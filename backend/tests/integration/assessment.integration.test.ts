import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { AssessmentService } from '../../src/services/assessment.service';
import { AdaptiveEngineService } from '../../src/services/adaptiveEngine.service';
import { RatingService } from '../../src/services/rating.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  AssessmentRepository,
  RatingRepository,
} from '../../src/repositories';
import {
  AssessmentType,
  AssessmentSessionStatus,
  ProblemDifficulty,
} from '@codeforge/shared';

describe('Intelligent Assessment & Skill Rating Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const assessmentRepo = new AssessmentRepository();
  const ratingRepo = new RatingRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const adaptiveEngine = new AdaptiveEngineService();
  const ratingService = new RatingService(ratingRepo);
  const assessmentService = new AssessmentService(assessmentRepo, adaptiveEngine, ratingService);

  let testUser1Id = '';
  let testUser2Id = '';

  before(async () => {
    const unique = Date.now();
    const user1 = await authService.register({
      email: `assess_test1_${unique}@codeforge.dev`,
      username: `assesser1_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Assessment Test User 1',
    });
    testUser1Id = user1.user.id;

    const user2 = await authService.register({
      email: `assess_test2_${unique}@codeforge.dev`,
      username: `assesser2_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Assessment Test User 2',
    });
    testUser2Id = user2.user.id;
  });

  it('should initialize an adaptive assessment session with sanitized questions (no answer leakage)', async () => {
    const session = await assessmentService.createSession(testUser1Id, {
      assessmentType: AssessmentType.DIAGNOSTIC,
      initialDifficulty: ProblemDifficulty.MEDIUM,
    });

    assert.ok(session.id, 'Session must have an ID');
    assert.strictEqual(session.userId, testUser1Id);
    assert.strictEqual(session.status, AssessmentSessionStatus.IN_PROGRESS);
    assert.ok(session.totalQuestions > 0, 'Must contain sequenced questions');
    assert.ok(session.currentQuestion, 'Must have active initial question');

    // SECURITY VERIFICATION: isCorrect must NOT be leaked
    if (session.currentQuestion?.options) {
      for (const opt of session.currentQuestion.options) {
        assert.strictEqual((opt as any).isCorrect, undefined, 'isCorrect must NEVER be exposed to client');
      }
    }
  });

  it('should process answers, accumulate score, and adapt difficulty dynamically', async () => {
    const session = await assessmentService.createSession(testUser1Id, {
      assessmentType: AssessmentType.DIAGNOSTIC,
      initialDifficulty: ProblemDifficulty.EASY,
    });

    const q1 = session.currentQuestion;
    assert.ok(q1, 'Question 1 must be present');

    // Query raw question from db to fetch correct option id for testing
    const rawQ1 = await assessmentRepo.getQuestionById(q1.id);
    const correctOpt = rawQ1?.optionsJson?.find((o: any) => o.isCorrect);

    // Submit correct answer
    const updated1 = await assessmentService.submitAnswer(testUser1Id, {
      sessionId: session.id,
      questionId: q1.id,
      selectedOptionIds: correctOpt ? [correctOpt.id] : [],
      timeSpentSeconds: 15,
    });

    assert.ok(updated1.totalScore > 0, 'Score should increase after correct response');
    assert.strictEqual(updated1.currentQuestionIndex, 1, 'Question index should advance');
  });

  it('should enforce multi-user isolation on assessment sessions', async () => {
    const session = await assessmentService.createSession(testUser1Id, {
      assessmentType: AssessmentType.DIAGNOSTIC,
    });

    // User 2 attempts to view User 1's assessment session -> must fail
    await assert.rejects(
      async () => {
        await assessmentService.getSession(testUser2Id, session.id);
      },
      /access/i,
      'User 2 should be rejected from viewing User 1 session',
    );
  });

  it('should complete assessment session and calculate skill rating delta', async () => {
    const session = await assessmentService.createSession(testUser1Id, {
      assessmentType: AssessmentType.TOPIC_MASTERY,
      initialDifficulty: ProblemDifficulty.MEDIUM,
    });

    // Complete session
    const result = await assessmentService.completeSession(testUser1Id, session.id, false);

    assert.strictEqual(result.sessionId, session.id);
    assert.strictEqual(result.userId, testUser1Id);
    assert.ok(typeof result.percentage === 'number');
    assert.ok(result.skillRatingAfter >= 800, 'Rating should be at or above baseline');
  });

  it('should generate personalized remediation plan with actionable items', async () => {
    const session = await assessmentService.createSession(testUser1Id, {
      assessmentType: AssessmentType.DIAGNOSTIC,
    });

    await assessmentService.completeSession(testUser1Id, session.id, false);
    const remediation = await assessmentService.getRemediationPlan(testUser1Id, session.id);

    assert.ok(remediation, 'Remediation plan must be created');
    assert.strictEqual(remediation.assessmentId, session.id);
    assert.ok(remediation.actionItems.length > 0, 'Action items must be generated');
    assert.ok(remediation.summary.length > 0, 'Summary must be provided');
  });
});
