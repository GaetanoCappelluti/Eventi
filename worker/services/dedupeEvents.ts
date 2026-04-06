import type { EventRecord } from '../types/event';

const merge = (a: EventRecord, b: EventRecord): EventRecord => ({
  ...a,
  description: a.description.length >= b.description.length ? a.description : b.description,
  ticketUrl: a.ticketUrl ?? b.ticketUrl,
  officialUrl: a.officialUrl ?? b.officialUrl,
  tags: [...new Set([...a.tags, ...b.tags])],
  confidenceScore: Math.max(a.confidenceScore, b.confidenceScore),
  freshnessScore: Math.max(a.freshnessScore, b.freshnessScore),
  updatedAt: new Date().toISOString(),
});

export const dedupeEvents = (events: EventRecord[]) => {
  const byKey = new Map<string, EventRecord>();

  for (const event of events) {
    const existing = byKey.get(event.dedupeKey);
    if (!existing) {
      byKey.set(event.dedupeKey, event);
      continue;
    }

    const winner = existing.confidenceScore >= event.confidenceScore ? existing : event;
    const loser = winner === existing ? event : existing;
    byKey.set(event.dedupeKey, merge(winner, loser));
  }

  return [...byKey.values()];
};
