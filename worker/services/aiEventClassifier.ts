import type { EventCategory, EventMacroCategory } from '../models/event';

const categoryMap: Array<{ macro: EventMacroCategory; category: EventCategory; keywords: string[] }> = [
  { macro: 'Sagre e Feste', category: 'Sagra', keywords: ['sagra', 'festa', 'patronale'] },
  { macro: 'Fiere e Mercati', category: 'Fiera campionaria', keywords: ['fiera', 'expo', 'mercato', 'market'] },
  { macro: 'Festival Territoriali', category: 'Festival territoriale', keywords: ['festival', 'territoriale'] },
  { macro: 'Enogastronomia', category: 'Festival food & wine', keywords: ['wine', 'food', 'gusto', 'gastronomia'] },
  { macro: 'Hi-Fi e Car Audio', category: 'Fiera hi-fi', keywords: ['hifi', 'hi-fi', 'audio', 'car audio'] },
];

export const classifyEventCategory = (text: string): { macroCategory: EventMacroCategory; category: EventCategory; confidenceBoost: number } => {
  const normalized = text.toLowerCase();
  const found = categoryMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));

  if (!found) {
    return {
      macroCategory: 'Eventi Locali e Regionali',
      category: 'Evento locale',
      confidenceBoost: 0,
    };
  }

  return {
    macroCategory: found.macro,
    category: found.category,
    confidenceBoost: 0.08,
  };
};
