import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils.js';
import { GlobalSearch } from '../components/global-search.js';
import {
  LayoutDashboard,
  Share2,
  Network,
  Boxes,
  Server,
  Plug,
  Gauge,
  Users,
  ListChecks,
  GitBranch,
  HelpCircle,
  History,
  ClipboardCheck,
  Bot,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}

const NAV_SECTIONS: Array<{ title: string | null; items: NavItem[] }> = [
  {
    title: null,
    items: [
      { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/graph', label: 'Knowledge Graph', icon: Share2 },
      { to: '/agents', label: 'Agent Pipeline', icon: Bot },
    ],
  },
  {
    title: 'Architecture & Design',
    items: [
      { to: '/architecture', label: 'Architecture', icon: Network },
      { to: '/domains', label: 'Domain Model', icon: Boxes },
      { to: '/deployment', label: 'Deployment', icon: Server },
      { to: '/integrations', label: 'Integrations', icon: Plug },
      { to: '/nfrs', label: 'NFRs', icon: Gauge },
    ],
  },
  {
    title: 'Product & Requirements',
    items: [
      { to: '/personas', label: 'Personas & Journeys', icon: Users },
      { to: '/backlog', label: 'Backlog', icon: ListChecks },
      { to: '/flows', label: 'Execution Flows', icon: GitBranch },
    ],
  },
  {
    title: 'Trust & Operations',
    items: [
      { to: '/gaps', label: 'Gap Analysis', icon: HelpCircle },
      { to: '/drift', label: 'Drift History', icon: History },
      { to: '/review', label: 'Review', icon: ClipboardCheck },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }): JSX.Element {
  const dataSource = import.meta.env.VITE_DATA_SOURCE ?? 'mock';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-4">
          <div className="text-sm font-semibold leading-tight text-slate-100">
            Phoenix.ai
          </div>
          <div className="text-xs text-slate-400">Platform review UI</div>
        </div>
        <div className="border-b border-slate-800 p-3">
          <GlobalSearch />
        </div>
        <nav className="flex-1 space-y-4 p-3">
          {NAV_SECTIONS.map((section, i) => (
            <div key={section.title ?? `section-${i}`}>
              {section.title ? (
                <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {section.title}
                </div>
              ) : null}
              <div className="space-y-1">
                {section.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end ?? false}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <div
            className={cn(
              'w-full rounded-full border px-2.5 py-1 text-center text-xs font-medium',
              dataSource === 'api'
                ? 'border-slate-700 bg-slate-800 text-slate-300'
                : 'border-violet-800 bg-violet-950/50 text-violet-300',
            )}
          >
            {dataSource === 'api' ? 'Live API mode' : 'Demo mode — fixture data'}
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
