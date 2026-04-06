import type { EventRecord } from '../types/event';

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const extractStructuredEvents = (html: string, sourceUrl: string): Partial<EventRecord>[] => {
  const matches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];

  return matches.flatMap((scriptBlock) => {
    const jsonText = scriptBlock.replace(/^.*?>/, '').replace(/<\/script>$/i, '').trim();
    if (!jsonText) return [];

    try {
      const parsed = JSON.parse(jsonText);
      const candidates = asArray(parsed['@graph'] ? parsed['@graph'] : parsed);
      return candidates
        .filter((item) => String(item['@type']).toLowerCase().includes('event'))
        .map((item) => ({
          title: item.name,
          description: item.description,
          startDate: String(item.startDate ?? '').slice(0, 10),
          endDate: item.endDate ? String(item.endDate).slice(0, 10) : undefined,
          city: item.location?.address?.addressLocality,
          region: item.location?.address?.addressRegion,
          country: item.location?.address?.addressCountry,
          venue: item.location?.name,
          officialUrl: item.url ?? sourceUrl,
          ticketUrl: item.offers?.url,
          sourceUrl,
          sourceDomain: new URL(sourceUrl).hostname,
          language: item.inLanguage ?? 'it',
          imageUrl: typeof item.image === 'string' ? item.image : undefined,
        }));
    } catch {
      return [];
    }
  });
};
