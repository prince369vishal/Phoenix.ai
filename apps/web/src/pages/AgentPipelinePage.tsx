import { useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  UploadCloud,
  ShieldCheck,
  Code2,
  Sparkles,
  Share2,
  GitCompare,
  Layers,
  HelpCircle,
  History,
  ClipboardCheck,
  CheckCircle2,
  Workflow,
  Lock,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/page-header.js';
import { FullscreenDiagram } from '../components/fullscreen-diagram.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.js';
import { Badge } from '../components/ui/badge.js';
import { Button } from '../components/ui/button.js';
import { cn } from '../lib/utils.js';
import { pairwise } from '../lib/pairwise.js';

type StageColor = 'slate' | 'violet' | 'amber' | 'teal' | 'rose' | 'blue' | 'orange' | 'cyan' | 'emerald';
type StageStatus = 'pending' | 'active' | 'done';

interface Stage {
  code: string;
  name: string;
  role: string;
  color: StageColor;
  icon: LucideIcon;
  badges: string[];
  detail: string;
  log: string[];
}

const COLOR_CLASSES: Record<StageColor, { icon: string; badge: string; dot: string; stroke: string }> = {
  slate: {
    icon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    badge: 'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    stroke: '#94a3b8',
  },
  violet: {
    icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300',
    badge: 'border-transparent bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    dot: 'bg-violet-500',
    stroke: '#8b5cf6',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
    badge: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
    stroke: '#d97706',
  },
  teal: {
    icon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300',
    badge: 'border-transparent bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    dot: 'bg-teal-500',
    stroke: '#14b8a6',
  },
  rose: {
    icon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',
    badge: 'border-transparent bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    dot: 'bg-rose-500',
    stroke: '#f43f5e',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
    badge: 'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
    stroke: '#3b82f6',
  },
  orange: {
    icon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
    badge: 'border-transparent bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    dot: 'bg-orange-500',
    stroke: '#f97316',
  },
  cyan: {
    icon: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300',
    badge: 'border-transparent bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    dot: 'bg-cyan-500',
    stroke: '#06b6d4',
  },
  emerald: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
    badge: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    stroke: '#10b981',
  },
};

