import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PredictiveIntelligenceService } from '../../src/modules/cognitive-core/predictiveIntelligenceService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { PredictionHorizon } from '@codeforge/shared';

describe('Phase 18: Predictive Intelligence Engine Unit Tests', () => {
  it('should generate predictive forecasts with success probabilities across horizons', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new PredictiveIntelligenceService(repo);

    const forecast = await service.generateForecast({
      targetScope: 'project',
      targetId: 'proj-compiler-v2',
      horizon: PredictionHorizon.NINETY_DAYS,
    });

    assert.ok(forecast);
    assert.strictEqual(forecast.horizon, PredictionHorizon.NINETY_DAYS);
    assert.ok(forecast.successProbability >= 0.85);
    assert.ok(forecast.expectedOutcomes.length > 0);
    assert.ok(forecast.riskFactors.length > 0);
    assert.ok(forecast.actionableRecommendations.length > 0);
  });

  it('should filter predictive forecasts by horizon and target ID', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new PredictiveIntelligenceService(repo);

    await service.generateForecast({
      targetScope: 'user',
      targetId: 'user-pred-1',
      horizon: PredictionHorizon.SEVEN_DAYS,
    });

    await service.generateForecast({
      targetScope: 'user',
      targetId: 'user-pred-1',
      horizon: PredictionHorizon.FIVE_YEARS,
    });

    const sevenDayList = await service.listForecasts('user-pred-1', PredictionHorizon.SEVEN_DAYS);
    const fiveYearList = await service.listForecasts('user-pred-1', PredictionHorizon.FIVE_YEARS);

    assert.strictEqual(sevenDayList.length, 1);
    assert.strictEqual(fiveYearList.length, 1);
  });
});
