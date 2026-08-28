import { randomUUID } from 'crypto';
import { IGlobalEcosystemRepository } from './interfaces/IGlobalEcosystemRepository';
import {
  GlobalNetworkNodeDto,
  GlobalNetworkEdgeDto,
  GlobalGraphDto,
  TalentProfileDto,
  VerifiedSkillDto,
  SkillVerificationRequestDto,
  StartupProfileDto,
  FounderMatchDto,
  ResearchPublicationDto,
  ResearchCitationDto,
  DigitalTwinDto,
  EcosystemReputationDto,
  EcosystemRewardDto,
  TrendSignalDto,
  GlobalNodeType,
  GlobalEdgeType,
  VerificationStatus,
  PublicationStatus,
  DigitalTwinType,
  ReputationTier,
  VentureStage,
  TrendCategory,
  EcosystemEventCategory,
} from '@codeforge/shared';

export class GlobalEcosystemRepository implements IGlobalEcosystemRepository {
  private nodes: Map<string, GlobalNetworkNodeDto> = new Map();
  private edges: Map<string, GlobalNetworkEdgeDto> = new Map();
  private talentProfiles: Map<string, TalentProfileDto> = new Map();
  private verifiedSkills: Map<string, VerifiedSkillDto[]> = new Map();
  private skillVerifications: Map<string, any[]> = new Map();
  private startupProfiles: Map<string, StartupProfileDto> = new Map();
  private founderMatches: Map<string, FounderMatchDto[]> = new Map();
  private publications: Map<string, ResearchPublicationDto> = new Map();
  private citations: Map<string, ResearchCitationDto[]> = new Map();
  private digitalTwins: Map<string, DigitalTwinDto> = new Map();
  private reputationStore: Map<string, EcosystemReputationDto> = new Map();
  private rewardsStore: Map<string, EcosystemRewardDto[]> = new Map();
  private trendsStore: Map<string, TrendSignalDto> = new Map();
  private eventsStore: any[] = [];

  // Module 1: Global AI Network
  async createNode(data: {
    entityId: string;
    nodeType: GlobalNodeType;
    label: string;
    score?: number;
    metadata?: Record<string, any>;
    tenantId?: string | null;
  }): Promise<GlobalNetworkNodeDto> {
    const id = randomUUID();
    const node: GlobalNetworkNodeDto = {
      id,
      entityId: data.entityId,
      nodeType: data.nodeType,
      label: data.label,
      score: data.score ?? 50.0,
      metadata: data.metadata || {},
      tenantId: data.tenantId || null,
      createdAt: new Date().toISOString(),
    };
    this.nodes.set(id, node);
    return node;
  }

  async getNodeById(id: string): Promise<GlobalNetworkNodeDto | null> {
    return this.nodes.get(id) || null;
  }

  async listNodes(nodeType?: GlobalNodeType, tenantId?: string | null): Promise<GlobalNetworkNodeDto[]> {
    let result = Array.from(this.nodes.values());
    if (nodeType) {
      result = result.filter(n => n.nodeType === nodeType);
    }
    if (tenantId !== undefined) {
      result = result.filter(n => n.tenantId === tenantId);
    }
    return result;
  }

  async createEdge(data: {
    sourceNodeId: string;
    targetNodeId: string;
    edgeType: GlobalEdgeType;
    weight?: number;
    metadata?: Record<string, any>;
  }): Promise<GlobalNetworkEdgeDto> {
    const id = randomUUID();
    const edge: GlobalNetworkEdgeDto = {
      id,
      sourceNodeId: data.sourceNodeId,
      targetNodeId: data.targetNodeId,
      edgeType: data.edgeType,
      weight: data.weight ?? 1.0,
      metadata: data.metadata || {},
      createdAt: new Date().toISOString(),
    };
    this.edges.set(id, edge);
    return edge;
  }

  async getGlobalGraph(limit: number = 100): Promise<GlobalGraphDto> {
    const nodes = Array.from(this.nodes.values()).slice(0, limit);
    const edges = Array.from(this.edges.values()).slice(0, limit * 2);
    return { nodes, edges };
  }

