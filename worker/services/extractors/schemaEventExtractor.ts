import type { NormalizedEvent } from '../../models/event';
import { classifyEventCategory } from '../aiEventClassifier';

export type SchemaExtractionInput = {
  sourceId: string;
  sourceUrl: string;
  schemaJson: unknown;
};

type GenericRecord = Record<string, unknown>;

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const readValue = (value: unknown) => (typeof value === 'string' ? value : undefined);

const extractSchemaEvents = (node: unknown): GenericRecord[] => {
  if (!node || typeof node !== 'object') return [];
  const record = node as GenericRecord;

  if (record['@type'] === 'Event') return [record];
  if (Array.isArray(record['@graph'])) return record['@graph'].flatMap((item) => extractSchemaEvents(item));
  if (Array.isArray(record)) return record.flatMap((item) => extractSchemaEvents(item));

  return [];
};

export const schemaEventExtractor = (input: SchemaExtractionInput): Partial<NormalizedEvent>[] => {
  const events = extractSchemaEvents(input.schemaJson);

  return events.map((item) => {
    const name = readValue(item.name) ?? 'Evento senza titolo';
    const description = readValue(item.description) ?? '';
    const categoryPrediction = classifyEventCategory(`${name} ${description}`);
    const location = (item.location as GenericRecord | undefined) ?? {};
    const address = (location.address as GenericRecord | undefined) ?? {};

    return {
      title: name,
      description,
      officialUrl: readValue(item.url) ?? input.sourceUrl,
      bookingUrl: readValue(item.offers),
      dates: {
        startDate: (readValue(item.startDate) ?? new Date().toISOString()).slice(0, 10),
        endDate: readValue(item.endDate)?.slice(0, 10),
        timezone: 'Europe/Rome',
      },
      geo: {
        countryCode: readValue(address.addressCountry) ?? 'EU',
        country: readValue(address.addressCountry) ?? 'Europa',
        region: readValue(address.addressRegion) ?? 'N/D',
        locality: readValue(address.addressLocality) ?? 'N/D',
        venue: readValue(location.name),
      },
      themes: asArray(readValue(item.eventAttendanceMode)).filter(Boolean),
      tags: asArray(readValue(item.keywords)).flatMap((k) => k.split(',').map((x) => x.trim())),
      macroCategory: categoryPrediction.macroCategory,
      category: categoryPrediction.category,
      confidenceScore: 0.62 + categoryPrediction.confidenceBoost,
      rankingScore: 0.58,
    };
  });
};
