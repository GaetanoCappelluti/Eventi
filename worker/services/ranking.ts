import type { EventRecord, SourceSeed } from '../types/event';

const completeness = (event: EventRecord) => {
  const fields = [
    event.description,
    event.city,
    event.region,
    event.country,
    event.venue,
    event.imageUrl,
    event.ticketUrl,
    event.officialUrl,
    event.subcategory,
    event.tags.length ? 'tags' : '',
  ];

  return fields.filter(Boolean).length / fields.length;
};

export const scoreEvent = (event: EventRecord, source?: SourceSeed) => {
  const sourceQuality = source?.reliability ?? 0.5;
  const urlBonus = (event.officialUrl ? 0.08 : 0) + (event.ticketUrl ? 0.06 : 0);
  const categoryConsistency = event.subcategory.toLowerCase().includes(event.category.split('&')[0].trim().toLowerCase()) ? 0.04 : 0;
  const total = event.freshnessScore * 0.3 + completeness(event) * 0.25 + sourceQuality * 0.25 + event.confidenceScore * 0.1 + urlBonus + categoryConsistency;
  return Number(total.toFixed(4));
};
