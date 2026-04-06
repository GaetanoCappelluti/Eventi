import type { EventRecord, MacroCategory } from '../types/event';
import { MACRO_CATEGORIES } from '../types/event';

const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const inferCategory = (rawCategory?: string): MacroCategory => {
  if (!rawCategory) return 'Eventi di Comunità';
  const found = MACRO_CATEGORIES.find((category) => category.toLowerCase() === rawCategory.toLowerCase());
  return found ?? 'Eventi di Comunità';
};

const computeFreshness = (startDate: string) => {
  const now = Date.now();
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const days = Math.abs(start - now) / 86400000;
  return Number((1 / Math.max(1, days)).toFixed(4));
};

const dedupeKey = (event: Pick<EventRecord, 'title' | 'startDate' | 'city' | 'venue' | 'sourceDomain'>) =>
  [slugify(event.title), event.startDate, slugify(event.city), slugify(event.venue ?? ''), event.sourceDomain].join('|');

export const normalizeEvent = (raw: Partial<EventRecord>): EventRecord => {
  const now = new Date().toISOString();
  const title = (raw.title ?? 'Evento senza titolo').trim();
  const startDate = raw.startDate ?? now.slice(0, 10);
  const sourceUrl = raw.sourceUrl ?? raw.officialUrl ?? 'https://eventoeuropa.eu';
  const sourceDomain = raw.sourceDomain ?? new URL(sourceUrl).hostname;

  const normalized: EventRecord = {
    id: raw.id ?? crypto.randomUUID(),
    title,
    description: raw.description ?? 'Descrizione non disponibile.',
    startDate,
    endDate: raw.endDate,
    city: raw.city ?? 'n/d',
    region: raw.region ?? 'n/d',
    country: raw.country ?? 'Europa',
    venue: raw.venue,
    category: inferCategory(raw.category),
    subcategory: raw.subcategory ?? 'Evento locale',
    tags: [...new Set((raw.tags ?? []).map((tag) => tag.toLowerCase()))],
    officialUrl: raw.officialUrl ?? sourceUrl,
    ticketUrl: raw.ticketUrl,
    sourceUrl,
    sourceDomain,
    language: raw.language ?? 'it',
    priceText: raw.priceText,
    currency: raw.currency,
    confidenceScore: raw.confidenceScore ?? 0.6,
    freshnessScore: raw.freshnessScore ?? computeFreshness(startDate),
    dedupeKey: raw.dedupeKey ?? dedupeKey({ title, startDate, city: raw.city ?? 'n/d', venue: raw.venue, sourceDomain }),
    imageUrl: raw.imageUrl,
    latitude: raw.latitude,
    longitude: raw.longitude,
    createdAt: raw.createdAt ?? now,
    updatedAt: now,
  };

  return normalized;
};
