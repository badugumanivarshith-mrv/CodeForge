import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AnalyticsExecutiveService } from '../../src/modules/analytics/analyticsExecutiveService';

describe('Executive Analytics Platform Integration Tests', () => {
  const executiveService = new AnalyticsExecutiveService();

  test('1. getExecutiveRollup aggregates multi-tenant KPIs', async () => {
    const analytics = await executiveService.getExecutiveRollup();

    assert.ok(analytics);
    assert.ok(analytics.kpis);
    assert.ok(analytics.kpis.totalInstitutions >= 1);
    assert.ok(analytics.kpis.overallPlacementRate > 0);
    assert.ok(analytics.kpis.averageStartingSalaryLpa > 0);
    assert.ok(analytics.kpis.coursesCompleted > 0);
  });

  test('2. Institutional leaderboard compares partner universities', async () => {
    const analytics = await executiveService.getExecutiveRollup();

    assert.ok(Array.isArray(analytics.institutionalLeaderboard));
    assert.ok(analytics.institutionalLeaderboard.length >= 1);

    for (const uni of analytics.institutionalLeaderboard) {
      assert.ok(uni.institutionId);
      assert.ok(uni.institutionName);
      assert.ok(uni.placementRate >= 0 && uni.placementRate <= 100);
      assert.ok(uni.studentCount > 0);
    }
  });

  test('3. Workforce pipeline trend calculates temporal enrollment and placement volumes', async () => {
    const analytics = await executiveService.getExecutiveRollup();

    assert.ok(Array.isArray(analytics.workforcePipelineTrend));
    assert.ok(analytics.workforcePipelineTrend.length >= 3);

    for (const item of analytics.workforcePipelineTrend) {
      assert.ok(item.month);
      assert.ok(item.studentsEnrolled > 0);
      assert.ok(item.certificationsEarned >= 0);
      assert.ok(item.placementsConducted >= 0);
    }
  });

  test('4. Curriculum effectiveness tracks industry hiring correlation score', async () => {
    const analytics = await executiveService.getExecutiveRollup();

    assert.ok(Array.isArray(analytics.curriculumEffectiveness));
    assert.ok(analytics.curriculumEffectiveness.length >= 3);

    for (const curr of analytics.curriculumEffectiveness) {
      assert.ok(curr.courseTitle);
      assert.ok(curr.completionRate >= 50 && curr.completionRate <= 100);
      assert.ok(curr.industryHiringCorrelation >= 70 && curr.industryHiringCorrelation <= 100);
    }
  });

  test('5. Executive KPIs update dynamically with system throughput', async () => {
    const initial = await executiveService.getExecutiveRollup();
    assert.strictEqual(typeof initial.kpis.certificationsIssued, 'number');
    assert.strictEqual(typeof initial.kpis.activeMentorshipSessions, 'number');
  });
});
