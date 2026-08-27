import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { InterviewService } from '../../src/services/interview.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  InterviewRepository,
  ActivityFeedRepository,
} from '../../src/repositories';
import { InterviewType, InterviewStatus, ProblemDifficulty } from '@codeforge/shared';

describe('AI Interview Preparation Platform Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const interviewRepo = new InterviewRepository();
  const feedRepo = new ActivityFeedRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const interviewService = new InterviewService(interviewRepo, feedRepo);

  let userId = '';
  let sessionId = '';
  let firstExchangeId = '';

  before(async () => {
    const unique = Date.now();
    const user = await authService.register({
      email: `interviewee_${unique}@codeforge.dev`,
      username: `interviewee_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Mock Interview Candidate',
    });
    userId = user.user.id;
  });

  it('should initiate a technical mock interview session with initial question', async () => {
    const result = await interviewService.startInterview(userId, {
      interviewType: InterviewType.TECHNICAL,
      roleTitle: 'Senior Backend Engineer',
      difficulty: ProblemDifficulty.MEDIUM,
    });

    assert.ok(result.session.id, 'Session should have ID');
    assert.strictEqual(result.session.userId, userId);
    assert.strictEqual(result.session.interviewType, InterviewType.TECHNICAL);
    assert.strictEqual(result.session.status, InterviewStatus.IN_PROGRESS);
    assert.ok(result.firstQuestion.id, 'Initial question should exist');
    assert.ok(result.firstQuestion.questionText.length > 10);

    sessionId = result.session.id;
    firstExchangeId = result.firstQuestion.id;
  });


  it('should record an answer and receive deterministic Socratic evaluation and next question', async () => {
    const answerResult = await interviewService.answerQuestion(sessionId, userId, {
      exchangeId: firstExchangeId,
      answerText: 'In a distributed database, optimistic concurrency control uses version stamps to validate that data has not changed before committing transactions, which eliminates locking overhead at the expense of potential rollbacks during high contention.',
      timeSpentSeconds: 45,
    });

    assert.ok(answerResult.answer.evaluationFeedback, 'Feedback should be generated');
    assert.ok(answerResult.answer.score !== undefined && answerResult.answer.score > 0);
    assert.ok(answerResult.nextQuestion, 'Next question should be returned');
    assert.strictEqual(answerResult.isComplete, false);
  });

  it('should finish interview and generate multidimensional scores and feedback report', async () => {
    const feedback = await interviewService.finishInterview(sessionId, userId);

    assert.strictEqual(feedback.session.status, InterviewStatus.COMPLETED);
    assert.ok(feedback.session.overallScore !== undefined && feedback.session.overallScore > 0);
    assert.ok(feedback.session.communicationScore !== undefined);
    assert.ok(feedback.session.technicalScore !== undefined);
    assert.ok(feedback.session.confidenceScore !== undefined);
    assert.ok(feedback.feedbackSummaryMdx.includes('Interview Performance Analysis'));
    assert.ok(feedback.strengths.length > 0);
    assert.ok(feedback.improvementSuggestions.length > 0);
  });

  it('should retrieve completed interview feedback report and history', async () => {
    const report = await interviewService.getInterviewFeedback(sessionId, userId);
    assert.strictEqual(report.session.id, sessionId);
    assert.ok(report.exchanges.length >= 1);

    const history = await interviewService.getUserInterviewHistory(userId);
    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].id, sessionId);
  });
});
