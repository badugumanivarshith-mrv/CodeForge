import { randomUUID } from 'crypto';
import { db } from '../database/connection';
import * as schema from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import {
  DealFlowDto,
  CreateDealFlowDto,
  FounderScoreDto,
  OpportunityScoreDto,
  DueDiligenceReportDto,
  InvestmentDecisionDto,
  FundDto,
  CreateFundDto,
  PortfolioHoldingDto,
  FundMetricsDto,
  ExitSimulationDto,
  LpProfileDto,
  SyndicateGroupDto,
  SyndicateMemberDto,
  CapitalAllocationPlanDto,
  DealStage,
  DealPriority,
  DiligenceCategory,
  DiligenceRiskSeverity,
  InvestmentRecommendation,
  CommitteeType,
  CommitteeVoteType,
  FundType,
  FundStatus,
  ExitType,
  ExitStatus,
  AllocationStrategy,
  SyndicateRole,
  StartupCategory,
  StartupStage,
  VentureHealthStatus,
} from '@codeforge/shared';
import { IVentureCapitalRepository } from './interfaces/IVentureCapitalRepository';

export class VentureCapitalRepository implements IVentureCapitalRepository {
  // In-memory stores for resilience and rapid test execution
  private memDealFlow = new Map<string, DealFlowDto>();
  private memFounderScores = new Map<string, FounderScoreDto>();
  private memOpportunityScores = new Map<string, OpportunityScoreDto>();
  private memDueDiligence = new Map<string, DueDiligenceReportDto>();
  private memDecisions = new Map<string, InvestmentDecisionDto>();
  private memFunds = new Map<string, FundDto>();
  private memHoldings = new Map<string, PortfolioHoldingDto>();
  private memMetrics = new Map<string, FundMetricsDto>();
  private memExits = new Map<string, ExitSimulationDto>();
  private memLps = new Map<string, LpProfileDto>();
  private memSyndicates = new Map<string, SyndicateGroupDto>();
  private memAllocations = new Map<string, CapitalAllocationPlanDto>();

  constructor() {
    this.seedDefaultVentureData();
  }

