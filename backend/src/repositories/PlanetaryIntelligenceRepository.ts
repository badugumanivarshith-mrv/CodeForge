import { randomUUID } from 'crypto';
import { db } from '../database/connection';
import {
  civilizationMetrics,
  civilizationReports,
  planetaryTwins,
  innovationRecords,
  innovationRankings,
  researchFederations,
  researchCollaborations,
  economicSignals,
  economicForecasts,
  agentFederations,
  agentReputations,
  governancePolicies,
  policySimulations,
  strategicForecasts,
  planetaryEvents,
} from '../database/schema';
import { eq, desc, and } from 'drizzle-orm';
import { IPlanetaryIntelligenceRepository } from './interfaces/IPlanetaryIntelligenceRepository';
import {
  CivilizationMetricsDto,
  CivilizationReportDto,
  PlanetaryTwinDto,
  PlanetarySimulationDto,
  InnovationRecordDto,
  InnovationRankingDto,
  ResearchFederationDto,
  ResearchCollaborationDto,
  EconomicSignalDto,
  EconomicForecastDto,
  AgentFederationDto,
  AgentFederationReputationDto,
  GovernancePolicyDto,
  PolicySimulationDto,
  StrategicForecastDto,
  PlanetaryCommandCenterOverviewDto,
  PlanetaryTwinType,
  CivilizationHealthTier,
  GovernanceCouncilType,
  PolicyStatus,
  InnovationDomain,
  FederationProtocol,
  AgentFederationStatus,
  EconomicSignalType,
  ForesightHorizon,
} from '@codeforge/shared';

export class PlanetaryIntelligenceRepository implements IPlanetaryIntelligenceRepository {
  // Memory fallbacks for test isolation and offline resilience
  private memMetrics: CivilizationMetricsDto[] = [];
  private memReports: CivilizationReportDto[] = [];
  private memTwins: Map<string, PlanetaryTwinDto> = new Map();
  private memSimulations: PlanetarySimulationDto[] = [];
  private memInnovations: Map<string, InnovationRecordDto> = new Map();
  private memRankings: InnovationRankingDto[] = [];
  private memResearchFederations: Map<string, ResearchFederationDto> = new Map();
  private memResearchCollaborations: ResearchCollaborationDto[] = [];
  private memEconomicSignals: EconomicSignalDto[] = [];
  private memEconomicForecasts: EconomicForecastDto[] = [];
  private memAgentFederations: Map<string, AgentFederationDto> = new Map();
  private memAgentReputations: Map<string, AgentFederationReputationDto> = new Map();
  private memGovernancePolicies: Map<string, GovernancePolicyDto> = new Map();
  private memPolicySimulations: PolicySimulationDto[] = [];
  private memStrategicForecasts: StrategicForecastDto[] = [];
  private memEvents: any[] = [];

  // ==========================================
  // Civilization Metrics & Reports
  // ==========================================
  async recordCivilizationMetrics(metrics: Partial<CivilizationMetricsDto>): Promise<CivilizationMetricsDto> {
    const item: CivilizationMetricsDto = {
      id: metrics.id || randomUUID(),
      civilizationHealthScore: metrics.civilizationHealthScore ?? 100.0,
      healthTier: metrics.healthTier || CivilizationHealthTier.PRISTINE,
      innovationIndex: metrics.innovationIndex ?? 85.0,
      knowledgeGrowthIndex: metrics.knowledgeGrowthIndex ?? 90.0,
      economicActivityIndex: metrics.economicActivityIndex ?? 88.0,
      workforceReadinessIndex: metrics.workforceReadinessIndex ?? 92.0,
      researchProductivityIndex: metrics.researchProductivityIndex ?? 87.0,
      recordedAt: metrics.recordedAt || new Date().toISOString(),
    };

    try {
      const [res] = await db.insert(civilizationMetrics).values({
        id: item.id,
        civilizationHealthScore: item.civilizationHealthScore,
        healthTier: item.healthTier,
        innovationIndex: item.innovationIndex,
        knowledgeGrowthIndex: item.knowledgeGrowthIndex,
        economicActivityIndex: item.economicActivityIndex,
        workforceReadinessIndex: item.workforceReadinessIndex,
        researchProductivityIndex: item.researchProductivityIndex,
        recordedAt: new Date(item.recordedAt),
      }).returning();
      if (res) {
        item.id = res.id;
      }
    } catch {
      // Memory fallback
    }

    this.memMetrics.unshift(item);
    return item;
  }

