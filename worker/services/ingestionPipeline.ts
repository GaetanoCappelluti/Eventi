import { extractHtmlEvents } from '../extractors/htmlEventExtractor';
import { extractStructuredEvents } from '../extractors/schemaEventExtractor';
import type { EventRecord } from '../types/event';
import { dedupeEvents } from './dedupeEvents';
import { normalizeEvent } from './normalizeEvent';
import { scoreEvent } from './ranking';
import { discoverSources } from './sourceDiscovery';
import { fetchSource } from './sourceFetcher';

export type IngestionStats = {
  discoveredSources: number;
  fetchedSources: number;
  structuredExtracted: number;
  htmlExtracted: number;
  normalizedEvents: number;
  dedupedEvents: number;
};

export const saveEvents = async (events: EventRecord[]): Promise<number> => events.length;

export const runIngestionPipeline = async () => {
  const sources = discoverSources();
  const fetched = await Promise.all(sources.map((source) => fetchSource(source)));

  const structured = fetched.flatMap((item) => extractStructuredEvents(item.html, item.source.url));
  const htmlBased = fetched.flatMap((item) => extractHtmlEvents(item.html, item.source.url));

  const normalized = [...structured, ...htmlBased].map((partial) => normalizeEvent(partial));
  const deduped = dedupeEvents(normalized).sort((a, b) => scoreEvent(b) - scoreEvent(a));
  const savedCount = await saveEvents(deduped);

  return {
    savedCount,
    stats: {
      discoveredSources: sources.length,
      fetchedSources: fetched.length,
      structuredExtracted: structured.length,
      htmlExtracted: htmlBased.length,
      normalizedEvents: normalized.length,
      dedupedEvents: deduped.length,
    } as IngestionStats,
  };
};
