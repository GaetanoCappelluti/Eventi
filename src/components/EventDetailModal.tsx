import type { EventItem } from '../services/events';
import { formatDate } from '../utils/dates';

type EventDetailModalProps = {
  event?: EventItem;
  onClose: () => void;
  onAddToCalendar: (event: EventItem) => void;
};

export const EventDetailModal = ({ event, onClose, onAddToCalendar }: EventDetailModalProps) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold text-white">{event.title}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
          <p><strong>Data:</strong> {formatDate(event.startDate)}{event.endDate ? ` → ${formatDate(event.endDate)}` : ''}</p>
          <p><strong>Luogo:</strong> {event.city}, {event.region}, {event.country}</p>
          <p><strong>Categoria:</strong> {event.category}</p>
          <p><strong>Prezzo:</strong> {event.price}</p>
        </div>

        <p className="mt-4 text-slate-200">{event.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300">#{tag}</span>)}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {event.url ? (
            <a href={event.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-600 px-3 py-2 text-sm hover:border-brand-500/60">
              Vai al sito evento
            </a>
          ) : null}
          <button type="button" onClick={() => onAddToCalendar(event)} className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-500">
            Aggiungi al calendario
          </button>
        </div>
      </div>
    </div>
  );
};
