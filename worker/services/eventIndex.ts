import { bootstrapEvents } from '../seeds/bootstrapEvents';
import { sourceSeeds } from '../seeds/sources';
import type { EventKpis, EventRecord, SearchFilters, SearchResponse } from '../types/event';
import { dedupeEvents } from './dedupeEvents';
import { scoreEvent } from './ranking';

const toMillis = (date: string) => new Date(`${date}T00:00:00Z`).getTime();

const countBy = (events: EventRecord[], pick: (event: EventRecord) => string) =>
  Object.entries(
    events.reduce<Record<string, number>>((acc, event) => {
      const key = pick(event);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

const applyFilters = (events: EventRecord[], filters: SearchFilters) =>
  events.filter((event) => {
    if (filters.country && event.country !== filters.country) return false;
    if (filters.region && event.region !== filters.region) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.subcategory && event.subcategory !== filters.subcategory) return false;
    if (filters.from && toMillis(event.startDate) < toMillis(filters.from)) return false;
    if (filters.to && toMillis(event.startDate) > toMillis(filters.to)) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const haystack = [event.title, event.description, event.category, event.subcategory, event.city, event.region, ...event.tags].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

class EventIndex {
  private events: EventRecord[];

  constructor() {
    this.events = dedupeEvents(bootstrapEvents);
  }

  query(filters: SearchFilters): SearchResponse {
    const filtered = applyFilters(this.events, filters);
    const ranked = [...filtered].sort((a, b) => {
      const sourceA = sourceSeeds.find((item) => a.sourceDomain.includes(new URL(item.url).hostname));
      const sourceB = sourceSeeds.find((item) => b.sourceDomain.includes(new URL(item.url).hostname));
      return scoreEvent(b, sourceB) - scoreEvent(a, sourceA);
    });

    const offset = Math.max(0, filters.offset ?? 0);
    const end = filters.limit ? offset + Math.max(1, filters.limit) : undefined;

    return { total: ranked.length, items: ranked.slice(offset, end) };
  }

  byId(id: string) {
    return this.events.find((event) => event.id === id);
  }

  kpis(filters: SearchFilters): EventKpis {
    const filtered = applyFilters(this.events, filters);
    const sortedByDate = [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate));

    return {
      totalEvents: filtered.length,
      topMacroCategories: countBy(filtered, (event) => event.category),
      topSubcategories: countBy(filtered, (event) => event.subcategory),
      topCountries: countBy(filtered, (event) => event.country),
      topRegions: countBy(filtered, (event) => event.region),
      topCities: countBy(filtered, (event) => event.city),
      periodCovered: {
        from: sortedByDate[0]?.startDate,
        to: sortedByDate.at(-1)?.endDate ?? sortedByDate.at(-1)?.startDate,
      },
    };
  }

  sources() {
    return sourceSeeds;
  }

  health() {
    return { status: 'ok', indexedEvents: this.events.length, sources: sourceSeeds.length, generatedAt: new Date().toISOString() };
  }
}

export const eventIndex = new EventIndex();
