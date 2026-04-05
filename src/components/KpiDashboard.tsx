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
      <KpiCard title="Eventi totali" value={kpis.totalEvents} subtitle="Copertura corrente dell'indice eventi" />
      <KpiCard title="Top località" value={kpis.topLocations.length} subtitle="Città con più occorrenze nel set filtrato" />
      <KpiCard title="Temi attivi" value={kpis.topThemes.length} subtitle="Topic più frequenti per raffinamento rapido" />
    </div>

    <div className="grid gap-3 lg:grid-cols-2">
      <div className="card-surface p-4">
        <h3 className="section-title">Macro-categorie</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.byMacroCategory.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ macroCategory: filters.macroCategory === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Paesi</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.byCountry.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ country: filters.country === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Regioni</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.byRegion.slice(0, 10).map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ region: filters.region === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Top temi</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.topThemes.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ query: filters.query === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>
    </div>
  </section>
);