  private seedDefaultVentureData() {
    const fundId = 'fund-seed-1';
    const defaultFund: FundDto = {
      id: fundId,
      fundName: 'Horizon DeepTech Ventures Fund I',
      fundType: FundType.VENTURE_FUND,
      status: FundStatus.ACTIVELY_DEPLOYING,
      targetSizeUsd: 100000000,
      committedCapitalUsd: 85000000,
      deployedCapitalUsd: 32000000,
      reserveCapitalUsd: 45000000,
      vintageYear: 2025,
      managementFeePercent: 2.0,
      carriedInterestPercent: 20.0,
      hurdleRatePercent: 8.0,
      totalInvestments: 8,
      activeHoldingsCount: 8,
      exitCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memFunds.set(fundId, defaultFund);

    const deal1: DealFlowDto = {
      id: 'deal-seed-1',
      startupId: 'startup-seed-1',
      startupName: 'AgentForge Studio',
      tagline: 'Autonomous AI engineer swarms for mission-critical software verification',
      category: StartupCategory.AI_DEVTOOLS,
      stage: DealStage.DUE_DILIGENCE,
      priority: DealPriority.HIGH,
      source: 'Internal Autonomous Incubator',
      sourceUrl: 'https://codeforge.io/startups/agentforge-studio',
      initialValuationUsd: 12000000,
      targetRaiseUsd: 2500000,
      tractionSummary: '$480k ARR, 140% Net Retention, 42 enterprise pilot deployments',
      fitScore: 94.5,
      tags: ['AI DevTools', 'Autonomous Agents', 'Formal Verification'],
      assignedAnalyst: 'Alex Morgan, Principal',
      notes: 'Category-defining technology with 10x developer leverage and formal math verification guarantees.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memDealFlow.set(deal1.id, deal1);

    const holding1: PortfolioHoldingDto = {
      id: 'holding-seed-1',
      fundId,
      startupId: 'startup-seed-1',
      startupName: 'AgentForge Studio',
      category: StartupCategory.AI_DEVTOOLS,
      stage: StartupStage.MVP,
      initialInvestedUsd: 2000000,
      followOnInvestedUsd: 500000,
      totalInvestedUsd: 2500000,
      ownershipPercent: 18.5,
      currentValuationUsd: 18000000,
      holdingValueUsd: 3330000,
      moic: 1.33,
      irr: 32.5,
      healthStatus: VentureHealthStatus.THRIVING,
      boardSeat: true,
      proRataRights: true,
      acquiredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memHoldings.set(holding1.id, holding1);

    const metrics1: FundMetricsDto = {
      fundId,
      totalCommittedUsd: 85000000,
      totalCalledUsd: 35000000,
      totalDistributedUsd: 5000000,
      navUsd: 48000000,
      dpi: 0.14,
      rvpi: 1.37,
      tvpi: 1.51,
      grossIrrPercent: 28.6,
      netIrrPercent: 22.4,
      moic: 1.51,
      calculatedAt: new Date().toISOString(),
    };
    this.memMetrics.set(fundId, metrics1);
  }

  // 1. Deal Flow
  async createDealFlow(data: CreateDealFlowDto): Promise<DealFlowDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const record: DealFlowDto = {
      id,
      startupId: data.startupId,
      startupName: data.startupName,
      tagline: data.tagline || 'Next-generation AI software platform',
      category: data.category,
      stage: data.stage || DealStage.INBOX,
      priority: data.priority || DealPriority.MEDIUM,
      source: data.source || 'Inbound Sourcing',
      sourceUrl: data.sourceUrl,
      initialValuationUsd: data.initialValuationUsd ?? 8000000,
      targetRaiseUsd: data.targetRaiseUsd ?? 1500000,
      tractionSummary: data.tractionSummary || 'Early-stage MVP traction',
      fitScore: data.fitScore ?? 88.0,
      tags: data.tags || [],
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      try {
        await db.insert(schema.dealFlow).values({
          id: record.id,
          startupId: record.startupId,
          startupName: record.startupName,
          tagline: record.tagline,
          category: record.category,
          stage: record.stage,
          priority: record.priority,
          source: record.source,
          sourceUrl: record.sourceUrl,
          initialValuationUsd: record.initialValuationUsd,
          targetRaiseUsd: record.targetRaiseUsd,
          tractionSummary: record.tractionSummary,
          fitScore: record.fitScore,
          tags: record.tags,
          notes: record.notes,
          metadata: {},
        });
      } catch (err) {
        // memory fallback
      }
    }

    this.memDealFlow.set(id, record);
    return record;
  }

  async getDealFlowById(id: string): Promise<DealFlowDto | null> {
    return this.memDealFlow.get(id) || null;
  }

  async listDealFlow(stage?: DealStage, category?: StartupCategory): Promise<DealFlowDto[]> {
    let list = Array.from(this.memDealFlow.values());
    if (stage) list = list.filter((d) => d.stage === stage);
    if (category) list = list.filter((d) => d.category === category);
    return list;
  }

  async updateDealFlowStage(id: string, stage: DealStage, notes?: string): Promise<DealFlowDto | null> {
    const existing = this.memDealFlow.get(id);
    if (!existing) return null;
    const updated: DealFlowDto = {
      ...existing,
      stage,
      notes: notes || existing.notes,
      updatedAt: new Date().toISOString(),
    };
    this.memDealFlow.set(id, updated);
    return updated;
  }

  async updateDealFlowPriority(id: string, priority: DealPriority): Promise<DealFlowDto | null> {
    const existing = this.memDealFlow.get(id);
    if (!existing) return null;
    const updated: DealFlowDto = {
      ...existing,
      priority,
      updatedAt: new Date().toISOString(),
    };
    this.memDealFlow.set(id, updated);
    return updated;
  }

  // 2. Founder Scores
  async createFounderScore(data: Partial<FounderScoreDto>): Promise<FounderScoreDto> {
    const id = data.id || randomUUID();
    const record: FounderScoreDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      founderName: data.founderName || 'Lead Technical Founder',
      technicalDepthScore: data.technicalDepthScore ?? 92.0,
      convictionScore: data.convictionScore ?? 95.0,
      executionVelocityScore: data.executionVelocityScore ?? 90.0,
      domainExpertiseScore: data.domainExpertiseScore ?? 88.0,
      resilienceScore: data.resilienceScore ?? 94.0,
      compositeScore: data.compositeScore ?? 91.8,
      strengths: data.strengths || ['Deep domain expertise in distributed systems', 'Proven track record of rapid shipping'],
      growthAreas: data.growthAreas || ['Enterprise enterprise sales scaling'],
      assessmentNarrative: data.assessmentNarrative || 'Exemplary founder archetype with exceptional technical depth and high execution velocity.',
      evaluatedAt: new Date().toISOString(),
    };

    this.memFounderScores.set(record.startupId, record);
    return record;
  }

  async getFounderScoreByStartupId(startupId: string): Promise<FounderScoreDto | null> {
    return this.memFounderScores.get(startupId) || null;
  }

  async listFounderScores(): Promise<FounderScoreDto[]> {
    return Array.from(this.memFounderScores.values());
  }

  // 3. Opportunity Scores
  async createOpportunityScore(data: Partial<OpportunityScoreDto>): Promise<OpportunityScoreDto> {
    const id = data.id || randomUUID();
    const record: OpportunityScoreDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      marketTamScore: data.marketTamScore ?? 94.0,
      timingMoatScore: data.timingMoatScore ?? 92.5,
      competitiveAdvantageScore: data.competitiveAdvantageScore ?? 90.0,
      unitEconomicsPotentialScore: data.unitEconomicsPotentialScore ?? 88.5,
      scalabilityScore: data.scalabilityScore ?? 96.0,
      compositeScore: data.compositeScore ?? 92.2,
      keyDrivers: data.keyDrivers || ['$40B+ TAM expansion driven by agentic software migration', 'High gross margins (85%+)'],
      majorRisks: data.majorRisks || ['Incumbent enterprise platform consolidation'],
      scoredAt: new Date().toISOString(),
    };

    this.memOpportunityScores.set(record.startupId, record);
    return record;
  }