  async getRecommendations(nodeId: string): Promise<any[]> {
    const directEdges = Array.from(this.edges.values()).filter(
      e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId
    );
    const directNeighborIds = new Set(
      directEdges.map(e => (e.sourceNodeId === nodeId ? e.targetNodeId : e.sourceNodeId))
    );

    const candidates = Array.from(this.nodes.values()).filter(
      n => n.id !== nodeId && !directNeighborIds.has(n.id)
    );

    return candidates.slice(0, 5).map(c => ({
      targetNodeId: c.id,
      label: c.label,
      nodeType: c.nodeType,
      relevanceScore: Math.min(95, Math.round(c.score * 0.9 + 10)),
      reason: `High strategic affinity with common ecosystem goals in ${c.nodeType}`,
      commonConnectionsCount: Math.floor(Math.random() * 3) + 1,
    }));
  }

  // Module 4: Global Talent Cloud
  async createTalentProfile(userId: string, data: Partial<TalentProfileDto>): Promise<TalentProfileDto> {
    const id = randomUUID();
    const profile: TalentProfileDto = {
      id,
      userId,
      fullName: data.fullName || 'Ecosystem Engineer',
      title: data.title || 'Full Stack AI Architect',
      bio: data.bio || 'Building decentralized collective intelligence systems.',
      hourlyRateUsd: data.hourlyRateUsd ?? 85.0,
      availabilityStatus: data.availabilityStatus || 'available',
      globalRank: data.globalRank ?? 1,
      verifiedSkillsCount: data.verifiedSkillsCount ?? 0,
      reputationScore: data.reputationScore ?? 150.0,
      reputationTier: data.reputationTier || ReputationTier.EXPERT,
      portfolioScore: data.portfolioScore ?? 92.0,
      location: data.location || 'Global Remote',
      createdAt: new Date().toISOString(),
    };
    this.talentProfiles.set(userId, profile);
    return profile;
  }

  async getTalentProfileByUserId(userId: string): Promise<TalentProfileDto | null> {
    return this.talentProfiles.get(userId) || null;
  }

  async listTalentProfiles(tier?: ReputationTier, minScore?: number): Promise<TalentProfileDto[]> {
    let list = Array.from(this.talentProfiles.values());
    if (tier) {
      list = list.filter(p => p.reputationTier === tier);
    }
    if (minScore !== undefined) {
      list = list.filter(p => p.reputationScore >= minScore);
    }
    return list.sort((a, b) => b.reputationScore - a.reputationScore);
  }

  async addVerifiedSkill(
    talentProfileId: string,
    skillName: string,
    proficiencyLevel: string = 'advanced',
    score: number = 90.0
  ): Promise<VerifiedSkillDto> {
    const id = randomUUID();
    const skill: VerifiedSkillDto = {
      id,
      talentProfileId,
      skillName,
      proficiencyLevel,
      score,
      status: VerificationStatus.VERIFIED,
      verifiedAt: new Date().toISOString(),
      verifierBadge: 'CodeForge Autonomous Verifier',
    };
    const current = this.verifiedSkills.get(talentProfileId) || [];
    current.push(skill);
    this.verifiedSkills.set(talentProfileId, current);

    // Update profile count
    for (const profile of this.talentProfiles.values()) {
      if (profile.id === talentProfileId) {
        profile.verifiedSkillsCount = current.length;
      }
    }
    return skill;
  }

  async listVerifiedSkills(talentProfileId: string): Promise<VerifiedSkillDto[]> {
    return this.verifiedSkills.get(talentProfileId) || [];
  }

