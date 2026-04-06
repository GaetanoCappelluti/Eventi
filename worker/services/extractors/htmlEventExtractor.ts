import type { NormalizedEvent } from '../../models/event';

export type HtmlExtractionInput = {
  sourceId: string;
  sourceUrl: string;
  html: string;
};

/**
 * Estrattore euristico fallback per pagine senza JSON-LD.
 * Da estendere con selettori specifici per dominio/fonte.
 */
export const htmlEventExtractor = (_input: HtmlExtractionInput): Partial<NormalizedEvent>[] => {
  return [];
};
