import { eventIndex } from '../services/eventIndex';

export const indexStatusRoute = () => Response.json(eventIndex.stats());
