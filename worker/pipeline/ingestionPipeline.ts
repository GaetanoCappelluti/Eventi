import { sourceSeeds } from '../config/sourceSeeds';
import type { NormalizedEvent } from '../models/event';
import { discoverEventPages } from '../services/webDiscovery';
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

const extractJsonLdNodes = (html: string): unknown[] => {
  const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

export const runIngestionPipeline = async (): Promise<{ items: NormalizedEvent[]; stats: PipelineStageResult }> => {
  const discovered = sourceSeeds.sort((a, b) => a.priority - b.priority);
  const discoveredPages = await discoverEventPages();

  const extractedRaw: Partial<NormalizedEvent>[] = [];

  for (const page of discoveredPages) {
    try {
      const response = await fetch(page.url);
      if (!response.ok) continue;
      const html = await response.text();
      const schemas = extractJsonLdNodes(html);

      for (const schema of schemas) {
        extractedRaw.push(...schemaEventExtractor({ sourceId: page.sourceId, sourceUrl: page.url, schemaJson: schema }));
      }

      if (schemas.length === 0) {
        extractedRaw.push(...htmlEventExtractor({ sourceId: page.sourceId, sourceUrl: page.url, html }));
      }
    } catch {
      continue;
    }
  }

  const normalized = extractedRaw.map((raw) => normalizeEvent(raw));
  const deduped = dedupeEvents(normalized);

  return {
    items: deduped,
    stats: {
      discoveredSources: discovered.length + discoveredPages.length,
      extractedEvents: extractedRaw.length,
      normalizedEvents: normalized.length,
      dedupedEvents: deduped.length,
    },
  };
};
