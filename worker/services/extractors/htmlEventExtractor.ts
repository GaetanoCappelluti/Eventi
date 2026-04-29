import type { NormalizedEvent } from '../../models/event';
import { classifyEventCategory } from '../aiEventClassifier';

export type HtmlExtractionInput = {
  sourceId: string;
  sourceUrl: string;
  html: string;
};

const stripHtml = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const parseTitle = (html: string) => html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();

const parseIsoDate = (text: string) => text.match(/(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})/)?.[0]?.replace(/\./g, '-').replace(/\//g, '-');

export const htmlEventExtractor = (input: HtmlExtractionInput): Partial<NormalizedEvent>[] => {
  if (!input.html.trim()) return [];

  const title = parseTitle(input.html) ?? 'Evento da pagina web';
  const body = stripHtml(input.html);
  const description = body.slice(0, 400);
  const startDate = parseIsoDate(body) ?? new Date().toISOString().slice(0, 10);
  const categoryPrediction = classifyEventCategory(`${title} ${description}`);

  return [
    {
      title,
      description,
      officialUrl: input.sourceUrl,
      dates: {
        startDate,
        timezone: 'Europe/Rome',
      },
      geo: {
        countryCode: 'EU',
        country: 'Europa',
        region: 'N/D',
        locality: 'N/D',
      },
      themes: ['web-discovery'],
      tags: description.split(' ').slice(0, 6),
      macroCategory: categoryPrediction.macroCategory,
      category: categoryPrediction.category,
      confidenceScore: 0.45 + categoryPrediction.confidenceBoost,
      rankingScore: 0.4,
    },
  ];
};
