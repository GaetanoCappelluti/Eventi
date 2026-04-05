import type { EventItem } from '../services/events';

export const uniqueValues = (events: EventItem[], picker: (event: EventItem) => string) =>
  [...new Set(events.map((event) => picker(event)))].sort((a, b) => a.localeCompare(b));
