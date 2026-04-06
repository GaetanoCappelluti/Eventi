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
  const { filters, setFilters, events, totalResults, loading, hasSearched, runSearch, loadMore, kpis, regionSummary, categorySummary, highlighted, hasMore } = useEventSearch();
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
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Scopri eventi europei in modo guidato.</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Parti senza filtri obbligatori, osserva KPI e distribuzioni iniziali, poi restringi per area, categoria e tempo fino a trovare l'evento giusto.
          </p>
        </header>

        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          onSearch={() => void runSearch()}
          loading={loading}
          countries={kpis.byCountry.map((item) => item.key)}
          regions={kpis.byRegion.map((item) => item.key)}
        />

        {hasSearched ? (
          <section className="mt-8 space-y-6">
            <KpiDashboard
              kpis={kpis}
              filters={filters}
              onFilterChange={(patch) => void applyProgressiveFilter(patch)}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <RegionSummary items={regionSummary} selected={filters.region} onSelect={(region) => void applyProgressiveFilter({ region: filters.region === region ? undefined : region })} />
              <CategorySummary items={categorySummary} selected={filters.macroCategory} onSelect={(category) => void applyProgressiveFilter({ macroCategory: filters.macroCategory === category ? undefined : category })} />
            </div>

            {highlighted.length > 0 ? (
              <section>
                <h2 className="section-title">Eventi in evidenza</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {highlighted.map((event) => (
                    <EventCard key={`highlight-${event.id}`} event={event} onDetails={setSelectedEvent} onAddToCalendar={setCalendarEvent} />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="section-title">Lista eventi</h2>
                <span className="text-sm text-slate-400">{pluralize(totalResults, 'evento trovato', 'eventi trovati')} · {pluralize(events.length, 'mostrato', 'mostrati')}</span>
              </div>

              {events.length > 0 ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} onDetails={setSelectedEvent} onAddToCalendar={setCalendarEvent} />
                    ))}
                  </div>

              {events.length > 0 && hasMore ? (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loading}
                    className="rounded-lg border border-brand-500/60 bg-brand-600/20 px-4 py-2 text-sm font-medium text-brand-100 transition hover:bg-brand-600/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Caricamento...' : 'Carica altri eventi'}
                  </button>
                </div>
              ) : null}
                </>
              ) : (
                <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-sm text-slate-300">
                  Nessun evento trovato con i filtri correnti. Prova a rimuovere alcuni filtri o a cambiare intervallo data.
                </div>
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
