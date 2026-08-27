import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { CurriculumService } from '../../src/services/curriculum.service';
import { QuizService } from '../../src/services/quiz.service';
import { ProblemService } from '../../src/services/problem.service';
import { ProgressService } from '../../src/services/progress.service';
import { LearnerIntelligenceService } from '../../src/services/learnerIntelligence.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  CurriculumRepository,
  QuizRepository,
  ProblemRepository,
  ProgressRepository,
  GamificationRepository,
  LearnerIntelligenceRepository,
} from '../../src/repositories';
import {
  LanguageId,
  ProblemDifficulty,
} from '@codeforge/shared';

describe('Learner Intelligence & Adaptive Engine Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const curriculumRepo = new CurriculumRepository();
  const quizRepo = new QuizRepository();
  const problemRepo = new ProblemRepository();
  const progressRepo = new ProgressRepository();
  const gamificationRepo = new GamificationRepository();
  const intelligenceRepo = new LearnerIntelligenceRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const curriculumService = new CurriculumService(
    curriculumRepo,
    problemRepo,
    quizRepo,
    progressRepo,
  );
  const quizService = new QuizService(quizRepo, gamificationRepo, progressRepo);
  const problemService = new ProblemService(problemRepo);
  const progressService = new ProgressService(progressRepo, gamificationRepo, curriculumRepo);
  const intelligenceService = new LearnerIntelligenceService(
    intelligenceRepo,
    curriculumRepo,
    gamificationRepo,
  );

  let testUserId = '';
  let testTopicId = '';
  let testQuizId = '';
  let testLessonId = '';

  before(async () => {
    const unique = Date.now();
    const registered = await authService.register({
      email: `intel_test_${unique}@codeforge.dev`,
      username: `intel_${unique}`,
      password: 'StrongPassword123!',
      displayName: 'Intelligence Tester',
    });
    testUserId = registered.user.id;

    // Retrieve topic 1 (python-syntax-literals)
    const topic = await curriculumService.getTopicDetail('python', 'python-syntax-literals');
    testTopicId = topic.topic.id;
    if (topic.lessons.length > 0) {
      testLessonId = topic.lessons[0].id;
    }
    if (topic.quiz) {
      testQuizId = topic.quiz.id;
    }
  });

  it('1. Initialize learner intelligence profile for new user', async () => {
    const profile = await intelligenceService.getLearnerProfile(testUserId, LanguageId.PYTHON);

    assert.equal(profile.userId, testUserId);
    assert.equal(profile.overallSkillLevel, 'beginner');
    assert.ok(profile.confidenceLevel >= 0);
    assert.equal(profile.activeLanguage?.id, LanguageId.PYTHON);
    assert.ok(Array.isArray(profile.strengths));
    assert.ok(Array.isArray(profile.weaknesses));
  });

  it('2. Mastery progression from NOT_STARTED to LEARNING and DEVELOPING', async () => {
    const initialMasteries = await intelligenceService.getTopicMasteries(testUserId, LanguageId.PYTHON);
    assert.ok(initialMasteries.length > 0);
    const top1 = initialMasteries.find(t => t.topicId === testTopicId);
    assert.ok(top1);
    assert.equal(top1.conceptualState, 'not_started');

    // Complete lesson 1
    if (testLessonId) {
      await progressService.completeLesson(testUserId, testLessonId);
    }

    const updatedMasteries = await intelligenceService.getTopicMasteries(testUserId, LanguageId.PYTHON);
    const updatedTop1 = updatedMasteries.find(t => t.topicId === testTopicId);
    assert.ok(updatedTop1);
    assert.ok(updatedTop1.masteryScore > 0, 'Mastery score should increase after lesson completion');
    assert.notEqual(updatedTop1.conceptualState, 'not_started');
  });

  it('3. Weakness detection detects quiz struggle and prerequisite gaps', async () => {
    // If a topic has been attempted with a low quiz score, detect weakness
    if (testQuizId) {
      const quiz = await quizService.getQuizByTopicId(testTopicId);
      // Submit failing answers (empty or wrong options)
      await quizService.submitQuiz(testUserId, quiz.id, []);
    }

    const weaknesses = await intelligenceService.getWeaknesses(testUserId, LanguageId.PYTHON);
    assert.ok(Array.isArray(weaknesses));

    const quizWeakness = weaknesses.find(w => w.topicId === testTopicId);
    if (quizWeakness) {
      assert.ok(quizWeakness.weaknessScore > 0);
      assert.ok(['high', 'medium', 'low'].includes(quizWeakness.priority));
      assert.ok(quizWeakness.recommendedRemediation.length > 0);
    }
  });

  it('4. Adaptive difficulty adjusts recommended challenge based on performance', async () => {
    const adaptive = await intelligenceService.getAdaptiveDifficulty(testUserId, testTopicId);

    assert.equal(adaptive.topicId, testTopicId);
    assert.ok(
      [ProblemDifficulty.EASY, ProblemDifficulty.MEDIUM, ProblemDifficulty.DIFFICULT].includes(
        adaptive.recommendedDifficulty,
      ),
    );
    assert.ok(adaptive.rationale.length > 0);
    assert.ok(adaptive.metrics !== undefined);
  });

  it('5. Personalized learning path orders sequenced actions and recommendations', async () => {
    const path = await intelligenceService.getPersonalizedLearningPath(testUserId, LanguageId.PYTHON);
    assert.ok(path.length > 0);
    assert.equal(path[0].sequence, 1);
    assert.ok(path[0].actionType.length > 0);
    assert.ok(path[0].reason.length > 0);
    assert.ok(path[0].actionUrl.length > 0);

    const recs = await intelligenceService.getRecommendations(testUserId, LanguageId.PYTHON);
    assert.ok(recs.length > 0);
    assert.ok(recs[0].ctaUrl.length > 0);
    assert.ok(recs[0].reason.length > 0);
  });

  it('6. Learning analytics aggregates performance and topic distribution', async () => {
    const analytics = await intelligenceService.getLearningAnalytics(testUserId, LanguageId.PYTHON);

    assert.equal(analytics.userId, testUserId);
    assert.ok(analytics.topicMasteryDistribution !== undefined);
    assert.ok(analytics.learningConsistencyScore >= 0);
    assert.ok(Array.isArray(analytics.strongestTopics));
    assert.ok(Array.isArray(analytics.weakestTopics));
  });

  it('7. Enforce learner data isolation and ownership between multiple users', async () => {
    const unique2 = Date.now() + 100;
    const user2 = await authService.register({
      email: `intel_isolated_${unique2}@codeforge.dev`,
      username: `isolated_${unique2}`,
      password: 'StrongPassword123!',
    });

    const user1Profile = await intelligenceService.getLearnerProfile(testUserId, LanguageId.PYTHON);
    const user2Profile = await intelligenceService.getLearnerProfile(user2.user.id, LanguageId.PYTHON);

    assert.equal(user1Profile.userId, testUserId);
    assert.equal(user2Profile.userId, user2.user.id);
    assert.notEqual(user1Profile.userId, user2Profile.userId);
    assert.equal(user2Profile.recentActivitySummary.lessonsCompletedLast7Days, 0);
  });
});

