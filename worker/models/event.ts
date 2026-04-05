export type EventMacroCategory =
  | 'Sagre e Feste'
  | 'Fiere e Mercati'
  | 'Festival Territoriali'
  | 'Enogastronomia'
  | 'Hi-Fi e Car Audio'
  | 'Audio e Musica'
  | 'Eventi Locali e Regionali';

export type EventCategory =
  | 'Sagra'
  | 'Sagra enogastronomica'
  | 'Fiera campionaria'
  | 'Mercatino artigianale'
  | 'Mercatino natalizio'
  | 'Festival territoriale'
  | 'Festa patronale'
  | 'Festival food & wine'
  | 'Raduno hi-fi car'
  | 'Fiera hi-fi'
  | 'Mostra mercato audio'
  | 'Evento locale';

export type EventSourceType = 'official' | 'institutional' | 'media' | 'community' | 'ticketing' | 'aggregator';

export type SourceReference = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: EventSourceType;
  discoveredAt: string;
  extractor: 'schema' | 'html' | 'manual-seed';
  sourceScore: number;
};

export type EventGeo = {
  countryCode: string;
  country: string;
  region: string;
  locality: string;
  venue?: string;
  lat?: number;
  lon?: number;
};

export type EventDateRange = {
  startDate: string;
  endDate?: string;
  timezone: string;
};

export type NormalizedEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  macroCategory: EventMacroCategory;
  category: EventCategory;
  themes: string[];
  tags: string[];
  geo: EventGeo;
  dates: EventDateRange;
  officialUrl: string;
  bookingUrl?: string;
  imageUrl?: string;
  ticketPrice?: string;
  confidenceScore: number;
  rankingScore: number;
  dedupeHash: string;
  sourceRefs: SourceReference[];
  createdAt: string;
  updatedAt: string;
};

export type SearchFilters = {
  q?: string;
  from?: string;
  to?: string;
  country?: string;
  region?: string;
  macroCategory?: string;
  category?: string;
  themes?: string[];
  limit?: number;
  offset?: number;
};

export type SearchResult = {
  total: number;
  items: NormalizedEvent[];
};

export type EventKpis = {
  totalEvents: number;
  byMacroCategory: { key: string; count: number }[];
  byCountry: { key: string; count: number }[];
  byRegion: { key: string; count: number }[];
  topLocations: { key: string; count: number }[];
  topThemes: { key: string; count: number }[];
};