const STAGES: Stage[] = [
  {
    code: '01',
    name: 'Ingestion & connectors',
    role: 'Deterministic — normalizes every source into a common representation',
    color: 'slate',
    icon: UploadCloud,
    badges: ['no AI'],
    detail:
      'Connects to source code, docs, tickets, logs, gateways, data models and recordings. Each artifact is stamped with source type, version/commit and checksum. Supports incremental fetch on re-runs.',
    log: [
      'Connected 6 sources: Git (ClaimsCore, 340k LOC), Confluence (212 pages), Jira (1,847 tickets)',
      'Splunk logs (30-day window), Oracle DB schema, Kong API gateway specs',
      'Normalized to common intermediate representation — 1 source (SharePoint SOPs) access pending, recorded as gap',
    ],
  },
  {
    code: '02',
    name: 'Redaction & injection hardening',
    role: 'Deterministic — security gate, runs before any model sees content',
    color: 'amber',
    icon: ShieldCheck,
    badges: ['gate'],
    detail:
      'Scans all ingested content for secrets and PII before storage or model access. Detected values are replaced with stable reference tokens. Content is later presented to models only as delimited data, never as instructions.',
    log: [
      'Scanned 340k LOC + 212 docs for secrets and PII',
      'Redacted 14 API keys, 3 DB connection strings, 212 member-ID/SSN patterns',
      'Suspicious instruction found in a ticket comment — neutralized, treated as data only',
    ],
  },
  {
    code: '03',
    name: 'Deterministic extraction',
    role: 'AST / LSP parsing — exact facts, not model inference',
    color: 'slate',
    icon: Code2,
    badges: ['no AI'],
    detail:
      'Builds the module, dependency and call graph; extracts data models, API contracts and deployment topology from source. Computes co-change coupling and single-owner risk. Every fact stored with file-and-line evidence.',
    log: [
      'AST/LSP parse complete: 1,204 classes, 89 REST endpoints, 340 tables from ORM',
      'Co-change coupling computed across 4 years of commit history',
      'Flagged ClaimsAdjudicationEngine.java as single-owner — high knowledge-risk',
    ],
  },
  {
    code: '04',
    name: 'Semantic inference',
    role: 'AI agent — reads structured facts only, never raw source',
    color: 'violet',
    icon: Sparkles,
    badges: ['AI agent', 'no tools'],
    detail:
      'Infers bounded contexts by combining dependency clustering, shared vocabulary and data ownership. Retrieves rationale from commits, PRs, tickets and docs — never fabricates it. Inferred elements are flagged distinct from extracted facts.',
    log: [
      'Clustered 1,204 classes into 7 bounded contexts via community detection',
      'Named: Claims Intake, Adjudication, Eligibility, Provider Network, Payments, Appeals, Reporting',
      'Rationale for "Adjudication" retrieved from 6 PR discussions + 2 Confluence pages',
    ],
  },
  {
    code: '05',
    name: 'Knowledge graph & provenance',
    role: 'Single source of truth — every output is a projection of this graph',
    color: 'teal',
    icon: Share2,
    badges: ['store'],
    detail:
      'Stores all elements as typed nodes and edges. Every node/edge carries provenance (source, deriving agent, evidence, timestamp) and a confidence value. Versioned — each run produces an immutable graph version.',
    log: [
      '18,940 nodes / 41,200 edges committed to graph v14',
      'Every node stamped with provenance + confidence',
      'Stable, content-derived IDs assigned so elements persist across future runs',
    ],
  },
  {
    code: '06',
    name: 'Reconciliation & confidence',
    role: 'Merges signals across sources, surfaces disagreement',
    color: 'rose',
    icon: GitCompare,
    badges: ['conflicts'],
    detail:
      'Weights sources by type — code for structure, logs for behaviour, docs for intent. Confidence is derived structurally, never from model self-report. Conflicting sources are recorded, not silently resolved.',
    log: [
      '312 elements reconciled across 2+ independent sources',
      '9 conflicts detected — e.g. code shows sync adjudication call, 2019 diagram shows async queue',
      'Both positions retained and flagged for review',
    ],
  },
  {
    code: '07',
    name: 'OKF renderers',
    role: 'Projects the graph into 11 output artifact types',
    color: 'blue',
    icon: Layers,
    badges: ['x11 outputs'],
    detail:
      'Renders logical data models, domains, personas/journeys, screens, execution flows, C4 architecture, deployment diagrams, NFRs, epics/features/stories, integrations & data flows, and flow-to-journey relationships. Renderers read the graph — they do not analyze independently.',
    log: [
      'Rendered: data model, 7 domain maps, C4 (context/container/component), deployment diagram',
      '42 execution flows, 118 epics/features/stories, integration map (23 integrations)',
      'Persona/journey output partial — limited by available source coverage',
    ],
  },
  {
    code: '08',
    name: 'Gap analysis planner',
    role: 'Names the specific input that would resolve each coverage gap',
    color: 'orange',
    icon: HelpCircle,
    badges: ['governance'],
    detail:
      'After reconciliation, coverage is assessed per output artifact. Gaps are phrased as collaborative requests, consistent with a trust-over-surveillance approach — never as an audit finding.',
    log: [
      '3 gaps identified after coverage assessment',
      'No source for Appeals persona/journey — request UX research or interviews',
      'SharePoint SOPs unavailable — request access to resolve',
    ],
  },
  {
    code: '09',
    name: 'Drift detection',
    role: 'Diffs the deterministic graph across runs, not generated prose',
    color: 'cyan',
    icon: History,
    badges: ['differential'],
    detail:
      'On re-run, only artifacts changed since the prior version are reprocessed. The new graph is diffed against the prior to produce an architectural changelog, immune to model non-determinism.',
    log: [
      'Re-run vs. graph v13: +1 integration (new Provider Portal API)',
      '1 removed table (legacy_claims_archive dropped), 4 modified flows',
      'Architectural changelog generated for review',
    ],
  },
  {
    code: '10',
    name: 'Human review & correction',
    role: 'Human-in-the-loop — reviewers confirm, edit or reject any element',
    color: 'emerald',
    icon: ClipboardCheck,
    badges: ['human'],
    detail:
      'Presents a review queue ordered by element leverage (centrality) and inverse confidence. Confirmed corrections are persisted and treated as authoritative on every subsequent run.',
    log: [
      'Review queue ranked by centrality × inverse confidence',
      'Top item: Adjudication sync/async conflict (confidence 0.54)',
      'Reviewer confirmed async queue is current; correction persisted as authoritative',
    ],
  },
  {
    code: '11',
    name: 'Evaluation harness',
    role: 'Scores each run against a golden bundle, gates regressions',
    color: 'emerald',
    icon: CheckCircle2,
    badges: ['CI gate'],
    detail:
      'Scores precision/recall for nodes and edges against a hand-authored golden bundle. Runs automatic round-trip checks — e.g. claimed APIs verified against live gateway logs. Gates changes that regress accuracy.',
    log: [
      'Scored vs. golden bundle: node precision 0.93 / recall 0.89, edge F1 0.87',
      'Round-trip check: 87 / 89 claimed APIs found live in gateway logs — 2 flagged as contradictions',
      'Run gate: PASS',
    ],
  },
];

