import { downloadEventIcs } from '../services/calendar';
import type { EventItem } from '../services/events';

type CalendarModalProps = {
  event?: EventItem;
  onClose: () => void;
};

export const CalendarModal = ({ event, onClose }: CalendarModalProps) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/75 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Salva in calendario</h3>
        <p className="mt-2 text-sm text-slate-300">Scarica un file .ics universale, compatibile con Google Calendar, Outlook e Apple Calendar.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200">Chiudi</button>
          <button
            onClick={() => {
              downloadEventIcs(event);
              onClose();
            }}
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white"
          >
            Download .ics
          </button>
        </div>
      </div>
    </div>
  );
};
