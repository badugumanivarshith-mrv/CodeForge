import { randomUUID } from 'crypto';
import { db } from '../database/connection';
import * as schema from '../database/schema';
import { eq, desc } from 'drizzle-orm';
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
  MarketRiskLevel,
  IncubationPhase,
  CustomerPersonaType,
  GrowthChannel,
  VentureHealthStatus,
  StartupFundingStage,
  InvestorType,
  StartupEventType,
} from '@codeforge/shared';
import { IStartupBuilderRepository } from './interfaces/IStartupBuilderRepository';

export class StartupBuilderRepository implements IStartupBuilderRepository {
  // In-memory fallback stores
  private memStartups = new Map<string, StartupDto>();
  private memStartupIdeas = new Map<string, StartupIdeaDto>();
  private memMarketReports = new Map<string, MarketReportDto>();
  private memCustomerPersonas = new Map<string, CustomerPersonaDto>();
  private memProductIncubations = new Map<string, ProductIncubationDto>();
  private memVenturePortfolios = new Map<string, VenturePortfolioDto>();
  private memFundraisingRounds = new Map<string, FundraisingRoundDto>();
  private memInvestorProfiles = new Map<string, InvestorProfileDto>();
  private memGrowthForecasts = new Map<string, GrowthForecastDto>();
  private memStartupMetrics = new Map<string, StartupMetricsDto>();
  private memStartupEvents = new Map<string, StartupEventDto>();

  constructor() {
    this.seedDefaultStartupEcosystem();
  }

