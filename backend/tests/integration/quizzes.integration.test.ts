import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  QuizRepository,
  GamificationRepository,
  ProgressRepository,
  CurriculumRepository,
  UserRepository,
} from '../../src/repositories';
import { QuizService, AuthService } from '../../src/services';

describe('Quizzes Integration Tests', () => {
  const quizRepo = new QuizRepository();
  const gamificationRepo = new GamificationRepository();
  const progressRepo = new ProgressRepository();
  const curriculumRepo = new CurriculumRepository();
  const userRepo = new UserRepository();
  const authService = new AuthService();

  const quizService = new QuizService(quizRepo, gamificationRepo, progressRepo);

  const testId = Date.now();
  let testUserId = '';
  let testTopicId = '';
  let testQuizId = '';

  test('0. Setup test user and retrieve topic quiz', async () => {
    const reg = await authService.register({
      email: `quiz_user_${testId}@codeforge.dev`,
      username: `quizuser_${testId}`.slice(0, 25),
      password: 'SecureP@ssword123!',
      displayName: 'Quiz Tester',
    });
    testUserId = reg.user.id;

    const topic = await curriculumRepo.getTopicBySlug('python' as any, 'python-syntax-literals');
    assert.ok(topic);
    testTopicId = topic.id;

    const quiz = await quizRepo.getQuizByTopicId(testTopicId);
    assert.ok(quiz);
    testQuizId = quiz.id;
  });

  test('1. SECURITY CHECK: Quiz options delivered to client strictly omit `isCorrect` answer key', async () => {
    const clientQuiz = await quizService.getQuizByTopicId(testTopicId);
    assert.ok(clientQuiz.questions && clientQuiz.questions.length > 0);

    for (const q of clientQuiz.questions) {
      for (const opt of q.options) {
        assert.strictEqual(
          (opt as any).isCorrect,
          undefined,
          'Option `isCorrect` must NEVER be sent to client before submission!',
        );
      }
    }
  });

  test('2. Server-side grading evaluates correct answers and awards XP on pass', async () => {
    // Internal query to get ground truth options for testing correct submission
    const rawQuiz = await quizRepo.getQuizById(testQuizId);
    assert.ok(rawQuiz?.questions);

    const answers = rawQuiz.questions.map(q => {
      const correctOpt = q.options.find(o => o.isCorrect);
      return {
        questionId: q.id,
        selectedOptionId: correctOpt?.id || '',
      };
    });

    const result = await quizService.submitQuiz(testUserId, testQuizId, answers);

    assert.strictEqual(result.isPassed, true);
    assert.strictEqual(result.scorePercentage, 100);
    assert.strictEqual(result.correctAnswersCount, rawQuiz.questions.length);
    assert.strictEqual(result.xpAwarded, 75); // 50 base + 25 perfect bonus

    // Verify user profile totalXp was incremented
    const summary = await gamificationRepo.getGamificationSummary(testUserId);
    assert.strictEqual(summary.totalXp, 75);
  });

  test('3. Repeat quiz submission evaluates score but does NOT duplicate XP rewards', async () => {
    const rawQuiz = await quizRepo.getQuizById(testQuizId);
    assert.ok(rawQuiz?.questions);

    const answers = rawQuiz.questions.map(q => {
      const correctOpt = q.options.find(o => o.isCorrect);
      return {
        questionId: q.id,
        selectedOptionId: correctOpt?.id || '',
      };
    });

    const repeatResult = await quizService.submitQuiz(testUserId, testQuizId, answers);

    assert.strictEqual(repeatResult.isPassed, true);
    assert.strictEqual(repeatResult.scorePercentage, 100);
    assert.strictEqual(repeatResult.xpAwarded, 0, 'No additional XP should be awarded for re-passing!');

    // Total XP remains 75
    const summary = await gamificationRepo.getGamificationSummary(testUserId);
    assert.strictEqual(summary.totalXp, 75);
  });
});
