import { useEffect, useState } from 'react';
import { CategorySummary } from './components/CategorySummary';
import { CalendarModal } from './components/CalendarModal';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { FiltersPanel } from './components/FiltersPanel';
import { KpiDashboard } from './components/KpiDashboard';
import { RegionSummary } from './components/RegionSummary';
import { useEventSearch } from './hooks/useEventSearch';
import type { EventItem } from './services/events';
import { pluralize } from './utils/formatters';

const App = () => {
  const { filters, setFilters, events, loading, hasSearched, runSearch, kpis, regionSummary, categorySummary, highlighted } = useEventSearch();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | undefined>();
  const [calendarEvent, setCalendarEvent] = useState<EventItem | undefined>();

  useEffect(() => {
    void runSearch();
  }, []);

  const applyProgressiveFilter = async (patch: Partial<typeof filters>) => {
    await runSearch(patch);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-500">EventoEuropa · Nexyron</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Aggregatore europeo eventi territoriali.</h1>
          <p className="mt-3 max-w-3xl text-slate-300">La UI usa solo API interne: ricerca libera, KPI globali e raffinamento progressivo senza filtri obbligatori.</p>
        </header>

        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          onSearch={() => void runSearch()}
          loading={loading}
          countries={kpis.topCountries.map((item) => item.key)}
          regions={kpis.topRegions.map((item) => item.key)}
        />

        {hasSearched ? (
          <section className="mt-8 space-y-6">
            <KpiDashboard kpis={kpis} filters={filters} onFilterChange={(patch) => void applyProgressiveFilter(patch)} />

            <div className="grid gap-4 lg:grid-cols-2">
              <RegionSummary items={regionSummary} selected={filters.region} onSelect={(region) => void applyProgressiveFilter({ region: filters.region === region ? undefined : region })} />
              <CategorySummary items={categorySummary} selected={filters.category} onSelect={(category) => void applyProgressiveFilter({ category: filters.category === category ? undefined : category })} />
            </div>

            {highlighted.length > 0 ? (
              <section>
                <h2 className="section-title">Eventi in evidenza (ranking completo)</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {highlighted.slice(0, 6).map((event) => (
                    <EventCard key={`highlight-${event.id}`} event={event} onDetails={setSelectedEvent} onAddToCalendar={setCalendarEvent} />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="section-title">Lista eventi</h2>
                <span className="text-sm text-slate-400">{pluralize(events.length, 'evento', 'eventi')}</span>
              </div>

              {events.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} onDetails={setSelectedEvent} onAddToCalendar={setCalendarEvent} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-sm text-slate-300">Nessun evento trovato con i filtri correnti. Prova a rimuovere alcuni filtri o a cambiare intervallo data.</div>
              )}
            </section>
          </section>
        ) : null}
      </div>

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(undefined)} onAddToCalendar={setCalendarEvent} />
      <CalendarModal event={calendarEvent} onClose={() => setCalendarEvent(undefined)} />
    </main>
  );
};

export default App;
