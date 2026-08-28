import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AnalyticsService } from '../../src/services/analytics.service';
import { AuthService } from '../../src/services/auth.service';
import { JudgeService } from '../../src/modules/judge/judgeService';
import { ProblemRepository } from '../../src/repositories';
import { LanguageId, JudgeVerdict } from '@codeforge/shared';

describe('Analytics Service Unit & Computation Tests', () => {
  const analyticsService = new AnalyticsService();
  const authService = new AuthService();
  const judgeService = new JudgeService();
  const problemRepo = new ProblemRepository();

  let testUserId = '';
  let problemId = '';

  test('Setup: Create user and identify test problem', async () => {
    const unique = Date.now();
    const u = await authService.register({
      email: `analytics_user_${unique}@codeforge.dev`,
      username: `analytics_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Analytics Test User',
    });
    testUserId = u.user.id;

    const p = await problemRepo.findBySlug('two-sum-target');
    assert.ok(p);
    problemId = p.id;
  });

  test('1. Compute initial stats for user with zero submissions', async () => {
    const stats = await analyticsService.getPerformanceAnalytics(testUserId);
    assert.strictEqual(stats.totalSubmissions, 0);
    assert.strictEqual(stats.acceptedSubmissions, 0);
    assert.strictEqual(stats.acceptanceRate, 0);
    assert.strictEqual(stats.averageRuntimeMs, 0);
    assert.strictEqual(stats.averageMemoryKb, 0);
    assert.strictEqual(stats.languageUsage.length, 0);
  });

  test('2. Compute metrics after mixed accepted and wrong submissions', async () => {
    // Submit 1 wrong answer
    await judgeService.submitSolution(testUserId, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: 'print("WRONG")',
    });

    // Submit 1 accepted answer
    const acCode = `
import json
import sys

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    lines = [l.strip() for l in raw.splitlines() if l.strip()]
    if len(lines) >= 2:
        nums = json.loads(lines[0])
        target = int(lines[1])
        res = two_sum(nums, target)
        print(json.dumps(res))
`;
    await judgeService.submitSolution(testUserId, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: acCode,
    });

    const stats = await analyticsService.getPerformanceAnalytics(testUserId);
    assert.strictEqual(stats.totalSubmissions, 2);
    assert.strictEqual(stats.acceptedSubmissions, 1);
    assert.strictEqual(stats.acceptanceRate, 50); // 1/2 = 50%
    assert.ok(stats.averageRuntimeMs >= 0);
    assert.ok(stats.averageMemoryKb >= 0);
    assert.ok(stats.languageUsage.length > 0);
    assert.strictEqual(stats.languageUsage[0].languageId, LanguageId.PYTHON);
    assert.strictEqual(stats.languageUsage[0].count, 2);
  });

  test('3. Compute difficulty solve count breakdown', async () => {
    const stats = await analyticsService.getPerformanceAnalytics(testUserId);
    assert.ok(stats.solvedByDifficulty);
    assert.strictEqual(stats.solvedByDifficulty.easy, 1);
    assert.strictEqual(stats.solvedByDifficulty.total, 1);
  });

  test('4. Compute recent activity trend metrics', async () => {
    const stats = await analyticsService.getPerformanceAnalytics(testUserId);
    assert.ok(stats.recentTrend);
    assert.ok(stats.recentTrend.length >= 1);
    assert.strictEqual(stats.recentTrend[0].submissionsCount, 2);
    assert.strictEqual(stats.recentTrend[0].acceptedCount, 1);
  });
});