const LEGEND: Array<{ color: StageColor; label: string }> = [
  { color: 'slate', label: 'Deterministic (parsing, no AI)' },
  { color: 'violet', label: 'AI agent — no tools / no write access' },
  { color: 'emerald', label: 'Human-in-the-loop' },
  { color: 'teal', label: 'Shared knowledge graph' },
  { color: 'orange', label: 'Governance / quality' },
];

const SPEED_MS: Record<'slow' | 'normal' | 'fast', number> = { slow: 1300, normal: 750, fast: 320 };

interface LogEntry {
  stageIndex: number;
  text: string;
}

interface AgentNodeData {
  stage: Stage;
  status: StageStatus;
  isSelected: boolean;
  needsTargetTop: boolean;
  needsTargetLeft: boolean;
  needsSourceRight: boolean;
  needsSourceBottom: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const HANDLE_DOT = '!h-2 !w-2 !border-none !bg-border';

function AgentNode({ data }: NodeProps<AgentNodeData>): JSX.Element {
  const { stage, status, isSelected, needsTargetTop, needsTargetLeft, needsSourceRight, needsSourceBottom } = data;
  const Icon = stage.icon;
  const colors = COLOR_CLASSES[stage.color];

  return (
    <div
      className={cn(
        'flex h-[76px] w-[184px] flex-col justify-between rounded-lg border bg-card px-3 py-2.5 shadow-sm transition-all',
        status === 'active' && 'border-primary ring-2 ring-primary',
        status !== 'active' && isSelected && 'border-violet-400 ring-2 ring-violet-300',
        status !== 'active' && !isSelected && 'border-border',
        status === 'done' && 'opacity-60',
      )}
    >
      {needsTargetTop ? (
        <Handle type="target" position={Position.Top} id="target-top" className={cn('!left-1/2', HANDLE_DOT)} />
      ) : null}
      {needsTargetLeft ? (
        <Handle type="target" position={Position.Left} id="target-left" className={cn('!top-1/2', HANDLE_DOT)} />
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded', colors.icon)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        {status === 'done' ? (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-2.5 w-2.5" />
          </span>
        ) : (
          <span className="font-mono text-[9px] text-muted-foreground">{stage.code}</span>
        )}
      </div>
      <div className="line-clamp-2 text-[11.5px] font-semibold leading-tight">{stage.name}</div>
      {needsSourceRight ? (
        <Handle type="source" position={Position.Right} id="source-right" className={cn('!top-1/2', HANDLE_DOT)} />
      ) : null}
      {needsSourceBottom ? (
        <Handle type="source" position={Position.Bottom} id="source-bottom" className={cn('!left-1/2', HANDLE_DOT)} />
      ) : null}
    </div>
  );
}

const NODE_TYPES = { agent: AgentNode };

const GRID_COLS = 2;
const NODE_W = 184;
const NODE_H = 76;
const GAP_X = 64;
const GAP_Y = 56;

function PipelineDiagram({
  activeIndex,
  completed,
  selectedIndex,
  onSelect,
  isFullscreen,
}: {
  activeIndex: number;
  completed: Set<number>;
  selectedIndex: number;
  onSelect: (i: number) => void;
  isFullscreen: boolean;
}): JSX.Element {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node<AgentNodeData>[] = STAGES.map((stage, i) => {
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      const hasNext = i + 1 < STAGES.length;
      return {
        id: stage.code,
        type: 'agent',
        position: { x: col * (NODE_W + GAP_X), y: row * (NODE_H + GAP_Y) },
        draggable: false,
        data: {
          stage,
          status: completed.has(i) ? 'done' : activeIndex === i ? 'active' : 'pending',
          isSelected: selectedIndex === i,
          needsTargetTop: col === 0 && i > 0,
          needsTargetLeft: col === 1,
          needsSourceRight: col === 0 && hasNext,
          needsSourceBottom: col === 1 && hasNext,
        },
      };
    });

    const indexed = STAGES.map((stage, i) => ({ stage, i }));
    const edges: Edge[] = pairwise(indexed).map(([prev, curr]) => {
      const sourceDone = completed.has(prev.i);
      const targetActive = activeIndex === curr.i;
      const targetDone = completed.has(curr.i);
      const flowing = sourceDone && targetActive;
      const settled = sourceDone && targetDone;
      const color = flowing || settled ? '#6366f1' : '#cbd5e1';
      const sameRow = prev.i % GRID_COLS === 0;
      return {
        id: `${prev.stage.code}-${curr.stage.code}`,
        source: prev.stage.code,
        sourceHandle: sameRow ? 'source-right' : 'source-bottom',
        target: curr.stage.code,
        targetHandle: sameRow ? 'target-left' : 'target-top',
        type: 'smoothstep',
        animated: flowing,
        style: { stroke: color, strokeWidth: flowing || settled ? 2 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
      };
    });

    return { nodes, edges };
  }, [activeIndex, completed, selectedIndex]);

