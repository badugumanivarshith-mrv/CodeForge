import {
  StartupDto,
  StartupIdeaDto,
  MarketReportDto,
  CustomerPersonaDto,
  ProductIncubationDto,
  VenturePortfolioDto,
  FundraisingRoundDto,
  InvestorProfileDto,
  GrowthForecastDto,
  StartupMetricsDto,
  StartupEventDto,
  StartupCommandCenterOverviewDto,
  StartupCategory,
  StartupStage,
  IncubationPhase,
} from '@codeforge/shared';

export interface IStartupBuilderRepository {
  // 1. Startups
  createStartup(data: Partial<StartupDto>): Promise<StartupDto>;
  getStartupById(id: string): Promise<StartupDto | null>;
  getStartupBySlug(slug: string): Promise<StartupDto | null>;
  listStartups(creatorUserId?: string, category?: StartupCategory, stage?: StartupStage): Promise<StartupDto[]>;
  updateStartup(id: string, updates: Partial<StartupDto>): Promise<StartupDto | null>;

  // 2. Startup Ideas
  createStartupIdea(data: Partial<StartupIdeaDto>): Promise<StartupIdeaDto>;
  getStartupIdeaById(id: string): Promise<StartupIdeaDto | null>;
  listStartupIdeas(creatorUserId?: string, category?: StartupCategory): Promise<StartupIdeaDto[]>;

  // 3. Market Reports
  createMarketReport(data: Partial<MarketReportDto>): Promise<MarketReportDto>;
  getMarketReportById(id: string): Promise<MarketReportDto | null>;
  listMarketReports(startupId?: string, sector?: StartupCategory): Promise<MarketReportDto[]>;

  // 4. Customer Personas
  createCustomerPersona(data: Partial<CustomerPersonaDto>): Promise<CustomerPersonaDto>;
  getCustomerPersonaById(id: string): Promise<CustomerPersonaDto | null>;
  listCustomerPersonas(startupId?: string): Promise<CustomerPersonaDto[]>;

  // 5. Product Incubations
  createProductIncubation(data: Partial<ProductIncubationDto>): Promise<ProductIncubationDto>;
  getProductIncubationById(id: string): Promise<ProductIncubationDto | null>;
  listProductIncubations(startupId?: string): Promise<ProductIncubationDto[]>;
  updateProductIncubationPhase(id: string, phase: IncubationPhase): Promise<ProductIncubationDto | null>;

  // 6. Venture Portfolios
  createVenturePortfolio(data: Partial<VenturePortfolioDto>): Promise<VenturePortfolioDto>;
  getVenturePortfolioById(id: string): Promise<VenturePortfolioDto | null>;
  listVenturePortfolios(creatorUserId?: string): Promise<VenturePortfolioDto[]>;
  updateVenturePortfolio(id: string, updates: Partial<VenturePortfolioDto>): Promise<VenturePortfolioDto | null>;

  // 7. Fundraising Rounds
  createFundraisingRound(data: Partial<FundraisingRoundDto>): Promise<FundraisingRoundDto>;
  getFundraisingRoundById(id: string): Promise<FundraisingRoundDto | null>;
  listFundraisingRounds(startupId?: string): Promise<FundraisingRoundDto[]>;
  updateFundraisingRound(id: string, updates: Partial<FundraisingRoundDto>): Promise<FundraisingRoundDto | null>;

  // 8. Investor Profiles
  createInvestorProfile(data: Partial<InvestorProfileDto>): Promise<InvestorProfileDto>;
  getInvestorProfileById(id: string): Promise<InvestorProfileDto | null>;
  listInvestorProfiles(category?: StartupCategory): Promise<InvestorProfileDto[]>;

  // 9. Growth Forecasts
  createGrowthForecast(data: Partial<GrowthForecastDto>): Promise<GrowthForecastDto>;
  getGrowthForecastById(id: string): Promise<GrowthForecastDto | null>;
  listGrowthForecasts(startupId?: string): Promise<GrowthForecastDto[]>;

  // 10. Startup Metrics & Events
  createStartupMetrics(data: Partial<StartupMetricsDto>): Promise<StartupMetricsDto>;
  listStartupMetrics(startupId?: string): Promise<StartupMetricsDto[]>;

  createStartupEvent(data: Partial<StartupEventDto>): Promise<StartupEventDto>;
  listStartupEvents(startupId?: string): Promise<StartupEventDto[]>;

  // 11. Command Center Dashboard
  getCommandCenterOverview(creatorUserId?: string): Promise<StartupCommandCenterOverviewDto>;
}
