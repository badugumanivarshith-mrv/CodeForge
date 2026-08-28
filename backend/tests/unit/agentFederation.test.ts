import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AgentFederationService } from '../../src/modules/planetary-network/agentFederationService';
import { FederationProtocol, AgentFederationStatus } from '@codeforge/shared';

function createMockAgentFedRepo() {
  const federations: Map<string, any> = new Map();
  const reputations: Map<string, any> = new Map();

  return {
    async createAgentFederation(data: any) {
      const item = { ...data, id: `fed-${Date.now()}` };
      federations.set(item.id, item);
      return item;
    },
    async getAgentFederation(id: string) {
      return federations.get(id) || null;
    },
    async listAgentFederations(status?: AgentFederationStatus) {
      let list = Array.from(federations.values());
      if (status) list = list.filter((f) => f.status === status);
      return list;
    },
    async upsertAgentReputation(rep: any) {
      const key = `${rep.federationId}:${rep.agentId}`;
      reputations.set(key, rep);
      return rep;
    },
    async getAgentReputations(federationId: string) {
      const list: any[] = [];
      for (const [k, v] of reputations.entries()) {
        if (v.federationId === federationId) list.push(v);
      }
      return list;
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: Autonomous Agent Federation Unit Tests', () => {
  it('should establish an autonomous agent federation', async () => {
    const repo = createMockAgentFedRepo();
    const service = new AgentFederationService(repo);

    const federation = await service.formFederation({
      federationName: 'Autonomous Security Auditing Federation',
      organizationId: 'org-enterprise-mesh',
      protocol: FederationProtocol.MULTI_AGENT_CONSENSUS,
      participatingAgentCount: 25,
    });

    assert.ok(federation);
    assert.strictEqual(federation.federationName, 'Autonomous Security Auditing Federation');
    assert.strictEqual(federation.status, AgentFederationStatus.ONLINE);
    assert.strictEqual(federation.participatingAgentCount, 25);
  });

  it('should negotiate and delegate task across federations', async () => {
    const repo = createMockAgentFedRepo();
    const service = new AgentFederationService(repo);

    const src = await service.formFederation({
      federationName: 'Frontend Synthesis Swarm',
      organizationId: 'org-frontend',
    });

    const dest = await service.formFederation({
      federationName: 'Database Sharding Swarm',
      organizationId: 'org-db',
    });

    const plan = await service.negotiateAndDelegateTask({
      sourceFederationId: src.id,
      targetFederationId: dest.id,
      taskPayload: { command: 'generate_crdt_cluster_schema' },
      bountyCredits: 50,
      timeoutSeconds: 120,
    });

    assert.ok(plan);
    assert.strictEqual(plan.status, 'accepted');
    assert.strictEqual(plan.negotiatedBountyCredits, 50);

    const fetched = await service.getDelegationPlan(plan.planId);
    assert.ok(fetched);
    assert.strictEqual(fetched.sourceFederationId, src.id);
  });

  it('should update agent trust score and award reputation badges', async () => {
    const repo = createMockAgentFedRepo();
    const service = new AgentFederationService(repo);

    const fed = await service.formFederation({
      federationName: 'Principal Architecture Swarm',
      organizationId: 'org-arch',
    });

    const rep = await service.updateAgentTrustScore('agent-super-1', fed.id, 9.0);
    assert.ok(rep);
    assert.ok(rep.trustScore >= 98.0);
    assert.strictEqual(rep.reputationBadge, 'Luminary Autonomous Agent');
  });
});
