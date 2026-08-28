import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { JudgeService } from '../../src/modules/judge/judgeService';
import { SubmissionAnalysisService } from '../../src/modules/judge/submissionAnalysisService';
import { ProblemRepository } from '../../src/repositories';
import { LanguageId, JudgeVerdict } from '@codeforge/shared';

describe('AI Submission Failure Diagnostics Integration Tests', () => {
  const authService = new AuthService();
  const judgeService = new JudgeService();
  const analysisService = new SubmissionAnalysisService();
  const problemRepo = new ProblemRepository();

  let testUserId = '';
  let problemId = '';

  test('Setup: Create user and locate challenge problem', async () => {
    const unique = Date.now();
    const u = await authService.register({
      email: `ai_diag_${unique}@codeforge.dev`,
      username: `ai_diag_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'AI Diagnostics Tester',
    });
    testUserId = u.user.id;

    const problem = await problemRepo.findBySlug('two-sum-target');
    assert.ok(problem);
    problemId = problem.id;
  });

  test('1. AI Failure Diagnostics: analyzes WRONG_ANSWER submission and identifies root cause', async () => {
    const wrongCode = `
import sys
# Buggy two sum: returning indices starting from 1 instead of 0
print("1 2")
`;

    const sub = await judgeService.submitSolution(testUserId, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: wrongCode,
    });

    assert.ok(sub.verdict !== JudgeVerdict.ACCEPTED);

    const analysis = await judgeService.getSubmissionAnalysis(sub.id);
    assert.ok(analysis);
    assert.ok(analysis.probableBugCategory);
    assert.ok(analysis.likelyRootCause);
    assert.ok(analysis.missedEdgeCases.length > 0);
    assert.ok(analysis.recommendedLearningTopics.length > 0);
  });

  test('2. AI Failure Diagnostics: analyzes TIME_LIMIT_EXCEEDED scenario with complexity warnings', async () => {
    const analysis = await analysisService.analyzeSubmission({
      submissionId: 'test-tle-sub-id',
      problemTitle: 'Two Sum Target',
      languageId: LanguageId.PYTHON,
      sourceCode: `
# Exponential nested loop simulating O(N^3)
for i in range(1000000):
    for j in range(1000000):
        pass
`,
      verdict: JudgeVerdict.TIME_LIMIT_EXCEEDED,
      errorMessage: 'Time limit exceeded (2050ms > 2000ms)',
    });

    assert.ok(analysis);
    assert.ok(analysis.probableBugCategory.includes('Time Limit') || analysis.probableBugCategory.includes('Complexity') || analysis.probableBugCategory.includes('Inefficient'));
    assert.ok(analysis.complexityConcerns);
    assert.ok(analysis.complexityConcerns.analysis.length > 0);
  });

  test('3. AI Failure Diagnostics: analyzes RUNTIME_ERROR with exception analysis', async () => {
    const analysis = await analysisService.analyzeSubmission({
      submissionId: 'test-rte-sub-id',
      problemTitle: 'Two Sum Target',
      languageId: LanguageId.PYTHON,
      sourceCode: `
arr = []
print(arr[10]) # IndexError
`,
      verdict: JudgeVerdict.RUNTIME_ERROR,
      errorMessage: 'IndexError: list index out of range',
    });

    assert.ok(analysis);
    assert.ok(
      analysis.probableBugCategory.toLowerCase().includes('runtime') ||
      analysis.probableBugCategory.toLowerCase().includes('exception') ||
      analysis.probableBugCategory.toLowerCase().includes('error')
    );
    assert.ok(analysis.likelyRootCause.length > 0);
  });
});
