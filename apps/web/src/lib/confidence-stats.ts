import type { ConfidenceLevel } from '@phoenix-ai/shared';
import type { GraphElementMetadata } from '../data/index.js';

const LEVELS: ConfidenceLevel[] = ['high', 'medium', 'low', 'inferred'];

export interface ConfidenceStat {
  level: ConfidenceLevel;
  label: string;
  count: number;
}

const LABELS: Record<ConfidenceLevel, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  inferred: 'Inferred',
};

export function computeConfidenceStats(elements: GraphElementMetadata[]): ConfidenceStat[] {
  const counts: Record<ConfidenceLevel, number> = { high: 0, medium: 0, low: 0, inferred: 0 };
  for (const el of elements) {
    counts[el.confidence.level] += 1;
  }
  return LEVELS.map((level) => ({ level, label: LABELS[level], count: counts[level] }));
}
