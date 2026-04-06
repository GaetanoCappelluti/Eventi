import type { ChangeEvent } from 'react';
import { CATEGORIES } from '../data/sectors';
import type { EventFilters, QuickRange } from '../services/events';
import { quickRangeLabel } from '../utils/dates';

type FiltersPanelProps = {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
  onSearch: () => void;
  loading: boolean;
  countries: string[];
  regions: string[];
};

export const FiltersPanel = ({ filters, onChange, onSearch, loading, countries, regions }: FiltersPanelProps) => {
  const update = (key: keyof EventFilters) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    onChange({ ...filters, [key]: value || undefined });
  };

  return (
    <section className="card-surface p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-slate-300">
          Data da
          <input type="date" value={filters.from ?? ''} onChange={update('from')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2" />
        </label>

        <label className="text-sm text-slate-300">
          Data a
          <input type="date" value={filters.to ?? ''} onChange={update('to')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2" />
        </label>

        <label className="text-sm text-slate-300">
          Periodo rapido
          <select value={filters.quickRange ?? 'none'} onChange={update('quickRange')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2">
            {(Object.keys(quickRangeLabel) as QuickRange[]).map((key) => (
              <option key={key} value={key}>{quickRangeLabel[key]}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          Ricerca libera
          <input type="text" placeholder="es. sagra, mercatino, hi-fi car" value={filters.query ?? ''} onChange={update('query')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2" />
        </label>

        <label className="text-sm text-slate-300">
          Paese
          <select value={filters.country ?? ''} onChange={update('country')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2">
            <option value="">Tutti</option>
            {countries.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          Regione
          <select value={filters.region ?? ''} onChange={update('region')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2">
            <option value="">Tutte</option>
            {regions.map((region) => <option key={region} value={region}>{region}</option>)}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          Macro-categoria
          <select value={filters.category ?? ''} onChange={update('category')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2">
            <option value="">Tutte</option>
            {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <div className="flex items-end">
          <button type="button" onClick={onSearch} disabled={loading} className="w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-500 disabled:opacity-50">
            {loading ? 'Ricerca in corso...' : 'Esplora eventi'}
          </button>
        </div>
      </div>
    </section>
  );
};
