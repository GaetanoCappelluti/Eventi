import { searchClient } from './searchClient';

export type QuickRange = 'next_7' | 'next_30' | 'this_month' | 'none';

export type EventFilters = {
  from?: string;
  to?: string;
  quickRange?: QuickRange;
  region?: string;
  country?: string;
  category?: string;
  macroCategory?: string;
  query?: string;
};

type ApiFilters = Omit<EventFilters, 'query'> & { q?: string; limit?: number; offset?: number };

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  macroCategory: string;
  category: string;
  themes: string[];
  tags: string[];
  geo: {
    countryCode: string;
    country: string;
    region: string;
    locality: string;
    venue?: string;
  };
  dates: {
    startDate: string;
    endDate?: string;
    timezone: string;
  };
  officialUrl: string;
  bookingUrl?: string;
  confidenceScore: number;
  rankingScore: number;
  ticketPrice?: string;
};

export type EventKpis = {
  totalEvents: number;
  byMacroCategory: { key: string; count: number }[];
  byCountry: { key: string; count: number }[];
  byRegion: { key: string; count: number }[];
  topLocations: { key: string; count: number }[];
  topThemes: { key: string; count: number }[];
};

export type EventSearchResult = {
  total: number;
  items: EventItem[];
};

const withQuickRange = (filters: EventFilters): EventFilters => {
  if (!filters.quickRange || filters.quickRange === 'none') return filters;

  const today = new Date();
  const start = today.toISOString().slice(0, 10);

  if (filters.quickRange === 'next_7') {
    const to = new Date(today);
    to.setDate(to.getDate() + 7);
    return { ...filters, from: filters.from ?? start, to: filters.to ?? to.toISOString().slice(0, 10) };
  }

  if (filters.quickRange === 'next_30') {
    const to = new Date(today);
    to.setDate(to.getDate() + 30);
    return { ...filters, from: filters.from ?? start, to: filters.to ?? to.toISOString().slice(0, 10) };
  }

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { ...filters, from: filters.from ?? start, to: filters.to ?? endOfMonth.toISOString().slice(0, 10) };
};

const toApiFilters = (filters: EventFilters, paging?: { limit?: number; offset?: number }): ApiFilters => {
  const computed = withQuickRange(filters);
  const { query, ...rest } = computed;
  return { ...rest, q: query, ...paging };
};

export const getEventOfficialUrl = (event: EventItem) => event.officialUrl;

export const searchEvents = async (filters: EventFilters, paging?: { limit?: number; offset?: number }): Promise<EventSearchResult> =>
  searchClient.search(toApiFilters(filters, paging));

export const getEventKpis = async (filters: EventFilters): Promise<EventKpis> => searchClient.kpis(toApiFilters(filters));

export const getRegionSummary = (kpis: EventKpis) => kpis.byRegion.slice(0, 8);

export const getCategorySummary = (kpis: EventKpis) => kpis.byMacroCategory;

export const getHighlightedEvents = (events: EventItem[]) => events.slice(0, 4);
