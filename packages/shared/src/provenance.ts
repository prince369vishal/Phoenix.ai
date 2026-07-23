/**
 * Shared provenance & confidence types.
 *
 * Every node and edge in the knowledge graph must carry this metadata
 * (FRD §4.3, Element Metadata) so that every rendered OKF output can be
 * traced back to its source, deriving agent, and confidence level.
 */

export type SourceType =
  | 'source-code'
  | 'technical-doc'
  | 'business-doc'
  | 'ticket'
  | 'log'
  | 'data-model'
  | 'test'
  | 'recording'
  | 'other';

export interface Provenance {
  /** Identifier of the artifact this element/claim was derived from. */
  sourceId: string;
  sourceType: SourceType;
  /** Which agent/module derived this element (e.g. 'extraction-engine', 'inference-engine'). */
  derivedBy: string;
  /** ISO-8601 timestamp of derivation. */
  derivedAt: string;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'inferred';

export interface Confidence {
  level: ConfidenceLevel;
  /** Optional numeric score in [0, 1] for finer-grained ranking. */
  score?: number | undefined;
  /** Human-readable rationale for the assigned confidence, where available. */
  rationale?: string | undefined;
}

export interface GraphElementMetadata {
  provenance: Provenance[];
  confidence: Confidence;
}
