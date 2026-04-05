import type { EventItem, EventKpis } from './events';

type SearchApiFilters = Record<string, string | number | undefined>;

const API_BASE = import.meta.env.VITE_EVENT_API_BASE ?? '/api';

const toQuery = (filters: SearchApiFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    params.set(key, String(value));
  });
  return params.toString();
};

async function readJson<T>(path: string, filters: SearchApiFilters): Promise<T> {
  const query = toQuery(filters);
  const url = `${API_BASE}${path}${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API ${path} failed (${response.status})`);
  return response.json() as Promise<T>;
}

export const searchClient = {
  search: (filters: SearchApiFilters) => readJson<{ total: number; items: EventItem[] }>('/search', filters),
  kpis: (filters: SearchApiFilters) => readJson<EventKpis>('/kpis', filters),
};
