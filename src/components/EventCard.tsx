import { formatDate } from '../utils/dates';
import type { EventItem } from '../services/events';

type EventCardProps = {
  event: EventItem;
  onDetails: (event: EventItem) => void;
  onAddToCalendar: (event: EventItem) => void;
};

export const EventCard = ({ event, onDetails, onAddToCalendar }: EventCardProps) => (
  <article className="card-surface p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
        <p className="mt-1 text-sm text-slate-300">{formatDate(event.startDate)} · {event.city}, {event.country}</p>
      </div>
      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{event.category}</span>
    </div>

    <p className="mt-3 line-clamp-3 text-sm text-slate-300">{event.description}</p>

    <div className="mt-4 flex flex-wrap gap-2">
      {event.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300">#{tag}</span>)}
    </div>

    <div className="mt-5 flex gap-2">
      <button type="button" onClick={() => onDetails(event)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-500">Dettaglio</button>
      <button type="button" onClick={() => onAddToCalendar(event)} className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-100 hover:border-brand-500/60">Calendario</button>
    </div>
  </article>
);
