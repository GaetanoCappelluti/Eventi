export type EventDataItem = {
  id: string;
  name: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  country: string;
  region: string;
  sector: string;
  sectorId: string;
  price: string;
  website?: string;
  officialUrl?: string;
  emoji: string;
  tags: string[];
  highlight?: boolean;
};

const year = 2026;
const monthCycle = [5, 6, 7, 8, 9, 10, 11, 12];
const dayCycle = [2, 5, 8, 11, 14, 17, 20, 23, 26];
const makeDate = (month: number, day: number) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const sectors = [
  { sector: 'Sagre', sectorId: 'sagre', emoji: '🍷', tags: ['sagre', 'enogastronomia', 'territorio'] },
  { sector: 'Fiere', sectorId: 'fiere', emoji: '🏟️', tags: ['fiere', 'business', 'networking'] },
  { sector: 'Mercatini', sectorId: 'mercatini', emoji: '🧺', tags: ['mercatini', 'artigianato', 'locale'] },
  { sector: 'Hi-Fi', sectorId: 'hifi', emoji: '🎚️', tags: ['hi-fi', 'audio', 'ascolto'] },
  { sector: 'Car Audio', sectorId: 'caraudio', emoji: '🚗', tags: ['car audio', 'raduni', 'sound'] },
  { sector: 'Cultura', sectorId: 'cultura', emoji: '🏛️', tags: ['cultura', 'mostre', 'patrimonio'] },
  { sector: 'Outdoor', sectorId: 'outdoor', emoji: '🥾', tags: ['outdoor', 'natura', 'itinerari'] },
  { sector: 'Eventi territoriali', sectorId: 'territoriali', emoji: '📍', tags: ['territorio', 'regioni', 'community'] },
];

const places = [
  { location: 'Milano', country: 'Italia', region: 'Lombardia' },
  { location: 'Torino', country: 'Italia', region: 'Piemonte' },
  { location: 'Bologna', country: 'Italia', region: 'Emilia-Romagna' },
  { location: 'Firenze', country: 'Italia', region: 'Toscana' },
  { location: 'Roma', country: 'Italia', region: 'Lazio' },
  { location: 'Barcellona', country: 'Spagna', region: 'Catalogna' },
  { location: 'Madrid', country: 'Spagna', region: 'Comunità di Madrid' },
  { location: 'Parigi', country: 'Francia', region: 'Île-de-France' },
  { location: 'Lione', country: 'Francia', region: 'Auvergne-Rhône-Alpes' },
  { location: 'Berlino', country: 'Germania', region: 'Berlino' },
  { location: 'Monaco di Baviera', country: 'Germania', region: 'Baviera' },
  { location: 'Amsterdam', country: 'Paesi Bassi', region: 'Noord-Holland' },
  { location: 'Utrecht', country: 'Paesi Bassi', region: 'Utrecht' },
  { location: 'Bruxelles', country: 'Belgio', region: 'Bruxelles-Capitale' },
  { location: 'Lisbona', country: 'Portogallo', region: 'Lisboa' },
  { location: 'Vienna', country: 'Austria', region: 'Vienna' },
  { location: 'Varsavia', country: 'Polonia', region: 'Masovia' },
  { location: 'Praga', country: 'Repubblica Ceca', region: 'Praga' },
  { location: 'Budapest', country: 'Ungheria', region: 'Budapest' },
  { location: 'Stoccolma', country: 'Svezia', region: 'Stoccolma' },
];

export const MOCK_EVENTS: EventDataItem[] = Array.from({ length: 320 }, (_, index) => {
  const id = index + 1;
  const sector = sectors[index % sectors.length];
  const place = places[index % places.length];
  const month = monthCycle[index % monthCycle.length];
  const day = dayCycle[index % dayCycle.length];

  return {
    id: `ev-${id}`,
    name: `${sector.sector} Europa ${year} #${id}`,
    description: `Incontro ${sector.sector.toLowerCase()} con focus su comunità locale, filiere regionali e partecipazione europea.`,
    date: makeDate(month, day),
    endDate: makeDate(month, Math.min(day + 1 + (index % 2), 28)),
    location: place.location,
    country: place.country,
    region: place.region,
    sector: sector.sector,
    sectorId: sector.sectorId,
    price: index % 6 === 0 ? 'Gratis' : `€${8 + (index % 14) * 2}`,
    website: `https://mock.eventieuropa.example/${sector.sectorId}/${id}`,
    officialUrl: `https://official.eventieuropa.example/${sector.sectorId}/${id}`,
    emoji: sector.emoji,
    tags: [...sector.tags, place.location.toLowerCase().replace(/\s+/g, '-')],
    highlight: id % 40 === 0,
  };
});
