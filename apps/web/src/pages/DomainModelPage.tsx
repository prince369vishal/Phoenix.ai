import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { dataProvider } from '../data/index.js';
import { useAsync } from '../lib/useAsync.js';
import { PageHeader } from '../components/page-header.js';
import { LoadingState, ErrorState } from '../components/loading-state.js';
import { ConfidenceBadge } from '../components/confidence-badge.js';
import { Card, CardContent, CardTitle, CardDescription } from '../components/ui/card.js';
import { Badge } from '../components/ui/badge.js';

export function DomainModelPage(): JSX.Element {
  const { data, loading, error } = useAsync(() => dataProvider.getDomains(), []);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string): void {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) return <LoadingState label="Loading domain model…" />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <div>
      <PageHeader
        title="Domain Model"
        description="Domains and their aggregates, recovered from the data model, source code, and business docs."
      />
      <div className="space-y-3">
        {(data ?? []).map((domain) => {
          const isOpen = expanded.has(domain.id);
          return (
            <Card key={domain.id}>
              <button
                type="button"
                onClick={() => toggle(domain.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle>{domain.name}</CardTitle>
                    <CardDescription>{domain.description}</CardDescription>
                  </div>
                </div>
                <ConfidenceBadge
                  level={domain.metadata.confidence.level}
                  score={domain.metadata.confidence.score}
                />
              </button>
              {isOpen ? (
                <CardContent className="border-t border-border pt-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {domain.aggregates.map((agg) => (
                      <div key={agg.id} className="rounded-md border border-border p-3">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium">{agg.name}</span>
                          <ConfidenceBadge
                            level={agg.metadata.confidence.level}
                            score={agg.metadata.confidence.score}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {agg.entities.map((entity) => (
                            <Badge key={entity} variant="outline">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                        {agg.metadata.confidence.rationale ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {agg.metadata.confidence.rationale}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
