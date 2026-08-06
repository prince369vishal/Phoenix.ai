export type CompanyId = 'aurora' | 'fintech';

export interface CompanyOption {
  id: CompanyId;
  /** Full display name, e.g. "Aurora Commerce". */
  name: string;
  /** Short label used in nav/chrome. */
  shortName: string;
  industry: string;
  tagline: string;
  description: string;
  /** Headline stats shown on the selection card. */
  stats: {
    elements: number;
    domains: number;
    integrations: number;
  };
  /** Tailwind color token driving the card/badge accent. */
  accent: 'violet' | 'emerald';
}

export const COMPANIES: CompanyOption[] = [
  {
    id: 'aurora',
    name: 'Aurora Commerce',
    shortName: 'Aurora',
    industry: 'E-commerce',
    tagline: 'Storefront, checkout, payments & fulfillment',
    description:
      'A mid-size e-commerce platform handling storefront browsing, checkout, payments, fraud screening, and fulfillment across web and mobile, integrated with a legacy ERP for finance and inventory reconciliation.',
    stats: { elements: 142, domains: 6, integrations: 5 },
    accent: 'violet',
  },
  {
    id: 'fintech',
    name: 'Fintech - Banking System',
    shortName: 'Banking System',
    industry: 'Fintech — Digital Banking & Payments',
    tagline: 'Onboarding, accounts, cards, payments & fraud/AML',
    description:
      'A digital-first neobank offering checking/savings accounts, card issuing, and P2P payments, integrated with a third-party core banking ledger, card processor, KYC/AML vendor, and ACH payment rail.',
    stats: { elements: 131, domains: 6, integrations: 5 },
    accent: 'emerald',
  },
];

export const DEFAULT_COMPANY: CompanyId = 'aurora';

const COMPANIES_BY_ID: Record<CompanyId, CompanyOption> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
) as Record<CompanyId, CompanyOption>;

export function getCompany(id: CompanyId): CompanyOption {
  return COMPANIES_BY_ID[id] ?? COMPANIES_BY_ID[DEFAULT_COMPANY];
}
