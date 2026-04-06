import { eventIndex } from '../services/eventIndex';

export const eventRoute = (request: Request) => {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').pop();
  if (!id) return new Response('Missing id', { status: 400 });
  const event = eventIndex.byId(id);
  if (!event) return new Response('Not found', { status: 404 });
  return Response.json(event);
};
