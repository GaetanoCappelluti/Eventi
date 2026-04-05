import { kpisRoute } from './routes/kpis';
import { searchRoute } from './routes/search';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/search') return searchRoute(request);
    if (url.pathname === '/api/kpis') return kpisRoute(request);

    return new Response('Not found', { status: 404 });
  },
};
