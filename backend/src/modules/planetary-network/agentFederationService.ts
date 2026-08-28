import { randomUUID } from 'crypto';
import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  AgentFederationDto,
  AgentFederationReputationDto,
  AgentDelegationPlanDto,
  AgentFederationStatus,
  FederationProtocol,
} from '@codeforge/shared';

export class AgentFederationService {
  private repo: IPlanetaryIntelligenceRepository;
  private delegations: Map<string, AgentDelegationPlanDto> = new Map();

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
  }

  async formFederation(data: {
    federationName: string;
    organizationId: string;
    protocol?: FederationProtocol;
    participatingAgentCount?: number;
  }): Promise<AgentFederationDto> {
    const federation = await this.repo.createAgentFederation({
      federationName: data.federationName,
      organizationId: data.organizationId,
      protocol: data.protocol || FederationProtocol.MULTI_AGENT_CONSENSUS,
      status: AgentFederationStatus.ONLINE,
      participatingAgentCount: data.participatingAgentCount || 10,
      totalNegotiationsHandled: 0,
      cooperationIndex: 99.0,
    });

    await this.repo.recordPlanetaryEvent(
      'federation_formed',
      `Established autonomous agent federation: ${federation.federationName}`,
      federation.id,
      { protocol: federation.protocol, agentCount: federation.participatingAgentCount }
    );

    return federation;
  }

  async negotiateAndDelegateTask(data: {
    sourceFederationId: string;
    targetFederationId: string;
    taskPayload: Record<string, any>;
    bountyCredits: number;
    timeoutSeconds?: number;
  }): Promise<AgentDelegationPlanDto> {
    const src = await this.repo.getAgentFederation(data.sourceFederationId);
    const dest = await this.repo.getAgentFederation(data.targetFederationId);
    if (!src || !dest) {
      throw new Error('Both source and destination federations must exist for autonomous delegation');
    }

    const plan: AgentDelegationPlanDto = {
      planId: `del-${Date.now()}-${randomUUID().slice(0, 8)}`,
      sourceFederationId: data.sourceFederationId,
      targetFederationId: data.targetFederationId,
      taskPayload: data.taskPayload,
      negotiatedBountyCredits: data.bountyCredits,
      slaTimeoutSeconds: data.timeoutSeconds || 300,
      status: 'accepted',
    };

    this.delegations.set(plan.planId, plan);

    // Update federation metrics
    src.totalNegotiationsHandled += 1;
    dest.totalNegotiationsHandled += 1;

    return plan;
  }

  async updateAgentTrustScore(agentId: string, federationId: string, scoreDelta: number): Promise<AgentFederationReputationDto> {
    const existing = await this.repo.getAgentReputations(federationId);
    const rep = existing.find((r) => r.agentId === agentId) || {
      agentId,
      federationId,
      trustScore: 90.0,
      successfulDelegations: 0,
      disputeRate: 0.0,
      reputationBadge: 'Autonomous Agent',
    };

    const newScore = Math.max(0, Math.min(100, rep.trustScore + scoreDelta));
    rep.trustScore = parseFloat(newScore.toFixed(2));
    if (scoreDelta > 0) rep.successfulDelegations += 1;

    if (rep.trustScore >= 98.0) rep.reputationBadge = 'Luminary Autonomous Agent';
    else if (rep.trustScore >= 95.0) rep.reputationBadge = 'Master Agent';
    else if (rep.trustScore >= 90.0) rep.reputationBadge = 'Trusted Fellow';

    return this.repo.upsertAgentReputation(rep);
  }

  async listFederations(status?: AgentFederationStatus): Promise<AgentFederationDto[]> {
    return this.repo.listAgentFederations(status);
  }

  async getFederationReputations(federationId: string): Promise<AgentFederationReputationDto[]> {
    return this.repo.getAgentReputations(federationId);
  }

  async getDelegationPlan(planId: string): Promise<AgentDelegationPlanDto | null> {
    return this.delegations.get(planId) || null;
  }
}
