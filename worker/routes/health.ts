import { eventIndex } from '../services/eventIndex';

export const healthRoute = () => Response.json(eventIndex.health());
