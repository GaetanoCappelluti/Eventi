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
  limit: url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined,
  offset: url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : undefined,
});

export const searchRoute = (request: Request) => {
  const filters = getFiltersFromUrl(new URL(request.url));
  const result = eventIndex.query(filters);
  return Response.json(result);
};
