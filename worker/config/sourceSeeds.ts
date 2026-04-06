export type SourceSeed = {
  id: string;
  countryCode: string;
  country: string;
  categories: string[];
  sourceType: 'official' | 'institutional' | 'media' | 'community' | 'ticketing' | 'aggregator';
  priority: number;
  baseUrl: string;
  notes?: string;
};

export const sourceSeeds: SourceSeed[] = [
  { id: 'it-proloco', countryCode: 'IT', country: 'Italia', categories: ['Sagra', 'Sagra enogastronomica', 'Festa patronale'], sourceType: 'institutional', priority: 1, baseUrl: 'https://www.unioneproloco.it', notes: 'Directory Pro Loco provinciali per sagre e feste.' },
  { id: 'it-fiere', countryCode: 'IT', country: 'Italia', categories: ['Fiera campionaria', 'Fiera hi-fi'], sourceType: 'official', priority: 1, baseUrl: 'https://www.fieramilano.it' },
  { id: 'de-stadtportal', countryCode: 'DE', country: 'Germania', categories: ['Mercatino artigianale', 'Festival territoriale'], sourceType: 'institutional', priority: 2, baseUrl: 'https://www.berlin.de/events/' },
  { id: 'fr-tourism', countryCode: 'FR', country: 'Francia', categories: ['Mercatino natalizio', 'Festival food & wine'], sourceType: 'institutional', priority: 2, baseUrl: 'https://www.france.fr/fr/evenements' },
  { id: 'es-ferias', countryCode: 'ES', country: 'Spagna', categories: ['Feria', 'Festival food & wine', 'Evento locale'], sourceType: 'media', priority: 2, baseUrl: 'https://www.spain.info/es/agenda/' },
  { id: 'nl-caraudio', countryCode: 'NL', country: 'Paesi Bassi', categories: ['Raduno hi-fi car', 'Mostra mercato audio'], sourceType: 'community', priority: 1, baseUrl: 'https://www.nlcaraudio.nl/events' },
  { id: 'eu-ticketing', countryCode: 'EU', country: 'Europa', categories: ['Festival territoriale', 'Audio e Musica'], sourceType: 'ticketing', priority: 3, baseUrl: 'https://www.eventbrite.com/d/europe/events/' },
];
