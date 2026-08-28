import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EconomicIntelligenceService } from '../../src/modules/planetary-network/economicIntelligenceService';
import { EconomicSignalType } from '@codeforge/shared';

function createMockEconRepo() {
  const signals: any[] = [];
  const forecasts: any[] = [];

  return {
    async recordEconomicSignal(s: any) {
      const item = { ...s, id: `sig-${Date.now()}` };
      signals.unshift(item);
      return item;
    },
    async listEconomicSignals(type?: EconomicSignalType, limit: number = 20) {
      let list = signals;
      if (type) list = list.filter((s) => s.signalType === type);
      return list.slice(0, limit);
    },
    async createEconomicForecast(f: any) {
      const item = { ...f, id: `fc-${Date.now()}` };
      forecasts.unshift(item);
      return item;
    },
    async getLatestEconomicForecasts(limit: number = 10) {
      return forecasts.slice(0, limit);
    },
  } as any;
}

describe('Phase 17: Global Economic Intelligence Unit Tests', () => {
  it('should record real-time economic signals', async () => {
    const repo = createMockEconRepo();
    const service = new EconomicIntelligenceService(repo);

    const signal = await service.recordSignal({
      signalType: EconomicSignalType.COMPUTE_DEMAND,
      sector: 'Planetary High-Throughput Token Execution',
      intensityScore: 92.5,
      region: 'North America Mesh Hub',
      metadata: { gpuClusterSaturation: 0.88 },
    });

    assert.ok(signal);
    assert.strictEqual(signal.signalType, EconomicSignalType.COMPUTE_DEMAND);
    assert.strictEqual(signal.intensityScore, 92.5);

    const list = await service.listSignals(EconomicSignalType.COMPUTE_DEMAND);
    assert.strictEqual(list.length, 1);
  });

  it('should generate macroeconomic forecast with talent demand and skill premiums', async () => {
    const repo = createMockEconRepo();
    const service = new EconomicIntelligenceService(repo);

    await service.recordSignal({
      signalType: EconomicSignalType.TALENT_INFLOW,
      sector: 'Autonomous Multi-Agent Engineering',
      intensityScore: 96.0,
    });

    const forecast = await service.generateMacroForecast(12);
    assert.ok(forecast);
    assert.strictEqual(forecast.horizonMonths, 12);
    assert.ok(forecast.talentDemandGrowth > 0);
    assert.ok(forecast.macroEconomicHealthScore > 80);
    assert.ok(forecast.skillPremiumTrends.length > 0);
  });

  it('should filter economic signals by signal type', async () => {
    const repo = createMockEconRepo();
    const service = new EconomicIntelligenceService(repo);

    await service.recordSignal({
      signalType: EconomicSignalType.SKILL_PREMIUM,
      sector: 'Quantum Cryptography',
      intensityScore: 88.0,
    });

    await service.recordSignal({
      signalType: EconomicSignalType.STARTUP_CAPITAL,
      sector: 'AI Infrastructure',
      intensityScore: 94.0,
    });

    const capitalSignals = await service.listSignals(EconomicSignalType.STARTUP_CAPITAL);
    assert.strictEqual(capitalSignals.length, 1);
    assert.strictEqual(capitalSignals[0].sector, 'AI Infrastructure');
  });
});
