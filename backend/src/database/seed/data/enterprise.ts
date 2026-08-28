import { OrgPlan } from '@codeforge/shared';

export const SEED_UNIVERSITIES = [
  {
    name: 'Massachusetts Institute of Technology',
    slug: 'mit',
    website: 'https://mit.edu',
    logoUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=128&auto=format&fit=crop&q=80',
    state: 'Massachusetts',
    country: 'USA',
    accreditationGrade: 'A++',
    ranking: 1,
    isVerified: true,
  },
  {
    name: 'Stanford University',
    slug: 'stanford',
    website: 'https://stanford.edu',
    logoUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=128&auto=format&fit=crop&q=80',
    state: 'California',
    country: 'USA',
    accreditationGrade: 'A++',
    ranking: 2,
    isVerified: true,
  },
  {
    name: 'IIT Bombay',
    slug: 'iit-bombay',
    website: 'https://iitb.ac.in',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=128&auto=format&fit=crop&q=80',
    state: 'Maharashtra',
    country: 'India',
    accreditationGrade: 'Tier 1',
    ranking: 3,
    isVerified: true,
  },
  {
    name: 'University of California, Berkeley',
    slug: 'uc-berkeley',
    website: 'https://berkeley.edu',
    logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=128&auto=format&fit=crop&q=80',
    state: 'California',
    country: 'USA',
    accreditationGrade: 'A++',
    ranking: 4,
    isVerified: true,
  },
];

export const SEED_ORGANIZATIONS = [
  {
    name: 'Nexus Enterprise Engineering',
    slug: 'nexus-enterprise',
    domain: 'nexus.tech',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    plan: OrgPlan.ENTERPRISE,
    isVerified: true,
    themeConfig: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      portalTitle: 'Nexus Talent & Upskilling Academy',
    },
  },
  {
    name: 'Apex Global Bootcamp',
    slug: 'apex-bootcamp',
    domain: 'apexbootcamp.org',
    logoUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=128&auto=format&fit=crop&q=80',
    plan: OrgPlan.PROFESSIONAL,
    isVerified: true,
    themeConfig: {
      primaryColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      portalTitle: 'Apex Workforce Accelerator',
    },
  },
];

export const SEED_CERTIFICATE_TEMPLATES = [
  {
    name: 'Full-Stack Systems Engineer Master Certificate',
    issuerName: 'CodeForge Enterprise & University Board',
    badgeImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=128&auto=format&fit=crop&q=80',
    templateHtml: '<div class="cert-card"><h1>Full-Stack Systems Mastery</h1><p>Awarded for extraordinary algorithmic, systems, and full-stack performance.</p></div>',
    criteriaJson: { minScore: 85, requiredModules: 12 },
  },
  {
    name: 'Algorithmic Problem Solving & Data Structures Tier-1',
    issuerName: 'CodeForge Global Online Judge',
    badgeImageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=128&auto=format&fit=crop&q=80',
    templateHtml: '<div class="cert-card"><h1>Advanced DSA Certification</h1><p>Verified algorithmic problem-solving competence across dynamic programming, graphs, and system design.</p></div>',
    criteriaJson: { minEloRating: 1800, minSolvedProblems: 50 },
  },
];
