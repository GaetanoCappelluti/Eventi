import { CATEGORIES, MACRO_AREAS } from '../data/sectors';

export type QuickRange = 'next_7' | 'next_30' | 'this_month' | 'none';

export type EventItem = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  country: string;
  city: string;
  region: string;
  macroArea: (typeof MACRO_AREAS)[number];
  category: (typeof CATEGORIES)[number];
  description: string;
  tags: string[];
  price: string;
  highlight?: boolean;
  url?: string;
};

export type EventFilters = {
  from?: string;
  to?: string;
  quickRange?: QuickRange;
  region?: string;
  country?: string;
  category?: string;
  macroArea?: string;
  query?: string;
};

export type EventKpis = {
  totalEvents: number;
  highlights: number;
  topLocations: { key: string; count: number }[];
  categories: { key: string; count: number }[];
  macroAreas: { key: string; count: number }[];
  temporalClusters: { key: string; count: number }[];
};

const today = new Date();
const addDays = (d: number) => {
  const n = new Date(today);
  n.setDate(n.getDate() + d);
  return n.toISOString().slice(0, 10);
};

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'AI Policy Summit Roma',
    startDate: addDays(3),
    country: 'Italia',
    city: 'Roma',
    region: 'Lazio',
    macroArea: 'Sud Europa',
    category: 'Tecnologia',
    description: 'Conferenza su AI Act, governance dati e impatto nei servizi pubblici europei.',
    tags: ['AI', 'Policy', 'GovTech'],
    price: '€99',
    highlight: true,
    url: 'https://example.org/ai-policy-summit',
  },
  {
    id: 'ev-2',
    title: 'Barcelona Startup Week',
    startDate: addDays(8),
    country: 'Spagna',
    city: 'Barcellona',
    region: 'Catalogna',
    macroArea: 'Sud Europa',
    category: 'Startup',
    description: 'Pitch, mentorship e networking tra founder e investitori europei.',
    tags: ['VC', 'Scaleup', 'Networking'],
    price: 'Gratis',
    highlight: true,
    url: 'https://example.org/startup-week',
  },
  {
    id: 'ev-3',
    title: 'Berlin Green Industry Forum',
    startDate: addDays(14),
    country: 'Germania',
    city: 'Berlino',
    region: 'Berlino',
    macroArea: 'Centro Europa',
    category: 'Sostenibilità',
    description: 'Evento dedicato a transizione energetica e supply chain sostenibili.',
    tags: ['NetZero', 'Manufacturing'],
    price: '€149',
  },
  {
    id: 'ev-4',
    title: 'Lisbon Product Design Days',
    startDate: addDays(20),
    country: 'Portogallo',
    city: 'Lisbona',
    region: 'Lisboa',
    macroArea: 'Europa Ovest',
    category: 'Design',
    description: 'Workshop e talk per product team B2B e B2C.',
    tags: ['UX', 'Product', 'Workshop'],
    price: '€79',
  },
  {
    id: 'ev-5',
    title: 'Paris Cultural Innovation Fair',
    startDate: addDays(26),
    country: 'Francia',
    city: 'Parigi',
    region: 'Île-de-France',
    macroArea: 'Europa Ovest',
    category: 'Cultura',
    description: 'Festival di contaminazione tra cultura, tecnologia e formazione.',
    tags: ['Musei', 'Digital Heritage'],
    price: '€45',
    highlight: true,
  },
  {
    id: 'ev-6',
    title: 'Amsterdam Data Leaders Meetup',
    startDate: addDays(34),
    country: 'Paesi Bassi',
    city: 'Amsterdam',
    region: 'Noord-Holland',
    macroArea: 'Nord Europa',
    category: 'Business',
    description: 'Round table su data strategy e analytics operating model.',
    tags: ['Data', 'Leadership'],
    price: 'Gratis',
  },
  {
    id: 'ev-7',
    title: 'Milano Hospitality Trends',
    startDate: addDays(11),
    country: 'Italia',
    city: 'Milano',
    region: 'Lombardia',
    macroArea: 'Sud Europa',
    category: 'Turismo',
    description: 'Nuove esperienze travel e strategie digitali per hospitality.',
    tags: ['Travel', 'Hospitality'],
    price: '€65',
  },
  {
    id: 'ev-8',
    title: 'Athens Food & Cities Lab',
    startDate: addDays(18),
    country: 'Grecia',
    city: 'Atene',
    region: 'Attica',
    macroArea: 'Sud Europa',
    category: 'Food',
    description: 'Laboratorio su cibo urbano, sostenibilità e filiere locali.',
    tags: ['FoodTech', 'Urban'],
    price: '€35',
  },
  {
    id: 'ev-9',
    title: 'Vienna Deep Tech Dialogues',
    startDate: addDays(39),
    country: 'Austria',
    city: 'Vienna',
    region: 'Vienna',
    macroArea: 'Centro Europa',
    category: 'Tecnologia',
    description: 'Panel su AI applicata, robotics e investimento industriale.',
    tags: ['DeepTech', 'R&D'],
    price: '€120',
  },
  {
    id: 'ev-10',
    title: 'Dublin Scaleup Operations Forum',
    startDate: addDays(46),
    country: 'Irlanda',
    city: 'Dublino',
    region: 'Leinster',
    macroArea: 'Nord Europa',
    category: 'Startup',
    description: 'Best practice operative per startup in fase di crescita internazionale.',
    tags: ['Ops', 'Scaleup'],
    price: '€90',
  },
];

