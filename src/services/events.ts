import { searchClient } from './searchClient';

export type QuickRange = 'next_7' | 'next_30' | 'this_month' | 'none';

export type EventFilters = {
  from?: string;
  to?: string;
  quickRange?: QuickRange;
  region?: string;
  country?: string;
  category?: string;
  query?: string;
};

type ApiFilters = Omit<EventFilters, 'query'> & { q?: string };

export type EventItem = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  city: string;
  region: string;
  country: string;
  venue?: string;
  category: string;
  subcategory: string;
  tags: string[];
  officialUrl: string;
  ticketUrl?: string;
  sourceUrl: string;
  sourceDomain: string;
  language: string;
  priceText?: string;
  currency?: string;
  confidenceScore: number;
  freshnessScore: number;
  dedupeKey: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
};

export type EventKpis = {
  totalEvents: number;
  topMacroCategories: { key: string; count: number }[];
  topSubcategories: { key: string; count: number }[];
  topCountries: { key: string; count: number }[];
  topRegions: { key: string; count: number }[];
  topCities: { key: string; count: number }[];
  periodCovered: { from?: string; to?: string };
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

const toApiFilters = (filters: EventFilters): ApiFilters => {
  const computed = withQuickRange(filters);
  const { query, ...rest } = computed;
  return { ...rest, q: query };
};

export const getEventOfficialUrl = (event: EventItem) => event.officialUrl;

export const searchEvents = async (filters: EventFilters): Promise<EventItem[]> => {
  const result = await searchClient.search(toApiFilters(filters));
  return result.items;
};

export const getEventKpis = async (filters: EventFilters): Promise<EventKpis> => searchClient.kpis(toApiFilters(filters));

export const getRegionSummary = (kpis: EventKpis) => kpis.topRegions;

export const getCategorySummary = (kpis: EventKpis) => kpis.topMacroCategories;

export const getHighlightedEvents = (events: EventItem[]) => events;
