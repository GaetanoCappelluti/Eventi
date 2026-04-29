import { runIngestionPipeline } from '../pipeline/ingestionPipeline';
import { eventIndex } from '../services/eventIndex';

export const ingestRoute = async () => {
  const { items, stats } = await runIngestionPipeline();
  eventIndex.merge(items);

  return Response.json({
    ok: true,
    ingested: items.length,
    totalIndex: eventIndex.stats().totalSeeded,
    stats,
  });
};
