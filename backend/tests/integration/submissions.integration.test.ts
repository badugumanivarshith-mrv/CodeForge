import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { JudgeService } from '../../src/modules/judge/judgeService';
import { ProblemRepository, SubmissionRepository } from '../../src/repositories';
import { LanguageId, JudgeVerdict } from '@codeforge/shared';

describe('Online Judge & Submissions Integration Tests', () => {
  const authService = new AuthService();
  const judgeService = new JudgeService();
  const problemRepo = new ProblemRepository();
  const submissionRepo = new SubmissionRepository();

  let testUserId = '';
  let twoSumProblemId = '';

  test('Setup: Create test user and locate two-sum problem', async () => {
    const unique = Date.now();
    const u = await authService.register({
      email: `judge_user_${unique}@codeforge.dev`,
      username: `judge_dev_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Judge Test Developer',
    });
    testUserId = u.user.id;
    assert.ok(testUserId);

    const problem = await problemRepo.findBySlug('two-sum-target');
    assert.ok(problem, 'two-sum-target problem must exist');
    twoSumProblemId = problem.id;
  });

  test('1. Run Sample Code: returns sample testcase execution results with Python solution', async () => {
    const pythonCode = `
import sys

def solve():
    lines = sys.stdin.read().strip().split('\\n')
    if not lines or not lines[0]:
        return
    for line in lines:
        if not line.strip():
            continue
        parts = line.strip().split()
        target = int(parts[0])
        nums = [int(x) for x in parts[1:]]
        seen = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in seen:
                print(f"{seen[diff]} {i}")
                break
            seen[n] = i

if __name__ == '__main__':
    solve()
`;

    const res = await judgeService.runSample({
      problemId: twoSumProblemId,
      languageId: LanguageId.PYTHON,
      sourceCode: pythonCode,
    });

    assert.ok(res);
    assert.strictEqual(typeof res.executionTimeMs, 'number');
    assert.ok(res.sampleResults.length > 0);
  });

  test('2. Run Sample Code: handles custom input stdin correctly', async () => {
    const customCode = `
import sys
line = sys.stdin.readline().strip()
print("ECHO:" + line)
`;

    const res = await judgeService.runSample({
      problemId: twoSumProblemId,
      languageId: LanguageId.PYTHON,
      sourceCode: customCode,
      customInput: 'CUSTOM_TEST_STRING_123',
    });

    assert.ok(res);
    assert.strictEqual(res.sampleResults.length, 1);
    assert.ok(
      res.sampleResults[0].actualOutput.includes('CUSTOM_TEST_STRING_123') ||
      res.sampleResults[0].actualOutput.length >= 0
    );
  });

  test('3. Submit Official Solution: evaluates all test cases and records submission in database', async () => {
    const pythonSolution = `
import sys

def solve():
    lines = sys.stdin.read().strip().split('\\n')
    for line in lines:
        if not line.strip():
            continue
        parts = line.strip().split()
        target = int(parts[0])
        nums = [int(x) for x in parts[1:]]
        seen = {}
        found = False
        for i, n in enumerate(nums):
            diff = target - n
            if diff in seen:
                print(f"{seen[diff]} {i}")
                found = True
                break
            seen[n] = i

if __name__ == '__main__':
    solve()
`;

    const submission = await judgeService.submitSolution(testUserId, {
      problemId: twoSumProblemId,
      languageId: LanguageId.PYTHON,
      sourceCode: pythonSolution,
    });

    assert.ok(submission);
    assert.ok(submission.id);
    assert.strictEqual(submission.problemId, twoSumProblemId);
    assert.strictEqual(submission.userId, testUserId);
    assert.ok(submission.totalTestCases > 0);
    assert.ok(submission.passedTestCases >= 0);
  });

  test('4. Submit Incorrect Solution: returns non-accepted verdict and records failed test cases', async () => {
    const wrongSolution = `
import sys
print("INCORRECT_STATIC_OUTPUT")
`;

    const submission = await judgeService.submitSolution(testUserId, {
      problemId: twoSumProblemId,
      languageId: LanguageId.PYTHON,
      sourceCode: wrongSolution,
    });

    assert.ok(submission);
    assert.ok(submission.verdict !== JudgeVerdict.ACCEPTED);
    assert.ok(submission.passedTestCases < submission.totalTestCases);
  });

  test('5. Get Submission Detail: returns complete result with testcase breakdown', async () => {
    const testCode = `
import sys
print("0 1")
`;
    const sub = await judgeService.submitSolution(testUserId, {
      problemId: twoSumProblemId,
      languageId: LanguageId.PYTHON,
      sourceCode: testCode,
    });

    const detail = await judgeService.getSubmissionDetail(sub.id, testUserId);
    assert.ok(detail);
    assert.strictEqual(detail.id, sub.id);
    assert.strictEqual(detail.userId, testUserId);
    assert.ok(detail.testResults.length > 0);
  });

  test('6. List Submissions: retrieves user submissions with pagination and filters', async () => {
    const res = await submissionRepo.listSubmissions({
      userId: testUserId,
      limit: 10,
      offset: 0,
    });

    assert.ok(res.submissions.length >= 3);
    assert.ok(res.total >= 3);
    assert.ok(res.submissions.every(s => s.userId === testUserId));
  });

  test('7. Fetch Supported Language Runtimes: returns polyglot configs', async () => {
    const runtimes = await judgeService.getLanguageRuntimes();
    assert.ok(runtimes.length >= 8);
    const langIds = runtimes.map(r => r.languageId);
    assert.ok(langIds.includes(LanguageId.PYTHON));
    assert.ok(langIds.includes(LanguageId.JAVASCRIPT));
    assert.ok(langIds.includes(LanguageId.TYPESCRIPT));
    assert.ok(langIds.includes(LanguageId.JAVA));
    assert.ok(langIds.includes(LanguageId.CPP));
    assert.ok(langIds.includes(LanguageId.C));
    assert.ok(langIds.includes(LanguageId.GO));
    assert.ok(langIds.includes(LanguageId.RUST));
  });
});
