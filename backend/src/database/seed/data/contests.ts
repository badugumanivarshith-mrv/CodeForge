import { ContestState } from '@codeforge/shared';

export interface SeedContest {
  slug: string;
  title: string;
  descriptionMdx: string;
  status: ContestState;
  startAtOffsetDays: number;
  endAtOffsetDays: number;
  durationMinutes: number;
  totalPoints: number;
  scoringFormula: string;
  problemSlugs: { slug: string; sequence: number; points: number; penaltyMinutes: number }[];
}

export const SEED_CONTESTS: SeedContest[] = [
  {
    slug: 'codeforge-weekly-clash-1',
    title: 'CodeForge Weekly Clash #1: Algorithm Ascendance',
    descriptionMdx: `# CodeForge Weekly Clash #1

Welcome to the inaugural **CodeForge Weekly Clash**! Test your algorithmic speed, precision, and problem-solving grit.

### Contest Rules:
- **Format**: Standard ICPC-style scoring.
- **Duration**: 90 Minutes.
- **Scoring**: Each solved problem awards full points. Each rejected submission incurs a **20-minute penalty** upon final acceptance.
- **Leaderboard**: Ranked primarily by total points, tie-broken by lowest cumulative penalty time.
`,
    status: ContestState.LIVE,
    startAtOffsetDays: -1,
    endAtOffsetDays: 6,
    durationMinutes: 90,
    totalPoints: 300,
    scoringFormula: 'standard_icpc',
    problemSlugs: [
      { slug: 'two-sum', sequence: 1, points: 100, penaltyMinutes: 20 },
      { slug: 'valid-parentheses', sequence: 2, points: 100, penaltyMinutes: 20 },
      { slug: 'merge-two-sorted-lists', sequence: 3, points: 100, penaltyMinutes: 20 },
    ],
  },
  {
    slug: 'codeforge-grand-prix-spring',
    title: 'CodeForge Grand Prix: Data Structures Showdown',
    descriptionMdx: `# CodeForge Grand Prix: Data Structures Showdown

The premier competitive programming event of the season. Compete with top engineers across tree traversals, dynamic programming, and optimal lookup algorithms.

### Prizes & Badges:
- 🥇 1st Place: 1,000 XP & Grandmaster Badge
- 🥈 2nd-10th: 500 XP & Competitive Champion Badge
`,
    status: ContestState.UPCOMING,
    startAtOffsetDays: 3,
    endAtOffsetDays: 7,
    durationMinutes: 120,
    totalPoints: 400,
    scoringFormula: 'standard_icpc',
    problemSlugs: [
      { slug: 'two-sum', sequence: 1, points: 100, penaltyMinutes: 20 },
      { slug: 'valid-parentheses', sequence: 2, points: 100, penaltyMinutes: 20 },
    ],
  },
];
