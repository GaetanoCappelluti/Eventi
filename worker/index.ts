import { kpisRoute } from './routes/kpis';
import { searchRoute } from './routes/search';
import { ingestRoute } from './routes/ingest';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/search') return searchRoute(request);
    if (url.pathname === '/api/kpis') return kpisRoute(request);
    if (url.pathname === '/api/ingest' && request.method === 'POST') return ingestRoute();

    return new Response('Not found', { status: 404 });
  },
};
