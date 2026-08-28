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

export interface IGlobalEcosystemRepository {
  // Module 1: Global AI Network
  createNode(data: { entityId: string; nodeType: GlobalNodeType; label: string; score?: number; metadata?: Record<string, any>; tenantId?: string | null }): Promise<GlobalNetworkNodeDto>;
  getNodeById(id: string): Promise<GlobalNetworkNodeDto | null>;
  listNodes(nodeType?: GlobalNodeType, tenantId?: string | null): Promise<GlobalNetworkNodeDto[]>;
  createEdge(data: { sourceNodeId: string; targetNodeId: string; edgeType: GlobalEdgeType; weight?: number; metadata?: Record<string, any> }): Promise<GlobalNetworkEdgeDto>;
  getGlobalGraph(limit?: number): Promise<GlobalGraphDto>;
  getRecommendations(nodeId: string): Promise<any[]>;

  // Module 4: Global Talent Cloud
  createTalentProfile(userId: string, data: Partial<TalentProfileDto>): Promise<TalentProfileDto>;
  getTalentProfileByUserId(userId: string): Promise<TalentProfileDto | null>;
  listTalentProfiles(tier?: ReputationTier, minScore?: number): Promise<TalentProfileDto[]>;
  addVerifiedSkill(talentProfileId: string, skillName: string, proficiencyLevel?: string, score?: number): Promise<VerifiedSkillDto>;
  listVerifiedSkills(talentProfileId: string): Promise<VerifiedSkillDto[]>;
  createSkillVerificationRequest(talentProfileId: string, req: SkillVerificationRequestDto): Promise<any>;

  // Module 5: AI Entrepreneurship Platform
  createStartupProfile(founderUserId: string, data: Partial<StartupProfileDto>): Promise<StartupProfileDto>;
  getStartupProfileById(id: string): Promise<StartupProfileDto | null>;
  listStartupProfiles(stage?: VentureStage, industry?: string): Promise<StartupProfileDto[]>;
  createFounderMatch(startupId: string, matchedUserId: string, matchScore: number, complementarySkills: string[], roleFit: string): Promise<FounderMatchDto>;
  listFounderMatches(startupId: string): Promise<FounderMatchDto[]>;

  // Module 6: Global Research Network
  createPublication(authorUserId: string, data: Partial<ResearchPublicationDto>): Promise<ResearchPublicationDto>;
  getPublicationById(id: string): Promise<ResearchPublicationDto | null>;
  listPublications(domain?: string, status?: PublicationStatus): Promise<ResearchPublicationDto[]>;
  createCitation(sourceId: string, targetId: string, contextSnippet?: string, weight?: number): Promise<ResearchCitationDto>;
  listCitations(publicationId: string): Promise<ResearchCitationDto[]>;

  // Module 7: Digital Twin Ecosystem
  createDigitalTwin(entityId: string, twinType: DigitalTwinType, name: string, stateSnapshot?: Record<string, any>, behavioralModel?: Record<string, any>): Promise<DigitalTwinDto>;
  getDigitalTwinById(id: string): Promise<DigitalTwinDto | null>;
  listDigitalTwins(twinType?: DigitalTwinType): Promise<DigitalTwinDto[]>;
  updateDigitalTwinState(id: string, stateSnapshot: Record<string, any>): Promise<DigitalTwinDto | null>;

  // Module 8: AI Economy & Token System
  getReputation(userId: string): Promise<EcosystemReputationDto>;
  updateReputation(userId: string, scoreDelta: number, skillCreditsDelta?: number): Promise<EcosystemReputationDto>;
  createReward(userId: string, rewardType: string, skillCredits: number, reason: string, txRef?: string): Promise<EcosystemRewardDto>;
  listRewards(userId: string): Promise<EcosystemRewardDto[]>;

  // Module 10: Trends & Events
  recordTrend(trendName: string, category: TrendCategory, momentumScore?: number, growthRate?: number, demandScore?: number): Promise<TrendSignalDto>;
  listTrends(category?: TrendCategory): Promise<TrendSignalDto[]>;
  recordEvent(category: EcosystemEventCategory, title: string, description: string, payload?: Record<string, any>, actorUserId?: string | null): Promise<any>;
}
