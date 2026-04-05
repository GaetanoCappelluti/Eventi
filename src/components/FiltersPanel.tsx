import type { ChangeEvent } from 'react';
import { REGIONS } from '../data/regions';
import { CATEGORIES, MACRO_AREAS } from '../data/sectors';
import { quickRangeLabel } from '../utils/dates';
import type { EventFilters, QuickRange } from '../services/events';

type FiltersPanelProps = {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
  onSearch: () => void;
  loading: boolean;
};

export const FiltersPanel = ({ filters, onChange, onSearch, loading }: FiltersPanelProps) => {
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
          <input type="text" placeholder="es. AI, startup, turismo" value={filters.query ?? ''} onChange={update('query')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2" />
        </label>

        <label className="text-sm text-slate-300">
          Macro-area
          <select value={filters.macroArea ?? ''} onChange={update('macroArea')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2">
            <option value="">Tutte</option>
            {MACRO_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          Regione
          <select value={filters.region ?? ''} onChange={update('region')} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2">
            <option value="">Tutte</option>
            {REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          Categoria
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
