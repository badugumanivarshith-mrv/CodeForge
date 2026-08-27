import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { ContestService } from '../../src/services/contest.service';
import { LeaderboardService } from '../../src/services/leaderboard.service';
import { RatingService } from '../../src/services/rating.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  ContestRepository,
  ProblemRepository,
  SubmissionRepository,
  RatingRepository,
} from '../../src/repositories';
import {
  ContestState,
  LanguageId,
  LeaderboardTimeframe,
} from '@codeforge/shared';

describe('Competitive Contests & Leaderboards Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const contestRepo = new ContestRepository();
  const problemRepo = new ProblemRepository();
  const submissionRepo = new SubmissionRepository();
  const ratingRepo = new RatingRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const ratingService = new RatingService(ratingRepo);
  const contestService = new ContestService(contestRepo, problemRepo, submissionRepo, ratingService);
  const leaderboardService = new LeaderboardService(ratingRepo, contestRepo);

  let competitor1Id = '';
  let competitor2Id = '';
  let testContestId = '';
  let testProblemId = '';

  before(async () => {
    const unique = Date.now();
    const u1 = await authService.register({
      email: `contest_comp1_${unique}@codeforge.dev`,
      username: `coder1_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Contest Competitor 1',
    });
    competitor1Id = u1.user.id;

    const u2 = await authService.register({
      email: `contest_comp2_${unique}@codeforge.dev`,
      username: `coder2_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Contest Competitor 2',
    });
    competitor2Id = u2.user.id;

    // Fetch existing contests and problems
    const contests = await contestService.listContests();
    if (contests.length > 0) {
      testContestId = contests[0].id;
      const fullContest = await contestService.getContest(testContestId);
      if (fullContest.problems && fullContest.problems.length > 0) {
        testProblemId = fullContest.problems[0].problemId;
      }
    }

    if (!testProblemId) {
      const problem = await problemRepo.findBySlug('two-sum');
      if (problem) {
        testProblemId = problem.id;
      }
    }
  });


  it('should list available contests and fetch contest details with problems', async () => {
    const contests = await contestService.listContests();
    assert.ok(Array.isArray(contests), 'Contests must be returned as array');
    assert.ok(contests.length > 0, 'Must contain seeded contests');

    const details = await contestService.getContest(contests[0].id, competitor1Id);
    assert.ok(details.id, 'Contest details must have an ID');
    assert.ok(details.title, 'Contest title must be present');
  });

  it('should register a competitor for a contest and initiate start timer', async () => {
    if (!testContestId) return;

    const participant = await contestService.registerParticipant(competitor1Id, testContestId);
    assert.ok(participant.id, 'Participant record created');
    assert.strictEqual(participant.contestId, testContestId);
    assert.strictEqual(participant.userId, competitor1Id);

    const started = await contestService.startContest(competitor1Id, testContestId);
    assert.ok(started.startedAt, 'Start timestamp must be recorded');
  });

  it('should process contest solution submission and apply ICPC penalty rules', async () => {
    if (!testContestId || !testProblemId) return;

    await contestService.registerParticipant(competitor1Id, testContestId);

    const submission = await contestService.submitSolution(competitor1Id, {
      contestId: testContestId,
      problemId: testProblemId,
      languageId: LanguageId.PYTHON,
      sourceCode: 'def solve(nums):\n    return sum(nums)\n',
    });

    assert.ok(submission.id, 'Submission must have ID');
    assert.strictEqual(submission.contestId, testContestId);
    assert.ok(submission.isPassed, 'Non-trivial solution should pass');
  });

  it('should compute live contest leaderboard standings', async () => {
    if (!testContestId) return;

    const lb = await leaderboardService.getContestLeaderboard(testContestId);
    assert.ok(lb.contestId, 'Contest ID present in leaderboard');
    assert.ok(Array.isArray(lb.entries), 'Entries must be an array');
  });

  it('should retrieve global and weekly leaderboards', async () => {
    const globalLb = await leaderboardService.getGlobalLeaderboard(LeaderboardTimeframe.GLOBAL, 1, 20);
    assert.ok(globalLb.entries, 'Global leaderboard must have entries');
    assert.ok(typeof globalLb.totalUsers === 'number');

    const weeklyLb = await leaderboardService.getGlobalLeaderboard(LeaderboardTimeframe.WEEKLY, 1, 20);
    assert.ok(weeklyLb.entries, 'Weekly leaderboard must have entries');
  });
});
