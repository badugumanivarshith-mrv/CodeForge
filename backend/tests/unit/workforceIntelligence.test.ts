import { test, describe } from 'node:test';
import assert from 'node:assert';
import { WorkforceIntelligenceService } from '../../src/modules/intelligence/workforceIntelligenceService';

describe('Workforce Intelligence Unit Tests', () => {
  const intelligenceService = new WorkforceIntelligenceService();

  test('1. calculateWorkforceReadiness returns score within [10, 100] and distributes talent clusters', () => {
    const result = intelligenceService.calculateWorkforceReadiness(200, 85, 170);

    assert.ok(result);
    assert.strictEqual(typeof result.overallReadinessIndex, 'number');
    assert.ok(result.overallReadinessIndex >= 80, `Expected readiness >= 80, got ${result.overallReadinessIndex}`);
    assert.strictEqual(result.activeLearnersCount, 200);
    assert.ok(result.jobReadyTalentCount > 0);
    assert.strictEqual(result.topTalentClusters.length, 4);

    // Sum of cluster percentages is roughly jobReadyTalentCount
    const totalClusterCount = result.topTalentClusters.reduce((sum, c) => sum + c.candidateCount, 0);
    assert.ok(totalClusterCount <= result.jobReadyTalentCount + 5);
  });

  test('2. calculateWorkforceReadiness handles 0 learners gracefully without divide-by-zero', () => {
    const result = intelligenceService.calculateWorkforceReadiness(0, 0, 0);

    assert.ok(result);
    assert.strictEqual(result.overallReadinessIndex, 10);
    assert.strictEqual(result.jobReadyTalentCount, 0);
  });

  test('3. getSkillDemandForecasts returns high-demand and high-velocity engineering skills', () => {
    const forecasts = intelligenceService.getSkillDemandForecasts();

    assert.ok(Array.isArray(forecasts));
    assert.ok(forecasts.length >= 6);

    const distributedSystems = forecasts.find(f => f.skill.includes('Distributed Systems'));
    assert.ok(distributedSystems);
    assert.ok(distributedSystems.growthRatePercentage >= 30);
    assert.ok(distributedSystems.demandScore >= 90);
  });

  test('4. getSalaryIntelligenceBenchmarks provides accurate percentiles across seniorities', () => {
    const salaries = intelligenceService.getSalaryIntelligenceBenchmarks();

    assert.ok(Array.isArray(salaries));
    assert.ok(salaries.length >= 5);

    for (const item of salaries) {
      assert.ok(item.percentile25th <= item.medianSalaryUsd);
      assert.ok(item.medianSalaryUsd <= item.percentile75th);
      assert.ok(item.percentile75th <= item.percentile90th);
      assert.ok(item.salaryGrowthYoY > 0);
    }
  });

  test('5. getTechAdoptionTrends correctly tags curriculum recommendations', () => {
    const trends = intelligenceService.getTechAdoptionTrends();

    assert.ok(Array.isArray(trends));
    assert.ok(trends.length >= 5);

    const rustTrend = trends.find(t => t.technology.includes('Rust'));
    assert.ok(rustTrend);
    assert.strictEqual(rustTrend.recommendedForCurriculum, true);
    assert.strictEqual(rustTrend.momentum, 'ACCELERATING');
  });

  test('6. generateFullReport aggregates composite intelligence telemetry', () => {
    const report = intelligenceService.generateFullReport(500);

    assert.ok(report);
    assert.ok(report.forecastDate);
    assert.strictEqual(report.workforceReadiness.activeLearnersCount, 500);
    assert.ok(report.topDemandedSkills.length >= 6);
    assert.ok(report.salaryIntelligence.length >= 5);
    assert.ok(report.techTrends.length >= 5);
  });
});