  private seedDefaultStartupEcosystem() {
    const startupId = 'startup-seed-1';
    const creatorUserId = '00000000-0000-0000-0000-000000000001';

    const defaultStartup: StartupDto = {
      id: startupId,
      creatorUserId,
      name: 'AgentForge Studio',
      slug: 'agentforge-studio',
      tagline: 'Autonomous AI engineer swarms for mission-critical software verification',
      category: StartupCategory.AI_DEVTOOLS,
      stage: StartupStage.MVP,
      problemStatement: 'Modern software engineering teams face immense cognitive load in compiler verification and security testing.',
      solutionDescription: 'Autonomous multi-agent swarms executing continuous formal dialectic synthesis and AST fuzzing.',
      targetMarket: 'Enterprise engineering leaders, DevSecOps teams, and high-growth developer organizations.',
      viabilityScore: 94.5,
      innovationScore: 97.2,
      readinessScore: 91.0,
      businessPlanSummary: 'Developer-led bottom-up adoption converting to $100k+ annual enterprise platform tiers with 88% gross margins.',
      currentFundingStage: StartupFundingStage.SEED,
      totalRaisedUsd: 1500000,
      valuationUsd: 12000000,
      monthlyBurnRateUsd: 45000,
      runwayMonths: 24,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memStartups.set(startupId, defaultStartup);

    const ideaId = 'idea-seed-1';
    const defaultIdea: StartupIdeaDto = {
      id: ideaId,
      creatorUserId,
      title: 'Zero-Latency Formal Verifier for Distributed Smart Systems',
      category: StartupCategory.AUTONOMOUS_AGENTS,
      problemStatement: 'Decentralized distributed agents require formal mathematical guarantees against state divergence.',
      proposedSolution: 'Continuous zero-knowledge micro-proof engine embedded in compiler toolchains.',
      marketOpportunity: '$42B Total Addressable Market across decentralized cloud and enterprise microservices.',
      differentiationMoat: 'Proprietary speculative invariant dialectic model with sub-10ms proof latency.',
      viabilityScore: 93.0,
      marketSizeEstimate: '$42B+ TAM',
      competitors: ['Legacy AST Linters', 'Static Security Scanners'],
      suggestedMonetization: ['Per-seat developer subscription', 'Tiered API execution consumption', 'Private enterprise enclave license'],
      createdAt: new Date().toISOString(),
    };
    this.memStartupIdeas.set(ideaId, defaultIdea);

    const marketReportId = 'market-report-seed-1';
    const defaultMarketReport: MarketReportDto = {
      id: marketReportId,
      startupId,
      sector: StartupCategory.AI_DEVTOOLS,
      tamUsd: 65000000000,
      samUsd: 14000000000,
      somUsd: 2800000000,
      cagrPercent: 28.4,
      marketTrends: [
        'Explosion of generative and agentic code synthesis',
        'Shift from manual code reviews to autonomous formal verification',
        'Stringent compliance and supply-chain security mandates',
      ],
      competitiveLandscape: [
        {
          competitorName: 'Legacy Code Analysis Co',
          marketSharePercent: 34.0,
          strengths: ['Brand awareness', 'Broad language support'],
          weaknesses: ['High false positive rates', 'Slow batch processing'],
        },
        {
          competitorName: 'Modern DevScan AI',
          marketSharePercent: 18.5,
          strengths: ['Fast UI', 'Good IDE integration'],
          weaknesses: ['Lacks formal mathematical proof guarantees', 'High inference costs'],
        },
      ],
      opportunityGaps: [
        'Real-time compiler-embedded proof generation',
        'Zero-knowledge telemetry verification for air-gapped corporate clouds',
      ],
      riskLevel: MarketRiskLevel.MODERATE,
      confidenceScore: 92.5,
      createdAt: new Date().toISOString(),
    };
    this.memMarketReports.set(marketReportId, defaultMarketReport);

    const personaId = 'persona-seed-1';
    const defaultPersona: CustomerPersonaDto = {
      id: personaId,
      startupId,
      personaType: CustomerPersonaType.ENTERPRISE_ARCHITECT,
      title: 'Principal Systems Architect (Fortune 500)',
      demographics: {
        roleTitle: 'VP of Platform Architecture',
        companySize: '1,000 - 10,000 employees',
        budgetAuthorityUsd: 500000,
      },
      painPoints: [
        'Security regressions slipping through CI/CD pipelines',
        'Excessive developer time spent triaging noisy linter alerts',
        'Difficulty verifying autonomous AI code output',
      ],
      buyingMotivations: [
        '100% mathematical certainty on critical infrastructure changes',
        'Accelerating release velocity without lowering security guardrails',
      ],
      willingnessToPayMonthlyUsd: 1500,
      userJourneyStages: [
        {
          stage: 'Discovery',
          touchpoint: 'Open-source CLI tool and GitHub Action',
          frictionPoint: 'Configuring enterprise SSO and RBAC',
          delightMoment: 'Instant 0xzk proof badge generated on pull request',
        },
        {
          stage: 'Expansion',
          touchpoint: 'Organization-wide dashboard',
          frictionPoint: 'Budget allocation across disparate business units',
          delightMoment: '90% drop in production incidents within first quarter',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.memCustomerPersonas.set(personaId, defaultPersona);

    const incubationId = 'incubation-seed-1';
    const defaultIncubation: ProductIncubationDto = {
      id: incubationId,
      startupId,
      productName: 'AgentForge Core Verifier',
      phase: IncubationPhase.MVP,
      conceptSummary: 'Autonomous compiler plugin generating zero-knowledge verified test invariants in real time.',
      mvpFeatureSet: [
        { featureName: 'AST Dialectic Parser', priority: 'must_have', complexity: 'medium', status: 'COMPLETED' },
        { featureName: 'Distributed ZK Proof Pipeline', priority: 'must_have', complexity: 'high', status: 'IN_PROGRESS' },
        { featureName: 'IDE Live Preview & Diagnostic Mesh', priority: 'should_have', complexity: 'low', status: 'COMPLETED' },
      ],
      validationMetrics: {
        userInterviewsConducted: 42,
        prototypeTestCount: 185,
        earlyAccessSignups: 1450,
      },
      productMarketFitScore: 88.5,
      retentionEstimatePercent: 91.2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memProductIncubations.set(incubationId, defaultIncubation);

    const portfolioId = 'portfolio-seed-1';
    const defaultPortfolio: VenturePortfolioDto = {
      id: portfolioId,
      creatorUserId,
      portfolioName: 'Alpha Horizon Autonomous Ventures I',
      description: 'Seed-stage venture fund focused on next-generation AI infrastructure and autonomous agents.',
      totalVentureCount: 1,
      aggregateValuationUsd: 12000000,
      totalCapitalDeployedUsd: 1500000,
      overallHealthScore: 94.0,
      ventures: [
        {
          startupId,
          startupName: 'AgentForge Studio',
          stage: StartupStage.MVP,
          healthStatus: VentureHealthStatus.THRIVING,
          valuationUsd: 12000000,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memVenturePortfolios.set(portfolioId, defaultPortfolio);

    const roundId = 'round-seed-1';
    const defaultRound: FundraisingRoundDto = {
      id: roundId,
      startupId,
      roundName: 'Seed Round',
      stage: StartupFundingStage.SEED,
      targetRaiseUsd: 2000000,
      committedUsd: 1500000,
      preMoneyValuationUsd: 10000000,
      postMoneyValuationUsd: 12000000,
      pitchDeckUrl: 'https://cdn.codeforge.io/decks/agentforge-seed.pdf',
      readinessScore: 93.0,
      isClosed: false,
      createdAt: new Date().toISOString(),
    };
    this.memFundraisingRounds.set(roundId, defaultRound);

    const investorId = 'investor-seed-1';
    const defaultInvestor: InvestorProfileDto = {
      id: investorId,
      investorName: 'Horizon Sovereign AI Ventures',
      investorType: InvestorType.VENTURE_CAPITAL,
      investmentThesis: 'Backing category-defining autonomous developer tooling and cognitive infrastructure.',
      sweetSpotCheckSizeUsd: 1500000,
      preferredStages: [StartupFundingStage.SEED, StartupFundingStage.SERIES_A],
      preferredCategories: [StartupCategory.AI_DEVTOOLS, StartupCategory.AUTONOMOUS_AGENTS],
      portfolioCompanyCount: 28,
      matchScore: 96.5,
    };
    this.memInvestorProfiles.set(investorId, defaultInvestor);

    const growthId = 'growth-seed-1';
    const defaultGrowth: GrowthForecastDto = {
      id: growthId,
      startupId,
      primaryChannel: GrowthChannel.PRODUCT_LED,
      monthlyActiveUsersForecast: [
        { month: 1, mau: 500 },
        { month: 3, mau: 2200 },
        { month: 6, mau: 8500 },
        { month: 12, mau: 35000 },
      ],
      customerAcquisitionCostUsd: 38.0,
      customerLifetimeValueUsd: 1450.0,
      ltvCacRatio: 38.1,
      monthlyChurnPercent: 1.2,
      monthlyRevenueForecastUsd: [
        { month: 1, mrr: 8500 },
        { month: 3, mrr: 32000 },
        { month: 6, mrr: 115000 },
        { month: 12, mrr: 480000 },
      ],
      viralCoefficient: 1.65,
      overallGrowthScore: 95.0,
      createdAt: new Date().toISOString(),
    };
    this.memGrowthForecasts.set(growthId, defaultGrowth);

    const metricsId = 'metrics-seed-1';
    const defaultMetrics: StartupMetricsDto = {
      id: metricsId,
      startupId,
      mrrUsd: 35000,
      arrUsd: 420000,
      burnRateMonthlyUsd: 45000,
      runwayMonths: 24,
      activeUsers: 3400,
      churnRatePercent: 1.1,
      healthStatus: VentureHealthStatus.THRIVING,
      recordedAt: new Date().toISOString(),
    };
    this.memStartupMetrics.set(metricsId, defaultMetrics);

    const eventId = 'event-seed-1';
    const defaultEvent: StartupEventDto = {
      id: eventId,
      startupId,
      eventType: StartupEventType.PMF_ACHIEVED,
      title: 'Early Product-Market Fit Milestones Achieved',
      description: 'Organic developer adoption reached 3,000+ weekly active engineers with 91% cohort retention.',
      metadata: { retentionRate: 0.91, activeTeams: 120 },
      createdAt: new Date().toISOString(),
    };
    this.memStartupEvents.set(eventId, defaultEvent);
  }

  // 1. Startups
  async createStartup(data: Partial<StartupDto>): Promise<StartupDto> {
    const id = data.id || randomUUID();
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `startup-${Date.now()}`);
    const now = new Date().toISOString();

    const record: StartupDto = {
      id,
      creatorUserId: data.creatorUserId || '00000000-0000-0000-0000-000000000001',
      name: data.name || 'Autonomous Startup Venture',
      slug,
      tagline: data.tagline || 'Autonomous AI venture built on CodeForge',
      category: data.category || StartupCategory.AI_DEVTOOLS,
      stage: data.stage || StartupStage.IDEATION,
      problemStatement: data.problemStatement || 'Automating mission-critical engineering workflows.',
      solutionDescription: data.solutionDescription || 'Autonomous AI agent execution engine.',
      targetMarket: data.targetMarket || 'Global enterprise developers and startups.',
      viabilityScore: data.viabilityScore ?? 88.0,
      innovationScore: data.innovationScore ?? 92.0,
      readinessScore: data.readinessScore ?? 85.0,
      businessPlanSummary: data.businessPlanSummary || 'SaaS subscription with consumption pricing.',
      currentFundingStage: data.currentFundingStage || StartupFundingStage.PRE_SEED,
      totalRaisedUsd: data.totalRaisedUsd ?? 0,
      valuationUsd: data.valuationUsd ?? 2500000,
      monthlyBurnRateUsd: data.monthlyBurnRateUsd ?? 15000,
      runwayMonths: data.runwayMonths ?? 18,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      try {
        await db.insert(schema.startups).values({
          id: record.id,
          creatorUserId: record.creatorUserId,
          name: record.name,
          slug: record.slug,
          tagline: record.tagline,
          category: record.category,
          stage: record.stage,
          problemStatement: record.problemStatement,
          solutionDescription: record.solutionDescription,
          targetMarket: record.targetMarket,
          viabilityScore: record.viabilityScore,
          innovationScore: record.innovationScore,
          readinessScore: record.readinessScore,
          businessPlanSummary: record.businessPlanSummary,
          currentFundingStage: record.currentFundingStage,
          totalRaisedUsd: record.totalRaisedUsd,
          valuationUsd: record.valuationUsd,
          monthlyBurnRateUsd: record.monthlyBurnRateUsd,
          runwayMonths: record.runwayMonths,
          metadata: {},
        });
      } catch (err) {
        // Fallback to memory store
      }
    }

    this.memStartups.set(id, record);
    return record;
  }

  async getStartupById(id: string): Promise<StartupDto | null> {
    if (db) {
      try {
        const rows = await db.select().from(schema.startups).where(eq(schema.startups.id, id));
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            creatorUserId: r.creatorUserId,
            name: r.name,
            slug: r.slug,
            tagline: r.tagline,
            category: r.category as StartupCategory,
            stage: r.stage as StartupStage,
            problemStatement: r.problemStatement,
            solutionDescription: r.solutionDescription,
            targetMarket: r.targetMarket,
            viabilityScore: r.viabilityScore,
            innovationScore: r.innovationScore,
            readinessScore: r.readinessScore,
            businessPlanSummary: r.businessPlanSummary,
            currentFundingStage: r.currentFundingStage as StartupFundingStage,
            totalRaisedUsd: r.totalRaisedUsd,
            valuationUsd: r.valuationUsd,
            monthlyBurnRateUsd: r.monthlyBurnRateUsd,
            runwayMonths: r.runwayMonths,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        // fallback
      }
    }
    return this.memStartups.get(id) || null;
  }

  async getStartupBySlug(slug: string): Promise<StartupDto | null> {
    if (db) {
      try {
        const rows = await db.select().from(schema.startups).where(eq(schema.startups.slug, slug));
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            creatorUserId: r.creatorUserId,
            name: r.name,
            slug: r.slug,
            tagline: r.tagline,
            category: r.category as StartupCategory,
            stage: r.stage as StartupStage,
            problemStatement: r.problemStatement,
            solutionDescription: r.solutionDescription,
            targetMarket: r.targetMarket,
            viabilityScore: r.viabilityScore,
            innovationScore: r.innovationScore,
            readinessScore: r.readinessScore,
            businessPlanSummary: r.businessPlanSummary,
            currentFundingStage: r.currentFundingStage as StartupFundingStage,
            totalRaisedUsd: r.totalRaisedUsd,
            valuationUsd: r.valuationUsd,
            monthlyBurnRateUsd: r.monthlyBurnRateUsd,
            runwayMonths: r.runwayMonths,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        // fallback
      }
    }
    for (const s of this.memStartups.values()) {
      if (s.slug === slug) return s;
    }
    return null;
  }

  async listStartups(creatorUserId?: string, category?: StartupCategory, stage?: StartupStage): Promise<StartupDto[]> {
    if (db) {
      try {
        const rows = await db.select().from(schema.startups).orderBy(desc(schema.startups.createdAt));
        let results = rows.map((r) => ({
          id: r.id,
          creatorUserId: r.creatorUserId,
          name: r.name,
          slug: r.slug,
          tagline: r.tagline,
          category: r.category as StartupCategory,
          stage: r.stage as StartupStage,
          problemStatement: r.problemStatement,
          solutionDescription: r.solutionDescription,
          targetMarket: r.targetMarket,
          viabilityScore: r.viabilityScore,
          innovationScore: r.innovationScore,
          readinessScore: r.readinessScore,
          businessPlanSummary: r.businessPlanSummary,
          currentFundingStage: r.currentFundingStage as StartupFundingStage,
          totalRaisedUsd: r.totalRaisedUsd,
          valuationUsd: r.valuationUsd,
          monthlyBurnRateUsd: r.monthlyBurnRateUsd,
          runwayMonths: r.runwayMonths,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
        if (creatorUserId) results = results.filter((s) => s.creatorUserId === creatorUserId);
        if (category) results = results.filter((s) => s.category === category);
        if (stage) results = results.filter((s) => s.stage === stage);
        if (results.length > 0) return results;
      } catch (err) {
        // fallback
      }
    }
    let list = Array.from(this.memStartups.values());
    if (creatorUserId) list = list.filter((s) => s.creatorUserId === creatorUserId);
    if (category) list = list.filter((s) => s.category === category);
    if (stage) list = list.filter((s) => s.stage === stage);
    return list;
  }

  async updateStartup(id: string, updates: Partial<StartupDto>): Promise<StartupDto | null> {
    const existing = await this.getStartupById(id);
    if (!existing) return null;

    const updated: StartupDto = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      try {
        const { createdAt, updatedAt, ...cleanUpdates } = updates;
        await db.update(schema.startups).set({
          ...cleanUpdates,
          updatedAt: new Date(),
        } as any).where(eq(schema.startups.id, id));
      } catch (err) {
        // fallback
      }
    }

    this.memStartups.set(id, updated);
    return updated;
  }

  // 2. Startup Ideas
  async createStartupIdea(data: Partial<StartupIdeaDto>): Promise<StartupIdeaDto> {
    const id = data.id || randomUUID();
    const record: StartupIdeaDto = {
      id,
      creatorUserId: data.creatorUserId,
      title: data.title || 'Innovative AI Idea',
      category: data.category || StartupCategory.AI_DEVTOOLS,
      problemStatement: data.problemStatement || 'Automating critical engineering bottlenecks.',
      proposedSolution: data.proposedSolution || 'Autonomous agent workflows.',
      marketOpportunity: data.marketOpportunity || '$10B+ TAM opportunity.',
      differentiationMoat: data.differentiationMoat || 'Proprietary formal synthesis engine.',
      viabilityScore: data.viabilityScore ?? 87.0,
      marketSizeEstimate: data.marketSizeEstimate || '$10B+ TAM',
      competitors: data.competitors || ['Competitor A', 'Competitor B'],
      suggestedMonetization: data.suggestedMonetization || ['SaaS subscription', 'Usage fees'],
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.startupIdeas).values({
          id: record.id,
          creatorUserId: record.creatorUserId,
          title: record.title,
          category: record.category,
          problemStatement: record.problemStatement,
          proposedSolution: record.proposedSolution,
          marketOpportunity: record.marketOpportunity,
          differentiationMoat: record.differentiationMoat,
          viabilityScore: record.viabilityScore,
          marketSizeEstimate: record.marketSizeEstimate,
          competitors: record.competitors,
          suggestedMonetization: record.suggestedMonetization,
          metadata: {},
        });
      } catch (err) {
        // fallback
      }
    }

    this.memStartupIdeas.set(id, record);
    return record;
  }

  async getStartupIdeaById(id: string): Promise<StartupIdeaDto | null> {
    return this.memStartupIdeas.get(id) || null;
  }

  async listStartupIdeas(creatorUserId?: string, category?: StartupCategory): Promise<StartupIdeaDto[]> {
    let list = Array.from(this.memStartupIdeas.values());
    if (creatorUserId) list = list.filter((i) => i.creatorUserId === creatorUserId);
    if (category) list = list.filter((i) => i.category === category);
    return list;
  }

  // 3. Market Reports
  async createMarketReport(data: Partial<MarketReportDto>): Promise<MarketReportDto> {
    const id = data.id || randomUUID();
    const record: MarketReportDto = {
      id,
      startupId: data.startupId,
      sector: data.sector || StartupCategory.AI_DEVTOOLS,
      tamUsd: data.tamUsd ?? 50000000000,
      samUsd: data.samUsd ?? 12000000000,
      somUsd: data.somUsd ?? 2500000000,
      cagrPercent: data.cagrPercent ?? 24.5,
      marketTrends: data.marketTrends || ['Accelerating agent adoption', 'Shift toward real-time validation'],
      competitiveLandscape: data.competitiveLandscape || [],
      opportunityGaps: data.opportunityGaps || ['Autonomous verification', 'Continuous safety guardrails'],
      riskLevel: data.riskLevel || MarketRiskLevel.MODERATE,
      confidenceScore: data.confidenceScore ?? 89.0,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.marketReports).values({
          id: record.id,
          startupId: record.startupId,
          sector: record.sector,
          tamUsd: record.tamUsd,
          samUsd: record.samUsd,
          somUsd: record.somUsd,
          cagrPercent: record.cagrPercent,
          marketTrends: record.marketTrends,
          competitiveLandscape: record.competitiveLandscape,
          opportunityGaps: record.opportunityGaps,
          riskLevel: record.riskLevel,
          confidenceScore: record.confidenceScore,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memMarketReports.set(id, record);
    return record;
  }

  async getMarketReportById(id: string): Promise<MarketReportDto | null> {
    return this.memMarketReports.get(id) || null;
  }

  async listMarketReports(startupId?: string, sector?: StartupCategory): Promise<MarketReportDto[]> {
    let list = Array.from(this.memMarketReports.values());
    if (startupId) list = list.filter((r) => r.startupId === startupId);
    if (sector) list = list.filter((r) => r.sector === sector);
    return list;
  }

  // 4. Customer Personas
  async createCustomerPersona(data: Partial<CustomerPersonaDto>): Promise<CustomerPersonaDto> {
    const id = data.id || randomUUID();
    const record: CustomerPersonaDto = {
      id,
      startupId: data.startupId,
      personaType: data.personaType || CustomerPersonaType.STARTUP_CTO,
      title: data.title || 'Technical Co-founder & CTO',
      demographics: data.demographics || {
        roleTitle: 'Chief Technology Officer',
        companySize: '10 - 200 employees',
        budgetAuthorityUsd: 100000,
      },
      painPoints: data.painPoints || ['Engineering velocity bottlenecks', 'High infrastructure complexity'],
      buyingMotivations: data.buyingMotivations || ['Automated developer productivity', 'Scalable architecture'],
      willingnessToPayMonthlyUsd: data.willingnessToPayMonthlyUsd ?? 500,
      userJourneyStages: data.userJourneyStages || [],
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.customerPersonas).values({
          id: record.id,
          startupId: record.startupId,
          personaType: record.personaType,
          title: record.title,
          demographics: record.demographics,
          painPoints: record.painPoints,
          buyingMotivations: record.buyingMotivations,
          willingnessToPayMonthlyUsd: record.willingnessToPayMonthlyUsd,
          userJourneyStages: record.userJourneyStages,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memCustomerPersonas.set(id, record);
    return record;
  }

  async getCustomerPersonaById(id: string): Promise<CustomerPersonaDto | null> {
    return this.memCustomerPersonas.get(id) || null;
  }

  async listCustomerPersonas(startupId?: string): Promise<CustomerPersonaDto[]> {
    let list = Array.from(this.memCustomerPersonas.values());
    if (startupId) list = list.filter((p) => p.startupId === startupId);
    return list;
  }

  // 5. Product Incubations
  async createProductIncubation(data: Partial<ProductIncubationDto>): Promise<ProductIncubationDto> {
    const id = data.id || randomUUID();
    const now = new Date().toISOString();
    const record: ProductIncubationDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      productName: data.productName || 'Incubated Product Module',
      phase: data.phase || IncubationPhase.IDEA,
      conceptSummary: data.conceptSummary || 'Autonomous product core concept.',
      mvpFeatureSet: data.mvpFeatureSet || [],
      validationMetrics: data.validationMetrics || {
        userInterviewsConducted: 10,
        prototypeTestCount: 25,
        earlyAccessSignups: 150,
      },
      productMarketFitScore: data.productMarketFitScore ?? 80.0,
      retentionEstimatePercent: data.retentionEstimatePercent ?? 85.0,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      try {
        await db.insert(schema.productIncubations).values({
          id: record.id,
          startupId: record.startupId,
          productName: record.productName,
          phase: record.phase,
          conceptSummary: record.conceptSummary,
          mvpFeatureSet: record.mvpFeatureSet,
          validationMetrics: record.validationMetrics,
          productMarketFitScore: record.productMarketFitScore,
          retentionEstimatePercent: record.retentionEstimatePercent,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memProductIncubations.set(id, record);
    return record;
  }

  async getProductIncubationById(id: string): Promise<ProductIncubationDto | null> {
    return this.memProductIncubations.get(id) || null;
  }

  async listProductIncubations(startupId?: string): Promise<ProductIncubationDto[]> {
    let list = Array.from(this.memProductIncubations.values());
    if (startupId) list = list.filter((p) => p.startupId === startupId);
    return list;
  }

  async updateProductIncubationPhase(id: string, phase: IncubationPhase): Promise<ProductIncubationDto | null> {
    const existing = this.memProductIncubations.get(id);
    if (!existing) return null;
    const updated: ProductIncubationDto = {
      ...existing,
      phase,
      updatedAt: new Date().toISOString(),
    };
    this.memProductIncubations.set(id, updated);
    return updated;
  }

  // 6. Venture Portfolios
  async createVenturePortfolio(data: Partial<VenturePortfolioDto>): Promise<VenturePortfolioDto> {
    const id = data.id || randomUUID();
    const now = new Date().toISOString();
    const record: VenturePortfolioDto = {
      id,
      creatorUserId: data.creatorUserId || '00000000-0000-0000-0000-000000000001',
      portfolioName: data.portfolioName || 'Venture Portfolio',
      description: data.description || 'Autonomous startup portfolio',
      totalVentureCount: data.totalVentureCount ?? 0,
      aggregateValuationUsd: data.aggregateValuationUsd ?? 0,
      totalCapitalDeployedUsd: data.totalCapitalDeployedUsd ?? 0,
      overallHealthScore: data.overallHealthScore ?? 90.0,
      ventures: data.ventures || [],
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      try {
        await db.insert(schema.venturePortfolios).values({
          id: record.id,
          creatorUserId: record.creatorUserId,
          portfolioName: record.portfolioName,
          description: record.description,
          totalVentureCount: record.totalVentureCount,
          aggregateValuationUsd: record.aggregateValuationUsd,
          totalCapitalDeployedUsd: record.totalCapitalDeployedUsd,
          overallHealthScore: record.overallHealthScore,
          ventures: record.ventures,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memVenturePortfolios.set(id, record);
    return record;
  }

  async getVenturePortfolioById(id: string): Promise<VenturePortfolioDto | null> {
    return this.memVenturePortfolios.get(id) || null;
  }

  async listVenturePortfolios(creatorUserId?: string): Promise<VenturePortfolioDto[]> {
    let list = Array.from(this.memVenturePortfolios.values());
    if (creatorUserId) list = list.filter((p) => p.creatorUserId === creatorUserId);
    return list;
  }

  async updateVenturePortfolio(id: string, updates: Partial<VenturePortfolioDto>): Promise<VenturePortfolioDto | null> {
    const existing = this.memVenturePortfolios.get(id);
    if (!existing) return null;
    const updated: VenturePortfolioDto = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.memVenturePortfolios.set(id, updated);
    return updated;
  }

  // 7. Fundraising Rounds
  async createFundraisingRound(data: Partial<FundraisingRoundDto>): Promise<FundraisingRoundDto> {
    const id = data.id || randomUUID();
    const record: FundraisingRoundDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      roundName: data.roundName || 'Seed Round',
      stage: data.stage || StartupFundingStage.SEED,
      targetRaiseUsd: data.targetRaiseUsd ?? 1000000,
      committedUsd: data.committedUsd ?? 0,
      preMoneyValuationUsd: data.preMoneyValuationUsd ?? 8000000,
      postMoneyValuationUsd: data.postMoneyValuationUsd ?? (data.preMoneyValuationUsd ?? 8000000) + (data.targetRaiseUsd ?? 1000000),
      leadInvestorId: data.leadInvestorId,
      pitchDeckUrl: data.pitchDeckUrl || 'https://cdn.codeforge.io/decks/default-deck.pdf',
      readinessScore: data.readinessScore ?? 88.0,
      isClosed: data.isClosed ?? false,
      createdAt: new Date().toISOString(),
      closedAt: data.closedAt,
    };

    if (db) {
      try {
        await db.insert(schema.fundraisingRounds).values({
          id: record.id,
          startupId: record.startupId,
          roundName: record.roundName,
          stage: record.stage,
          targetRaiseUsd: record.targetRaiseUsd,
          committedUsd: record.committedUsd,
          preMoneyValuationUsd: record.preMoneyValuationUsd,
          postMoneyValuationUsd: record.postMoneyValuationUsd,
          leadInvestorId: record.leadInvestorId,
          pitchDeckUrl: record.pitchDeckUrl,
          readinessScore: record.readinessScore,
          isClosed: record.isClosed,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memFundraisingRounds.set(id, record);
    return record;
  }

  async getFundraisingRoundById(id: string): Promise<FundraisingRoundDto | null> {
    return this.memFundraisingRounds.get(id) || null;
  }

  async listFundraisingRounds(startupId?: string): Promise<FundraisingRoundDto[]> {
    let list = Array.from(this.memFundraisingRounds.values());
    if (startupId) list = list.filter((r) => r.startupId === startupId);
    return list;
  }

  async updateFundraisingRound(id: string, updates: Partial<FundraisingRoundDto>): Promise<FundraisingRoundDto | null> {
    const existing = this.memFundraisingRounds.get(id);
    if (!existing) return null;
    const updated: FundraisingRoundDto = {
      ...existing,
      ...updates,
    };
    this.memFundraisingRounds.set(id, updated);
    return updated;
  }

  // 8. Investor Profiles
  async createInvestorProfile(data: Partial<InvestorProfileDto>): Promise<InvestorProfileDto> {
    const id = data.id || randomUUID();
    const record: InvestorProfileDto = {
      id,
      investorName: data.investorName || 'Venture Partner Entity',
      investorType: data.investorType || InvestorType.VENTURE_CAPITAL,
      investmentThesis: data.investmentThesis || 'Investing in transformative developer tools and AI infrastructure.',
      sweetSpotCheckSizeUsd: data.sweetSpotCheckSizeUsd ?? 500000,
      preferredStages: data.preferredStages || [StartupFundingStage.SEED, StartupFundingStage.SERIES_A],
      preferredCategories: data.preferredCategories || [StartupCategory.AI_DEVTOOLS],
      portfolioCompanyCount: data.portfolioCompanyCount ?? 15,
      matchScore: data.matchScore ?? 90.0,
    };

    if (db) {
      try {
        await db.insert(schema.investorProfiles).values({
          id: record.id,
          investorName: record.investorName,
          investorType: record.investorType,
          investmentThesis: record.investmentThesis,
          sweetSpotCheckSizeUsd: record.sweetSpotCheckSizeUsd,
          preferredStages: record.preferredStages,
          preferredCategories: record.preferredCategories,
          portfolioCompanyCount: record.portfolioCompanyCount,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memInvestorProfiles.set(id, record);
    return record;
  }

  async getInvestorProfileById(id: string): Promise<InvestorProfileDto | null> {
    return this.memInvestorProfiles.get(id) || null;
  }

  async listInvestorProfiles(category?: StartupCategory): Promise<InvestorProfileDto[]> {
    let list = Array.from(this.memInvestorProfiles.values());
    if (category) {
      list = list.filter((p) => p.preferredCategories.includes(category));
    }
    return list;
  }

  // 9. Growth Forecasts
  async createGrowthForecast(data: Partial<GrowthForecastDto>): Promise<GrowthForecastDto> {
    const id = data.id || randomUUID();
    const record: GrowthForecastDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      primaryChannel: data.primaryChannel || GrowthChannel.PRODUCT_LED,
      monthlyActiveUsersForecast: data.monthlyActiveUsersForecast || [],
      customerAcquisitionCostUsd: data.customerAcquisitionCostUsd ?? 40.0,
      customerLifetimeValueUsd: data.customerLifetimeValueUsd ?? 1200.0,
      ltvCacRatio: data.ltvCacRatio ?? 30.0,
      monthlyChurnPercent: data.monthlyChurnPercent ?? 1.5,
      monthlyRevenueForecastUsd: data.monthlyRevenueForecastUsd || [],
      viralCoefficient: data.viralCoefficient ?? 1.4,
      overallGrowthScore: data.overallGrowthScore ?? 91.0,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.growthForecasts).values({
          id: record.id,
          startupId: record.startupId,
          primaryChannel: record.primaryChannel,
          monthlyActiveUsersForecast: record.monthlyActiveUsersForecast,
          customerAcquisitionCostUsd: record.customerAcquisitionCostUsd,
          customerLifetimeValueUsd: record.customerLifetimeValueUsd,
          ltvCacRatio: record.ltvCacRatio,
          monthlyChurnPercent: record.monthlyChurnPercent,
          monthlyRevenueForecastUsd: record.monthlyRevenueForecastUsd,
          viralCoefficient: record.viralCoefficient,
          overallGrowthScore: record.overallGrowthScore,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memGrowthForecasts.set(id, record);
    return record;
  }

  async getGrowthForecastById(id: string): Promise<GrowthForecastDto | null> {
    return this.memGrowthForecasts.get(id) || null;
  }

  async listGrowthForecasts(startupId?: string): Promise<GrowthForecastDto[]> {
    let list = Array.from(this.memGrowthForecasts.values());
    if (startupId) list = list.filter((g) => g.startupId === startupId);
    return list;
  }

  // 10. Startup Metrics & Events
  async createStartupMetrics(data: Partial<StartupMetricsDto>): Promise<StartupMetricsDto> {
    const id = data.id || randomUUID();
    const record: StartupMetricsDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      mrrUsd: data.mrrUsd ?? 10000,
      arrUsd: data.arrUsd ?? (data.mrrUsd ? data.mrrUsd * 12 : 120000),
      burnRateMonthlyUsd: data.burnRateMonthlyUsd ?? 20000,
      runwayMonths: data.runwayMonths ?? 18,
      activeUsers: data.activeUsers ?? 500,
      churnRatePercent: data.churnRatePercent ?? 1.5,
      healthStatus: data.healthStatus || VentureHealthStatus.THRIVING,
      recordedAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.startupMetrics).values({
          id: record.id,
          startupId: record.startupId,
          mrrUsd: record.mrrUsd,
          arrUsd: record.arrUsd,
          burnRateMonthlyUsd: record.burnRateMonthlyUsd,
          runwayMonths: record.runwayMonths,
          activeUsers: record.activeUsers,
          churnRatePercent: record.churnRatePercent,
          healthStatus: record.healthStatus,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memStartupMetrics.set(id, record);
    return record;
  }

  async listStartupMetrics(startupId?: string): Promise<StartupMetricsDto[]> {
    let list = Array.from(this.memStartupMetrics.values());
    if (startupId) list = list.filter((m) => m.startupId === startupId);
    return list;
  }

  async createStartupEvent(data: Partial<StartupEventDto>): Promise<StartupEventDto> {
    const id = data.id || randomUUID();
    const record: StartupEventDto = {
      id,
      startupId: data.startupId || 'startup-seed-1',
      eventType: data.eventType || StartupEventType.IDEA_CREATED,
      title: data.title || 'Startup Milestone Event',
      description: data.description || 'Milestone achieved by autonomous venture.',
      metadata: data.metadata || {},
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.startupEvents).values({
          id: record.id,
          startupId: record.startupId,
          eventType: record.eventType,
          title: record.title,
          description: record.description,
          metadata: record.metadata,
        });
      } catch (err) {
        // fallback
      }
    }

    this.memStartupEvents.set(id, record);
    return record;
  }

  async listStartupEvents(startupId?: string): Promise<StartupEventDto[]> {
    let list = Array.from(this.memStartupEvents.values());
    if (startupId) list = list.filter((e) => e.startupId === startupId);
    return list;
  }

  // 11. Command Center Dashboard
  async getCommandCenterOverview(creatorUserId?: string): Promise<StartupCommandCenterOverviewDto> {
    const startupsList = await this.listStartups(creatorUserId);
    const ideasList = await this.listStartupIdeas(creatorUserId);
    const incubationsList = await this.listProductIncubations();
    const marketReportsList = await this.listMarketReports();
    const roundsList = await this.listFundraisingRounds();

    const totalCapitalRaisedUsd = startupsList.reduce((acc, s) => acc + (s.totalRaisedUsd || 0), 0);
    const aggregatePortfolioValuationUsd = startupsList.reduce((acc, s) => acc + (s.valuationUsd || 0), 0);
    const averageMarketFitScore = incubationsList.length > 0
      ? incubationsList.reduce((acc, i) => acc + i.productMarketFitScore, 0) / incubationsList.length
      : 85.0;

    return {
      totalStartupsCount: startupsList.length,
      totalIdeasGenerated: ideasList.length,
      activeIncubationsCount: incubationsList.length,
      totalCapitalRaisedUsd,
      aggregatePortfolioValuationUsd,
      averageMarketFitScore: Number(averageMarketFitScore.toFixed(1)),
      topStartups: startupsList.slice(0, 5),
      recentMarketReports: marketReportsList.slice(0, 5),
      recentFundraisingRounds: roundsList.slice(0, 5),
      portfolioHealthSummary: {
        thriving: startupsList.filter((s) => s.stage === StartupStage.GROWTH || s.stage === StartupStage.SCALE || s.viabilityScore >= 90).length || 1,
        onTrack: startupsList.filter((s) => s.stage === StartupStage.MVP || s.stage === StartupStage.PROTOTYPE).length || 1,
        needsAttention: startupsList.filter((s) => s.stage === StartupStage.IDEATION && s.viabilityScore < 80).length || 0,
      },
    };
  }
}