  async getOpportunityScoreByStartupId(startupId: string): Promise<OpportunityScoreDto | null> {
    return this.memOpportunityScores.get(startupId) || null;
  }

  async listOpportunityScores(): Promise<OpportunityScoreDto[]> {
    return Array.from(this.memOpportunityScores.values());
  }

  // 4. Due Diligence Reports
  async createDueDiligenceReport(data: Partial<DueDiligenceReportDto>): Promise<DueDiligenceReportDto> {
    const id = data.id || randomUUID();
    const now = new Date().toISOString();
    const record: DueDiligenceReportDto = {
      id,
      dealId: data.dealId,
      startupId: data.startupId || 'startup-seed-1',
      overallScore: data.overallScore ?? 92.4,
      recommendation: data.recommendation || InvestmentRecommendation.STRONG_INVEST,
      executiveSummary: data.executiveSummary || 'Comprehensive due diligence confirms strong technical moat and rapid market adoption.',
      dimensions: data.dimensions || [],
      detectedRisks: data.detectedRisks || [],
      redFlags: data.redFlags || [],
      greenLights: data.greenLights || ['Proprietary formal verifier IP', 'Zero-churn enterprise cohorts'],
      completedAt: now,
      createdAt: now,
    };

    this.memDueDiligence.set(id, record);
    this.memDueDiligence.set(record.startupId, record);
    return record;
  }

