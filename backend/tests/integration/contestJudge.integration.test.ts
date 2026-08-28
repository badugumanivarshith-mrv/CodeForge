import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { ContestService } from '../../src/services/contest.service';
import { RatingService } from '../../src/services/rating.service';
import { JudgeService } from '../../src/modules/judge/judgeService';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  ProblemRepository,
  SubmissionRepository,
  ContestRepository,
  ProgressRepository,
  RatingRepository,
} from '../../src/repositories';
import { LanguageId, JudgeVerdict } from '@codeforge/shared';
import { db } from '../../src/database/connection';
import { contestProblems } from '../../src/database/schema';

describe('Contest Judge & ICPC Scoring Integration Tests', () => {
  const contestRepo = new ContestRepository();
  const problemRepo = new ProblemRepository();
  const submissionRepo = new SubmissionRepository();
  const ratingRepo = new RatingRepository();

  const authService = new AuthService();
  const ratingService = new RatingService(ratingRepo);
  const contestService = new ContestService(contestRepo, problemRepo, submissionRepo, ratingService);
  const judgeService = new JudgeService();

  let contestant1Id = '';
  let contestant2Id = '';
  let contestId = '';
  let problemId = '';

  test('Setup: Create two contestants, register in contest, find target problem', async () => {
    const unique = Date.now();
    const u1 = await authService.register({
      email: `icpc_c1_${unique}@codeforge.dev`,
      username: `icpc_c1_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'ICPC Contestant 1',
    });
    contestant1Id = u1.user.id;

    const u2 = await authService.register({
      email: `icpc_c2_${unique}@codeforge.dev`,
      username: `icpc_c2_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'ICPC Contestant 2',
    });
    contestant2Id = u2.user.id;

    // Fetch active contest and problem
    const contests = await contestService.listContests();
    assert.ok(contests.length > 0, 'Contests must exist');
    contestId = contests[0].id;

    const problem = await problemRepo.findBySlug('two-sum-target');
    assert.ok(problem, 'Problem must exist');
    problemId = problem.id;

    // Ensure problem is linked to contest
    await db
      .insert(contestProblems)
      .values({
        contestId,
        problemId,
        sequence: 1,
        points: 100,
        penaltyMinutes: 20,
      })
      .onConflictDoNothing();

    // Register and start both contestants
    await contestService.registerParticipant(contestant1Id, contestId);
    await contestService.startContest(contestant1Id, contestId);

    await contestService.registerParticipant(contestant2Id, contestId);
    await contestService.startContest(contestant2Id, contestId);
  });

  test('1. Submit failing attempt inside contest: records penalty attempt', async () => {
    const wrongCode = `
import sys
print("WRONG_OUTPUT")
`;

    const sub = await judgeService.submitSolution(contestant1Id, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: wrongCode,
      contestId,
    });

    assert.ok(sub);
    assert.ok(sub.verdict !== JudgeVerdict.ACCEPTED);
    assert.strictEqual(sub.contestId, contestId);
  });

  test('2. Submit accepted solution after failed attempts: calculates 20-min ICPC penalty', async () => {
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

    const sub = await judgeService.submitSolution(contestant1Id, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: acCode,
      contestId,
    });

    assert.ok(sub);
    assert.strictEqual(sub.verdict, JudgeVerdict.ACCEPTED);

    // Verify contestant standings updated
    const participant = await contestRepo.getParticipant(contestId, contestant1Id);
    assert.ok(participant);
    assert.strictEqual(participant.score, 100);
    // 1 prior failure = 20 penalty minutes + elapsed minutes
    assert.ok(participant.penaltyTimeMinutes >= 20);
  });

  test('3. Contest leaderboard ranks contestants by Score (DESC) and Penalty Time (ASC)', async () => {
    // Contestant 2 submits directly with 0 prior failures
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

    await judgeService.submitSolution(contestant2Id, {
      problemId,
      languageId: LanguageId.PYTHON,
      sourceCode: acCode,
      contestId,
    });

    const standings = await contestRepo.listParticipants(contestId);
    assert.ok(standings.length >= 2);

    const p1 = standings.find(p => p.userId === contestant1Id);
    const p2 = standings.find(p => p.userId === contestant2Id);
    assert.ok(p1 && p2);
    assert.ok(p2.penaltyTimeMinutes <= p1.penaltyTimeMinutes);
    assert.ok(p2.rank <= p1.rank);
  });
});
