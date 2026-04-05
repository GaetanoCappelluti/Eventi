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
  const [kpis, setKpis] = useState<EventKpis>(emptyKpis);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (overrides?: Partial<EventFilters>) => {
    setLoading(true);
    const merged = { ...filters, ...overrides };
    setFilters(merged);
    const [found, nextKpis] = await Promise.all([searchEvents(merged), getEventKpis(merged)]);
    setEvents(found);
    setKpis(nextKpis);
    setHasSearched(true);
    setLoading(false);
  }, [filters]);

  const analytics = useMemo(() => ({
    kpis,
    regionSummary: getRegionSummary(kpis),
    categorySummary: getCategorySummary(kpis),
    highlighted: getHighlightedEvents(events),
  }), [events, kpis]);

  return { filters, setFilters, events, loading, hasSearched, runSearch, ...analytics };
};
