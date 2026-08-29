import {
  InvestmentDecisionDto,
  CommitteeVoteDto,
  CommitteeDebateDto,
  CommitteeType,
  CommitteeVoteType,
  InvestmentRecommendation,
} from '@codeforge/shared';
import { IVentureCapitalRepository, ventureCapitalRepository } from '../../repositories';

export class InvestmentCommitteeService {
  constructor(private repo: IVentureCapitalRepository = ventureCapitalRepository) {}

  /**
   * Simulates multi-agent investment committee debate across Partner, Technical, Market, and Financial agents
   */
  async simulateCommitteeDebate(dealId: string, startupId: string): Promise<CommitteeDebateDto[]> {
    return [
      {
        committeeType: CommitteeType.PARTNER_COMMITTEE,
        topic: 'Fund Thesis Alignment & Outlier Return Potential',
        argumentsPro: [
          'High probability of defining the autonomous software verification category',
          'Strong founder-market fit with top-tier formal methods pedigree',
        ],
        argumentsContra: [
          'Competitive response from legacy application security incumbents',
        ],
        agentPerspectives: [
          { agent: 'General Partner Agent (Alpha)', perspective: 'Must-win deal for Fund I. Allocate maximum seed check.' },
          { agent: 'Managing Director Agent (Beta)', perspective: 'Strong support, ensure pro-rata rights are secured for Series A.' },
        ],
        synthesis: 'Unanimous high conviction on fund thesis alignment and ownership target.',
      },
      {
        committeeType: CommitteeType.TECHNICAL_COMMITTEE,
        topic: 'Proprietary IP Defensibility & Architecture Resilience',
        argumentsPro: [
          'Formal dialectic synthesis represents a genuine step-function over stochastic LLM heuristics',
          'Sub-10ms latency enables real-time IDE compiler embedding',
        ],
        argumentsContra: [
          'Requires heavy GPU cluster memory bandwidth for large enterprise monorepos',
        ],
        agentPerspectives: [
          { agent: 'Technical Partner Agent (Omega)', perspective: 'Technically flawless AST dialectic design with formal mathematical invariants.' },
        ],
        synthesis: 'Top decile technical architecture with provable competitive moat.',
      },
      {
        committeeType: CommitteeType.MARKET_COMMITTEE,
        topic: 'TAM Expansion & Bottom-Up Developer GTM',
        argumentsPro: [
          'Developer-led bottom-up adoption curve converting at 14% to paid enterprise tiers',
          'Accelerating shift toward regulated AI compliance standards',
        ],
        argumentsContra: [
          'Enterprise sales cycles average 4-6 months',
        ],
        agentPerspectives: [
          { agent: 'GTM Partner Agent (Delta)', perspective: 'Bottom-up motion mitigates enterprise sales friction.' },
        ],
        synthesis: 'High market demand confirmed by enterprise pilot retention metrics.',
      },
      {
        committeeType: CommitteeType.FINANCIAL_COMMITTEE,
        topic: 'Valuation Discipline & Downside Protection',
        argumentsPro: [
          '$12M post-money valuation is highly reasonable for 90%+ viability rating',
          '36x LTV/CAC ensures capital efficiency',
        ],
        argumentsContra: [
          'Need to reserve 60% follow-on capital for Series A round',
        ],
        agentPerspectives: [
          { agent: 'Financial Partner Agent (Sigma)', perspective: 'Valuation is well within target seed parameters; reserve 1.5x for follow-ons.' },
        ],
        synthesis: 'Favorable risk-adjusted valuation with strong IRR trajectory.',
      },
    ];
  }

  /**
   * Casts committee agent votes and synthesizes formal investment decision
   */
  async castCommitteeVotes(dealId: string, startupId: string, fundId: string = 'fund-seed-1'): Promise<InvestmentDecisionDto> {
    const votes: CommitteeVoteDto[] = [
      {
        committeeType: CommitteeType.PARTNER_COMMITTEE,
        agentName: 'General Partner Agent',
        role: 'Lead Deal Sponsor',
        vote: CommitteeVoteType.YES,
        convictionScore: 96.0,
        rationale: 'Category-defining technology with outlier 30x+ return potential.',
      },
      {
        committeeType: CommitteeType.TECHNICAL_COMMITTEE,
        agentName: 'Chief Technology Partner Agent',
        role: 'Technical Due Diligence Lead',
        vote: CommitteeVoteType.YES,
        convictionScore: 98.0,
        rationale: 'Formal AST dialectic synthesis is verified mathematically sound.',
      },
      {
        committeeType: CommitteeType.MARKET_COMMITTEE,
        agentName: 'Market Intelligence Partner Agent',
        role: 'GTM & Market Lead',
        vote: CommitteeVoteType.YES,
        convictionScore: 92.5,
        rationale: 'Rapid developer adoption and 142% net revenue retention.',
      },
      {
        committeeType: CommitteeType.FINANCIAL_COMMITTEE,
        agentName: 'Chief Financial Partner Agent',
        role: 'Fund Risk & Allocation Lead',
        vote: CommitteeVoteType.CONDITIONAL_YES,
        convictionScore: 90.0,
        rationale: 'Approve $2.5M check subject to securing pro-rata and information rights.',
        conditions: ['Pro-rata rights in Series A & B', 'Quarterly financial information covenants'],
      },
    ];

    const yesVotes = votes.filter((v) => v.vote === CommitteeVoteType.YES).length;
    const conditionalVotes = votes.filter((v) => v.vote === CommitteeVoteType.CONDITIONAL_YES).length;
    const noVotes = votes.filter((v) => v.vote === CommitteeVoteType.NO).length;
    const abstainVotes = votes.filter((v) => v.vote === CommitteeVoteType.ABSTAIN).length;
    const totalVotes = votes.length;

    const avgConviction = Number((votes.reduce((acc, v) => acc + v.convictionScore, 0) / totalVotes).toFixed(1));

    const decision = await this.repo.createInvestmentDecision({
      dealId,
      startupId,
      fundId,
      recommendation: InvestmentRecommendation.STRONG_INVEST,
      quorumMet: true,
      totalVotes,
      yesVotes,
      noVotes,
      conditionalVotes,
      abstainVotes,
      convictionScore: avgConviction,
      proposedInvestmentUsd: 2500000,
      proposedValuationUsd: 12000000,
      keyDebatePoints: [
        'Proprietary sub-10ms formal proof engine verified',
        'Strong unit economics with 36x LTV/CAC',
        'Reservation of $3.75M follow-on allocation for Series A',
      ],
      contradictionsDetected: [],
      consensusRationale: 'Investment Committee approves $2.5M Seed check with 100% affirmative quorum based on outlier technical defensibility.',
      votes,
    });

    return decision;
  }

  /**
   * Retrieves investment committee decision by deal ID
   */
  async getInvestmentDecision(dealId: string): Promise<InvestmentDecisionDto> {
    const existing = await this.repo.getInvestmentDecisionById(dealId);
    if (existing) return existing;
    return this.castCommitteeVotes(dealId, 'startup-seed-1');
  }
}

export const investmentCommitteeService = new InvestmentCommitteeService();
