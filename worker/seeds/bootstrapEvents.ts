import { sourceSeeds } from './sources';
import type { EventRecord, MacroCategory } from '../types/event';
import { normalizeEvent } from '../services/normalizeEvent';

const now = new Date();
const iso = (days: number) => {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const cityPool = [
  ['Italia', 'Lombardia', 'Milano'], ['Italia', 'Toscana', 'Greve in Chianti'], ['Italia', 'Puglia', 'Bari'],
  ['Germania', 'Berlino', 'Berlino'], ['Francia', 'Île-de-France', 'Parigi'], ['Spagna', 'Catalogna', 'Barcellona'],
  ['Paesi Bassi', 'Utrecht', 'Utrecht'], ['Polonia', 'Małopolskie', 'Cracovia'], ['Portogallo', 'Algarve', 'Portimão'],
  ['Austria', 'Vienna', 'Vienna'], ['Belgio', 'Vallonia', 'Liegi'], ['Repubblica Ceca', 'Moravia Meridionale', 'Brno'],
] as const;

const subcategories: Record<MacroCategory, string[]> = {
  'Sagre & Tradizioni': ['Sagra territoriale', 'Festa patronale', 'Festa tradizionale'],
  'Fiere & Expo': ['Fiera campionaria', 'Expo tematica', 'Mostra mercato'],
  'Mercatini & Eventi Locali': ['Mercatino settimanale', 'Mercatino natalizio', 'Evento di quartiere'],
  'HiFi & Audio': ['Fiera hi-fi', 'Showcase audio', 'Headphone meet'],
  'Car Audio & Raduni': ['Raduno hi-fi car', 'SPL contest', 'Demo installazioni car audio'],
  'Auto, Moto & Tuning': ['Raduno tuning', 'Expo automotive', 'Motor show locale'],
  'Food Festival & Street Food': ['Festival street food', 'Festival food regionale', 'Mercato del gusto'],
  'Turismo & Territorio': ['Festa del territorio', 'Cammino enoturistico', 'Open village'],
  'Artigianato & Handmade': ['Fiera artigianato', 'Mercato handmade', 'Laboratori artigiani'],
  'Vintage & Collezionismo': ['Mercato vintage', 'Fiera collezionismo', 'Scambio memorabilia'],
  'Famiglia & Bambini': ['Family day', 'Laboratori bambini', 'Festival famiglie'],
  'Benessere & Olistico': ['Fiera benessere', 'Festival olistico', 'Yoga & natura'],
  'Tecnologia & Innovazione': ['Tech expo', 'Maker festival', 'Innovation day'],
  'Agricoltura & Ruralità': ['Fiera agricola', 'Mostra zootecnica', 'Giornate rurali'],
  'Moda, Design & Creatività': ['Design week locale', 'Fashion market', 'Creative fair'],
  'Religioso & Popolare': ['Festa religiosa', 'Corteo storico', 'Rievocazione popolare'],
  'Festival Cittadini': ['Festival cittadino', 'Notte bianca', 'Festival urbano'],
  'Eventi di Comunità': ['Evento comunitario', 'Festa associazioni', 'Iniziativa civica'],
};

const macros = Object.keys(subcategories) as MacroCategory[];

export const bootstrapEvents: EventRecord[] = Array.from({ length: 180 }, (_, index) => {
  const macro = macros[index % macros.length];
  const subcategory = subcategories[macro][index % 3];
  const geo = cityPool[index % cityPool.length];
  const source = sourceSeeds[index % sourceSeeds.length];
  const startOffset = (index % 120) + 1;
  const startDate = iso(startOffset);
  const endDate = index % 4 === 0 ? iso(startOffset + 2) : undefined;
  const title = `${subcategory} ${geo[2]} ${now.getUTCFullYear()}`;

  return normalizeEvent({
    id: `seed-${index + 1}`,
    title,
    description: `Evento europeo dedicato a ${subcategory.toLowerCase()} con focus ${macro.toLowerCase()} nel territorio di ${geo[2]}.`,
    startDate,
    endDate,
    city: geo[2],
    region: geo[1],
    country: geo[0],
    venue: `Centro eventi ${geo[2]}`,
    category: macro,
    subcategory,
    tags: [macro.split('&')[0].trim().toLowerCase(), geo[2].toLowerCase(), subcategory.toLowerCase()],
    officialUrl: `${source.url.replace(/\/$/, '')}/events/${index + 1}`,
    ticketUrl: index % 3 === 0 ? `https://tickets.eventoeuropa.eu/${index + 1}` : undefined,
    sourceUrl: source.url,
    sourceDomain: new URL(source.url).hostname,
    language: source.language,
    priceText: index % 5 === 0 ? 'Ingresso gratuito' : `€${10 + (index % 7) * 3}`,
    currency: 'EUR',
    confidenceScore: Math.max(0.55, source.reliability - 0.05 + (index % 10) * 0.01),
    freshnessScore: 0,
    imageUrl: index % 2 === 0 ? `https://images.eventoeuropa.eu/${index + 1}.jpg` : undefined,
    latitude: undefined,
    longitude: undefined,
  });
});
