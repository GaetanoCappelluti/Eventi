import type { SourceSeed } from '../types/event';

export type SourceFetchResult = {
  source: SourceSeed;
  html: string;
  fetchedAt: string;
};

export const fetchSource = async (source: SourceSeed): Promise<SourceFetchResult> => ({
  source,
  html: '<html><head></head><body></body></html>',
  fetchedAt: new Date().toISOString(),
});
