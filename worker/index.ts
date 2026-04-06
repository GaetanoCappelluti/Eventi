import { eventRoute } from './routes/event';
import { healthRoute } from './routes/health';
import { kpisRoute } from './routes/kpis';
import { searchRoute } from './routes/search';
import { sourcesRoute } from './routes/sources';
import { runIngestionPipeline } from './services/ingestionPipeline';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/search') return searchRoute(request);
    if (url.pathname === '/api/kpis') return kpisRoute(request);
    if (url.pathname.startsWith('/api/event/')) return eventRoute(request);
    if (url.pathname === '/api/sources') return sourcesRoute();
    if (url.pathname === '/api/health') return healthRoute();

    return new Response('Not found', { status: 404 });
  },

  async scheduled() {
    await runIngestionPipeline();
  },
};
