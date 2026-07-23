import type { C4Level, OkfDataProvider } from '../types.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

/**
 * Real backend implementation of OkfDataProvider.
 *
 * TODO: these endpoints don't exist on @phoenix-ai/api yet — only /health does.
 * Wire each of these up as apps/api grows real routes over
 * @phoenix-ai/knowledge-graph, @phoenix-ai/okf-renderers, and @phoenix-ai/review-loop.
 * The shape returned by each endpoint should match the types in
 * apps/web/src/data/types.ts exactly so the UI needs zero changes when this
 * provider replaces the mock one.
 */
export const apiProvider: OkfDataProvider = {
  getSystemSummary: () => getJson('/api/system-summary'),
  getArchitecture: (level: C4Level) => getJson(`/api/architecture?level=${level}`),
  getDomains: () => getJson('/api/domains'),
  getExecutionFlows: () => getJson('/api/execution-flows'),
  getReviewItems: () => getJson('/api/review-items'),
  getDriftAlerts: () => getJson('/api/drift-alerts'),
  getPersonas: () => getJson('/api/personas'),
  getJourneys: () => getJson('/api/journeys'),
  getEpics: () => getJson('/api/epics'),
  getDeploymentTopology: () => getJson('/api/deployment-topology'),
  getNonFunctionalRequirements: () => getJson('/api/nfrs'),
  getIntegrations: () => getJson('/api/integrations'),
  getGapItems: () => getJson('/api/gap-items'),
  getDriftHistory: () => getJson('/api/drift-history'),
  getFullGraph: () => getJson('/api/graph'),
};
