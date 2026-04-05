# EventoEuropa

Motore React + Vite + Cloudflare Workers per aggregazione eventi europei, con pipeline pronta per ingestion multi-fonte (discover → extract → normalize → dedupe → index).

## Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind.
- **Backend API**: Cloudflare Workers (`/api/search`, `/api/kpis`).
- **Deployment target**: Cloudflare Pages + Worker API separato.
- **Index storage**: modulo dedicato (`worker/services/eventIndex.ts`), oggi in-memory su dataset seed realistico.

## Avvio locale frontend

```bash
npm install
npm run dev
```

Frontend su Vite (default `http://localhost:5173`) con chiamate API interne su `/api/*`.

## Avvio API worker

```bash
npm run dev:api
```

Configurazione Worker in `wrangler.toml` con entrypoint `worker/index.ts`.

> In locale puoi impostare `VITE_EVENT_API_BASE` (es. `http://127.0.0.1:8787/api`) per collegare UI e Worker separati.

## Architettura progetto

```text
src/
  components/
  hooks/
  services/
    searchClient.ts        # UI -> API interne
worker/
  config/
    sourceSeeds.ts         # seed fonti iniziali per paese/categoria
  data/
    seedEvents.ts          # seed index realistico
  models/
    event.ts               # modello dati evento completo
  pipeline/
    ingestionPipeline.ts   # discover -> extract -> normalize -> dedupe -> index
  routes/
    search.ts
    kpis.ts
  services/
    eventIndex.ts
    normalizeEvent.ts
    dedupeEvents.ts
    sourceScoring.ts
    extractors/
      schemaEventExtractor.ts
      htmlEventExtractor.ts
```

## Cosa è già implementato

- Ricerca libera senza filtri obbligatori (puoi partire anche solo da date o senza filtro).
- KPI iniziali: totale eventi, macro-categorie, regioni/paesi, top località, top temi.
- Ricerca progressiva: click sui KPI = applicazione filtro immediata.
- Dettaglio evento con **link ufficiale evidenziato** e **link prenotazione** se presente.
- Tassonomia ampliata per sagre, fiere, mercatini, hi-fi, car audio, eventi territoriali.
- Ranking base sensato (`rankingScore + confidence + freshness + query match`).
- Confidence score evento e scoring sorgente.

## Dove inserire il crawling reale

1. **Discovery fonti**: estendere `worker/config/sourceSeeds.ts` (o servizio dedicato) con domini per paese/categoria.
2. **Parsing schema.org/Event**: implementare logica reale in `worker/services/extractors/schemaEventExtractor.ts`.
3. **Fallback HTML extraction**: estendere `worker/services/extractors/htmlEventExtractor.ts` con parser/selectors per dominio.
4. **Normalizzazione + deduplica**: già pronte in `normalizeEvent.ts` e `dedupeEvents.ts`.
5. **Indicizzazione persistente**: sostituire index in-memory in `eventIndex.ts` con D1/KV/R2/Vectorize in base a strategia di query.
