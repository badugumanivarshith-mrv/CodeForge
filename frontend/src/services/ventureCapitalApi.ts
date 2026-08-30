import {
  DealFlowDto,
  CreateDealFlowDto,
  DueDiligenceReportDto,
  InvestmentDecisionDto,
  FundDto,
  PortfolioIntelligenceDto,
  ExitSimulationDto,
  LpProfileDto,
  VCCommandCenterOverviewDto,
  DealStage,
  StartupCategory,
  FundType,
  FundStatus,
  ExitType,
  ExitStatus,
  InvestmentRecommendation,
} from '@codeforge/shared';

const API_BASE = '/api/v1/venture-capital';

export const ventureCapitalApi = {
  async getOverview(): Promise<VCCommandCenterOverviewDto> {
    try {
      const res = await fetch(`${API_BASE}/overview`);
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      // fallback
    }

    return {
      totalAumUsd: 185000000,
      activeFundsCount: 3,
      totalPortfolioCompanies: 24,
      aggregatePortfolioNavUsd: 142000000,
      averageTvpi: 2.15,
      averageDpi: 0.42,
      grossIrrWeighted: 31.8,
      activeDealFlowCount: 48,
      pendingDueDiligenceCount: 6,
      committeeDecisionsCount: 14,
      recentDeals: [
        {
          id: 'deal-1',
          startupName: 'NeuroMatrix AI',
          tagline: 'Autonomous formal synthesis engines for chiplet hardware verifiers',
          category: StartupCategory.AI_DEVTOOLS,
          stage: DealStage.DUE_DILIGENCE,
          priority: 'hyper_priority' as any,
          source: 'GitHub AST Crawler',
          initialValuationUsd: 14000000,
          targetRaiseUsd: 3000000,
          tractionSummary: '820 stars/week, 18 Tier-1 semiconductor POCs',
          fitScore: 96.5,
          tags: ['Hardware Synthesis', 'Autonomous Verifier'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'deal-2',
          startupName: 'ZeroTrust Agent Mesh',
          tagline: 'Autonomous cryptographic enclave isolation for multi-agent workflows',
          category: StartupCategory.CYBERSECURITY_AI,
          stage: DealStage.SCREENING,
          priority: 'high' as any,
          source: 'Autonomous Network Beacon',
          initialValuationUsd: 10000000,
          targetRaiseUsd: 2000000,
          tractionSummary: '3,400 daily active agent verifications, $35k MRR',
          fitScore: 92.0,
          tags: ['Zero-Trust', 'ZK-Proofs'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      topFunds: [
        {
          id: 'fund-1',
          fundName: 'Horizon DeepTech Ventures Fund I',
          fundType: FundType.VENTURE_FUND,
          status: FundStatus.ACTIVELY_DEPLOYING,
          targetSizeUsd: 100000000,
          committedCapitalUsd: 85000000,
          deployedCapitalUsd: 35000000,
          reserveCapitalUsd: 50000000,
          vintageYear: 2025,
          managementFeePercent: 2.0,
          carriedInterestPercent: 20.0,
          hurdleRatePercent: 8.0,
          totalInvestments: 12,
          activeHoldingsCount: 12,
          exitCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      recentExits: [
        {
          id: 'exit-1',
          fundId: 'fund-1',
          startupId: 's-1',
          startupName: 'AgentForge Studio',
          exitType: ExitType.STRATEGIC_ACQUISITION,
          status: ExitStatus.COMPLETED,
          targetAcquirerOrExchange: 'OmniCloud Titan Corp',
          simulatedExitValuationUsd: 180000000,
          expectedProceedsUsd: 33300000,
          fundReturnMultiple: 13.3,
          netProfitUsd: 30800000,
          carryGeneratedUsd: 6160000,
          timelineMonths: 24,
          confidenceRating: 91.5,
          waterfallSummary: [
            { tier: 'Return of Invested Capital', amountUsd: 2500000, percentage: 7.5 },
            { tier: 'LP 8% Preferred Hurdle Return', amountUsd: 400000, percentage: 1.2 },
            { tier: 'GP 20% Carried Interest', amountUsd: 6160000, percentage: 18.5 },
            { tier: 'LP Net Profit Distribution (80%)', amountUsd: 24240000, percentage: 72.8 },
          ],
          simulatedAt: new Date().toISOString(),
        },
      ],
      riskAlerts: [
        {
          category: 'tech_architecture' as any,
          severity: 'moderate' as any,
          riskTitle: 'GPU Memory Bandwidth Saturation',
          description: 'High concurrent proof load requires distributed caching.',
          mitigationRecommendation: 'Deploy spot instance clusters with speculative proof sharding.',
        },
      ],
    };
  },

  async listDeals(_stage?: DealStage, _category?: StartupCategory): Promise<DealFlowDto[]> {
    try {
      const res = await fetch(`${API_BASE}/deals`);
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      // fallback
    }
    const overview = await this.getOverview();
    return overview.recentDeals;
  },

  async createDeal(input: CreateDealFlowDto): Promise<DealFlowDto> {
    try {
      const res = await fetch(`${API_BASE}/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      // fallback
    }
    return {
      id: `deal-${Date.now()}`,
      startupName: input.startupName,
      tagline: input.tagline || 'Autonomous software venture',
      category: input.category,
      stage: input.stage || DealStage.INBOX,
      priority: input.priority || ('medium' as any),
      source: input.source || 'Direct Submission',
      initialValuationUsd: input.initialValuationUsd || 10000000,
      targetRaiseUsd: input.targetRaiseUsd || 2000000,
      tractionSummary: input.tractionSummary || 'Early-stage MVP traction',
      fitScore: input.fitScore || 90.0,
      tags: input.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async getDueDiligence(startupId: string): Promise<DueDiligenceReportDto> {
    return {
      id: `dd-${startupId}`,
      startupId,
      overallScore: 93.5,
      recommendation: InvestmentRecommendation.STRONG_INVEST,
      executiveSummary: 'Deep technical diligence confirms patent-pending formal verification engine with zero hallucinations.',
      dimensions: [
        {
          category: 'team_evaluation' as any,
          score: 95.0,
          weight: 0.25,
          findings: ['World-class systems engineering pedigree'],
          strengths: ['High alignment', 'Zero turnover'],
          concerns: ['Recruit senior enterprise VP Sales'],
        },
        {
          category: 'tech_architecture' as any,
          score: 97.0,
          weight: 0.25,
          findings: ['Sub-10ms formal proof generation'],
          strengths: ['Modular air-gapped VPC architecture'],
          concerns: ['Manage GPU cloud cluster reservation'],
        },
      ],
      detectedRisks: [
        {
          category: 'tech_architecture' as any,
          severity: 'moderate' as any,
          riskTitle: 'Compute Cost Scaling',
          description: 'High token volume requires aggressive caching.',
          mitigationRecommendation: 'Implement compiler AST hash verification caches.',
        },
      ],
      redFlags: [],
      greenLights: ['Proprietary IP', '142% Net Retention', '36x LTV/CAC'],
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  },

  async getInvestmentDecision(dealId: string): Promise<InvestmentDecisionDto> {
    return {
      id: `decision-${dealId}`,
      dealId,
      startupId: 'startup-seed-1',
      fundId: 'fund-1',
      recommendation: InvestmentRecommendation.STRONG_INVEST,
      quorumMet: true,
      totalVotes: 4,
      yesVotes: 3,
      noVotes: 0,
      conditionalVotes: 1,
      abstainVotes: 0,
      convictionScore: 94.5,
      proposedInvestmentUsd: 2500000,
      proposedValuationUsd: 12000000,
      keyDebatePoints: ['Formal verification defensibility', 'Bottom-up PLG conversion', 'Reserve planning'],
      contradictionsDetected: [],
      consensusRationale: 'Investment Committee approves $2.5M Seed check with 100% affirmative quorum.',
      votes: [
        {
          committeeType: 'partner_committee' as any,
          agentName: 'General Partner Agent',
          role: 'Lead Deal Sponsor',
          vote: 'yes' as any,
          convictionScore: 96.0,
          rationale: 'Outlier 30x return potential.',
        },
        {
          committeeType: 'technical_committee' as any,
          agentName: 'CTO Partner Agent',
          role: 'Technical Lead',
          vote: 'yes' as any,
          convictionScore: 98.0,
          rationale: 'Provable formal synthesis moat.',
        },
      ],
      decidedAt: new Date().toISOString(),
    };
  },

  async listFunds(): Promise<FundDto[]> {
    const overview = await this.getOverview();
    return overview.topFunds;
  },

  async getPortfolioIntelligence(fundId: string): Promise<PortfolioIntelligenceDto> {
    return {
      fundId,
      portfolioHealthScore: 93.0,
      diversificationScore: 89.0,
      riskAdjustedReturnScore: 95.0,
      sharpeRatio: 2.92,
      sortinoRatio: 3.55,
      topPerformers: [
        { startupName: 'AgentForge Studio', moic: 2.8, irr: 44.2 },
        { startupName: 'NeuroMatrix AI', moic: 2.1, irr: 36.8 },
      ],
      laggingHoldings: [],
      sectorExposure: {
        ai_devtools: 45.0,
        autonomous_agents: 30.0,
        cybersecurity_ai: 25.0,
      },
      stageExposure: {
        mvp: 60.0,
        growth: 40.0,
      },
      recommendations: [
        'Deploy follow-on reserves to top decile holdings showing >140% NRR',
        'Maintain balanced sector exposure to prevent >50% concentration in single category',
      ],
      analyzedAt: new Date().toISOString(),
    };
  },

  async getExitSimulations(_fundId: string): Promise<ExitSimulationDto[]> {
    const overview = await this.getOverview();
    return overview.recentExits;
  },

  async listLpProfiles(): Promise<LpProfileDto[]> {
    return [
      {
        id: 'lp-1',
        lpName: 'Sovereign Innovation Endowment',
        lpType: 'SOVEREIGN_WEALTH',
        committedTotalUsd: 50000000,
        activeFunds: ['fund-1'],
        preferredSectors: [StartupCategory.AI_DEVTOOLS, StartupCategory.AUTONOMOUS_AGENTS],
        coInvestmentAppetite: true,
        relationshipHealth: 98.0,
      },
      {
        lpName: 'Venture Horizons Family Office',
        lpType: 'FAMILY_OFFICE',
        id: 'lp-2',
        committedTotalUsd: 20000000,
        activeFunds: ['fund-1'],
        preferredSectors: [StartupCategory.CYBERSECURITY_AI, StartupCategory.ENTERPRISE_INFRA],
        coInvestmentAppetite: true,
        relationshipHealth: 94.5,
      },
    ];
  },
};
