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
      <KpiCard title="Eventi totali" value={kpis.totalEvents} subtitle="Calcolati sull'intero set filtrato" />
      <KpiCard title="Top località" value={kpis.topCities.length} subtitle="Distribuzione città nell'indice filtrato" />
      <KpiCard title="Sottocategorie" value={kpis.topSubcategories.length} subtitle="Copertura tassonomia disponibile" />
    </div>

    <div className="grid gap-3 lg:grid-cols-2">
      <div className="card-surface p-4">
        <h3 className="section-title">Macro-categorie</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.topMacroCategories.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ category: filters.category === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Paesi</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.topCountries.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ country: filters.country === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Regioni</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {kpis.topRegions.map((item) => (
            <button key={item.key} onClick={() => onFilterChange({ region: filters.region === item.key ? undefined : item.key })} className="rounded-full border border-slate-600 px-3 py-1 text-sm hover:border-brand-500/60">
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface p-4">
        <h3 className="section-title">Periodo coperto</h3>
        <p className="mt-3 text-sm text-slate-300">Da {kpis.periodCovered.from ?? 'n/d'} a {kpis.periodCovered.to ?? 'n/d'}</p>
      </div>
    </div>
  </section>
);
