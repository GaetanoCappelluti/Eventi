import type { EventCategory, EventMacroCategory, NormalizedEvent } from '../models/event';

const stamp = new Date().toISOString();
const year = 2026;

const mkDate = (month: number, day: number) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const monthCycle = [5, 6, 7, 8, 9, 10, 11, 12];
const dayCycle = [3, 6, 9, 12, 15, 18, 21, 24, 27];

const marketsThemes = ['mercatini', 'artigianato', 'territorio'];
const fairsThemes = ['fiere', 'networking', 'distretti produttivi'];
const foodThemes = ['enogastronomia', 'degustazioni', 'prodotti tipici'];
const outdoorThemes = ['outdoor', 'natura', 'turismo attivo'];
const hifiThemes = ['hi-fi', 'ascolto', 'audio high-end'];
const carAudioThemes = ['car audio', 'raduni', 'sound quality'];
const cultureThemes = ['cultura', 'patrimonio', 'mostre'];

const macroPlan: { macroCategory: EventMacroCategory; category: EventCategory; themes: string[] }[] = [
  { macroCategory: 'Sagre e Feste', category: 'Sagra', themes: foodThemes },
  { macroCategory: 'Sagre e Feste', category: 'Festa patronale', themes: cultureThemes },
  { macroCategory: 'Fiere e Mercati', category: 'Fiera campionaria', themes: fairsThemes },
  { macroCategory: 'Fiere e Mercati', category: 'Mercatino artigianale', themes: marketsThemes },
  { macroCategory: 'Fiere e Mercati', category: 'Mercatino natalizio', themes: marketsThemes },
  { macroCategory: 'Festival Territoriali', category: 'Festival territoriale', themes: outdoorThemes },
  { macroCategory: 'Enogastronomia', category: 'Festival food & wine', themes: foodThemes },
  { macroCategory: 'Enogastronomia', category: 'Sagra enogastronomica', themes: foodThemes },
  { macroCategory: 'Hi-Fi e Car Audio', category: 'Fiera hi-fi', themes: hifiThemes },
  { macroCategory: 'Hi-Fi e Car Audio', category: 'Raduno hi-fi car', themes: carAudioThemes },
  { macroCategory: 'Audio e Musica', category: 'Mostra mercato audio', themes: hifiThemes },
  { macroCategory: 'Eventi Locali e Regionali', category: 'Evento locale', themes: outdoorThemes },
];

const locations = [
  { countryCode: 'IT', country: 'Italia', region: 'Lombardia', locality: 'Milano', timezone: 'Europe/Rome' },
  { countryCode: 'IT', country: 'Italia', region: 'Emilia-Romagna', locality: 'Bologna', timezone: 'Europe/Rome' },
  { countryCode: 'IT', country: 'Italia', region: 'Toscana', locality: 'Firenze', timezone: 'Europe/Rome' },
  { countryCode: 'IT', country: 'Italia', region: 'Puglia', locality: 'Bari', timezone: 'Europe/Rome' },
  { countryCode: 'ES', country: 'Spagna', region: 'Catalogna', locality: 'Barcellona', timezone: 'Europe/Madrid' },
  { countryCode: 'ES', country: 'Spagna', region: 'Comunità di Madrid', locality: 'Madrid', timezone: 'Europe/Madrid' },
  { countryCode: 'FR', country: 'Francia', region: 'Île-de-France', locality: 'Parigi', timezone: 'Europe/Paris' },
  { countryCode: 'FR', country: 'Francia', region: 'Auvergne-Rhône-Alpes', locality: 'Lione', timezone: 'Europe/Paris' },
  { countryCode: 'DE', country: 'Germania', region: 'Baviera', locality: 'Monaco di Baviera', timezone: 'Europe/Berlin' },
  { countryCode: 'DE', country: 'Germania', region: 'Berlino', locality: 'Berlino', timezone: 'Europe/Berlin' },
  { countryCode: 'NL', country: 'Paesi Bassi', region: 'Noord-Holland', locality: 'Amsterdam', timezone: 'Europe/Amsterdam' },
  { countryCode: 'NL', country: 'Paesi Bassi', region: 'Utrecht', locality: 'Utrecht', timezone: 'Europe/Amsterdam' },
  { countryCode: 'BE', country: 'Belgio', region: 'Bruxelles-Capitale', locality: 'Bruxelles', timezone: 'Europe/Brussels' },
  { countryCode: 'PT', country: 'Portogallo', region: 'Lisboa', locality: 'Lisbona', timezone: 'Europe/Lisbon' },
  { countryCode: 'AT', country: 'Austria', region: 'Vienna', locality: 'Vienna', timezone: 'Europe/Vienna' },
  { countryCode: 'CH', country: 'Svizzera', region: 'Zurigo', locality: 'Zurigo', timezone: 'Europe/Zurich' },
  { countryCode: 'PL', country: 'Polonia', region: 'Masovia', locality: 'Varsavia', timezone: 'Europe/Warsaw' },
  { countryCode: 'CZ', country: 'Repubblica Ceca', region: 'Praga', locality: 'Praga', timezone: 'Europe/Prague' },
  { countryCode: 'HU', country: 'Ungheria', region: 'Budapest', locality: 'Budapest', timezone: 'Europe/Budapest' },
  { countryCode: 'SE', country: 'Svezia', region: 'Stoccolma', locality: 'Stoccolma', timezone: 'Europe/Stockholm' },
  { countryCode: 'DK', country: 'Danimarca', region: 'Hovedstaden', locality: 'Copenaghen', timezone: 'Europe/Copenhagen' },
  { countryCode: 'IE', country: 'Irlanda', region: 'Leinster', locality: 'Dublino', timezone: 'Europe/Dublin' },
  { countryCode: 'GR', country: 'Grecia', region: 'Attica', locality: 'Atene', timezone: 'Europe/Athens' },
  { countryCode: 'HR', country: 'Croazia', region: 'Spalato-Dalmazia', locality: 'Spalato', timezone: 'Europe/Zagreb' },
];

