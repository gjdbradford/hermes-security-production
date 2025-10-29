export interface OnboardingFormData {
  // Service Needs
  serviceType: string;
  expectedOutcomes: string[];
  currentChallenges: string;

  // Timing & Urgency
  serviceStartTimeline: string;
  decisionTimeline: string;

  // Budget
  hasBudget: boolean;
  currency: string;
  budgetRange: string;

  // Decision Process
  projectLead: string;
  projectLeadRole: string;
  projectLeadRoleOther: string;
  decisionFactors: string[];

  // Source
  howDidYouHear: string;
  howDidYouHearOther?: string;

  // Meta
  email: string;
  country?: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export const CURRENCY_MAP: Record<string, string> = {
  US: '$',
  CA: '$',
  AU: '$',
  GB: '£',
  DE: '€',
  FR: '€',
  IT: '€',
  ES: '€',
  NL: '€',
  BE: '€',
  AT: '€',
  IE: '€',
  PT: '€',
  FI: '€',
  LU: '€',
  MT: '€',
  CY: '€',
  SK: '€',
  SI: '€',
  EE: '€',
  LV: '€',
  LT: '€',
  ZA: 'R',
  DEFAULT: '$',
};

export const SERVICE_TYPES = [
  { value: 'white-box', label: 'White box' },
  { value: 'gray-box', label: 'Gray box' },
  { value: 'black-box', label: 'Black box' },
  { value: 'all', label: 'All' },
];

export const EXPECTED_OUTCOMES = [
  { value: 'know-what-how', label: 'We know the what and how to fix' },
  { value: 'learned-in-house', label: 'We have learnt in house how to manage this better' },
  { value: 'tools-skills', label: 'We have been left with tools and skills to do this ourselves' },
  { value: '24-7-support', label: 'We can call Hermes anytime for assistance 24/7' },
  { value: 'other', label: 'Other' },
];

export const TIMELINE_OPTIONS = [
  { value: '1-week', label: '1 week' },
  { value: '1-month', label: '1 month' },
  { value: '2-months', label: '2 months' },
  { value: '3-months', label: '3 months' },
  { value: '6-plus-months', label: '6+ months' },
];

export const DECISION_TIMELINE_OPTIONS = [
  { value: '1-week', label: '1-2 weeks' },
  { value: '1-month', label: '1 month' },
  { value: '3-months', label: '3 months' },
  { value: '6-plus-months', label: '6+ months' },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'ZAR', label: 'ZAR (R)', symbol: 'R' },
  { value: 'OTHER', label: 'Other', symbol: '' },
];

export const BUDGET_RANGES = [
  { value: '0-10k', label: '0 – 10,000' },
  { value: '10k-50k', label: '10,000 – 50,000' },
  { value: '50k-100k', label: '50,000 – 100,000' },
  { value: '100k-plus', label: '100,000+' },
];

export const DECISION_FACTORS = [
  { value: 'price', label: 'Price' },
  { value: 'speed', label: 'Speed' },
  { value: 'experience', label: 'Experience' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'other', label: 'Other' },
];

export const SOURCE_OPTIONS = [
  { value: 'referral', label: 'Referral' },
  { value: 'search', label: 'Search engine' },
  { value: 'conference', label: 'Conference' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

export const ROLE_OPTIONS = [
  { value: 'ceo', label: 'CEO' },
  { value: 'cto', label: 'CTO' },
  { value: 'ciso', label: 'CISO' },
  { value: 'it-director', label: 'IT Director' },
  { value: 'security-manager', label: 'Security Manager' },
  { value: 'developer', label: 'Developer' },
  { value: 'devops-engineer', label: 'DevOps Engineer' },
  { value: 'compliance-officer', label: 'Compliance Officer' },
  { value: 'other', label: 'Other' },
];
