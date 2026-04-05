import type { EventFilters, EventKpis } from '../services/events';
import { KpiCard } from './KpiCard';

type KpiDashboardProps = {
  kpis: EventKpis;
  filters: EventFilters;
  onFilterChange: (patch: Partial<EventFilters>) => void;
};

export const KpiDashboard = ({ kpis, filters, onFilterChange }: KpiDashboardProps) => (
  <section className="space-y-4">
    <div className="grid gap-3 md:grid-cols-3">
      <KpiCard title="Eventi trovati" value={kpis.totalEvents} subtitle="Risultati coerenti con i filtri correnti" />
      <KpiCard title="Eventi in evidenza" value={kpis.highlights} subtitle="Selezione editoriale o più rilevanti" />
      <KpiCard title="Località attive" value={kpis.topLocations.length} subtitle="Città con maggiore concentrazione" />
    </div>

    <div className="grid gap-3 lg:grid-cols-3">
      <div className="card-surface p-4">
        <h3 className="section-title">Paesi più presenti</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.macroAreas.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ country: filters.country === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Categorie</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.categories.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ category: filters.category === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Cluster temporali</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.temporalClusters.map((item) => (
            <span key={item.key} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200">
              {item.key} · {item.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