  async createSkillVerificationRequest(talentProfileId: string, req: SkillVerificationRequestDto): Promise<any> {
    const id = randomUUID();
    const request = {
      id,
      talentProfileId,
      skillName: req.skillName,
      evidenceLinks: req.evidenceLinks || [],
      assessmentScore: req.assessmentScore || 88.0,
      status: VerificationStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    const list = this.skillVerifications.get(talentProfileId) || [];
    list.push(request);
    this.skillVerifications.set(talentProfileId, list);
    return request;
  }

  // Module 5: AI Entrepreneurship Platform
  async createStartupProfile(founderUserId: string, data: Partial<StartupProfileDto>): Promise<StartupProfileDto> {
    const id = randomUUID();
    const startup: StartupProfileDto = {
      id,
      founderUserId,
      name: data.name || 'Autonomous AI Venture',
      tagline: data.tagline || 'Revolutionizing agentic workflows',
      description: data.description || 'Decentralized autonomous enterprise platform.',
      stage: data.stage || VentureStage.SEED,
      industry: data.industry || 'Artificial Intelligence',
      targetMarket: data.targetMarket || 'Global Enterprises & Startups',
      businessModel: data.businessModel || 'B2B SaaS + AI Consumption',
      fundingGoalUsd: data.fundingGoalUsd ?? 500000,
      raisedAmountUsd: data.raisedAmountUsd ?? 50000,
      teamMemberUserIds: data.teamMemberUserIds || [founderUserId],
      marketValidationScore: data.marketValidationScore ?? 88.0,
      createdAt: new Date().toISOString(),
    };
    this.startupProfiles.set(id, startup);
    return startup;
  }

  async getStartupProfileById(id: string): Promise<StartupProfileDto | null> {
    return this.startupProfiles.get(id) || null;
  }

  async listStartupProfiles(stage?: VentureStage, industry?: string): Promise<StartupProfileDto[]> {
    let list = Array.from(this.startupProfiles.values());
    if (stage) {
      list = list.filter(s => s.stage === stage);
    }
    if (industry) {
      list = list.filter(s => s.industry.toLowerCase().includes(industry.toLowerCase()));
    }
    return list;
  }

  async createFounderMatch(
    startupId: string,
    matchedUserId: string,
    matchScore: number,
    complementarySkills: string[],
    roleFit: string
  ): Promise<FounderMatchDto> {
    const id = randomUUID();
    const match: FounderMatchDto = {
      id,
      startupId,
      matchedUserId,
      matchScore,
      complementarySkills,
      roleFit,
      status: 'suggested',
    };
    const current = this.founderMatches.get(startupId) || [];
    current.push(match);
    this.founderMatches.set(startupId, current);
    return match;
  }

  async listFounderMatches(startupId: string): Promise<FounderMatchDto[]> {
    return this.founderMatches.get(startupId) || [];
  }

  // Module 6: Global Research Network
  async createPublication(authorUserId: string, data: Partial<ResearchPublicationDto>): Promise<ResearchPublicationDto> {
    const id = randomUUID();
    const pub: ResearchPublicationDto = {
      id,
      authorUserId,
      orgId: data.orgId || null,
      title: data.title || 'Autonomous Collective Intelligence Networks',
      abstract: data.abstract || 'A formal model for emergent reasoning across multi-agent graphs.',
      domain: data.domain || 'Distributed AI Systems',
      status: data.status || PublicationStatus.PUBLISHED,
      peerReviewScore: data.peerReviewScore ?? 92.5,
      citationsCount: data.citationsCount ?? 0,
      downloadCount: data.downloadCount ?? 12,
      fullTextUrl: data.fullTextUrl || 'https://codeforge.dev/papers/collective-ai-2026.pdf',
      publishedAt: new Date().toISOString(),
    };
    this.publications.set(id, pub);
    return pub;
  }

  async getPublicationById(id: string): Promise<ResearchPublicationDto | null> {
    return this.publications.get(id) || null;
  }

  async listPublications(domain?: string, status?: PublicationStatus): Promise<ResearchPublicationDto[]> {
    let list = Array.from(this.publications.values());
    if (domain) {
      list = list.filter(p => p.domain.toLowerCase().includes(domain.toLowerCase()));
    }
    if (status) {
      list = list.filter(p => p.status === status);
    }
    return list;
  }

  async createCitation(
    sourceId: string,
    targetId: string,
    contextSnippet: string = '',
    weight: number = 1.0
  ): Promise<ResearchCitationDto> {
    const id = randomUUID();
    const citation: ResearchCitationDto = {
      id,
      sourcePublicationId: sourceId,
      targetPublicationId: targetId,
      contextSnippet,
      citationWeight: weight,
      createdAt: new Date().toISOString(),
    };
    const current = this.citations.get(targetId) || [];
    current.push(citation);
    this.citations.set(targetId, current);

    // Increment citation count
    const target = this.publications.get(targetId);
    if (target) {
      target.citationsCount = current.length;
    }
    return citation;
  }

  async listCitations(publicationId: string): Promise<ResearchCitationDto[]> {
    return this.citations.get(publicationId) || [];
  }

  // Module 7: Digital Twin Ecosystem
  async createDigitalTwin(
    entityId: string,
    twinType: DigitalTwinType,
    name: string,
    stateSnapshot: Record<string, any> = {},
    behavioralModel: Record<string, any> = {}
  ): Promise<DigitalTwinDto> {
    const id = randomUUID();
    const twin: DigitalTwinDto = {
      id,
      entityId,
      twinType,
      name,
      stateSnapshot,
      behavioralModel,
      accuracyRating: 94.5,
      lastSimulatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.digitalTwins.set(id, twin);
    return twin;
  }

  async getDigitalTwinById(id: string): Promise<DigitalTwinDto | null> {
    return this.digitalTwins.get(id) || null;
  }

  async listDigitalTwins(twinType?: DigitalTwinType): Promise<DigitalTwinDto[]> {
    let list = Array.from(this.digitalTwins.values());
    if (twinType) {
      list = list.filter(t => t.twinType === twinType);
    }
    return list;
  }

  async updateDigitalTwinState(id: string, stateSnapshot: Record<string, any>): Promise<DigitalTwinDto | null> {
    const twin = this.digitalTwins.get(id);
    if (!twin) return null;
    twin.stateSnapshot = { ...twin.stateSnapshot, ...stateSnapshot };
    twin.lastSimulatedAt = new Date().toISOString();
    return twin;
  }

  // Module 8: AI Economy & Token System
  async getReputation(userId: string): Promise<EcosystemReputationDto> {
    let rep = this.reputationStore.get(userId);
    if (!rep) {
      rep = {
        userId,
        score: 100.0,
        tier: ReputationTier.NOVICE,
        totalContributions: 1,
        upvotesReceived: 0,
        skillCreditsBalance: 50,
        badgesEarned: ['Ecosystem Pioneer'],
        rankPercentile: 50.0,
      };
      this.reputationStore.set(userId, rep);
    }
    return rep;
  }

  async updateReputation(userId: string, scoreDelta: number, skillCreditsDelta: number = 0): Promise<EcosystemReputationDto> {
    const rep = await this.getReputation(userId);
    rep.score = Math.max(0, rep.score + scoreDelta);
    rep.skillCreditsBalance = Math.max(0, rep.skillCreditsBalance + skillCreditsDelta);
    rep.totalContributions += 1;

    if (rep.score >= 500) rep.tier = ReputationTier.LUMINARY;
    else if (rep.score >= 350) rep.tier = ReputationTier.FELLOW;
    else if (rep.score >= 250) rep.tier = ReputationTier.MASTER;
    else if (rep.score >= 150) rep.tier = ReputationTier.EXPERT;
    else if (rep.score >= 80) rep.tier = ReputationTier.CONTRIBUTOR;
    else rep.tier = ReputationTier.NOVICE;

    rep.rankPercentile = Math.min(99.9, Math.round((rep.score / 600) * 100 * 10) / 10);
    return rep;
  }

  async createReward(userId: string, rewardType: string, skillCredits: number, reason: string, txRef?: string): Promise<EcosystemRewardDto> {
    const id = randomUUID();
    const reward: EcosystemRewardDto = {
      id,
      userId,
      rewardType,
      skillCreditsAwarded: skillCredits,
      reason,
      transactionReference: txRef || `TX-ECO-${Date.now()}`,
      awardedAt: new Date().toISOString(),
    };
    const list = this.rewardsStore.get(userId) || [];
    list.push(reward);
    this.rewardsStore.set(userId, list);

    await this.updateReputation(userId, Math.round(skillCredits * 0.5), skillCredits);
    return reward;
  }

  async listRewards(userId: string): Promise<EcosystemRewardDto[]> {
    return this.rewardsStore.get(userId) || [];
  }

  // Module 10: Trends & Events
  async recordTrend(
    trendName: string,
    category: TrendCategory,
    momentumScore: number = 85.0,
    growthRate: number = 22.5,
    demandScore: number = 90.0
  ): Promise<TrendSignalDto> {
    const trend: TrendSignalDto = {
      trendName,
      category,
      momentumScore,
      growthRatePercent: growthRate,
      demandScore,
      occurrences: (this.trendsStore.get(trendName)?.occurrences || 0) + 1,
    };
    this.trendsStore.set(trendName, trend);
    return trend;
  }

  async listTrends(category?: TrendCategory): Promise<TrendSignalDto[]> {
    let list = Array.from(this.trendsStore.values());
    if (category) {
      list = list.filter(t => t.category === category);
    }
    return list.sort((a, b) => b.momentumScore - a.momentumScore);
  }

  async recordEvent(
    category: EcosystemEventCategory,
    title: string,
    description: string,
    payload: Record<string, any> = {},
    actorUserId: string | null = null
  ): Promise<any> {
    const event = {
      id: randomUUID(),
      category,
      title,
      description,
      payload,
      actorUserId,
      createdAt: new Date().toISOString(),
    };
    this.eventsStore.push(event);
    return event;
  }
}

export const globalEcosystemRepository = new GlobalEcosystemRepository();
