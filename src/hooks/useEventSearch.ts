import { useCallback, useMemo, useState } from 'react';
import {
  getCategorySummary,
  getEventKpis,
  getHighlightedEvents,
  getRegionSummary,
  searchEvents,
  type EventFilters,
  type EventItem,
  type EventKpis,
} from '../services/events';

const initialFilters: EventFilters = { quickRange: 'none' };
const PAGE_SIZE = 48;

const emptyKpis: EventKpis = {
  totalEvents: 0,
  byMacroCategory: [],
  byCountry: [],
  byRegion: [],
  topLocations: [],
  topThemes: [],
};

export const useEventSearch = () => {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [kpis, setKpis] = useState<EventKpis>(emptyKpis);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (overrides?: Partial<EventFilters>) => {
    setLoading(true);
    const merged = { ...filters, ...overrides };
    setFilters(merged);
    const [{ items, total }, nextKpis] = await Promise.all([
      searchEvents(merged, { limit: PAGE_SIZE, offset: 0 }),
      getEventKpis(merged),
    ]);
    setEvents(items);
    setTotalResults(total);
    setKpis(nextKpis);
    setHasSearched(true);
    setLoading(false);
  }, [filters]);

  const loadMore = useCallback(async () => {
    if (loading || events.length >= totalResults) return;

    setLoading(true);
    const { items } = await searchEvents(filters, { limit: PAGE_SIZE, offset: events.length });
    setEvents((current) => [...current, ...items]);
    setLoading(false);
  }, [events.length, filters, loading, totalResults]);

  const analytics = useMemo(() => ({
    kpis,
    regionSummary: getRegionSummary(kpis),
    categorySummary: getCategorySummary(kpis),
    highlighted: getHighlightedEvents(events),
    hasMore: events.length < totalResults,
  }), [events, kpis, totalResults]);

  return { filters, setFilters, events, totalResults, loading, hasSearched, runSearch, loadMore, ...analytics };
};
