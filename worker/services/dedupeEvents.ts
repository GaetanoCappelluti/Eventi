import type { NormalizedEvent } from '../models/event';

const mergeEvents = (primary: NormalizedEvent, duplicate: NormalizedEvent): NormalizedEvent => {
  const refs = [...primary.sourceRefs, ...duplicate.sourceRefs];
  const themes = [...new Set([...primary.themes, ...duplicate.themes])];
  const tags = [...new Set([...primary.tags, ...duplicate.tags])];

  return {
    ...primary,
    description: primary.description.length >= duplicate.description.length ? primary.description : duplicate.description,
    bookingUrl: primary.bookingUrl ?? duplicate.bookingUrl,
    sourceRefs: refs,
    themes,
    tags,
    confidenceScore: Math.max(primary.confidenceScore, duplicate.confidenceScore),
    rankingScore: Math.max(primary.rankingScore, duplicate.rankingScore),
    updatedAt: new Date().toISOString(),
  };
};

export const dedupeEvents = (events: NormalizedEvent[]) => {
  const map = new Map<string, NormalizedEvent>();

  events.forEach((event) => {
    const existing = map.get(event.dedupeHash);
    if (!existing) {
      map.set(event.dedupeHash, event);
      return;
    }

    const winner = existing.confidenceScore >= event.confidenceScore ? existing : event;
    const loser = winner === existing ? event : existing;
    map.set(event.dedupeHash, mergeEvents(winner, loser));
  });

  return [...map.values()];
};
