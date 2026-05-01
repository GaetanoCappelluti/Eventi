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
  queryCount: number;
  discoveredLinks: number;
  uniqueLinks: number;
  fetchOk: number;
  fetchFailed: number;
  schemaEventsExtracted: number;
  htmlFallbackEventsExtracted: number;
  rejectedNoDate: number;
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
  const discovery = await discoverEventPages();
  const discoveredPages = discovery.pages;

  const extractedRaw: Partial<NormalizedEvent>[] = [];
  let fetchOk = 0;
  let fetchFailed = 0;
  let schemaEventsExtracted = 0;
  let htmlFallbackEventsExtracted = 0;
  let rejectedNoDate = 0;

  for (const page of discoveredPages) {
    try {
      const response = await fetch(page.url);
      if (!response.ok) {
        fetchFailed += 1;
        continue;
      }
      fetchOk += 1;
      const html = await response.text();
      const schemas = extractJsonLdNodes(html);

      for (const schema of schemas) {
        const schemaExtracted = schemaEventExtractor({ sourceId: page.sourceId, sourceUrl: page.url, schemaJson: schema });
        schemaEventsExtracted += schemaExtracted.length;
        extractedRaw.push(...schemaExtracted);
      }

      if (schemas.length === 0) {
        const fallbackExtracted = htmlEventExtractor({ sourceId: page.sourceId, sourceUrl: page.url, html });
        if (fallbackExtracted.length === 0) {
          rejectedNoDate += 1;
        }
        htmlFallbackEventsExtracted += fallbackExtracted.length;
        extractedRaw.push(...fallbackExtracted);
      }
    } catch {
      fetchFailed += 1;
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
      queryCount: discovery.stats.queryCount,
      discoveredLinks: discovery.stats.discoveredLinks,
      uniqueLinks: discovery.stats.uniqueLinks,
      fetchOk,
      fetchFailed,
      schemaEventsExtracted,
      htmlFallbackEventsExtracted,
      rejectedNoDate,
    },
  };
};
