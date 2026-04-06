import { eventIndex } from '../services/eventIndex';

export const sourcesRoute = () => Response.json({ total: eventIndex.sources().length, items: eventIndex.sources() });
