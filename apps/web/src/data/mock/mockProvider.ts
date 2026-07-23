import type { C4Level, OkfDataProvider } from '../types.js';
import {
  containerEdges,
  containerNodes,
  contextEdges,
  contextNodes,
  domains,
  driftAlerts,
  executionFlows,
  reviewItems,
  systemSummary,
} from './fixtures.js';
import { personas, journeys } from './personas.js';
import { epics } from './epics.js';
import { deploymentNodes } from './deployment.js';
import { nonFunctionalRequirements } from './nfrs.js';
import { integrations } from './integrations.js';
import { gapItems } from './gaps.js';
import { driftHistory } from './drift-history.js';
import { fullGraph } from './graph.js';

// Small artificial delay so loading states are visible in the demo, without
// making the UI feel sluggish.
function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const mockProvider: OkfDataProvider = {
  getSystemSummary: () => delay(systemSummary),

  getArchitecture: (level: C4Level) => {
    if (level === 'context') {
      return delay({ nodes: contextNodes, edges: contextEdges });
    }
    // 'component' level is out of scope for this demo fixture set (see the
    // Gap Analysis page — it's called out explicitly); fall back to the
    // container view rather than returning nothing.
    return delay({ nodes: containerNodes, edges: containerEdges });
  },

  getDomains: () => delay(domains),

  getExecutionFlows: () => delay(executionFlows),

  getReviewItems: () => delay(reviewItems),

  getDriftAlerts: () => delay(driftAlerts),

  getPersonas: () => delay(personas),

  getJourneys: () => delay(journeys),

  getEpics: () => delay(epics),

  getDeploymentTopology: () => delay(deploymentNodes),

  getNonFunctionalRequirements: () => delay(nonFunctionalRequirements),

  getIntegrations: () => delay(integrations),

  getGapItems: () => delay(gapItems),

  getDriftHistory: () => delay(driftHistory),

  getFullGraph: () => delay(fullGraph),
};
