import type { SearchFilters } from '../types/event';
import { eventIndex } from '../services/eventIndex';

const parseFilters = (url: URL): SearchFilters => ({
  q: url.searchParams.get('q') ?? undefined,
  from: url.searchParams.get('from') ?? undefined,
  to: url.searchParams.get('to') ?? undefined,
  country: url.searchParams.get('country') ?? undefined,
  region: url.searchParams.get('region') ?? undefined,
  category: url.searchParams.get('category') ?? url.searchParams.get('macroCategory') ?? undefined,
  subcategory: url.searchParams.get('subcategory') ?? undefined,
});

export const kpisRoute = (request: Request) => Response.json(eventIndex.kpis(parseFilters(new URL(request.url))));
