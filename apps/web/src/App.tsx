import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './layout/AppShell.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { ArchitecturePage } from './pages/ArchitecturePage.js';
import { DomainModelPage } from './pages/DomainModelPage.js';
import { ExecutionFlowsPage } from './pages/ExecutionFlowsPage.js';
import { ReviewPage } from './pages/ReviewPage.js';
import { PersonasJourneysPage } from './pages/PersonasJourneysPage.js';
import { BacklogPage } from './pages/BacklogPage.js';
import { DeploymentPage } from './pages/DeploymentPage.js';
import { NfrPage } from './pages/NfrPage.js';
import { IntegrationsPage } from './pages/IntegrationsPage.js';
import { GapAnalysisPage } from './pages/GapAnalysisPage.js';
import { DriftHistoryPage } from './pages/DriftHistoryPage.js';
import { GraphExplorerPage } from './pages/GraphExplorerPage.js';
import { AgentPipelinePage } from './pages/AgentPipelinePage.js';

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/graph" element={<GraphExplorerPage />} />
          <Route path="/agents" element={<AgentPipelinePage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/domains" element={<DomainModelPage />} />
          <Route path="/deployment" element={<DeploymentPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/nfrs" element={<NfrPage />} />
          <Route path="/personas" element={<PersonasJourneysPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/flows" element={<ExecutionFlowsPage />} />
          <Route path="/gaps" element={<GapAnalysisPage />} />
          <Route path="/drift" element={<DriftHistoryPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
