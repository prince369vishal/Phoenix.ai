import type { Confidence, Provenance } from '@phoenix-ai/shared';

export interface GraphElementMetadata {
  provenance: Provenance[];
  confidence: Confidence;
}

export interface SystemSummary {
  id: string;
  name: string;
  description: string;
  tags: string[];
  lastAnalyzedAt: string;
  coverageScore: number; // 0-1
  totalElements: number;
  pendingReviewCount: number;
  driftAlertCount: number;
}

export type C4Level = 'context' | 'container' | 'component';

export interface C4Node {
  id: string;
  level: C4Level;
  parentId?: string;
  name: string;
  description: string;
  technology?: string;
  metadata: GraphElementMetadata;
}

export interface C4Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  level: C4Level;
  metadata: GraphElementMetadata;
}

export interface Aggregate {
  id: string;
  name: string;
  entities: string[];
  metadata: GraphElementMetadata;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  aggregates: Aggregate[];
  metadata: GraphElementMetadata;
}

export interface FlowStep {
  id: string;
  name: string;
  description: string;
  readsEntities: string[];
  writesEntities: string[];
  metadata: GraphElementMetadata;
}

export interface ExecutionFlow {
  id: string;
  name: string;
  description: string;
  triggerScreen: string;
  steps: FlowStep[];
  metadata: GraphElementMetadata;
}

export interface ConflictingValue {
  sourceId: string;
  sourceLabel: string;
  value: string;
}

export interface ReviewItem {
  id: string;
  elementType: string;
  elementName: string;
  currentValue: string;
  metadata: GraphElementMetadata;
  conflict?: ConflictingValue[];
  status: 'pending' | 'confirmed' | 'corrected';
}

export interface DriftAlert {
  id: string;
  elementName: string;
  changeType: 'added' | 'removed' | 'modified';
  description: string;
  detectedAt: string;
}

// ---------------------------------------------------------------------------
// Personas & Journeys (OKF output: personas, journeys)
// ---------------------------------------------------------------------------

export interface Persona {
  id: string;
  name: string;
  role: string;
  goals: string[];
  painPoints: string[];
  metadata: GraphElementMetadata;
}

export interface Journey {
  id: string;
  name: string;
  personaId: string;
  description: string;
  /** Flow IDs this journey is realised by — the FRD's flow-to-journey relationship (output #11). */
  flowIds: string[];
  metadata: GraphElementMetadata;
}

// ---------------------------------------------------------------------------
// Epics / Features / Stories (OKF output: epics/features/stories)
// ---------------------------------------------------------------------------

export interface AcceptanceCriterion {
  id: string;
  description: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: AcceptanceCriterion[];
  metadata: GraphElementMetadata;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  stories: Story[];
  metadata: GraphElementMetadata;
}

export interface Epic {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  metadata: GraphElementMetadata;
}

// ---------------------------------------------------------------------------
// Deployment topology (OKF output: deployment diagrams)
// ---------------------------------------------------------------------------

export type DeploymentNodeKind = 'environment' | 'instance';

export interface DeploymentNode {
  id: string;
  kind: DeploymentNodeKind;
  name: string;
  /** Present when kind === 'instance': which environment id it belongs to. */
  environmentId?: string;
  /** Present when kind === 'instance': which C4 container this instance runs. */
  containerId?: string;
  runtime?: string;
  scale?: string;
  metadata: GraphElementMetadata;
}

// ---------------------------------------------------------------------------
// Non-functional requirements (OKF output: non-functional requirements)
// ---------------------------------------------------------------------------

export type NfrCategory = 'performance' | 'availability' | 'security' | 'compliance' | 'scalability';

export interface NonFunctionalRequirement {
  id: string;
  category: NfrCategory;
  requirement: string;
  target: string;
  appliesTo: string[];
  metadata: GraphElementMetadata;
}

// ---------------------------------------------------------------------------
// Integrations & data flows (OKF output: integrations & data flows)
// ---------------------------------------------------------------------------

