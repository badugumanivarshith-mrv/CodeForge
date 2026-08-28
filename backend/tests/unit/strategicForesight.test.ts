import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StrategicForesightService } from '../../src/modules/planetary-network/strategicForesightService';
import { ForesightHorizon, InnovationDomain } from '@codeforge/shared';

function createMockForesightRepo() {
  const forecasts: any[] = [];

  return {
    async createStrategicForecast(data: any) {
      const item = { ...data, id: `fc-${Date.now()}` };
      forecasts.unshift(item);
      return item;
    },
    async listStrategicForecasts(horizon?: ForesightHorizon, domain?: InnovationDomain) {
      let list = forecasts;
      if (horizon) list = list.filter((f) => f.horizon === horizon);
      if (domain) list = list.filter((f) => f.domain === domain);
      return list;
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: Strategic Foresight Engine Unit Tests', () => {
  it('should generate strategic foresight horizon forecast with confidence scoring', async () => {
    const repo = createMockForesightRepo();
    const service = new StrategicForesightService(repo);

    const forecast = await service.generateForecast({
      horizon: ForesightHorizon.FIVE_YEAR,
      domain: InnovationDomain.AUTONOMOUS_SYSTEMS,
      title: 'Global Autonomous Infrastructure Convergence',
      forecastNarrative: 'Over 90% of global compute infrastructure self-tunes and self-repairs using speculative AI reasoning.',
      opportunityRank: 1,
      riskRank: 1,
      confidenceScore: 94.0,
      recommendedPlaybook: ['Enact planetary safety sandbox policy', 'Scale cluster bandwidth'],
    });

    assert.ok(forecast);
    assert.strictEqual(forecast.horizon, ForesightHorizon.FIVE_YEAR);
    assert.strictEqual(forecast.confidenceScore, 94.0);
    assert.strictEqual(forecast.recommendedPlaybook.length, 2);
  });

  it('should filter forecasts by horizon and innovation domain', async () => {
    const repo = createMockForesightRepo();
    const service = new StrategicForesightService(repo);

    await service.generateForecast({
      horizon: ForesightHorizon.ONE_YEAR,
      domain: InnovationDomain.CYBERSECURITY,
      title: 'Zero-Trust Multi-Tenant Memory Shield',
      forecastNarrative: 'Hardware-enforced enclaves become standard for all multi-tenant AI agents.',
    });

    await service.generateForecast({
      horizon: ForesightHorizon.TEN_YEAR,
      domain: InnovationDomain.QUANTUM_COMPUTE,
      title: 'Decentralized Quantum State Routing',
      forecastNarrative: 'Quantum internet meshes link regional intelligence clusters.',
    });

    const oneYearList = await service.listForecasts(ForesightHorizon.ONE_YEAR);
    const quantumList = await service.listForecasts(undefined, InnovationDomain.QUANTUM_COMPUTE);

    assert.strictEqual(oneYearList.length, 1);
    assert.strictEqual(oneYearList[0].title, 'Zero-Trust Multi-Tenant Memory Shield');
    assert.strictEqual(quantumList.length, 1);
  });
});