  return (
    <div className="h-full w-full rounded-lg border border-border bg-muted/10">
      <ReactFlow
        key={isFullscreen ? 'fs' : 'normal'}
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodeClick={(_, node) => {
          const i = STAGES.findIndex((s) => s.code === node.id);
          if (i >= 0) onSelect(i);
        }}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.35}
        maxZoom={1.1}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
      >
        <Background gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function AgentPipelinePage(): JSX.Element {
  const [running, setRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const cancelledRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [logs]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  function reset(): void {
    cancelledRef.current = true;
    setRunning(false);
    setActiveIndex(-1);
    setCompleted(new Set());
    setLogs([]);
  }

  async function runDemo(): Promise<void> {
    if (running) return;
    cancelledRef.current = false;
    setRunning(true);
    setCompleted(new Set());
    setLogs([]);
    setActiveIndex(-1);
    const delay = SPEED_MS[speed];

    for (let i = 0; i < STAGES.length; i++) {
      if (cancelledRef.current) return;
      const stage = STAGES[i];
      if (!stage) continue;
      setActiveIndex(i);
      setSelectedIndex(i);
      setLogs((prev) => [...prev, { stageIndex: i, text: `${stage.name} — starting` }]);
      for (const line of stage.log) {
        await sleep(delay);
        if (cancelledRef.current) return;
        setLogs((prev) => [...prev, { stageIndex: i, text: line }]);
      }
      await sleep(delay * 0.5);
      if (cancelledRef.current) return;
      setCompleted((prev) => new Set(prev).add(i));
    }
    setActiveIndex(-1);
    setLogs((prev) => [
      ...prev,
      { stageIndex: -1, text: 'Orchestrator — run complete, graph v14 published, reproducible for identical inputs' },
    ]);
    setRunning(false);
  }

  const progressPct = Math.round((completed.size / STAGES.length) * 100);
  const selectedStage = STAGES[selectedIndex];

  return (
    <div>
      <PageHeader
        title="Agent Pipeline"
        description="A staged pipeline of specialized agents over one shared knowledge graph. Deterministic parsers extract exact facts first; AI agents interpret only structured facts, never raw source; every element carries provenance and confidence. Click a node to inspect it, or run the demo against a sample legacy system."
      />

      <Card className="mb-6 border-violet-200 bg-violet-50/60 dark:border-violet-900/50 dark:bg-violet-950/20">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
            <Workflow className="h-3.5 w-3.5" />
            Orchestrator
          </div>
          <p className="min-w-[260px] flex-1 text-sm text-muted-foreground">
            Sequences all 11 stages with explicit dependencies · routes bulk extraction to lower-tier
            models and hard synthesis to higher-tier models · isolates each tenant&apos;s data · guarantees
            identical inputs always yield an identical graph.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-border text-xs">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  disabled={running}
                  className={cn(
                    'px-2.5 py-1.5 capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                    speed === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-accent',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={reset} disabled={running && logs.length === 0}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={runDemo} disabled={running}>
              <Play className="h-3.5 w-3.5" />
              {running ? 'Running…' : 'Run demo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className={cn('h-2 w-2 rounded-full', COLOR_CLASSES[item.color].dot)} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {completed.size} / {STAGES.length} stages complete
        </div>
      </div>

      <FullscreenDiagram className="mb-4">
        {(isFullscreen) => (
          <div
            className={cn(
              'grid grid-cols-1 gap-4 pt-12 lg:grid-cols-2',
              isFullscreen && 'h-[calc(100vh-2rem)]',
            )}
          >
            <Card
              className={cn('flex flex-col overflow-hidden', isFullscreen ? 'h-full' : 'h-[560px]')}
            >
              <CardContent className="min-h-0 flex-1 p-3">
                <PipelineDiagram
                  activeIndex={activeIndex}
                  completed={completed}
                  selectedIndex={selectedIndex}
                  onSelect={setSelectedIndex}
                  isFullscreen={isFullscreen}
                />
              </CardContent>
            </Card>

            <Card
              className={cn(
                'flex flex-col overflow-hidden bg-slate-950 dark:bg-black',
                isFullscreen ? 'h-full' : 'h-[560px]',
              )}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
                <span>run log · sample system: Evernorth ClaimsCore (legacy claims processing platform)</span>
                <span>{running ? 'running…' : logs.length > 0 ? 'complete' : 'idle'}</span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-7 text-slate-300">
                {logs.length === 0 ? (
                  <div className="text-slate-500">
                    — click &quot;Run demo&quot; to process a sample system through every agent stage —
                  </div>
                ) : (
                  logs.map((entry, idx) => {
                    const sourceStage = entry.stageIndex >= 0 ? STAGES[entry.stageIndex] : undefined;
                    const stageColor = sourceStage ? COLOR_CLASSES[sourceStage.color].dot : 'bg-violet-400';
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', stageColor)} />
                        <span className="whitespace-pre-wrap">{entry.text}</span>
                      </div>
                    );
                  })
                )}
                <div ref={logEndRef} />
              </div>
            </Card>
          </div>
        )}
      </FullscreenDiagram>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{selectedStage?.name ?? 'Select a stage'}</CardTitle>
          {selectedStage ? <CardDescription>{selectedStage.role}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedStage ? (
            <>
              <div className="flex flex-wrap gap-1">
                {selectedStage.badges.map((b) => (
                  <Badge
                    key={b}
                    variant="outline"
                    className={cn('text-[10px]', COLOR_CLASSES[selectedStage.color].badge)}
                  >
                    {b === 'no tools' ? <Lock className="mr-1 h-2.5 w-2.5" /> : null}
                    {b}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{selectedStage.detail}</p>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  Sample output
                </div>
                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                  {selectedStage.log.map((line) => (
                    <li key={line} className="font-mono text-[11px] leading-snug text-muted-foreground">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Demo uses illustrative sample output modeled on the FRD&apos;s functional requirements
        (FR-ING through FR-ORC). No real system is analyzed in this demo.
      </p>
    </div>
  );
}
