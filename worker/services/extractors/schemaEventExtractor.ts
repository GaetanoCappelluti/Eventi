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
    const schemaStartDate = readValue(item.startDate)?.slice(0, 10);
    const schemaUrl = readValue(item.url);
    const categoryPrediction = classifyEventCategory(`${name} ${description}`);
    const location = (item.location as GenericRecord | undefined) ?? {};
    const address = (location.address as GenericRecord | undefined) ?? {};

    const hasRequiredName = Boolean(readValue(item.name));
    const hasRequiredStartDate = Boolean(schemaStartDate);
    const hasRequiredUrlOrLocation = Boolean(schemaUrl || readValue(location.name) || readValue(address.addressLocality));
    const verificationStatus = hasRequiredName && hasRequiredStartDate && hasRequiredUrlOrLocation ? 'verified' : 'probable';

    return {
      title: name,
      description,
      officialUrl: schemaUrl ?? input.sourceUrl,
      bookingUrl: readValue(item.offers),
      dates: {
        startDate: schemaStartDate ?? '1970-01-01',
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
      origin: 'schema_org',
      verificationStatus,
      sourceQualityNote: verificationStatus === 'verified' ? 'Evento verificato tramite dati strutturati schema.org/Event' : 'Evento schema.org incompleto, verifica consigliata',
    };
  });
};