const topicWords = ['sagre', 'fiere', 'mercatini', 'hi-fi', 'car audio', 'raduni', 'eventi territoriali', 'enogastronomia', 'cultura', 'outdoor'];

const mk = (event: Omit<NormalizedEvent, 'createdAt' | 'updatedAt'>): NormalizedEvent => ({
  ...event,
  createdAt: stamp,
  updatedAt: stamp,
});

const buildSeedEvents = (): NormalizedEvent[] =>
  Array.from({ length: 360 }, (_, index) => {
    const sequence = index + 1;
    const loc = locations[index % locations.length];
    const plan = macroPlan[index % macroPlan.length];
    const month = monthCycle[index % monthCycle.length];
    const day = dayCycle[index % dayCycle.length];
    const endDay = Math.min(day + ((index % 3) + 1), 28);

    const startDate = mkDate(month, day);
    const endDate = mkDate(month, endDay);
    const topic = topicWords[index % topicWords.length];

    const slug = `${loc.countryCode.toLowerCase()}-${loc.locality.toLowerCase().replace(/\s+/g, '-')}-${plan.category.toLowerCase().replace(/\s+/g, '-')}-${sequence}`;

    return mk({
      id: `ev-${sequence}`,
      slug,
      title: `${plan.category} ${loc.locality} ${year} #${sequence}`,
      description: `Evento ${plan.macroCategory.toLowerCase()} dedicato a ${topic}, reti territoriali e partecipazione locale in ${loc.locality}.`,
      macroCategory: plan.macroCategory,
      category: plan.category,
      themes: [...plan.themes, topic],
      tags: [topic, loc.locality.toLowerCase().replace(/\s+/g, '-'), plan.macroCategory.toLowerCase().replace(/\s+/g, '-')],
      geo: {
        countryCode: loc.countryCode,
        country: loc.country,
        region: loc.region,
        locality: loc.locality,
        venue: `Centro eventi ${loc.locality}`,
      },
      dates: {
        startDate,
        endDate,
        timezone: loc.timezone,
      },
      officialUrl: `https://eventieuropa.example/${slug}`,
      bookingUrl: `https://tickets.eventieuropa.example/${slug}`,
      ticketPrice: index % 5 === 0 ? 'Gratis' : `€${10 + (index % 12) * 3}`,
      confidenceScore: 0.82 + (index % 10) / 100,
      rankingScore: 0.79 + (index % 12) / 100,
      dedupeHash: `${loc.countryCode}|${loc.locality}|${slug}|${startDate}`,
      sourceRefs: [
        {
          sourceId: `${loc.countryCode.toLowerCase()}-tourism-${index % 9}`,
          sourceName: `${loc.locality} Turismo Eventi`,
          sourceUrl: `https://sources.eventieuropa.example/${loc.countryCode.toLowerCase()}/${index % 9}`,
          sourceType: index % 4 === 0 ? 'official' : 'institutional',
          discoveredAt: stamp,
          extractor: 'manual-seed',
          sourceScore: 0.8 + (index % 10) / 100,
        },
      ],
    });
  });

export const seedEvents: NormalizedEvent[] = buildSeedEvents();