  async getDueDiligenceReportById(id: string): Promise<DueDiligenceReportDto | null> {
    return this.memDueDiligence.get(id) || null;
  }

  async getDueDiligenceReportByStartupId(startupId: string): Promise<DueDiligenceReportDto | null> {
    return this.memDueDiligence.get(startupId) || null;
  }

  async listDueDiligenceReports(): Promise<DueDiligenceReportDto[]> {
    return Array.from(new Set(this.memDueDiligence.values()));
  }

  // 5. Investment Decisions
  async createInvestmentDecision(data: Partial<InvestmentDecisionDto>): Promise<InvestmentDecisionDto> {
    const id = data.id || randomUUID();
    const record: InvestmentDecisionDto = {
      id,
      dealId: data.dealId,
      startupId: data.startupId || 'startup-seed-1',
      fundId: data.fundId || 'fund-seed-1',
      recommendation: data.recommendation || InvestmentRecommendation.INVEST,
      quorumMet: data.quorumMet ?? true,
      totalVotes: data.totalVotes ?? 4,
      yesVotes: data.yesVotes ?? 3,
      noVotes: data.noVotes ?? 0,
      conditionalVotes: data.conditionalVotes ?? 1,
      abstainVotes: data.abstainVotes ?? 0,
      convictionScore: data.convictionScore ?? 91.5,
      proposedInvestmentUsd: data.proposedInvestmentUsd ?? 2500000,
      proposedValuationUsd: data.proposedValuationUsd ?? 12000000,
      keyDebatePoints: data.keyDebatePoints || ['Defensibility of compiler-integrated proof engine', 'Speed of enterprise GTM'],
      contradictionsDetected: data.contradictionsDetected || [],
      consensusRationale: data.consensusRationale || 'Strong technical committee backing with clear $100M ARR roadmap.',
      votes: data.votes || [],
      decidedAt: new Date().toISOString(),
    };

    this.memDecisions.set(id, record);
    return record;
  }

  async getInvestmentDecisionById(id: string): Promise<InvestmentDecisionDto | null> {
    return this.memDecisions.get(id) || null;
  }

  async listInvestmentDecisions(fundId?: string): Promise<InvestmentDecisionDto[]> {
    let list = Array.from(this.memDecisions.values());
    if (fundId) list = list.filter((d) => d.fundId === fundId);
    return list;
  }

  // 6. Funds
  async createFund(data: CreateFundDto): Promise<FundDto> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const record: FundDto = {
      id,
      fundName: data.fundName,
      fundType: data.fundType || FundType.VENTURE_FUND,
      status: FundStatus.ACTIVELY_DEPLOYING,
      targetSizeUsd: data.targetSizeUsd,
      committedCapitalUsd: data.targetSizeUsd * 0.8,
      deployedCapitalUsd: 0,
      reserveCapitalUsd: data.targetSizeUsd * 0.5,
      vintageYear: data.vintageYear || new Date().getFullYear(),
      managementFeePercent: data.managementFeePercent ?? 2.0,
      carriedInterestPercent: data.carriedInterestPercent ?? 20.0,
      hurdleRatePercent: 8.0,
      totalInvestments: 0,
      activeHoldingsCount: 0,
      exitCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.memFunds.set(id, record);
    return record;
  }

  async getFundById(id: string): Promise<FundDto | null> {
    return this.memFunds.get(id) || null;
  }

  async listFunds(status?: FundStatus): Promise<FundDto[]> {
    let list = Array.from(this.memFunds.values());
    if (status) list = list.filter((f) => f.status === status);
    return list;
  }

  async updateFund(id: string, updates: Partial<FundDto>): Promise<FundDto | null> {
    const existing = this.memFunds.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.memFunds.set(id, updated);
    return updated;
  }

