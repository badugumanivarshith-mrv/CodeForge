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
  StartupCategory,
  FundStatus,
} from '@codeforge/shared';

export interface IVentureCapitalRepository {
  // 1. Deal Flow
  createDealFlow(data: CreateDealFlowDto): Promise<DealFlowDto>;
  getDealFlowById(id: string): Promise<DealFlowDto | null>;
  listDealFlow(stage?: DealStage, category?: StartupCategory): Promise<DealFlowDto[]>;
  updateDealFlowStage(id: string, stage: DealStage, notes?: string): Promise<DealFlowDto | null>;
  updateDealFlowPriority(id: string, priority: DealPriority): Promise<DealFlowDto | null>;

  // 2. Founder Scores
  createFounderScore(data: Partial<FounderScoreDto>): Promise<FounderScoreDto>;
  getFounderScoreByStartupId(startupId: string): Promise<FounderScoreDto | null>;
  listFounderScores(): Promise<FounderScoreDto[]>;

  // 3. Opportunity Scores
  createOpportunityScore(data: Partial<OpportunityScoreDto>): Promise<OpportunityScoreDto>;
  getOpportunityScoreByStartupId(startupId: string): Promise<OpportunityScoreDto | null>;
  listOpportunityScores(): Promise<OpportunityScoreDto[]>;

  // 4. Due Diligence Reports
  createDueDiligenceReport(data: Partial<DueDiligenceReportDto>): Promise<DueDiligenceReportDto>;
  getDueDiligenceReportById(id: string): Promise<DueDiligenceReportDto | null>;
  getDueDiligenceReportByStartupId(startupId: string): Promise<DueDiligenceReportDto | null>;
  listDueDiligenceReports(): Promise<DueDiligenceReportDto[]>;

  // 5. Investment Decisions
  createInvestmentDecision(data: Partial<InvestmentDecisionDto>): Promise<InvestmentDecisionDto>;
  getInvestmentDecisionById(id: string): Promise<InvestmentDecisionDto | null>;
  listInvestmentDecisions(fundId?: string): Promise<InvestmentDecisionDto[]>;

  // 6. Funds
  createFund(data: CreateFundDto): Promise<FundDto>;
  getFundById(id: string): Promise<FundDto | null>;
  listFunds(status?: FundStatus): Promise<FundDto[]>;
  updateFund(id: string, updates: Partial<FundDto>): Promise<FundDto | null>;

  // 7. Portfolio Holdings
  createPortfolioHolding(data: Partial<PortfolioHoldingDto>): Promise<PortfolioHoldingDto>;
  getPortfolioHoldingById(id: string): Promise<PortfolioHoldingDto | null>;
  listPortfolioHoldings(fundId?: string): Promise<PortfolioHoldingDto[]>;
  updatePortfolioHolding(id: string, updates: Partial<PortfolioHoldingDto>): Promise<PortfolioHoldingDto | null>;

  // 8. Fund Metrics
  createFundMetrics(data: Partial<FundMetricsDto>): Promise<FundMetricsDto>;
  getFundMetricsByFundId(fundId: string): Promise<FundMetricsDto | null>;

  // 9. Exit Simulations
  createExitSimulation(data: Partial<ExitSimulationDto>): Promise<ExitSimulationDto>;
  getExitSimulationById(id: string): Promise<ExitSimulationDto | null>;
  listExitSimulations(fundId?: string): Promise<ExitSimulationDto[]>;

  // 10. LP Profiles
  createLpProfile(data: Partial<LpProfileDto>): Promise<LpProfileDto>;
  getLpProfileById(id: string): Promise<LpProfileDto | null>;
  listLpProfiles(): Promise<LpProfileDto[]>;

  // 11. Syndicates
  createSyndicate(data: Partial<SyndicateGroupDto>): Promise<SyndicateGroupDto>;
  getSyndicateById(id: string): Promise<SyndicateGroupDto | null>;
  listSyndicates(startupId?: string): Promise<SyndicateGroupDto[]>;
  addSyndicateMember(syndicateId: string, member: SyndicateMemberDto): Promise<SyndicateGroupDto | null>;

  // 12. Capital Allocation Plans
  createCapitalAllocationPlan(data: Partial<CapitalAllocationPlanDto>): Promise<CapitalAllocationPlanDto>;
  getCapitalAllocationPlanByFundId(fundId: string): Promise<CapitalAllocationPlanDto | null>;
}
