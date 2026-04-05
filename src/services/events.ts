import { MOCK_EVENTS, type EventDataItem } from '../data/events';
import { filterEvents } from '../utils/filterEvents';

export type QuickRange = 'next_7' | 'next_30' | 'this_month' | 'none';

export type EventItem = EventDataItem;

export type EventFilters = {
  from?: string;
  to?: string;
  quickRange?: QuickRange;
  region?: string;
  country?: string;
  category?: string;
  query?: string;
};

export type EventKpis = {
  totalEvents: number;
  highlights: number;
  topLocations: { key: string; count: number }[];
  categories: { key: string; count: number }[];
  macroAreas: { key: string; count: number }[];
  temporalClusters: { key: string; count: number }[];
};

const countBy = (events: EventItem[], keySelector: (event: EventItem) => string) =>
  Object.entries(
    events.reduce<Record<string, number>>((acc, event) => {
      const key = keySelector(event);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

const temporalBucket = (isoDate: string) => {
  const eventDate = new Date(isoDate);
  const deltaDays = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (deltaDays <= 7) return 'Prossimi 7 giorni';
  if (deltaDays <= 30) return 'Prossimi 30 giorni';
  return 'Oltre 30 giorni';
};

export const getEventOfficialUrl = (event: EventItem) => event.officialUrl ?? event.website;

export const searchEvents = async (filters: EventFilters): Promise<EventItem[]> => {
  const result = filterEvents(MOCK_EVENTS, filters);
  return Promise.resolve(result);
};

export const getEventKpis = (events: EventItem[]): EventKpis => ({
  totalEvents: events.length,
  highlights: events.filter((event) => event.highlight).length,
  topLocations: countBy(events, (event) => `${event.location}, ${event.country}`).slice(0, 5),
  categories: countBy(events, (event) => event.sector),
  macroAreas: countBy(events, (event) => event.country),
  temporalClusters: countBy(events, (event) => temporalBucket(event.date)),
});

export const getRegionSummary = (events: EventItem[]) => countBy(events, (event) => event.region).slice(0, 8);

export const getCategorySummary = (events: EventItem[]) => countBy(events, (event) => event.sector);

export const getHighlightedEvents = (events: EventItem[]) => events.filter((event) => event.highlight).slice(0, 4);
