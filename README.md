# EventoEuropa

Web app React + Vite + Tailwind per la scoperta guidata di eventi in Europa.

## Stack

- React 18
- Vite 5
- TypeScript
- Tailwind CSS

## Avvio locale

```bash
npm install
npm run dev
```

Build produzione:

```bash
npm run build
npm run preview
```

## Architettura

```text
src/
  components/
  data/
  hooks/
  services/
  utils/
```

## Note implementative

- Nessuna dipendenza da Base44.
- Nessuna chiamata API esterna lato client: ricerca e KPI usano dataset locale mock.
- Calendario: download `.ics` disponibile con service dedicato (`src/services/calendar.ts`), predisposto per integrazioni future account-based.