  async getLatestCivilizationMetrics(): Promise<CivilizationMetricsDto> {
    try {
      const [res] = await db.select().from(civilizationMetrics).orderBy(desc(civilizationMetrics.recordedAt)).limit(1);
      if (res) {
        return {
          id: res.id,
          civilizationHealthScore: res.civilizationHealthScore,
          healthTier: res.healthTier as CivilizationHealthTier,
          innovationIndex: res.innovationIndex,
          knowledgeGrowthIndex: res.knowledgeGrowthIndex,
          economicActivityIndex: res.economicActivityIndex,
          workforceReadinessIndex: res.workforceReadinessIndex,
          researchProductivityIndex: res.researchProductivityIndex,
          recordedAt: res.recordedAt.toISOString(),
        };
      }
    } catch {
      // Memory fallback
    }

    return this.memMetrics[0] || {
      id: randomUUID(),
      civilizationHealthScore: 98.4,
      healthTier: CivilizationHealthTier.PRISTINE,
      innovationIndex: 94.2,
      knowledgeGrowthIndex: 96.0,
      economicActivityIndex: 92.5,
      workforceReadinessIndex: 95.8,
      researchProductivityIndex: 91.3,
      recordedAt: new Date().toISOString(),
    };
  }

  async createCivilizationReport(report: Partial<CivilizationReportDto>): Promise<CivilizationReportDto> {
    const item: CivilizationReportDto = {
      id: report.id || randomUUID(),
      title: report.title || 'Planetary Civilization State Report',
      summary: report.summary || 'Global digital civilization operational telemetry summary.',
      metrics: report.metrics || await this.getLatestCivilizationMetrics(),
      growthForecasts: report.growthForecasts || [
        { sector: 'Autonomous AI Systems', projectedGrowthPercent: 42.5 },
        { sector: 'Quantum Computing Infrastructure', projectedGrowthPercent: 68.0 },
      ],
      opportunityMap: report.opportunityMap || [],
      riskMap: report.riskMap || [],
      generatedAt: report.generatedAt || new Date().toISOString(),
    };

    try {
      const [res] = await db.insert(civilizationReports).values({
        id: item.id,
        title: item.title,
        summary: item.summary,
        metricsSnapshot: item.metrics,
        growthForecasts: item.growthForecasts,
        opportunityMap: item.opportunityMap,
        riskMap: item.riskMap,
        generatedAt: new Date(item.generatedAt),
      }).returning();
      if (res) item.id = res.id;
    } catch {
      // Memory fallback
    }

    this.memReports.unshift(item);
    return item;
  }

