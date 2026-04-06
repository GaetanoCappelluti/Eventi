import type { EventRecord } from '../types/event';

const capture = (html: string, regex: RegExp) => html.match(regex)?.[1]?.trim();

export const extractHtmlEvents = (html: string, sourceUrl: string): Partial<EventRecord>[] => {
  if (!html.trim()) return [];

  const title = capture(html, /<h1[^>]*>([^<]+)<\/h1>/i) ?? capture(html, /<title[^>]*>([^<]+)<\/title>/i);
  const startDate = capture(html, /data-start-date=["']([^"']+)["']/i);
  const city = capture(html, /data-city=["']([^"']+)["']/i);

  if (!title || !startDate) return [];

  return [{
    title,
    startDate: startDate.slice(0, 10),
    city: city ?? 'n/d',
    region: 'n/d',
    country: 'Europa',
    description: capture(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ?? 'Evento estratto da HTML.',
    officialUrl: sourceUrl,
    sourceUrl,
    sourceDomain: new URL(sourceUrl).hostname,
    language: 'it',
  }];
};
