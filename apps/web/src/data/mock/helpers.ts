import type { Confidence, ConfidenceLevel, Provenance, SourceType } from '@phoenix-ai/shared';
import type { GraphElementMetadata } from '../types.js';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function prov(
  sourceId: string,
  sourceType: SourceType,
  derivedBy: string,
  daysAgo = 3,
): Provenance {
  return { sourceId, sourceType, derivedBy, derivedAt: daysAgoIso(daysAgo) };
}

export function conf(level: ConfidenceLevel, score?: number, rationale?: string): Confidence {
  return { level, score, rationale };
}

export function meta(provenance: Provenance[], confidence: Confidence): GraphElementMetadata {
  return { provenance, confidence };
}
