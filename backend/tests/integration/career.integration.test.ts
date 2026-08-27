import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { CareerIntelligenceService } from '../../src/services/careerIntelligence.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  CareerRepository,
  RatingRepository,
  CurriculumRepository,
} from '../../src/repositories';
import { CareerRole } from '@codeforge/shared';

describe('Career Intelligence & Role Readiness Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const careerRepo = new CareerRepository();
  const ratingRepo = new RatingRepository();
  const curriculumRepo = new CurriculumRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const careerService = new CareerIntelligenceService(
    careerRepo,
    ratingRepo,
    curriculumRepo,
  );

  let userId = '';

  before(async () => {
    const unique = Date.now();
    const user = await authService.register({
      email: `career_dev_${unique}@codeforge.dev`,
      username: `career_dev_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Career Target User',
    });
    userId = user.user.id;
  });

  it('should list all 9 comprehensive career paths with salary and demand insights', () => {
    const paths = careerService.getCareerPaths();
    assert.strictEqual(paths.length, 9, 'Must offer all 9 industry career roles');

    const fullstack = paths.find(p => p.role === CareerRole.FULLSTACK_DEVELOPER);
    assert.ok(fullstack, 'Fullstack path must exist');
    assert.ok(fullstack.avgSalaryRange.includes('$'), 'Salary range must be present');
    assert.ok(fullstack.marketDemand.length > 0, 'Market demand must be documented');
    assert.ok(fullstack.keySkills.length >= 4, 'Must define core competencies');
  });

  it('should get detailed career path roadmap for AI Engineer', () => {
    const aiPath = careerService.getCareerPath(CareerRole.AI_ENGINEER);
    assert.strictEqual(aiPath.role, CareerRole.AI_ENGINEER);
    assert.ok(aiPath.roadmapPhases.length >= 3);
    assert.ok(aiPath.keySkills.length >= 3);
  });

  it('should allow user to configure and retrieve their target career goal', async () => {
    const goal = await careerService.setUserGoal(userId, {
      targetRole: CareerRole.BACKEND_DEVELOPER,
      targetLevel: 'Senior',
      targetTimelineMonths: 6,
    });

    assert.ok(goal.id);
    assert.strictEqual(goal.userId, userId);
    assert.strictEqual(goal.targetRole, CareerRole.BACKEND_DEVELOPER);
    assert.strictEqual(goal.targetLevel, 'Senior');

    const fetchedGoal = await careerService.getUserGoal(userId);
    assert.strictEqual(fetchedGoal?.targetRole, CareerRole.BACKEND_DEVELOPER);
  });

  it('should calculate comprehensive job readiness score and identify skill gaps', async () => {
    const readiness = await careerService.calculateReadiness(userId, CareerRole.BACKEND_DEVELOPER);

    assert.strictEqual(readiness.targetRole, CareerRole.BACKEND_DEVELOPER);
    assert.ok(readiness.readinessScore >= 0 && readiness.readinessScore <= 100);
    assert.ok(Array.isArray(readiness.skillGaps), 'Skill gaps must be an array');
    assert.ok(readiness.skillGaps.length > 0, 'Should analyze missing topics and milestones');
    assert.ok(readiness.recommendedCourses.length > 0);
    assert.ok(readiness.recommendedProjects.length > 0);
    assert.ok(readiness.timelineEstimate.length > 0);
  });

});
