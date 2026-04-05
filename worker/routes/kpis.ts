import type { SearchFilters } from '../models/event';
import { eventIndex } from '../services/eventIndex';

const getFiltersFromUrl = (url: URL): SearchFilters => ({
  q: url.searchParams.get('q') ?? undefined,
  from: url.searchParams.get('from') ?? undefined,
  to: url.searchParams.get('to') ?? undefined,
  country: url.searchParams.get('country') ?? undefined,
  region: url.searchParams.get('region') ?? undefined,
  macroCategory: url.searchParams.get('macroCategory') ?? undefined,
  category: url.searchParams.get('category') ?? undefined,
});

export const kpisRoute = (request: Request) => {
  const filters = getFiltersFromUrl(new URL(request.url));
  const result = eventIndex.kpis(filters);
  return Response.json(result);
};
