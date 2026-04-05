import type { EventDataItem } from '../data/events';
import type { EventFilters, QuickRange } from '../services/events';

const applyQuickRange = (eventDate: string, quickRange: QuickRange) => {
  if (quickRange === 'none') return true;

  const date = new Date(eventDate);
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (quickRange === 'next_7') return diff >= 0 && diff <= 7;
  if (quickRange === 'next_30') return diff >= 0 && diff <= 30;

  const sameMonth = date.getUTCMonth() === now.getUTCMonth() && date.getUTCFullYear() === now.getUTCFullYear();
  return sameMonth && diff >= 0;
};

export const filterEvents = (events: EventDataItem[], filters: EventFilters) => {
  const normalizedQuery = filters.query?.toLowerCase().trim();

  return events.filter((event) => {
    const byDateFrom = !filters.from || event.date >= filters.from;
    const byDateTo = !filters.to || event.date <= filters.to;
    const byQuickRange = !filters.quickRange || applyQuickRange(event.date, filters.quickRange);
    const byRegion = !filters.region || event.region === filters.region;
    const byCountry = !filters.country || event.country === filters.country;
    const byCategory = !filters.category || event.sector === filters.category;

    const textIndex = [
      event.name,
      event.description,
      event.location,
      event.country,
      event.region,
      event.sector,
      event.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase();

    const byQuery = !normalizedQuery || textIndex.includes(normalizedQuery);

    return byDateFrom && byDateTo && byQuickRange && byRegion && byCountry && byCategory && byQuery;
  });
};