  // 7. Portfolio Holdings
  async createPortfolioHolding(data: Partial<PortfolioHoldingDto>): Promise<PortfolioHoldingDto> {
    const id = data.id || randomUUID();
    const now = new Date().toISOString();
    const record: PortfolioHoldingDto = {
      id,
      fundId: data.fundId || 'fund-seed-1',
      startupId: data.startupId || 'startup-seed-1',
      startupName: data.startupName || 'Portfolio Startup',
      category: data.category || StartupCategory.AI_DEVTOOLS,
      stage: data.stage || StartupStage.MVP,
      initialInvestedUsd: data.initialInvestedUsd ?? 1500000,
      followOnInvestedUsd: data.followOnInvestedUsd ?? 0,
      totalInvestedUsd: (data.initialInvestedUsd ?? 1500000) + (data.followOnInvestedUsd ?? 0),
      ownershipPercent: data.ownershipPercent ?? 15.0,
      currentValuationUsd: data.currentValuationUsd ?? 10000000,
      holdingValueUsd: data.holdingValueUsd ?? (data.currentValuationUsd ?? 10000000) * ((data.ownershipPercent ?? 15.0) / 100),
      moic: data.moic ?? 1.25,
      irr: data.irr ?? 28.0,
      healthStatus: data.healthStatus || VentureHealthStatus.THRIVING,
      boardSeat: data.boardSeat ?? false,
      proRataRights: data.proRataRights ?? true,
      acquiredAt: now,
      updatedAt: now,
    };

    this.memHoldings.set(id, record);
    return record;
  }

  async getPortfolioHoldingById(id: string): Promise<PortfolioHoldingDto | null> {
    return this.memHoldings.get(id) || null;
  }

  async listPortfolioHoldings(fundId?: string): Promise<PortfolioHoldingDto[]> {
    let list = Array.from(this.memHoldings.values());
    if (fundId) list = list.filter((h) => h.fundId === fundId);
    return list;
  }

  async updatePortfolioHolding(id: string, updates: Partial<PortfolioHoldingDto>): Promise<PortfolioHoldingDto | null> {
    const existing = this.memHoldings.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.memHoldings.set(id, updated);
    return updated;
  }

  // 8. Fund Metrics
  async createFundMetrics(data: Partial<FundMetricsDto>): Promise<FundMetricsDto> {
    const record: FundMetricsDto = {
      fundId: data.fundId || 'fund-seed-1',
      totalCommittedUsd: data.totalCommittedUsd ?? 100000000,
      totalCalledUsd: data.totalCalledUsd ?? 40000000,
      totalDistributedUsd: data.totalDistributedUsd ?? 10000000,
      navUsd: data.navUsd ?? 65000000,
      dpi: data.dpi ?? 0.25,
      rvpi: data.rvpi ?? 1.625,
      tvpi: data.tvpi ?? 1.875,
      grossIrrPercent: data.grossIrrPercent ?? 31.4,
      netIrrPercent: data.netIrrPercent ?? 24.8,
      moic: data.moic ?? 1.88,
      calculatedAt: new Date().toISOString(),
    };

    this.memMetrics.set(record.fundId, record);
    return record;
  }

  async getFundMetricsByFundId(fundId: string): Promise<FundMetricsDto | null> {
    return this.memMetrics.get(fundId) || null;
  }

