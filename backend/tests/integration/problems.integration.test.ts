import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ProblemRepository, CurriculumRepository } from '../../src/repositories';
import { ProblemService } from '../../src/services';
import { ProblemDifficulty, LanguageId } from '@codeforge/shared';

describe('Problems Integration Tests', () => {
  const problemRepo = new ProblemRepository();
  const curriculumRepo = new CurriculumRepository();
  const problemService = new ProblemService(problemRepo, curriculumRepo);

  test('1. List published arena problems', async () => {
    const problems = await problemService.listProblems();
    assert.ok(problems.length >= 2);
    const slugs = problems.map(p => p.slug);
    assert.ok(slugs.includes('two-sum-target'));
    assert.ok(slugs.includes('valid-palindrome'));
  });

  test('2. Get Problem detail with starter code in 6 languages', async () => {
    const problem = await problemService.getProblemDetail('two-sum-target', LanguageId.PYTHON);
    assert.ok(problem);
    assert.strictEqual(problem.slug, 'two-sum-target');
    assert.strictEqual(problem.difficulty, ProblemDifficulty.EASY);
    assert.ok(problem.starterCode['python']);
    assert.ok(problem.starterCode['javascript']);
    assert.ok(problem.starterCode['typescript']);
    assert.ok(problem.starterCode['java']);
    assert.ok(problem.starterCode['cpp']);
    assert.ok(problem.starterCode['c']);
    assert.ok(problem.examples.length > 0);
  });

  test('3. SECURITY CHECK: Hidden test cases are strictly omitted from client problem payload', async () => {
    const problem = await problemService.getProblemDetail('two-sum-target');
    assert.ok(problem.sampleTestCases.length > 0);

    // Ensure none of the test cases returned in problem detail are hidden
    for (const tc of problem.sampleTestCases) {
      assert.strictEqual(tc.isHidden, false, 'Hidden test case must not be exposed to clients!');
    }

    // Direct repo query with includeHidden=true proves hidden test cases exist in DB
    const allTestCases = await problemRepo.getTestCases(problem.id, true);
    const hiddenCount = allTestCases.filter(t => t.isHidden).length;
    assert.ok(hiddenCount >= 2, 'Hidden test cases must exist in database for judging');
    assert.ok(allTestCases.length > problem.sampleTestCases.length);
  });

  test('4. Fetch Socratic hints across Tier 1, 2, and 3', async () => {
    const problem = await problemService.getProblemDetail('two-sum-target');
    const hint1 = await problemService.getProblemHints(problem.id, 1);
    const hint2 = await problemService.getProblemHints(problem.id, 2);
    const hint3 = await problemService.getProblemHints(problem.id, 3);

    assert.strictEqual(hint1.tier, 1);
    assert.ok(hint1.hint.includes('Concept Nudge'));
    assert.strictEqual(hint2.tier, 2);
    assert.ok(hint2.hint.includes('Algorithm Structure'));
    assert.strictEqual(hint3.tier, 3);
    assert.ok(hint3.hint.includes('Optimization'));
  });
});
