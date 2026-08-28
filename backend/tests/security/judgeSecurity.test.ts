import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { JudgeService } from '../../src/modules/judge/judgeService';
import { ProblemRepository } from '../../src/repositories';
import { LanguageId, JudgeVerdict } from '@codeforge/shared';
import { LocalProcessExecutionProvider } from '../../src/modules/judge/ExecutionProvider';

describe('Online Judge Security & Sandbox Isolation Tests', () => {
  const authService = new AuthService();
  const judgeService = new JudgeService();
  const problemRepo = new ProblemRepository();

  let userAId = '';
  let userBId = '';
  let problemId = '';

  test('Setup: Create two test users and locate challenge problem', async () => {
    const unique = Date.now();
    const u1 = await authService.register({
      email: `sec_judge_a_${unique}@codeforge.dev`,
      username: `sec_judge_a_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Security Tester A',
    });
    userAId = u1.user.id;

    const u2 = await authService.register({
      email: `sec_judge_b_${unique}@codeforge.dev`,
      username: `sec_judge_b_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Security Tester B',
    });
    userBId = u2.user.id;

    const problem = await problemRepo.findBySlug('two-sum-target');
    assert.ok(problem);
    problemId = problem.id;
  });

  test('1. Hidden Test Protection: hidden test inputs and expected outputs are NEVER returned to clients', async () => {
    const wrongCode = `
import sys
print("WRONG_ANSWER")
`;

    const sub = await judgeService.submitSolution(userAId, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: wrongCode,
    });

    const detail = await judgeService.getSubmissionDetail(sub.id, userAId);
    assert.ok(detail);
    assert.ok(detail.testResults.length > 0);

    const hiddenTestResults = detail.testResults.filter(t => !t.isSample);
    assert.ok(hiddenTestResults.length > 0, 'Hidden test results must exist in submission');

    for (const tc of hiddenTestResults) {
      assert.strictEqual(tc.inputData, null, 'Hidden test case inputData MUST be null in client response!');
      assert.strictEqual(tc.expectedOutput, null, 'Hidden test case expectedOutput MUST be null in client response!');
      assert.strictEqual(tc.actualOutput, '[Hidden Test Case]', 'Hidden test case actualOutput MUST be masked in client response!');
    }
  });

  test('2. Output Flooding Protection: sandbox truncates excessive stdout output at 64KB', async () => {
    const provider = new LocalProcessExecutionProvider();
    const floodScript = 'console.log("X".repeat(100000));';

    const result = await provider.execute({
      languageId: LanguageId.JAVASCRIPT,
      sourceCode: floodScript,
      inputData: '',
      timeLimitMs: 2000,
      memoryLimitMb: 128,
    });

    assert.ok(result);
    assert.strictEqual(result.isOutputExceeded, true, 'isOutputExceeded flag must be true');
    assert.ok(result.stdout.length <= 65536 + 100, 'stdout size must be capped');
  });

  test('3. Timeout Protection: infinite loop execution terminates within timeout without hanging', async () => {
    const provider = new LocalProcessExecutionProvider();
    const infiniteScript = 'while(true) {}';

    const start = Date.now();
    const result = await provider.execute({
      languageId: LanguageId.JAVASCRIPT,
      sourceCode: infiniteScript,
      inputData: '',
      timeLimitMs: 1000,
      memoryLimitMb: 128,
    });
    const elapsed = Date.now() - start;

    assert.ok(result);
    assert.strictEqual(result.isTimeout, true);
    assert.ok(elapsed >= 900 && elapsed <= 2500, `Execution should terminate near 1000ms, took ${elapsed}ms`);
  });
});
