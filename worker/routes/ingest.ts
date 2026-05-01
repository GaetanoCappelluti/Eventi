import { runIngestionPipeline } from '../pipeline/ingestionPipeline';
import { eventIndex } from '../services/eventIndex';

export const ingestRoute = async () => {
  const { items, stats } = await runIngestionPipeline();
  eventIndex.merge(items);
  eventIndex.setLastIngestionStats(stats as unknown as Record<string, unknown>);

  return Response.json({
    ok: true,
    ingested: items.length,
    totalIndex: eventIndex.stats().totalIndexed,
    stats,
  });
};