export type IntegrationDirection = 'outbound' | 'inbound' | 'bidirectional';

export interface Integration {
  id: string;
  name: string;
  counterpart: string;
  direction: IntegrationDirection;
  protocol: string;
  dataExchanged: string;
  metadata: GraphElementMetadata;
}

// ---------------------------------------------------------------------------
// Gap analysis (surfaces missing inputs, not just low-confidence facts)
// ---------------------------------------------------------------------------

export type GapSeverity = 'blocking' | 'high' | 'medium' | 'low';

export interface GapItem {
  id: string;
  area: string;
  description: string;
  missingInputs: string[];
  severity: GapSeverity;
  suggestedAction: string;
}

// ---------------------------------------------------------------------------
// Drift history (differential runs over time)
// ---------------------------------------------------------------------------

export interface DriftRun {
  id: string;
  runDate: string;
  summary: string;
  changes: DriftAlert[];
}

// ---------------------------------------------------------------------------
// Full knowledge graph (for the graph explorer view)
// ---------------------------------------------------------------------------

/** A single key/value fact about a node (e.g. "Technology: Node.js"). */
export interface GraphNodeAttribute {
  label: string;
  value: string;
}

/** A named list of child facts (e.g. "Goals", "Acceptance criteria", "Steps"). */
export interface GraphNodeSection {
  label: string;
  items: string[];
}

export type GraphCrossRefKind =
  | 'review'
  | 'gap'
  | 'drift'
  | 'nfr'
  | 'integration'
  | 'deployment';

/**
 * A pointer from a graph node to something on another page that touches the
 * same element — an open review item, a gap, a drift alert, an NFR, and so on.
 * This is what makes the explorer feel like one graph rather than 14 pages.
 */
export interface GraphCrossRef {
  id: string;
  kind: GraphCrossRefKind;
  label: string;
  detail: string;
  route: string;
}

/**
 * Everything the explorer shows when a node is clicked. Derived from the same
 * fixtures the rest of the app reads, so a node's dossier can never disagree
 * with the page that renders the same element.
 */
export interface GraphNodeDetail {
  /** One-paragraph description of what this element is. */
  summary: string;
  /** Kind-specific facts, rendered as a definition grid. */
  attributes: GraphNodeAttribute[];
  /** Nested detail — steps, entities, goals, acceptance criteria, etc. */
  sections: GraphNodeSection[];
  /** Provenance + confidence, exactly as carried by the underlying element. */
  metadata: GraphElementMetadata;
  /** Where this element is rendered as a document view. */
  route: string;
  routeLabel: string;
  /** Open questions and related items on other pages. */
  crossRefs: GraphCrossRef[];
}

export interface GraphNode {
  id: string;
  label: string;
  kind: string;
  confidenceLevel: Confidence['level'];
  /** Optional so an API-backed provider can serve a slim graph and lazy-load detail. */
  detail?: GraphNodeDetail;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface OkfDataProvider {
  getSystemSummary(): Promise<SystemSummary>;
  getArchitecture(level: C4Level): Promise<{ nodes: C4Node[]; edges: C4Edge[] }>;
  getDomains(): Promise<Domain[]>;
  getExecutionFlows(): Promise<ExecutionFlow[]>;
  getReviewItems(): Promise<ReviewItem[]>;
  getDriftAlerts(): Promise<DriftAlert[]>;
  getPersonas(): Promise<Persona[]>;
  getJourneys(): Promise<Journey[]>;
  getEpics(): Promise<Epic[]>;
  getDeploymentTopology(): Promise<DeploymentNode[]>;
  getNonFunctionalRequirements(): Promise<NonFunctionalRequirement[]>;
  getIntegrations(): Promise<Integration[]>;
  getGapItems(): Promise<GapItem[]>;
  getDriftHistory(): Promise<DriftRun[]>;
  getFullGraph(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }>;
}
