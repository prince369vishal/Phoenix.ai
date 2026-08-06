import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Banknote,
  Boxes,
  CheckCircle2,
  Layers,
  Plug,
  ShoppingCart,
} from 'lucide-react';
import { COMPANIES, type CompanyId, type CompanyOption } from '../data/index.js';
import { cn } from '../lib/utils.js';
import { Badge } from '../components/ui/badge.js';

const ICONS: Record<CompanyId, typeof ShoppingCart> = {
  aurora: ShoppingCart,
  fintech: Banknote,
};

const ACCENT_CLASSES: Record<
  CompanyOption['accent'],
  { border: string; iconWrap: string; button: string }
> = {
  violet: {
    border: 'group-hover:border-l-violet-500',
    iconWrap: 'bg-violet-50 text-violet-600 ring-1 ring-violet-100',
    button: 'bg-violet-700 hover:bg-violet-800',
  },
  emerald: {
    border: 'group-hover:border-l-emerald-500',
    iconWrap: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    button: 'bg-emerald-700 hover:bg-emerald-800',
  },
};

interface CompanySelectPageProps {
  selectedCompany: CompanyId | null;
  onSelect: (companyId: CompanyId) => void;
}

export function CompanySelectPage({ selectedCompany, onSelect }: CompanySelectPageProps): JSX.Element {
  const navigate = useNavigate();

  function handlePick(id: CompanyId): void {
    onSelect(id);
    navigate('/');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-foreground">
      {/* Corporate header bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
            P
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-slate-900">Phoenix.ai</span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <span className="hidden text-sm text-slate-500 sm:inline">
              Reverse Engineering Platform
            </span>
          </div>
        </div>
        <Badge variant="outline" className="border-slate-300 text-slate-600">
          Demo Environment
        </Badge>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-16">
        <div className="mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select an engagement
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.25rem]">
            Which company do you want to reverse engineer?
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
            Phoenix.ai reconstructs architecture, domain models, execution flows, and product
            backlog directly from a codebase — with confidence scoring and provenance on every
            element. Select a sample engagement below to explore the output.
          </p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {COMPANIES.map((company) => {
            const Icon = ICONS[company.id];
            const accent = ACCENT_CLASSES[company.accent];
            const isSelected = company.id === selectedCompany;
            return (
              <button
                key={company.id}
                type="button"
                onClick={() => handlePick(company.id)}
                className={cn(
                  'group flex h-full flex-col items-start rounded-lg border border-l-4 border-slate-200 border-l-transparent bg-white p-7 text-left shadow-sm transition-all duration-200',
                  'hover:shadow-md',
                  accent.border,
                )}
              >
                <div className="mb-5 flex w-full items-start justify-between">
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-md',
                      accent.iconWrap,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Currently selected
                    </span>
                  ) : null}
                </div>

                <h2 className="mb-1.5 text-lg font-semibold tracking-tight text-slate-900">
                  {company.name}
                </h2>
                <Badge variant="outline" className="mb-3 border-slate-200 text-slate-600">
                  {company.industry}
                </Badge>
                <p className="mb-3 text-sm font-medium text-slate-700">{company.tagline}</p>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  {company.description}
                </p>

                <div className="mt-auto flex w-full items-center gap-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> {company.stats.elements} elements
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5" /> {company.stats.domains} domains
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Plug className="h-3.5 w-3.5" /> {company.stats.integrations} integrations
                  </span>
                </div>

                <span
                  className={cn(
                    'mt-5 flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors',
                    accent.button,
                  )}
                >
                  {isSelected ? 'Continue with this engagement' : `Reverse engineer ${company.shortName}`}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-slate-400">
          You can switch engagements anytime from the sidebar.
        </p>
      </main>
    </div>
  );
}
