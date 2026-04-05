import type { NormalizedEvent } from '../models/event';
import { computeSourceReliability } from './sourceScoring';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const makeDedupeHash = (event: Pick<NormalizedEvent, 'title' | 'geo' | 'dates'>) =>
  `${event.geo.countryCode}|${slugify(event.geo.locality)}|${slugify(event.title)}|${event.dates.startDate}`;

export const normalizeEvent = (raw: Partial<NormalizedEvent>): NormalizedEvent => {
  const timestamp = new Date().toISOString();
  const title = (raw.title ?? 'Evento senza titolo').trim();
  const sourceRefs = raw.sourceRefs ?? [];
  const sourceReliability = computeSourceReliability(sourceRefs);
  const confidenceScore = raw.confidenceScore ?? Math.max(0.4, sourceReliability);

  const normalized: NormalizedEvent = {
    id: raw.id ?? crypto.randomUUID(),
    slug: raw.slug ?? slugify(title),
    title,
    description: raw.description?.trim() ?? 'Descrizione non disponibile.',
    macroCategory: raw.macroCategory ?? 'Eventi Locali e Regionali',
    category: raw.category ?? 'Evento locale',
    themes: [...new Set((raw.themes ?? []).map((item) => item.toLowerCase()))],
    tags: [...new Set((raw.tags ?? []).map((item) => item.toLowerCase()))],
    geo: {
      countryCode: raw.geo?.countryCode ?? 'EU',
      country: raw.geo?.country ?? 'Europa',
      region: raw.geo?.region ?? 'n/d',
      locality: raw.geo?.locality ?? 'n/d',
      venue: raw.geo?.venue,
      lat: raw.geo?.lat,
      lon: raw.geo?.lon,
    },
    dates: {
      startDate: raw.dates?.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: raw.dates?.endDate,
      timezone: raw.dates?.timezone ?? 'Europe/Rome',
    },
    officialUrl: raw.officialUrl ?? raw.bookingUrl ?? 'https://eventoeuropa.local/evento',
    bookingUrl: raw.bookingUrl,
    imageUrl: raw.imageUrl,
    ticketPrice: raw.ticketPrice,
    confidenceScore,
    rankingScore: raw.rankingScore ?? confidenceScore,
    dedupeHash: raw.dedupeHash ?? makeDedupeHash({ title, geo: raw.geo ?? { countryCode: 'EU', country: 'Europa', region: 'n/d', locality: 'n/d' }, dates: raw.dates ?? { startDate: new Date().toISOString().slice(0, 10), timezone: 'Europe/Rome' } }),
    sourceRefs,
    createdAt: raw.createdAt ?? timestamp,
    updatedAt: timestamp,
  };

  return normalized;
};
