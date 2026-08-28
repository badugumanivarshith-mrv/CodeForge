import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DigitalTwinService } from '../../src/modules/global-network/digitalTwinService';
import { DigitalTwinType } from '@codeforge/shared';

describe('Phase 16: Digital Twin Ecosystem Unit Tests', () => {
  const createMockRepo = () => {
    const twins = new Map<string, any>();
    const simulations = new Map<string, any[]>();

    return {
      twins,
      simulations,
      async createDigitalTwin(entityId: string, twinType: DigitalTwinType, name: string, snapshot: any, model: any) {
        const twin = {
          id: `dt-${Date.now()}`,
          entityId,
          twinType,
          name,
          stateSnapshot: snapshot,
          behavioralModel: model,
          accuracyRating: 95.0,
          lastSynchronizedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        twins.set(twin.id, twin);
        return twin;
      },
      async getDigitalTwinById(id: string) {
        return twins.get(id) || null;
      },
      async listDigitalTwins(twinType?: DigitalTwinType) {
        let list = Array.from(twins.values());
        if (twinType) list = list.filter(t => t.twinType === twinType);
        return list;
      },
      async updateDigitalTwinState(id: string, snapshot: any) {
        const t = twins.get(id);
        if (!t) return null;
        t.stateSnapshot = snapshot;
        t.lastSynchronizedAt = new Date().toISOString();
        return t;
      },
      async saveSimulationResult(twinId: string, scenario: any) {
        const sim = {
          id: `sim-${Date.now()}`,
          twinId,
          ...scenario,
          simulatedAt: new Date().toISOString(),
        };
        const list = simulations.get(twinId) || [];
        list.push(sim);
        simulations.set(twinId, list);
        return sim;
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should create a digital twin for an enterprise entity', async () => {
    const repo = createMockRepo();
    const service = new DigitalTwinService(repo);

    const twin = await service.createTwin({
      entityId: 'org-enterprise-corp',
      twinType: DigitalTwinType.ENTERPRISE_TWIN,
      name: 'Enterprise Corp Digital Mirror',
      stateSnapshot: { headCount: 120, cloudSpend: 50000 },
      behavioralModel: { scalingSensitivity: 1.2 },
    });

    assert.strictEqual(twin.name, 'Enterprise Corp Digital Mirror');
    assert.strictEqual(twin.twinType, DigitalTwinType.ENTERPRISE_TWIN);
    assert.strictEqual(twin.accuracyRating, 95.0);
  });

  test('should execute a predictive simulation on a digital twin', async () => {
    const repo = createMockRepo();
    const service = new DigitalTwinService(repo);

    const twin = await service.createTwin({
      entityId: 'agent-10',
      twinType: DigitalTwinType.AGENT_TWIN,
      name: 'Atlas Agent Replica',
    });

    const sim = await service.runSimulation(twin.id, 'High Load Burst 10k RPS', { burstDurationSec: 300 });

    assert.strictEqual(sim.twinId, twin.id);
    assert.strictEqual(sim.scenarioTitle, 'High Load Burst 10k RPS');
    assert.ok(sim.simulatedOutcomes.length >= 3, 'Should produce at least 3 simulation outcomes');
    assert.ok(sim.confidenceInterval.min < sim.confidenceInterval.max);
  });

  test('should synchronize state snapshot of a digital twin', async () => {
    const repo = createMockRepo();
    const service = new DigitalTwinService(repo);

    const twin = await service.createTwin({
      entityId: 'talent-99',
      twinType: DigitalTwinType.CAREER_TWIN,
      name: 'Career Trajectory Twin',
    });

    const updated = await service.syncTwinState(twin.id, {
      currentLevel: 'Staff Engineer',
      certifications: ['Multi-Agent Architecture Specialist'],
    });

    assert.strictEqual(updated.stateSnapshot.currentLevel, 'Staff Engineer');
  });
});