  // 9. Exit Simulations
  async createExitSimulation(data: Partial<ExitSimulationDto>): Promise<ExitSimulationDto> {
    const id = data.id || randomUUID();
    const record: ExitSimulationDto = {
      id,
      fundId: data.fundId || 'fund-seed-1',
      startupId: data.startupId || 'startup-seed-1',
      startupName: data.startupName || 'Acquired Venture',
      exitType: data.exitType || ExitType.STRATEGIC_ACQUISITION,
      status: data.status || ExitStatus.SIMULATED,
      targetAcquirerOrExchange: data.targetAcquirerOrExchange || 'Major Cloud Platform',
      simulatedExitValuationUsd: data.simulatedExitValuationUsd ?? 150000000,
      expectedProceedsUsd: data.expectedProceedsUsd ?? 27750000,
      fundReturnMultiple: data.fundReturnMultiple ?? 11.1,
      netProfitUsd: data.netProfitUsd ?? 25250000,
      carryGeneratedUsd: data.carryGeneratedUsd ?? 5050000,
      timelineMonths: data.timelineMonths ?? 24,
      confidenceRating: data.confidenceRating ?? 88.0,
      waterfallSummary: data.waterfallSummary || [
        { tier: 'LP Return of Capital', amountUsd: 2500000, percentage: 9.0 },
        { tier: 'LP Preferred 8% Hurdle', amountUsd: 600000, percentage: 2.2 },
        { tier: 'GP 20% Carried Interest Catch-up', amountUsd: 5050000, percentage: 18.2 },
        { tier: 'LP Pro-rata Net Profit (80%)', amountUsd: 19600000, percentage: 70.6 },
      ],
      simulatedAt: new Date().toISOString(),
    };

    this.memExits.set(id, record);
    return record;
  }

  async getExitSimulationById(id: string): Promise<ExitSimulationDto | null> {
    return this.memExits.get(id) || null;
  }

  async listExitSimulations(fundId?: string): Promise<ExitSimulationDto[]> {
    let list = Array.from(this.memExits.values());
    if (fundId) list = list.filter((e) => e.fundId === fundId);
    return list;
  }

  // 10. LP Profiles
  async createLpProfile(data: Partial<LpProfileDto>): Promise<LpProfileDto> {
    const id = data.id || randomUUID();
    const record: LpProfileDto = {
      id,
      lpName: data.lpName || 'Institutional Endowment Fund',
      lpType: data.lpType || 'INSTITUTIONAL',
      committedTotalUsd: data.committedTotalUsd ?? 25000000,
      activeFunds: data.activeFunds || ['fund-seed-1'],
      preferredSectors: data.preferredSectors || [StartupCategory.AI_DEVTOOLS, StartupCategory.AUTONOMOUS_AGENTS],
      coInvestmentAppetite: data.coInvestmentAppetite ?? true,
      relationshipHealth: data.relationshipHealth ?? 95.0,
    };

    this.memLps.set(id, record);
    return record;
  }

  async getLpProfileById(id: string): Promise<LpProfileDto | null> {
    return this.memLps.get(id) || null;
  }

  async listLpProfiles(): Promise<LpProfileDto[]> {
    return Array.from(this.memLps.values());
  }

  // 11. Syndicates
  async createSyndicate(data: Partial<SyndicateGroupDto>): Promise<SyndicateGroupDto> {
    const id = data.id || randomUUID();
    const record: SyndicateGroupDto = {
      id,
      dealId: data.dealId,
      startupId: data.startupId || 'startup-seed-1',
      syndicateName: data.syndicateName || 'DeepTech Autonomous Syndicate I',
      leadInvestorId: data.leadInvestorId || 'lead-inv-1',
      targetRaiseUsd: data.targetRaiseUsd ?? 1000000,
      committedUsd: data.committedUsd ?? 250000,
      committedTotalUsd: data.committedTotalUsd ?? data.committedUsd ?? 250000,
      allocationSpots: data.allocationSpots ?? 20,
      carryPercent: data.carryPercent ?? 10.0,
      leadCarryPercent: data.leadCarryPercent ?? data.carryPercent ?? 10.0,
      members: data.members || [
        {
          userId: 'lead-inv-1',
          investorName: 'Horizon Syndicate Lead',
          role: SyndicateRole.LEAD_INVESTOR,
          committedUsd: 100000,
          joinedAt: new Date().toISOString(),
        },
      ],
      status: data.status || 'OPEN',
      createdAt: new Date().toISOString(),
    };

    this.memSyndicates.set(id, record);
    return record;
  }

