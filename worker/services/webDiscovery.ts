import { sourceSeeds } from '../config/sourceSeeds';

export type DiscoveredPage = {
  sourceId: string;
  sourceUrl: string;
  url: string;
  title: string;
  snippet: string;
};

const clean = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const parseDuckDuckGoLite = (html: string) => {
  const matches = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi)];
  return matches
    .map((match) => ({
      href: match[1],
      text: clean(match[2] ?? ''),
    }))
    .filter((item) => item.href.startsWith('http') && item.text.length > 6);
};

const buildQueries = () =>
  sourceSeeds.flatMap((source) =>
    source.categories.slice(0, 2).map((category) => ({
      sourceId: source.id,
      sourceUrl: source.baseUrl,
      query: `${category} ${source.country} eventi ufficiali`,
    })),
  );

export const discoverEventPages = async (maxPages = 24): Promise<DiscoveredPage[]> => {
  const queries = buildQueries();
  const discovered: DiscoveredPage[] = [];
  const seen = new Set<string>();

  for (const item of queries) {
    if (discovered.length >= maxPages) break;

    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(item.query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'user-agent': 'EventoEuropaBot/1.0 (+https://eventi.local)',
      },
    });

    if (!response.ok) continue;

    const html = await response.text();
    const links = parseDuckDuckGoLite(html).slice(0, 2);

    for (const link of links) {
      if (discovered.length >= maxPages) break;
      if (seen.has(link.href)) continue;
      seen.add(link.href);
      discovered.push({
        sourceId: item.sourceId,
        sourceUrl: item.sourceUrl,
        url: link.href,
        title: link.text,
        snippet: item.query,
      });
    }
  }

  return discovered;
};
