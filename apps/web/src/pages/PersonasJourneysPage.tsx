import { Target, AlertCircle } from 'lucide-react';
import { dataProvider } from '../data/index.js';
import { useAsync } from '../lib/useAsync.js';
import { PageHeader } from '../components/page-header.js';
import { LoadingState, ErrorState } from '../components/loading-state.js';
import { ConfidenceBadge } from '../components/confidence-badge.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.js';
import { Badge } from '../components/ui/badge.js';

export function PersonasJourneysPage(): JSX.Element {
  const personas = useAsync(() => dataProvider.getPersonas(), []);
  const journeys = useAsync(() => dataProvider.getJourneys(), []);
  const flows = useAsync(() => dataProvider.getExecutionFlows(), []);

  const loading = personas.loading || journeys.loading || flows.loading;
  const error = personas.error ?? journeys.error ?? flows.error;

  if (loading) return <LoadingState label="Loading personas and journeys…" />;
  if (error) return <ErrorState message={error.message} />;

  function flowName(flowId: string): string {
    return flows.data?.find((f) => f.id === flowId)?.name ?? flowId;
  }

  function personaName(personaId: string): string {
    return personas.data?.find((p) => p.id === personaId)?.name ?? personaId;
  }

  return (
    <div>
      <PageHeader
        title="Personas & Journeys"
        description="Recovered from personas docs, support tickets, and the code paths their goals map to."
      />

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Personas</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {(personas.data ?? []).map((persona) => (
          <Card key={persona.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{persona.name}</CardTitle>
                  <CardDescription>{persona.role}</CardDescription>
                </div>
                <ConfidenceBadge
                  level={persona.metadata.confidence.level}
                  score={persona.metadata.confidence.score}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                  <Target className="h-3.5 w-3.5" /> Goals
                </div>
                <ul className="list-inside list-disc text-sm text-foreground">
                  {persona.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5" /> Pain points
                </div>
                <ul className="list-inside list-disc text-sm text-foreground">
                  {persona.painPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Journeys</h2>
      <div className="space-y-3">
        {(journeys.data ?? []).map((journey) => (
          <Card key={journey.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{journey.name}</CardTitle>
                  <CardDescription>
                    Persona: {personaName(journey.personaId)} · {journey.description}
                  </CardDescription>
                </div>
                <ConfidenceBadge
                  level={journey.metadata.confidence.level}
                  score={journey.metadata.confidence.score}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Realised by execution flow
              </div>
              <div className="flex flex-wrap gap-1.5">
                {journey.flowIds.map((flowId) => (
                  <Badge key={flowId} variant="outline">
                    {flowName(flowId)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
