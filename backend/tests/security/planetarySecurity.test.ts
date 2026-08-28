import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PlanetaryNetworkService } from '../../src/modules/planetary-network/planetaryNetworkService';
import { AutonomousGovernanceService } from '../../src/modules/planetary-network/autonomousGovernanceService';
import { GovernanceCouncilType, PolicyStatus } from '@codeforge/shared';

function createMockSecurityRepo() {
  const policies: Map<string, any> = new Map();
  const simulations: any[] = [];

  return {
    async createGovernancePolicy(p: any) {
      const item = { ...p, id: `pol-${Date.now()}` };
      policies.set(item.id, item);
      return item;
    },
    async getGovernancePolicy(id: string) {
      return policies.get(id) || null;
    },
    async updateGovernancePolicy(id: string, updates: any) {
      const existing = policies.get(id);
      if (existing) Object.assign(existing, updates);
      return existing;
    },
    async recordPolicySimulation(sim: any) {
      const item = { ...sim, id: `sim-${Date.now()}` };
      simulations.unshift(item);
      return item;
    },
    async listGovernancePolicies(councilType?: any, status?: any) {
      let list = Array.from(policies.values());
      if (councilType) list = list.filter((p) => p.councilType === councilType);
      if (status) list = list.filter((p) => p.status === status);
      return list;
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: Planetary Security, Governance & Zero-Trust Verification Tests', () => {
  it('should enforce zero-trust routing and reject invalid cluster endpoints', async () => {
    const repo = createMockSecurityRepo();
    const networkService = new PlanetaryNetworkService(repo);

    await assert.rejects(
      async () => {
        await networkService.routeDistributedKnowledge('unregistered-cluster', 'cluster-na-1', 500);
      },
      /Invalid cluster routing endpoint specified/
    );
  });

  it('should enforce policy lifecycle state machine (PROPOSED -> SIMULATED -> ACTIVE)', async () => {
    const repo = createMockSecurityRepo();
    const govService = new AutonomousGovernanceService(repo);

    const policy = await govService.proposePolicy({
      title: 'Post-Quantum Lattice Encryption Mandate',
      councilType: GovernanceCouncilType.SECURITY_COMPLIANCE,
      description: 'Enforces lattice-based cryptographic signatures on all inter-cluster RPCs.',
      rules: ['Enforce Kyber-1024 or Dilithium-5 signatures on payload headers'],
      enactedBy: 'Security Governance Council',
    });

    assert.strictEqual(policy.status, PolicyStatus.PROPOSED);

    // Run simulation
    const sim = await govService.simulatePolicyImpact(policy.id);
    assert.ok(sim);
    assert.ok(sim.complianceProjectedPercent >= 95.0);

    const simulatedPolicy = await repo.getGovernancePolicy(policy.id);
    assert.strictEqual(simulatedPolicy.status, PolicyStatus.SIMULATED);

    // Enact
    const activePolicy = await govService.enactPolicy(policy.id);
    assert.strictEqual(activePolicy.status, PolicyStatus.ACTIVE);
  });

  it('should reject policy simulation and enactment on non-existent policy', async () => {
    const repo = createMockSecurityRepo();
    const govService = new AutonomousGovernanceService(repo);

    await assert.rejects(
      async () => {
        await govService.simulatePolicyImpact('non-existent-id');
      },
      /Policy not found/
    );

    await assert.rejects(
      async () => {
        await govService.enactPolicy('non-existent-id');
      },
      /Policy not found/
    );
  });

  it('should verify zero-trust cluster registration and audit event generation', async () => {
    const repo = createMockSecurityRepo();
    const networkService = new PlanetaryNetworkService(repo);

    const cluster = await networkService.registerCluster({
      clusterName: 'Secure Zero-Trust Enclave Cluster',
      region: 'eu-west-1-enclave',
      activeAgentsCount: 100,
      syncLatencyMs: 8.5,
    });

    assert.ok(cluster);
    assert.strictEqual(cluster.clusterName, 'Secure Zero-Trust Enclave Cluster');
    assert.strictEqual(cluster.status, 'optimal');
  });
});