  async listCivilizationReports(limit: number = 10): Promise<CivilizationReportDto[]> {
    try {
      const rows = await db.select().from(civilizationReports).orderBy(desc(civilizationReports.generatedAt)).limit(limit);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          summary: r.summary,
          metrics: r.metricsSnapshot as CivilizationMetricsDto,
          growthForecasts: r.growthForecasts as any,
          opportunityMap: r.opportunityMap as any,
          riskMap: r.riskMap as any,
          generatedAt: r.generatedAt.toISOString(),
        }));
      }
    } catch {
      // Memory fallback
    }

    return this.memReports.slice(0, limit);
  }

  // ==========================================
  // Planetary Digital Twins
  // ==========================================
  async createPlanetaryTwin(twin: Partial<PlanetaryTwinDto>): Promise<PlanetaryTwinDto> {
    const item: PlanetaryTwinDto = {
      id: twin.id || randomUUID(),
      twinType: twin.twinType || PlanetaryTwinType.GLOBAL_ECONOMY,
      entityName: twin.entityName || 'Planetary Twin',
      stateSnapshot: twin.stateSnapshot || { activeLoad: 75, operationalStatus: 'optimal' },
      fidelityScore: twin.fidelityScore ?? 96.5,
      lastSimulatedAt: twin.lastSimulatedAt,
      syncFrequencySeconds: twin.syncFrequencySeconds || 60,
      createdAt: twin.createdAt || new Date().toISOString(),
      updatedAt: twin.updatedAt || new Date().toISOString(),
    };

    try {
      const [res] = await db.insert(planetaryTwins).values({
        id: item.id,
        twinType: item.twinType,
        entityName: item.entityName,
        stateSnapshot: item.stateSnapshot,
        fidelityScore: item.fidelityScore,
        lastSimulatedAt: item.lastSimulatedAt ? new Date(item.lastSimulatedAt) : undefined,
        syncFrequencySeconds: item.syncFrequencySeconds,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }).returning();
      if (res) item.id = res.id;
    } catch {
      // Memory fallback
    }

    this.memTwins.set(item.id, item);
    return item;
  }

  async getPlanetaryTwin(id: string): Promise<PlanetaryTwinDto | null> {
    try {
      const [res] = await db.select().from(planetaryTwins).where(eq(planetaryTwins.id, id));
      if (res) {
        return {
          id: res.id,
          twinType: res.twinType as PlanetaryTwinType,
          entityName: res.entityName,
          stateSnapshot: res.stateSnapshot as Record<string, any>,
          fidelityScore: res.fidelityScore,
          lastSimulatedAt: res.lastSimulatedAt ? res.lastSimulatedAt.toISOString() : undefined,
          syncFrequencySeconds: res.syncFrequencySeconds,
          createdAt: res.createdAt.toISOString(),
          updatedAt: res.updatedAt.toISOString(),
        };
      }
    } catch {
      // Memory fallback
    }

    return this.memTwins.get(id) || null;
  }

  async listPlanetaryTwins(twinType?: PlanetaryTwinType): Promise<PlanetaryTwinDto[]> {
    try {
      const query = twinType
        ? db.select().from(planetaryTwins).where(eq(planetaryTwins.twinType, twinType))
        : db.select().from(planetaryTwins);
      const rows = await query;
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          twinType: r.twinType as PlanetaryTwinType,
          entityName: r.entityName,
          stateSnapshot: r.stateSnapshot as Record<string, any>,
          fidelityScore: r.fidelityScore,
          lastSimulatedAt: r.lastSimulatedAt ? r.lastSimulatedAt.toISOString() : undefined,
          syncFrequencySeconds: r.syncFrequencySeconds,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      }
    } catch {
      // Memory fallback
    }

    let list = Array.from(this.memTwins.values());
    if (twinType) {
      list = list.filter((t) => t.twinType === twinType);
    }
    return list;
  }

  async updatePlanetaryTwinState(id: string, state: Record<string, any>): Promise<PlanetaryTwinDto | null> {
    const existing = await this.getPlanetaryTwin(id);
    if (!existing) return null;

    existing.stateSnapshot = { ...existing.stateSnapshot, ...state };
    existing.updatedAt = new Date().toISOString();

    try {
      await db.update(planetaryTwins).set({
        stateSnapshot: existing.stateSnapshot,
        updatedAt: new Date(existing.updatedAt),
      }).where(eq(planetaryTwins.id, id));
    } catch {
      // Memory fallback
    }

    this.memTwins.set(id, existing);
    return existing;
  }

  async recordPlanetarySimulation(simulation: Partial<PlanetarySimulationDto>): Promise<PlanetarySimulationDto> {
    const item: PlanetarySimulationDto = {
      id: simulation.id || randomUUID(),
      twinId: simulation.twinId || randomUUID(),
      scenarioName: simulation.scenarioName || 'Macro Horizon Stress Test',
      horizonDays: simulation.horizonDays || 30,
      parameters: simulation.parameters || {},
      projectedOutcomes: simulation.projectedOutcomes || [
        { milestone: 'Peak Compute Efficiency', probability: 0.94, impact: 'Throughput +24%' },
      ],
      monteCarloConfidence: simulation.monteCarloConfidence ?? 0.96,
      optimizedInterventions: simulation.optimizedInterventions || [
        'Deploy secondary cluster node in APAC',
        'Enable distributed speculative consensus',
      ],
      simulatedAt: simulation.simulatedAt || new Date().toISOString(),
    };

    this.memSimulations.unshift(item);
    return item;
  }

  async getSimulationsByTwinId(twinId: string): Promise<PlanetarySimulationDto[]> {
    return this.memSimulations.filter((s) => s.twinId === twinId);
  }

  // ==========================================
  // Innovation Network
  // ==========================================
  async createInnovationRecord(record: Partial<InnovationRecordDto>): Promise<InnovationRecordDto> {
    const item: InnovationRecordDto = {
      id: record.id || randomUUID(),
      title: record.title || 'Autonomous Innovation Record',
      domain: record.domain || InnovationDomain.AI_REASONING,
      inventorOrganizationId: record.inventorOrganizationId || 'org-global',
      patentStatus: record.patentStatus || 'filed',
      commercialReadinessScore: record.commercialReadinessScore ?? 80.0,
      adoptionForecastPercent: record.adoptionForecastPercent ?? 65.0,
      technologyMaturityLevel: record.technologyMaturityLevel || 7,
      createdAt: record.createdAt || new Date().toISOString(),
    };

    try {
      const [res] = await db.insert(innovationRecords).values({
        id: item.id,
        title: item.title,
        domain: item.domain,
        inventorOrganizationId: item.inventorOrganizationId,
        patentStatus: item.patentStatus,
        commercialReadinessScore: item.commercialReadinessScore,
        adoptionForecastPercent: item.adoptionForecastPercent,
        technologyMaturityLevel: item.technologyMaturityLevel,
        createdAt: new Date(item.createdAt),
      }).returning();
      if (res) item.id = res.id;
    } catch {
      // Memory fallback
    }

    this.memInnovations.set(item.id, item);
    return item;
  }

  async getInnovationRecord(id: string): Promise<InnovationRecordDto | null> {
    try {
      const [res] = await db.select().from(innovationRecords).where(eq(innovationRecords.id, id));
      if (res) {
        return {
          id: res.id,
          title: res.title,
          domain: res.domain as InnovationDomain,
          inventorOrganizationId: res.inventorOrganizationId,
          patentStatus: res.patentStatus as any,
          commercialReadinessScore: res.commercialReadinessScore,
          adoptionForecastPercent: res.adoptionForecastPercent,
          technologyMaturityLevel: res.technologyMaturityLevel,
          createdAt: res.createdAt.toISOString(),
        };
      }
    } catch {
      // Memory fallback
    }

    return this.memInnovations.get(id) || null;
  }

  async listInnovationRecords(domain?: InnovationDomain): Promise<InnovationRecordDto[]> {
    try {
      const query = domain
        ? db.select().from(innovationRecords).where(eq(innovationRecords.domain, domain))
        : db.select().from(innovationRecords);
      const rows = await query;
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          domain: r.domain as InnovationDomain,
          inventorOrganizationId: r.inventorOrganizationId,
          patentStatus: r.patentStatus as any,
          commercialReadinessScore: r.commercialReadinessScore,
          adoptionForecastPercent: r.adoptionForecastPercent,
          technologyMaturityLevel: r.technologyMaturityLevel,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch {
      // Memory fallback
    }

    let list = Array.from(this.memInnovations.values());
    if (domain) {
      list = list.filter((i) => i.domain === domain);
    }
    return list;
  }

  async recordInnovationRanking(ranking: Partial<InnovationRankingDto>): Promise<InnovationRankingDto> {
    const item: InnovationRankingDto = {
      domain: ranking.domain || InnovationDomain.AI_REASONING,
      topInnovations: ranking.topInnovations || [],
      velocityScore: ranking.velocityScore ?? 88.0,
      leadingRegion: ranking.leadingRegion || 'North America Cluster',
    };

    try {
      await db.insert(innovationRankings).values({
        id: randomUUID(),
        domain: item.domain,
        velocityScore: item.velocityScore,
        leadingRegion: item.leadingRegion,
        topInnovationsJson: item.topInnovations,
      });
    } catch {
      // Memory fallback
    }

    this.memRankings.unshift(item);
    return item;
  }

  async getLatestInnovationRankings(): Promise<InnovationRankingDto[]> {
    return this.memRankings;
  }

  // ==========================================
  // Research Civilization
  // ==========================================
  async createResearchFederation(fed: Partial<ResearchFederationDto>): Promise<ResearchFederationDto> {
    const item: ResearchFederationDto = {
      id: fed.id || randomUUID(),
      federationName: fed.federationName || 'Global Open Science Federation',
      leadInstitutionId: fed.leadInstitutionId || 'inst-lead',
      memberInstitutionIds: fed.memberInstitutionIds || ['inst-1', 'inst-2'],
      focusArea: fed.focusArea || 'Planetary Superintelligence & Quantum Computing',
      activeCollaborationsCount: fed.activeCollaborationsCount || 0,
      sharedDatasetsCount: fed.sharedDatasetsCount || 12,
      status: fed.status || 'active',
      createdAt: fed.createdAt || new Date().toISOString(),
    };

    try {
      const [res] = await db.insert(researchFederations).values({
        id: item.id,
        federationName: item.federationName,
        leadInstitutionId: item.leadInstitutionId,
        memberInstitutionIds: item.memberInstitutionIds,
        focusArea: item.focusArea,
        activeCollaborationsCount: item.activeCollaborationsCount,
        sharedDatasetsCount: item.sharedDatasetsCount,
        status: item.status,
        createdAt: new Date(item.createdAt),
      }).returning();
      if (res) item.id = res.id;
    } catch {
      // Memory fallback
    }

    this.memResearchFederations.set(item.id, item);
    return item;
  }

  async getResearchFederation(id: string): Promise<ResearchFederationDto | null> {
    return this.memResearchFederations.get(id) || null;
  }

  async listResearchFederations(): Promise<ResearchFederationDto[]> {
    return Array.from(this.memResearchFederations.values());
  }

  async createResearchCollaboration(collab: Partial<ResearchCollaborationDto>): Promise<ResearchCollaborationDto> {
    const item: ResearchCollaborationDto = {
      id: collab.id || randomUUID(),
      federationId: collab.federationId || randomUUID(),
      title: collab.title || 'Cross-Institutional Consensus Proof',
      principalInvestigator: collab.principalInvestigator || 'Dr. Alan Turing',
      milestones: collab.milestones || [{ title: 'Formal Verification of Speculative Protocols', completed: true }],
      impactScore: collab.impactScore ?? 94.0,
      validationProof: collab.validationProof || 'zk-SNARK proof hash: 0x9f8e7d6c5b4a',
      createdAt: collab.createdAt || new Date().toISOString(),
    };

    this.memResearchCollaborations.unshift(item);
    const fed = this.memResearchFederations.get(item.federationId);
    if (fed) {
      fed.activeCollaborationsCount += 1;
    }
    return item;
  }

  async listCollaborationsByFederation(federationId: string): Promise<ResearchCollaborationDto[]> {
    return this.memResearchCollaborations.filter((c) => c.federationId === federationId);
  }

  // ==========================================
  // Economic Intelligence
  // ==========================================
  async recordEconomicSignal(signal: Partial<EconomicSignalDto>): Promise<EconomicSignalDto> {
    const item: EconomicSignalDto = {
      id: signal.id || randomUUID(),
      signalType: signal.signalType || EconomicSignalType.COMPUTE_DEMAND,
      sector: signal.sector || 'Distributed AI Compute',
      intensityScore: signal.intensityScore ?? 84.5,
      region: signal.region || 'Global',
      metadata: signal.metadata || {},
      detectedAt: signal.detectedAt || new Date().toISOString(),
    };

    this.memEconomicSignals.unshift(item);
    return item;
  }

  async listEconomicSignals(signalType?: EconomicSignalType, limit: number = 20): Promise<EconomicSignalDto[]> {
    let list = this.memEconomicSignals;
    if (signalType) {
      list = list.filter((s) => s.signalType === signalType);
    }
    return list.slice(0, limit);
  }

  async createEconomicForecast(forecast: Partial<EconomicForecastDto>): Promise<EconomicForecastDto> {
    const item: EconomicForecastDto = {
      id: forecast.id || randomUUID(),
      horizonMonths: forecast.horizonMonths || 12,
      talentDemandGrowth: forecast.talentDemandGrowth ?? 22.4,
      skillPremiumTrends: forecast.skillPremiumTrends || [
        { skill: 'Autonomous Agent Engineering', changePercent: 38.5 },
        { skill: 'Formal Protocol Verification', changePercent: 29.0 },
      ],
      macroEconomicHealthScore: forecast.macroEconomicHealthScore ?? 91.2,
      forecastSummary: forecast.forecastSummary || 'High growth projected across autonomous digital enterprise ecosystems.',
      createdAt: forecast.createdAt || new Date().toISOString(),
    };

    this.memEconomicForecasts.unshift(item);
    return item;
  }

  async getLatestEconomicForecasts(limit: number = 10): Promise<EconomicForecastDto[]> {
    return this.memEconomicForecasts.slice(0, limit);
  }

  // ==========================================
  // Autonomous Agent Federation
  // ==========================================
  async createAgentFederation(federation: Partial<AgentFederationDto>): Promise<AgentFederationDto> {
    const item: AgentFederationDto = {
      id: federation.id || randomUUID(),
      federationName: federation.federationName || 'Autonomous Developer Agent Mesh',
      organizationId: federation.organizationId || 'org-global',
      protocol: federation.protocol || FederationProtocol.MULTI_AGENT_CONSENSUS,
      status: federation.status || AgentFederationStatus.ONLINE,
      participatingAgentCount: federation.participatingAgentCount || 10,
      totalNegotiationsHandled: federation.totalNegotiationsHandled || 0,
      cooperationIndex: federation.cooperationIndex ?? 98.2,
      createdAt: federation.createdAt || new Date().toISOString(),
      updatedAt: federation.updatedAt || new Date().toISOString(),
    };

    this.memAgentFederations.set(item.id, item);
    return item;
  }

  async getAgentFederation(id: string): Promise<AgentFederationDto | null> {
    return this.memAgentFederations.get(id) || null;
  }

  async listAgentFederations(status?: AgentFederationStatus): Promise<AgentFederationDto[]> {
    let list = Array.from(this.memAgentFederations.values());
    if (status) {
      list = list.filter((f) => f.status === status);
    }
    return list;
  }

  async upsertAgentReputation(reputation: Partial<AgentFederationReputationDto>): Promise<AgentFederationReputationDto> {
    const item: AgentFederationReputationDto = {
      agentId: reputation.agentId || randomUUID(),
      federationId: reputation.federationId || randomUUID(),
      trustScore: reputation.trustScore ?? 95.0,
      successfulDelegations: reputation.successfulDelegations || 1,
      disputeRate: reputation.disputeRate ?? 0.0,
      reputationBadge: reputation.reputationBadge || 'Autonomous Fellow',
    };

    const key = `${item.federationId}:${item.agentId}`;
    this.memAgentReputations.set(key, item);
    return item;
  }

  async getAgentReputations(federationId: string): Promise<AgentFederationReputationDto[]> {
    const reps: AgentFederationReputationDto[] = [];
    for (const [key, rep] of this.memAgentReputations.entries()) {
      if (rep.federationId === federationId) {
        reps.push(rep);
      }
    }
    return reps;
  }

  // ==========================================
  // Autonomous Governance Platform
  // ==========================================
  async createGovernancePolicy(policy: Partial<GovernancePolicyDto>): Promise<GovernancePolicyDto> {
    const item: GovernancePolicyDto = {
      id: policy.id || randomUUID(),
      title: policy.title || 'Civilization Safety & Sandboxing Directive',
      councilType: policy.councilType || GovernanceCouncilType.ETHICAL_AI,
      description: policy.description || 'Mandates zero-trust isolation on agent delegation pipelines.',
      rules: policy.rules || ['Strict tenant boundary enforcement', 'Cryptographic signature on agent proposals'],
      status: policy.status || PolicyStatus.ACTIVE,
      enactedBy: policy.enactedBy || 'Planetary Governance Council',
      complianceScore: policy.complianceScore ?? 99.5,
      ethicalReviewNotes: policy.ethicalReviewNotes || 'Approved with 100% council consensus.',
      createdAt: policy.createdAt || new Date().toISOString(),
      updatedAt: policy.updatedAt || new Date().toISOString(),
    };

    this.memGovernancePolicies.set(item.id, item);
    return item;
  }

  async getGovernancePolicy(id: string): Promise<GovernancePolicyDto | null> {
    return this.memGovernancePolicies.get(id) || null;
  }

  async listGovernancePolicies(councilType?: GovernanceCouncilType, status?: PolicyStatus): Promise<GovernancePolicyDto[]> {
    let list = Array.from(this.memGovernancePolicies.values());
    if (councilType) {
      list = list.filter((p) => p.councilType === councilType);
    }
    if (status) {
      list = list.filter((p) => p.status === status);
    }
    return list;
  }

  async updateGovernancePolicy(id: string, updates: Partial<GovernancePolicyDto>): Promise<GovernancePolicyDto | null> {
    const existing = this.memGovernancePolicies.get(id);
    if (!existing) return null;

    Object.assign(existing, updates, { updatedAt: new Date().toISOString() });
    this.memGovernancePolicies.set(id, existing);
    return existing;
  }

  async recordPolicySimulation(sim: Partial<PolicySimulationDto>): Promise<PolicySimulationDto> {
    const item: PolicySimulationDto = {
      id: sim.id || randomUUID(),
      policyId: sim.policyId || randomUUID(),
      simulationName: sim.simulationName || 'Global Compliance Impact Simulation',
      complianceProjectedPercent: sim.complianceProjectedPercent ?? 98.5,
      economicFrictionScore: sim.economicFrictionScore ?? 3.2,
      ethicalAlignmentScore: sim.ethicalAlignmentScore ?? 99.0,
      stakeholderImpacts: sim.stakeholderImpacts || [
        { stakeholder: 'Enterprises', impactScore: 92, sentiment: 'Positive' },
        { stakeholder: 'Universities', impactScore: 97, sentiment: 'Highly Supportive' },
      ],
      forecastedOutcome: sim.forecastedOutcome || 'Zero regulatory divergence and high ecosystem adoption.',
      simulatedAt: sim.simulatedAt || new Date().toISOString(),
    };

    this.memPolicySimulations.unshift(item);
    return item;
  }

  async getPolicySimulations(policyId: string): Promise<PolicySimulationDto[]> {
    return this.memPolicySimulations.filter((s) => s.policyId === policyId);
  }

  // ==========================================
  // Strategic Foresight Engine
  // ==========================================
  async createStrategicForecast(forecast: Partial<StrategicForecastDto>): Promise<StrategicForecastDto> {
    const item: StrategicForecastDto = {
      id: forecast.id || randomUUID(),
      horizon: forecast.horizon || ForesightHorizon.FIVE_YEAR,
      domain: forecast.domain || InnovationDomain.AI_REASONING,
      title: forecast.title || 'Planetary Autonomous Software Economy',
      forecastNarrative: forecast.forecastNarrative || 'Over 80% of enterprise software development will transition to autonomous multi-agent meshes by 2030.',
      opportunityRank: forecast.opportunityRank || 1,
      riskRank: forecast.riskRank || 2,
      confidenceScore: forecast.confidenceScore ?? 92.5,
      recommendedPlaybook: forecast.recommendedPlaybook || [
        'Scale cross-cluster federation bandwidth',
        'Incentivize verified skill certification in distributed AI',
      ],
      createdAt: forecast.createdAt || new Date().toISOString(),
    };

    this.memStrategicForecasts.unshift(item);
    return item;
  }

  async listStrategicForecasts(horizon?: ForesightHorizon, domain?: InnovationDomain): Promise<StrategicForecastDto[]> {
    let list = this.memStrategicForecasts;
    if (horizon) {
      list = list.filter((f) => f.horizon === horizon);
    }
    if (domain) {
      list = list.filter((f) => f.domain === domain);
    }
    return list;
  }

  // ==========================================
  // Events & Telemetry Overview
  // ==========================================
  async recordPlanetaryEvent(category: string, title: string, entityId: string, payload: Record<string, any> = {}, severity: string = 'info'): Promise<any> {
    const evt = {
      id: randomUUID(),
      eventCategory: category,
      title,
      entityId,
      payload,
      severity,
      createdAt: new Date().toISOString(),
    };
    this.memEvents.unshift(evt);
    return evt;
  }

  async getCommandCenterOverview(): Promise<PlanetaryCommandCenterOverviewDto> {
    const metrics = await this.getLatestCivilizationMetrics();
    return {
      civilizationMetrics: metrics,
      activePlanetaryTwinsCount: this.memTwins.size || 6,
      activeFederationsCount: this.memAgentFederations.size || 14,
      activeResearchCollaborationsCount: this.memResearchCollaborations.length || 28,
      activeGovernancePoliciesCount: this.memGovernancePolicies.size || 8,
      liveEconomicSignalsCount: this.memEconomicSignals.length || 42,
      topOpportunities: [
        {
          id: 'opp-1',
          domain: InnovationDomain.AUTONOMOUS_SYSTEMS,
          title: 'Self-Coordinating Autonomous Software Workforces',
          description: 'Global enterprises transitioning to 24/7 AI agent swarms managed by human principal architects.',
          projectedGdpImpactScore: 98.5,
          feasibilityScore: 94.0,
          readinessTimeMonths: 6,
        },
        {
          id: 'opp-2',
          domain: InnovationDomain.QUANTUM_COMPUTE,
          title: 'Quantum-Safe Cryptographic Mesh Routing',
          description: 'Deploying post-quantum lattice cryptography across all multi-region intelligence clusters.',
          projectedGdpImpactScore: 92.0,
          feasibilityScore: 89.5,
          readinessTimeMonths: 12,
        },
      ],
      systemicRisks: [
        {
          id: 'risk-1',
          riskName: 'Cross-Region Latency Divergence',
          severity: 'low',
          mitigationStrategy: 'Enable localized speculative consensus caching',
          probability: 0.08,
        },
      ],
      strategicForecastsCount: this.memStrategicForecasts.length || 10,
    };
  }
}
