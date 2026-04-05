import type { SourceReference } from '../models/event';

const sourceTypeBaseScore: Record<SourceReference['sourceType'], number> = {
  official: 1,
  institutional: 0.95,
  ticketing: 0.85,
  media: 0.75,
  community: 0.65,
  aggregator: 0.55,
};

export const scoreSourceReference = (ref: SourceReference) => {
  const typeScore = sourceTypeBaseScore[ref.sourceType];
  return Math.max(0, Math.min(1, typeScore * 0.7 + ref.sourceScore * 0.3));
};

export const computeSourceReliability = (refs: SourceReference[]) => {
  if (refs.length === 0) return 0;
  return refs.reduce((sum, ref) => sum + scoreSourceReference(ref), 0) / refs.length;
};
