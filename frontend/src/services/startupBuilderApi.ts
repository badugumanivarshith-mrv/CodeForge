import { apiClient } from './apiClient';
import {
  StartupDto,
  CreateStartupDto,
  StartupIdeaDto,
  GenerateStartupIdeaDto,
  MarketReportDto,
  GenerateMarketReportDto,
  AIFounderDecisionDto,
  StrategicPlanReportDto,
  ProductIncubationDto,
  CreateProductIncubationDto,
  CustomerPersonaDto,
  CustomerValidationReportDto,
  GrowthForecastDto,
  VenturePortfolioDto,
  InvestorProfileDto,
  StartupCommandCenterOverviewDto,
  StartupCategory,
  StartupStage,
  GrowthChannel,
  CustomerPersonaType,
  StartupFundingStage,
} from '@codeforge/shared';

export const startupBuilderApi = {
  // Command Center Overview
  async getOverview(): Promise<StartupCommandCenterOverviewDto> {
    const res = await apiClient.get('/startup-builder/overview');
    return res.data.data;
  },

  // 1. Startups Core
  async listStartups(category?: StartupCategory, stage?: StartupStage): Promise<StartupDto[]> {
    const res = await apiClient.get('/startup-builder/startups', { params: { category, stage } });
    return res.data.data;
  },

  async getStartup(id: string): Promise<StartupDto> {
    const res = await apiClient.get(`/startup-builder/startups/${id}`);
    return res.data.data;
  },

  async createStartup(data: CreateStartupDto): Promise<StartupDto> {
    const res = await apiClient.post('/startup-builder/startups', data);
    return res.data.data;
  },

  async getStartupBlueprint(id: string): Promise<{
    startup: StartupDto;
    viabilityScore: number;
    innovationScore: number;
    recommendedFirstQuarterGoals: string[];
    riskAssessment: { technicalRisk: number; marketRisk: number; executionRisk: number };
    businessModelCanvas: {
      keyPartners: string[];
      keyActivities: string[];
      valuePropositions: string[];
      customerRelationships: string[];
      customerSegments: string[];
      costStructure: string[];
      revenueStreams: string[];
    };
  }> {
    const res = await apiClient.get(`/startup-builder/startups/${id}/blueprint`);
    return res.data.data;
  },

  async validateViability(id: string): Promise<{
    startupId: string;
    validationScore: number;
    isValidated: boolean;
    marketAttractivenessScore: number;
    technicalFeasibilityScore: number;
    defensibilityMoatRating: string;
    riskSummary: { riskLevel: string; primaryThreats: string[]; mitigations: string[] };
    recommendations: string[];
  }> {
    const res = await apiClient.get(`/startup-builder/startups/${id}/viability`);
    return res.data.data;
  },

  async advanceStage(id: string, targetStage: StartupStage): Promise<{
    startup: StartupDto;
    previousStage: StartupStage;
    currentStage: StartupStage;
    readinessValidation: { isEligible: boolean; criteriaMet: string[]; missingCriteria: string[] };
  }> {
    const res = await apiClient.post(`/startup-builder/startups/${id}/advance-stage`, { targetStage });
    return res.data.data;
  },

  async executePivot(id: string, data: {
    newProblemStatement?: string;
    newSolutionDescription?: string;
    newTargetMarket?: string;
    pivotRationale: string;
  }): Promise<{
    startup: StartupDto;
    pivotSummary: string;
    actionPlan: string[];
  }> {
    const res = await apiClient.post(`/startup-builder/startups/${id}/pivot`, data);
    return res.data.data;
  },

  // 2. Ideas
  async generateIdea(data: GenerateStartupIdeaDto): Promise<StartupIdeaDto> {
    const res = await apiClient.post('/startup-builder/ideas/generate', data);
    return res.data.data;
  },

  async listIdeas(category?: StartupCategory): Promise<StartupIdeaDto[]> {
    const res = await apiClient.get('/startup-builder/ideas', { params: { category } });
    return res.data.data;
  },

  // 3. Market Intelligence
  async generateMarketReport(data: GenerateMarketReportDto): Promise<MarketReportDto> {
    const res = await apiClient.post('/startup-builder/market/report', data);
    return res.data.data;
  },

  async listMarketReports(startupId?: string, sector?: StartupCategory): Promise<MarketReportDto[]> {
    const res = await apiClient.get('/startup-builder/market/reports', { params: { startupId, sector } });
    return res.data.data;
  },

  // 4. AI Founder
  async getFounderDecisionSupport(data: {
    startupId: string;
    decisionTitle: string;
    context: string;
    options: string[];
  }): Promise<AIFounderDecisionDto> {
    const res = await apiClient.post('/startup-builder/ai-founder/decision', data);
    return res.data.data;
  },

  async getStrategicPlan(startupId: string): Promise<StrategicPlanReportDto> {
    const res = await apiClient.get(`/startup-builder/ai-founder/${startupId}/strategic-plan`);
    return res.data.data;
  },

  // 5. Product Incubation
  async incubateProduct(data: CreateProductIncubationDto): Promise<ProductIncubationDto> {
    const res = await apiClient.post('/startup-builder/incubations', data);
    return res.data.data;
  },

  async listIncubations(startupId?: string): Promise<ProductIncubationDto[]> {
    const res = await apiClient.get('/startup-builder/incubations', { params: { startupId } });
    return res.data.data;
  },

  async getProductMarketFit(id: string): Promise<{
    incubationId: string;
    productMarketFitScore: number;
    pmfStatus: string;
    retentionEstimatePercent: number;
    seanEllisScorePercent: number;
    keyGrowthDrivers: string[];
    recommendedProductRefinements: string[];
  }> {
    const res = await apiClient.get(`/startup-builder/incubations/${id}/pmf`);
    return res.data.data;
  },

  // 6. Customer Discovery
  async generatePersona(startupId: string, personaType: CustomerPersonaType): Promise<CustomerPersonaDto> {
    const res = await apiClient.post('/startup-builder/customer-discovery/persona', { startupId, personaType });
    return res.data.data;
  },

  async getDiscoveryFeedback(startupId: string): Promise<CustomerValidationReportDto> {
    const res = await apiClient.get(`/startup-builder/customer-discovery/${startupId}/feedback`);
    return res.data.data;
  },

  // 7. Growth Engine
  async generateGrowthForecast(startupId: string, channel?: GrowthChannel): Promise<GrowthForecastDto> {
    const res = await apiClient.post('/startup-builder/growth/forecast', { startupId, channel });
    return res.data.data;
  },

  async getUnitEconomics(startupId: string): Promise<{
    startupId: string;
    cacUsd: number;
    ltvUsd: number;
    ltvCacRatio: number;
    paybackPeriodMonths: number;
    grossMarginPercent: number;
    viralCoefficient: number;
    healthAssessment: string;
    optimizationTactics: string[];
  }> {
    const res = await apiClient.get(`/startup-builder/growth/${startupId}/unit-economics`);
    return res.data.data;
  },

  // 8. Venture Portfolio
  async createPortfolio(data: {
    portfolioName: string;
    description?: string;
    initialStartupIds?: string[];
  }): Promise<VenturePortfolioDto> {
    const res = await apiClient.post('/startup-builder/portfolios', data);
    return res.data.data;
  },

  async listPortfolios(): Promise<VenturePortfolioDto[]> {
    const res = await apiClient.get('/startup-builder/portfolios');
    return res.data.data;
  },

  async getPortfolioHealth(id: string): Promise<{
    portfolio: VenturePortfolioDto;
    aggregateValuationUsd: number;
    healthTier: string;
    rankedVentures: Array<{ startupName: string; score: number; momentumStatus: string }>;
    capitalReallocationAdvice: string[];
  }> {
    const res = await apiClient.get(`/startup-builder/portfolios/${id}/health`);
    return res.data.data;
  },

  // 9. Fundraising
  async getFundraisingReadiness(startupId: string): Promise<{
    startupId: string;
    readinessScore: number;
    readinessTier: string;
    keyStrengths: string[];
    pitchHighlights: string[];
    recommendedRoundSizeUsd: number;
    recommendedValuationRangeUsd: { min: number; target: number; max: number };
  }> {
    const res = await apiClient.get(`/startup-builder/fundraising/${startupId}/readiness`);
    return res.data.data;
  },

  async getMatchedInvestors(startupId: string): Promise<{
    startupId: string;
    matchedInvestors: Array<InvestorProfileDto & { matchConfidencePercent: number; rationale: string }>;
  }> {
    const res = await apiClient.get(`/startup-builder/fundraising/${startupId}/match-investors`);
    return res.data.data;
  },

  async simulateFunding(data: {
    startupId: string;
    stage: StartupFundingStage;
    targetRaiseUsd: number;
    preMoneyValuationUsd: number;
  }): Promise<{
    stage: StartupFundingStage;
    targetRaiseUsd: number;
    preMoneyValuationUsd: number;
    postMoneyValuationUsd: number;
    investorEquityPercent: number;
    founderEquityPercent: number;
    projectedRunwayExtensionMonths: number;
    capTableSummary: Array<{ stakeholder: string; ownershipPercent: number; equityValueUsd: number }>;
  }> {
    const res = await apiClient.post('/startup-builder/fundraising/simulate', data);
    return res.data.data;
  },
};