const countBy = (events: EventItem[], keySelector: (event: EventItem) => string) =>
  Object.entries(
    events.reduce<Record<string, number>>((acc, event) => {
      const key = keySelector(event);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

const temporalBucket = (isoDate: string) => {
  const eventDate = new Date(isoDate);
  const deltaDays = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (deltaDays <= 7) return 'Prossimi 7 giorni';
  if (deltaDays <= 30) return 'Prossimi 30 giorni';
  return 'Oltre 30 giorni';
};

const applyQuickRange = (eventDate: string, quickRange: QuickRange) => {
  if (quickRange === 'none') return true;
  const date = new Date(eventDate);
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (quickRange === 'next_7') return diff >= 0 && diff <= 7;
  if (quickRange === 'next_30') return diff >= 0 && diff <= 30;
  const sameMonth = date.getUTCMonth() === now.getUTCMonth() && date.getUTCFullYear() === now.getUTCFullYear();
  return sameMonth && diff >= 0;
};

export const searchEvents = async (filters: EventFilters): Promise<EventItem[]> => {
  const result = MOCK_EVENTS.filter((event) => {
    const byDateFrom = !filters.from || event.startDate >= filters.from;
    const byDateTo = !filters.to || event.startDate <= filters.to;
    const byQuickRange = !filters.quickRange || applyQuickRange(event.startDate, filters.quickRange);
    const byRegion = !filters.region || event.region === filters.region;
    const byCountry = !filters.country || event.country === filters.country;
    const byCategory = !filters.category || event.category === filters.category;
    const byMacroArea = !filters.macroArea || event.macroArea === filters.macroArea;
    const text = `${event.title} ${event.description} ${event.tags.join(' ')}`.toLowerCase();
    const byQuery = !filters.query || text.includes(filters.query.toLowerCase());

    return byDateFrom && byDateTo && byQuickRange && byRegion && byCountry && byCategory && byMacroArea && byQuery;
  });

  return Promise.resolve(result);
};

export const getEventKpis = (events: EventItem[]): EventKpis => ({
  totalEvents: events.length,
  highlights: events.filter((event) => event.highlight).length,
  topLocations: countBy(events, (event) => `${event.city}, ${event.country}`).slice(0, 5),
  categories: countBy(events, (event) => event.category),
  macroAreas: countBy(events, (event) => event.macroArea),
  temporalClusters: countBy(events, (event) => temporalBucket(event.startDate)),
});

export const getRegionSummary = (events: EventItem[]) => countBy(events, (event) => event.region).slice(0, 8);

export const getCategorySummary = (events: EventItem[]) => countBy(events, (event) => event.category);

export const getHighlightedEvents = (events: EventItem[]) => events.filter((event) => event.highlight).slice(0, 4);
