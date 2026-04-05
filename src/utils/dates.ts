import type { QuickRange } from '../services/events';

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));

export const quickRangeLabel: Record<QuickRange, string> = {
  none: 'Nessun periodo rapido',
  next_7: 'Prossimi 7 giorni',
  next_30: 'Prossimi 30 giorni',
  this_month: 'Questo mese',
};
