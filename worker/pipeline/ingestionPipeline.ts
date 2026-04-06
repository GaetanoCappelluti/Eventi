import { sourceSeeds } from '../config/sourceSeeds';
import type { NormalizedEvent } from '../models/event';
import { htmlEventExtractor } from '../services/extractors/htmlEventExtractor';
import { schemaEventExtractor } from '../services/extractors/schemaEventExtractor';
import { dedupeEvents } from '../services/dedupeEvents';
import { normalizeEvent } from '../services/normalizeEvent';

export type PipelineStageResult = {
  discoveredSources: number;
  extractedEvents: number;
  normalizedEvents: number;
  dedupedEvents: number;
};

/**
 * Pipeline predisposta per futuro crawling reale.
 * Step: discover -> extract -> normalize -> dedupe -> index.
 */
export const runIngestionPipeline = async (): Promise<{ items: NormalizedEvent[]; stats: PipelineStageResult }> => {
  const discovered = sourceSeeds.sort((a, b) => a.priority - b.priority);

  const extractedRaw = discovered.flatMap((source) => {
    const schemaEvents = schemaEventExtractor({ sourceId: source.id, sourceUrl: source.baseUrl, schemaJson: null });
    const htmlEvents = htmlEventExtractor({ sourceId: source.id, sourceUrl: source.baseUrl, html: '' });
    return [...schemaEvents, ...htmlEvents];
  });

  const normalized = extractedRaw.map((raw) => normalizeEvent(raw));
  const deduped = dedupeEvents(normalized);

  return {
    items: deduped,
    stats: {
      discoveredSources: discovered.length,
      extractedEvents: extractedRaw.length,
      normalizedEvents: normalized.length,
      dedupedEvents: deduped.length,
    },
  };
};
