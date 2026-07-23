import { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { dataProvider, type GraphNode } from '../data/index.js';
import { useAsync } from '../lib/useAsync.js';
import { PageHeader } from '../components/page-header.js';
import { LoadingState, ErrorState } from '../components/loading-state.js';
import { CONFIDENCE_COLORS } from '../components/confidence-badge.js';
import { FullscreenDiagram } from '../components/fullscreen-diagram.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Badge } from '../components/ui/badge.js';
import { cn } from '../lib/utils.js';

const KIND_ORDER = [
  'System',
  'Container',
  'Domain',
  'Aggregate',
  'Persona',
  'Journey',
  'Flow',
  'Epic',
  'Feature',
  'Story',
];
const COLUMN_WIDTH = 210;
const ROW_HEIGHT = 56;

export function GraphExplorerPage(): JSX.Element {
  const { data, loading, error } = useAsync(() => dataProvider.getFullGraph(), []);
  const [visibleKinds, setVisibleKinds] = useState<Set<string> | null>(null);
  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const allKinds = useMemo(() => {
    if (!data) return [];
    const present = new Set(data.nodes.map((n) => n.kind));
    return KIND_ORDER.filter((k) => present.has(k));
  }, [data]);

  const activeKinds = useMemo(() => visibleKinds ?? new Set(allKinds), [visibleKinds, allKinds]);

  const { flowNodes, flowEdges } = useMemo(() => {
    if (!data) return { flowNodes: [], flowEdges: [] };
    const columnIndex = new Map<string, number>();
    allKinds.forEach((k, i) => columnIndex.set(k, i));
    const rowCounters = new Map<string, number>();

    const filterQuery = filterText.trim().toLowerCase();
    const visibleNodeIds = new Set<string>();

    const flowNodes: Node[] = [];
    for (const n of data.nodes) {
      if (!activeKinds.has(n.kind)) continue;
      const col = columnIndex.get(n.kind) ?? 0;
      const row = rowCounters.get(n.kind) ?? 0;
      rowCounters.set(n.kind, row + 1);
      const matches = !filterQuery || n.label.toLowerCase().includes(filterQuery);
      visibleNodeIds.add(n.id);
      flowNodes.push({
        id: n.id,
        position: { x: col * COLUMN_WIDTH, y: row * ROW_HEIGHT },
        data: {
          label: (
            <div className="text-left" style={{ opacity: matches ? 1 : 0.25 }}>
              <div className="flex items-center gap-1.5 text-[11px] font-medium leading-tight">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CONFIDENCE_COLORS[n.confidenceLevel] }}
                />
                {n.label}
              </div>
              <div className="text-[9px] text-muted-foreground">{n.kind}</div>
            </div>
          ),
        },
        style: {
          width: 190,
          borderRadius: 6,
          border: '1px solid hsl(214 32% 91%)',
          background: 'white',
          padding: 6,
        },
      });
    }

    const flowEdges: Edge[] = data.edges
      .filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        labelStyle: { fontSize: 9 },
        style: { stroke: '#cbd5e1' },
      }));

    return { flowNodes, flowEdges };
  }, [data, activeKinds, allKinds, filterText]);

  if (loading) return <LoadingState label="Loading knowledge graph…" />;
  if (error) return <ErrorState message={error.message} />;

  function toggleKind(kind: string): void {
    setVisibleKinds((prev) => {
      const base = prev ?? new Set(allKinds);
      const next = new Set(base);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        title="Knowledge Graph Explorer"
        description="Every output on every other page is a projection of this one shared graph — not independent documents. Filter by element type, or search to highlight a node."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Highlight nodes by name…"
          className="w-64 rounded-md border border-border px-2 py-1 text-sm"
        />
        {allKinds.map((kind) => (
          <button key={kind} type="button" onClick={() => toggleKind(kind)}>
            <Badge variant={activeKinds.has(kind) ? 'default' : 'outline'}>{kind}</Badge>
          </button>
        ))}
      </div>

      <FullscreenDiagram>
        {(isFullscreen) => (
          <div className={cn('grid grid-cols-1 gap-4 pt-12 lg:grid-cols-3', isFullscreen && 'h-full')}>
            <div
              className={cn(
                'overflow-hidden rounded-lg border border-border lg:col-span-2',
                isFullscreen ? 'h-full' : 'h-[600px]',
              )}
            >
              <ReactFlow
                key={isFullscreen ? 'fs' : 'normal'}
                nodes={flowNodes}
                edges={flowEdges}
                onNodeClick={(_, node) => {
                  const found = data?.nodes.find((n) => n.id === node.id) ?? null;
                  setSelected(found);
                }}
                fitView
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
              >
                <Background />
                <Controls />
                <MiniMap pannable zoomable />
              </ReactFlow>
            </div>

            <Card className={cn(isFullscreen && 'flex h-full flex-col overflow-hidden')}>
              <CardHeader className={cn(isFullscreen && 'shrink-0')}>
                <CardTitle>{selected ? selected.label : 'Select a node'}</CardTitle>
              </CardHeader>
              <CardContent className={cn(isFullscreen && 'flex-1 overflow-y-auto')}>
                {selected ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type: </span>
                      {selected.kind}
                    </div>
                    <div>
                      <span className="font-medium">Confidence: </span>
                      {selected.confidenceLevel}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click any node to see its type and confidence. Use the type filters above to
                    focus on one part of the graph, or the search box to highlight a specific
                    element.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </FullscreenDiagram>
    </div>
  );
}