  async getSyndicateById(id: string): Promise<SyndicateGroupDto | null> {
    return this.memSyndicates.get(id) || null;
  }

  async listSyndicates(startupId?: string): Promise<SyndicateGroupDto[]> {
    let list = Array.from(this.memSyndicates.values());
    if (startupId) list = list.filter((s) => s.startupId === startupId);
    return list;
  }

  async addSyndicateMember(syndicateId: string, member: SyndicateMemberDto): Promise<SyndicateGroupDto | null> {
    const existing = this.memSyndicates.get(syndicateId);
    if (!existing) return null;
    existing.members.push(member);
    existing.committedUsd += member.committedUsd;
    existing.committedTotalUsd = (existing.committedTotalUsd || 0) + member.committedUsd;
    if (existing.committedUsd >= existing.targetRaiseUsd) {
      existing.status = 'OVERSUBSCRIBED';
    }
    return existing;
  }

  // 12. Capital Allocation Plans
  async createCapitalAllocationPlan(data: Partial<CapitalAllocationPlanDto>): Promise<CapitalAllocationPlanDto> {
    const record: CapitalAllocationPlanDto = {
      fundId: data.fundId || 'fund-seed-1',
      strategy: data.strategy || AllocationStrategy.CONVICTION_WEIGHTED,
      targetFundSizeUsd: data.targetFundSizeUsd ?? data.availableCapitalUsd ?? 100000000,
      availableCapitalUsd: data.availableCapitalUsd ?? 50000000,
      newDealsAllocationUsd: data.newDealsAllocationUsd ?? 25000000,
      followOnReserveUsd: data.followOnReserveUsd ?? 20000000,
      contingencyBufferUsd: data.contingencyBufferUsd ?? 5000000,
      allocationsByStage: data.allocationsByStage || {
        [StartupStage.IDEATION]: 2000000,
        [StartupStage.VALIDATION]: 4000000,
        [StartupStage.PROTOTYPE]: 6000000,
        [StartupStage.MVP]: 10000000,
        [StartupStage.GROWTH]: 8000000,
      },
      allocationsBySector: data.allocationsBySector || {
        [StartupCategory.AI_DEVTOOLS]: 15000000,
        [StartupCategory.AUTONOMOUS_AGENTS]: 15000000,
        [StartupCategory.CYBERSECURITY_AI]: 10000000,
        [StartupCategory.ENTERPRISE_INFRA]: 10000000,
      },
      scenarioSensitivities: data.scenarioSensitivities || [
        {
          scenarioName: 'Bull AI Acceleration',
          description: 'High valuation multiple expansion and rapid liquidity',
          marketCondition: 'BULL',
          simulatedTvpi: 3.4,
          simulatedGrossIrr: 42.5,
          defaultRatePercent: 12.0,
        },
        {
          scenarioName: 'Base Case Steady Growth',
          description: 'Historical venture distribution curves and 7-year exit cycle',
          marketCondition: 'BASE',
          simulatedTvpi: 2.3,
          simulatedGrossIrr: 26.8,
          defaultRatePercent: 28.0,
        },
        {
          scenarioName: 'Bear Macro Contraction',
          description: 'Depressed multiple environment with prolonged runway demands',
          marketCondition: 'BEAR',
          simulatedTvpi: 1.4,
          simulatedGrossIrr: 12.2,
          defaultRatePercent: 45.0,
        },
      ],
      optimizedAt: new Date().toISOString(),
    };

    this.memAllocations.set(record.fundId, record);
    return record;
  }

  async getCapitalAllocationPlanByFundId(fundId: string): Promise<CapitalAllocationPlanDto | null> {
    return this.memAllocations.get(fundId) || null;
  }
}

export const ventureCapitalRepository = new VentureCapitalRepository();
