import type { EventItem } from './events';

const escapeIcs = (value: string) => value.replace(/[\\;,\n]/g, (match) => ({ '\\': '\\\\', ';': '\\;', ',': '\\,', '\n': '\\n' }[match] ?? match));

const toUtcTimestamp = (isoDate: string) => {
  const date = new Date(`${isoDate}T09:00:00Z`);
  return date.toISOString().replace(/[-:]/g, '').replace('.000', '');
};

export const buildIcsFile = (event: EventItem) => {
  const start = toUtcTimestamp(event.startDate);
  const end = toUtcTimestamp(event.endDate ?? event.startDate);
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EventoEuropa//IT\nBEGIN:VEVENT\nUID:${event.id}@eventoeuropa\nDTSTAMP:${toUtcTimestamp(event.startDate)}\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${escapeIcs(event.title)}\nDESCRIPTION:${escapeIcs(event.description)}\nLOCATION:${escapeIcs(`${event.city}, ${event.region}, ${event.country}`)}\nEND:VEVENT\nEND:VCALENDAR`;
};

export const downloadEventIcs = (event: EventItem) => {
  const content = buildIcsFile(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
