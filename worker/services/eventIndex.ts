import { seedEvents } from '../data/seedEvents';
import type { EventKpis, NormalizedEvent, SearchFilters, SearchResult } from '../models/event';
import { dedupeEvents } from './dedupeEvents';

const countBy = (events: NormalizedEvent[], fn: (event: NormalizedEvent) => string) =>
  Object.entries(
    events.reduce<Record<string, number>>((acc, event) => {
      const key = fn(event);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

const scoreByQuery = (event: NormalizedEvent, q?: string) => {
  if (!q) return 0;
  const query = q.toLowerCase().trim();
  if (!query) return 0;
  const haystack = [event.title, event.description, event.category, event.macroCategory, ...event.themes, ...event.tags].join(' ').toLowerCase();
  if (!haystack.includes(query)) return -0.5;
  if (event.title.toLowerCase().includes(query)) return 0.25;
  return 0.1;
};

const toMillis = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime();

const applyFilters = (events: NormalizedEvent[], filters: SearchFilters) =>
  events.filter((event) => {
    if (filters.country && event.geo.country !== filters.country) return false;
    if (filters.region && event.geo.region !== filters.region) return false;
    if (filters.macroCategory && event.macroCategory !== filters.macroCategory) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.from && toMillis(event.dates.startDate) < toMillis(filters.from)) return false;
    if (filters.to && toMillis(event.dates.startDate) > toMillis(filters.to)) return false;
    if (filters.themes?.length) {
      const lowerThemes = event.themes.map((theme) => theme.toLowerCase());
      if (!filters.themes.some((theme) => lowerThemes.includes(theme.toLowerCase()))) return false;
    }
    if (filters.q) {
      const query = filters.q.toLowerCase();
      const searchable = [event.title, event.description, event.category, event.macroCategory, ...event.themes, ...event.tags, event.geo.locality].join(' ').toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });

const rankEvents = (events: NormalizedEvent[], filters: SearchFilters) =>
  [...events].sort((a, b) => {
    const dateA = toMillis(a.dates.startDate);
    const dateB = toMillis(b.dates.startDate);
    const daysDistanceA = Math.abs(dateA - Date.now()) / (1000 * 60 * 60 * 24);
    const daysDistanceB = Math.abs(dateB - Date.now()) / (1000 * 60 * 60 * 24);

    const freshnessA = 1 / Math.max(1, daysDistanceA);
    const freshnessB = 1 / Math.max(1, daysDistanceB);

    const rankA = a.rankingScore * 0.5 + a.confidenceScore * 0.35 + freshnessA * 0.1 + scoreByQuery(a, filters.q) * 0.05;
    const rankB = b.rankingScore * 0.5 + b.confidenceScore * 0.35 + freshnessB * 0.1 + scoreByQuery(b, filters.q) * 0.05;

    return rankB - rankA;
  });

class EventIndex {
  private events = dedupeEvents(seedEvents);

  query(filters: SearchFilters): SearchResult {
    const filtered = applyFilters(this.events, filters);
    const ranked = rankEvents(filtered, filters);
    const offset = filters.offset ?? 0;
    const limit = Math.min(filters.limit ?? 50, 100);
    return {
      total: ranked.length,
      items: ranked.slice(offset, offset + limit),
    };
  }

  kpis(filters: SearchFilters): EventKpis {
    const filtered = applyFilters(this.events, filters);
    return {
      totalEvents: filtered.length,
      byMacroCategory: countBy(filtered, (event) => event.macroCategory),
      byCountry: countBy(filtered, (event) => event.geo.country),
      byRegion: countBy(filtered, (event) => event.geo.region),
      topLocations: countBy(filtered, (event) => `${event.geo.locality}, ${event.geo.country}`).slice(0, 10),
      topThemes: countBy(filtered, (event) => event.themes[0] ?? 'altro').slice(0, 10),
    };
  }

  stats() {
    return { totalSeeded: this.events.length };
  }
}

export const eventIndex = new EventIndex();
