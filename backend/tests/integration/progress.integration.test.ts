import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  ProgressRepository,
  GamificationRepository,
  CurriculumRepository,
  UserRepository,
} from '../../src/repositories';
import { ProgressService, AuthService } from '../../src/services';

describe('Progress & Gamification Integration Tests', () => {
  const progressRepo = new ProgressRepository();
  const gamificationRepo = new GamificationRepository();
  const curriculumRepo = new CurriculumRepository();
  const userRepo = new UserRepository();
  const authService = new AuthService();

  const progressService = new ProgressService(
    progressRepo,
    gamificationRepo,
    curriculumRepo,
    userRepo,
  );

  const testId = Date.now();
  let testUserId = '';
  let testLessonId = '';

  test('0. Setup test user and retrieve lesson', async () => {
    const reg = await authService.register({
      email: `progress_user_${testId}@codeforge.dev`,
      username: `proguser_${testId}`.slice(0, 25),
      password: 'SecureP@ssword123!',
      displayName: 'Progress Tester',
    });
    testUserId = reg.user.id;

    const topic = await curriculumRepo.getTopicBySlug('python' as any, 'python-syntax-literals');
    assert.ok(topic);

    const lessons = await curriculumRepo.getLessonsByTopic(topic.id);
    assert.ok(lessons.length > 0);
    testLessonId = lessons[0].id;
  });

  test('1. Completing a lesson for the first time awards 20 XP and updates streak', async () => {
    const result = await progressService.completeLesson(testUserId, testLessonId);

    assert.strictEqual(result.isFirstCompletion, true);
    assert.strictEqual(result.xpAwarded, 20);

    const summary = await gamificationRepo.getGamificationSummary(testUserId);
    assert.strictEqual(summary.totalXp, 20);
    assert.strictEqual(summary.currentStreak, 1);
  });

  test('2. Re-completing the same lesson does not award duplicate XP', async () => {
    const result = await progressService.completeLesson(testUserId, testLessonId);

    assert.strictEqual(result.isFirstCompletion, false);
    assert.strictEqual(result.xpAwarded, 0);

    const summary = await gamificationRepo.getGamificationSummary(testUserId);
    assert.strictEqual(summary.totalXp, 20);
  });

  test('3. Progress Dashboard aggregates live gamification metrics and recommended topic', async () => {
    const dashboard = await progressService.getDashboard(testUserId);

    assert.ok(dashboard.gamification);
    assert.strictEqual(dashboard.gamification.totalXp, 20);
    assert.strictEqual(dashboard.gamification.currentLevel, 1);
    assert.ok(dashboard.activeLanguage);
    assert.strictEqual(dashboard.activeLanguage?.slug, 'python');
    assert.ok(dashboard.recommendedTopic);
    assert.ok(dashboard.recentCompletedLessons.length >= 1);
  });
});
