import { useCallback, useMemo, useState } from 'react';
import {
  getCategorySummary,
  getEventKpis,
  getHighlightedEvents,
  getRegionSummary,
  searchEvents,
  type EventFilters,
  type EventItem,
} from '../services/events';

const initialFilters: EventFilters = { quickRange: 'next_30' };

export const useEventSearch = () => {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (overrides?: Partial<EventFilters>) => {
    setLoading(true);
    const merged = { ...filters, ...overrides };
    setFilters(merged);
    const found = await searchEvents(merged);
    setEvents(found);
    setHasSearched(true);
    setLoading(false);
  }, [filters]);

  const analytics = useMemo(() => ({
    kpis: getEventKpis(events),
    regionSummary: getRegionSummary(events),
    categorySummary: getCategorySummary(events),
    highlighted: getHighlightedEvents(events),
  }), [events]);

  return { filters, setFilters, events, loading, hasSearched, runSearch, ...analytics };
};
