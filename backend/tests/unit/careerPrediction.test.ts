import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CareerPredictionService } from '../../src/modules/career-os/careerPredictionService';
import { ForecastHorizon } from '@codeforge/shared';

describe('Career Prediction Engine Unit Tests', () => {
  const mockRepo: any = {
    predictions: new Map(),
    async savePredictions(twinId: string, userId: string, data: any) {
      this.predictions.set(userId, data);
      return data;
    },
    async getLatestPredictions(userId: string) {
      return this.predictions.get(userId) || null;
    },
  };

  const mockTwinService: any = {
    async getOrCreateTwin(userId: string) {
      return {
        id: `twin-${userId}`,
        userId,
        currentRole: 'Software Engineer',
        currentLevel: 'L4 / Mid-Level',
        targetRole: 'Senior Distributed Systems Engineer',
        targetLevel: 'L5 / Senior',
        yearsOfExperience: 3,
        primarySkills: ['TypeScript', 'Node.js', 'PostgreSQL'],
        growthAreas: ['Distributed Systems', 'Rust', 'Raft Consensus'],
        topStrengths: ['High Commit Velocity', 'Typed Architecture'],
        healthScore: 78,
        learningVelocity: 82,
        careerMomentum: 75,
        marketCompetitiveness: 80,
        interviewReadiness: 72,
        salaryPositioning: 75,
        leadershipPotential: 68,
        currentSalaryUsd: 125000,
        targetSalaryUsd: 185000,
      };
    },
  };

  const predictionService = new CareerPredictionService(mockRepo, mockTwinService);

  test('1. generatePredictions produces multi-horizon predictions across 6M, 1Y, 3Y, 5Y', async () => {
    const report = await predictionService.generatePredictions('user-pred-1');

    assert.ok(report);
    assert.strictEqual(report.userId, 'user-pred-1');
    assert.strictEqual(report.predictions.length, 4);

    const horizons = report.predictions.map(p => p.horizon);
    assert.ok(horizons.includes(ForecastHorizon.MONTHS_6));
    assert.ok(horizons.includes(ForecastHorizon.YEAR_1));
    assert.ok(horizons.includes(ForecastHorizon.YEARS_3));
    assert.ok(horizons.includes(ForecastHorizon.YEARS_5));
  });

  test('2. generatePredictions yields probabilities within valid [0, 100] bounds', async () => {
    const report = await predictionService.generatePredictions('user-pred-1');

    for (const pred of report.predictions) {
      assert.ok(pred.promotionProbability >= 0 && pred.promotionProbability <= 100);
      assert.ok(pred.salaryGrowthProbability >= 0 && pred.salaryGrowthProbability <= 100);
      assert.ok(pred.jobSwitchProbability >= 0 && pred.jobSwitchProbability <= 100);
      assert.ok(pred.leadershipReadiness >= 0 && pred.leadershipReadiness <= 100);
      assert.ok(pred.skillRelevanceScore >= 0 && pred.skillRelevanceScore <= 100);
      assert.ok(pred.careerRiskScore >= 0 && pred.careerRiskScore <= 100);
      assert.ok(pred.confidenceScore >= 0 && pred.confidenceScore <= 100);
    }
  });

  test('3. generatePredictions includes predicted roles, growth drivers, and risk factors', async () => {
    const report = await predictionService.generatePredictions('user-pred-1');

    for (const p of report.predictions) {
      assert.ok(p.predictedRoles.length >= 1);
      assert.ok(p.growthDrivers.length >= 1);
      assert.ok(p.riskFactors.length >= 1);
    }
  });

  test('4. generatePredictions includes fastestPathToTarget and strategic recommendations', async () => {
    const report = await predictionService.generatePredictions('user-pred-1');

    assert.ok(report.fastestPathToTarget.length > 0);
    assert.ok(report.topRecommendations.length >= 3);
  });

  test('5. getLatestPredictions returns cached predictions when available', async () => {
    const cached = await predictionService.getLatestPredictions('user-pred-1');

    assert.ok(cached);
    assert.strictEqual(cached.userId, 'user-pred-1');
    assert.strictEqual(cached.predictions.length, 4);
  });

  test('6. getLatestPredictions generates fresh predictions if none previously stored', async () => {
    const fresh = await predictionService.getLatestPredictions('user-pred-new');

    assert.ok(fresh);
    assert.strictEqual(fresh.userId, 'user-pred-new');
    assert.strictEqual(fresh.predictions.length, 4);
  });
});
