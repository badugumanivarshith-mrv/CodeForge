import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SalaryIntelligenceService } from '../../src/modules/career-os/salaryIntelligenceService';

describe('Salary Intelligence Platform Unit Tests', () => {
  const salaryService = new SalaryIntelligenceService();

  test('1. getSalaryBenchmarks provides ascending P25, P50, P75, P90 percentiles', () => {
    const benchmarks = salaryService.getSalaryBenchmarks();

    assert.ok(Array.isArray(benchmarks));
    assert.ok(benchmarks.length >= 4);

    for (const b of benchmarks) {
      assert.ok(b.p25SalaryUsd < b.p50SalaryUsd);
      assert.ok(b.p50SalaryUsd < b.p75SalaryUsd);
      assert.ok(b.p75SalaryUsd < b.p90SalaryUsd);
      assert.ok(b.annualBonusAvgUsd > 0);
      assert.ok(b.equityAvgUsd > 0);
    }
  });

  test('2. getSalaryIntelligenceReport calculates accurate percentile positioning', () => {
    const p50Report = salaryService.getSalaryIntelligenceReport('Distributed Systems Engineer', 'Senior (L5)', 185000);
    assert.strictEqual(p50Report.userPositionPercentile, 50);

    const highReport = salaryService.getSalaryIntelligenceReport('Distributed Systems Engineer', 'Senior (L5)', 250000);
    assert.ok(highReport.userPositionPercentile >= 75);
  });

  test('3. getSkillSalaryPremiums returns market boost for high-value skills', () => {
    const premiums = salaryService.getSkillSalaryPremiums();

    assert.ok(Array.isArray(premiums));
    assert.ok(premiums.length >= 4);

    const rustPremium = premiums.find(p => p.skill.includes('Rust'));
    assert.ok(rustPremium);
    assert.ok(rustPremium.salaryPremiumPercentage >= 15);
    assert.ok(rustPremium.avgEstimatedBoostUsd >= 20000);
  });

  test('4. getSalaryIntelligenceReport models promotion and job-switch compensation increases', () => {
    const report = salaryService.getSalaryIntelligenceReport('Distributed Systems Engineer', 'Senior (L5)', 150000);

    assert.ok(report.promotionSalaryForecastUsd > 150000);
    assert.ok(report.jobSwitchSalaryForecastUsd > report.promotionSalaryForecastUsd);
  });

  test('5. getSalaryIntelligenceReport generates full executive report with recommendations', () => {
    const report = salaryService.getSalaryIntelligenceReport('Distributed Systems Engineer', 'Senior (L5)', 150000);

    assert.ok(report);
    assert.strictEqual(report.userRole, 'Distributed Systems Engineer');
    assert.ok(report.userPositionPercentile > 0);
    assert.ok(report.benchmarks.length >= 1);
    assert.ok(report.skillSalaryPremiums.length >= 3);
    assert.ok(report.compensationRecommendations.length >= 3);
  });

  test('6. getSalaryIntelligenceReport handles unknown roles gracefully via default benchmark', () => {
    const report = salaryService.getSalaryIntelligenceReport('Unknown Quantum Role', 'Custom Level', 130000);

    assert.ok(report);
    assert.ok(report.currentEstimatedP50 >= 100000);
    assert.ok(report.benchmarks.length >= 1);
  });
});
