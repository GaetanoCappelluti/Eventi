export const MACRO_CATEGORIES = [
  'Sagre & Tradizioni',
  'Fiere & Expo',
  'Mercatini & Eventi Locali',
  'HiFi & Audio',
  'Car Audio & Raduni',
  'Auto, Moto & Tuning',
  'Food Festival & Street Food',
  'Turismo & Territorio',
  'Artigianato & Handmade',
  'Vintage & Collezionismo',
  'Famiglia & Bambini',
  'Benessere & Olistico',
  'Tecnologia & Innovazione',
  'Agricoltura & Ruralità',
  'Moda, Design & Creatività',
  'Religioso & Popolare',
  'Festival Cittadini',
  'Eventi di Comunità',
] as const;

export type MacroCategory = (typeof MACRO_CATEGORIES)[number];

export type EventSourceType = 'official' | 'institutional' | 'media' | 'community' | 'ticketing' | 'aggregator';

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  city: string;
  region: string;
  country: string;
  venue?: string;
  category: MacroCategory;
  subcategory: string;
  tags: string[];
  officialUrl: string;
  ticketUrl?: string;
  sourceUrl: string;
  sourceDomain: string;
  language: string;
  priceText?: string;
  currency?: string;
  confidenceScore: number;
  freshnessScore: number;
  dedupeKey: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
};

export type SourceSeed = {
  id: string;
  name: string;
  country: string;
  language: string;
  type: EventSourceType;
  reliability: number;
  categoryFocus: MacroCategory[];
  sourceKind: 'tourism-board' | 'municipality' | 'fair-portal' | 'community' | 'ticketing' | 'editorial' | 'directory';
  url: string;
};

export type SearchFilters = {
  q?: string;
  from?: string;
  to?: string;
  country?: string;
  region?: string;
  category?: string;
  subcategory?: string;
  limit?: number;
  offset?: number;
};

export type SearchResponse = { total: number; items: EventRecord[] };

export type Bucket = { key: string; count: number };

export type EventKpis = {
  totalEvents: number;
  topMacroCategories: Bucket[];
  topSubcategories: Bucket[];
  topCountries: Bucket[];
  topRegions: Bucket[];
  topCities: Bucket[];
  periodCovered: { from?: string; to?: string };
};
