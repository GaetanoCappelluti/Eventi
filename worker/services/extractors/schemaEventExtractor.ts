import type { NormalizedEvent } from '../../models/event';

export type SchemaExtractionInput = {
  sourceId: string;
  sourceUrl: string;
  schemaJson: unknown;
};

/**
 * Predisposto per parsing schema.org/Event.
 * In produzione riceverà HTML già scaricato e i nodi JSON-LD estratti.
 */
export const schemaEventExtractor = (_input: SchemaExtractionInput): Partial<NormalizedEvent>[] => {
  return [];
};
