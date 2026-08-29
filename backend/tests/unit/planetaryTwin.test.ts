import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PlanetaryTwinService } from '../../src/modules/planetary-network/planetaryTwinService';
import { PlanetaryTwinType } from '@codeforge/shared';

function createMockTwinRepo() {
  const twins: Map<string, any> = new Map();
  const simulations: any[] = [];

  return {
    async listPlanetaryTwins(twinType?: PlanetaryTwinType) {
      let list = Array.from(twins.values());
      if (twinType) list = list.filter((t) => t.twinType === twinType);
      return list;
    },
    async createPlanetaryTwin(data: any) {
      const twin = { ...data, id: `twin-${Date.now()}-${Math.random().toString(36).slice(2)}` };
      twins.set(twin.id, twin);
      return twin;
    },
    async getPlanetaryTwin(id: string) {
      return twins.get(id) || null;
    },
    async updatePlanetaryTwinState(id: string, state: any) {
      const existing = twins.get(id);
      if (existing) {
        existing.stateSnapshot = { ...existing.stateSnapshot, ...state };
        twins.set(id, existing);
      }
      return existing;
    },
    async recordPlanetarySimulation(sim: any) {
      const item = { ...sim, id: `sim-${Date.now()}` };
      simulations.unshift(item);
      return item;
    },
    async getSimulationsByTwinId(twinId: string) {
      return simulations.filter((s) => s.twinId === twinId);
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: Planetary Digital Twins Unit Tests', () => {
  it('should create and retrieve a planetary digital twin', async () => {
    const repo = createMockTwinRepo();
    const service = new PlanetaryTwinService(repo);

    const twin = await service.createTwin({
      twinType: PlanetaryTwinType.GLOBAL_ECONOMY,
      entityName: 'Global AI Compute Liquidity Twin',
      stateSnapshot: { activeLiquidityPoolUsd: 250000000 },
      fidelityScore: 98.5,
    });

    assert.ok(twin);
    assert.strictEqual(twin.twinType, PlanetaryTwinType.GLOBAL_ECONOMY);
    assert.strictEqual(twin.entityName, 'Global AI Compute Liquidity Twin');

    const fetched = await service.getTwin(twin.id);
    assert.ok(fetched);
    assert.strictEqual(fetched.fidelityScore, 98.5);
  });

  it('should run a 30-day Monte Carlo scenario simulation on a planetary twin', async () => {
    const repo = createMockTwinRepo();
    const service = new PlanetaryTwinService(repo);

    const twin = await service.createTwin({
      twinType: PlanetaryTwinType.WORKFORCE,
      entityName: 'Autonomous Engineering Workforce Twin',
    });

    const sim = await service.runScenarioSimulation(
      twin.id,
      'Multi-Agent Squeeze Scenario',
      30,
      { trafficSurgeFactor: 3.5 }
    );

    assert.ok(sim);
    assert.strictEqual(sim.twinId, twin.id);
    assert.ok(sim.monteCarloConfidence > 0.9);
    assert.ok(sim.projectedOutcomes.length > 0);
    assert.ok(sim.optimizedInterventions.length > 0);
  });

  it('should reject simulation on non-existent planetary twin', async () => {
    const repo = createMockTwinRepo();
    const service = new PlanetaryTwinService(repo);

    await assert.rejects(
      async () => {
        await service.runScenarioSimulation('invalid-twin-id', 'Test Scenario');
      },
      /Planetary twin not found/
    );
  });
});
