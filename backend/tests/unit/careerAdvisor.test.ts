import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CareerAdvisorService } from '../../src/modules/recruiters/careerAdvisorService';

describe('AI Career Advisor Unit Tests', () => {
  const advisorService = new CareerAdvisorService();

  test('1. Interview readiness score calculation combining multiple mastery dimensions', () => {
    const candidateStats = {
      solvedProblemsCount: 45,
      hardProblemsCount: 8,
      contestRating: 1650,
      assessmentAverage: 82,
      interviewSessionsCount: 4,
      interviewAvgScore: 78,
    };

    const readiness = advisorService.calculateInterviewReadiness(candidateStats);

    assert.ok(typeof readiness === 'number');
    assert.ok(readiness >= 0 && readiness <= 100);
    assert.ok(readiness >= 60, `Expected readiness >= 60 for solid candidate, got ${readiness}`);
  });

  test('2. Salary estimation percentiles & median calculations based on role and rating', () => {
    const estimation = advisorService.estimateSalary('Backend Systems Engineer', 1800);

    assert.ok(estimation);
    assert.ok(estimation.minAnnual > 0);
    assert.ok(estimation.maxAnnual > estimation.minAnnual);
    assert.ok(estimation.medianAnnual >= estimation.minAnnual && estimation.medianAnnual <= estimation.maxAnnual);
    assert.strictEqual(estimation.currency, 'USD');
    assert.ok(estimation.percentileRank >= 50, 'Higher Elo rating should yield higher percentile rank');
  });

  test('3. Skill gap analysis prioritizing critical deficits over nice-to-have gaps', () => {
    const userSkills = [
      { name: 'JavaScript', proficiency: 85 },
      { name: 'HTML/CSS', proficiency: 90 },
    ];

    const targetRole = 'Staff Software Architect';
    const gaps = advisorService.analyzeSkillGaps(userSkills, targetRole);

    assert.ok(Array.isArray(gaps));
    assert.ok(gaps.length > 0);

    const hasCritical = gaps.some(g => g.importance === 'critical');
    assert.ok(hasCritical, 'Advanced architect role must highlight critical system design gaps');

    // Verify ordering: critical first, then important, then nice_to_have
    const importanceOrder = { critical: 3, important: 2, nice_to_have: 1 };
    for (let i = 0; i < gaps.length - 1; i++) {
      const current = importanceOrder[gaps[i].importance];
      const next = importanceOrder[gaps[i + 1].importance];
      assert.ok(current >= next, 'Skill gaps must be sorted in descending order of criticality');
    }
  });

  test('4. 3-Stage Career Trajectory generation across 1-2y, 2-3y, and 3-5y horizons', () => {
    const trajectory = advisorService.generateCareerTrajectory('Full Stack Engineer');

    assert.ok(Array.isArray(trajectory));
    assert.strictEqual(trajectory.length, 3);

    assert.strictEqual(trajectory[0].stage, 'Immediate Horizon (0-1 Year)');
    assert.strictEqual(trajectory[1].stage, 'Mid-Level Mastery (1-3 Years)');
    assert.strictEqual(trajectory[2].stage, 'Principal / Leadership (3-5+ Years)');

    for (const stage of trajectory) {
      assert.ok(stage.targetRoles.length > 0);
      assert.ok(stage.milestones.length > 0);
    }
  });

  test('5. Personalized Problem-Solving Practice Roadmap generation with ordered steps', () => {
    const roadmap = advisorService.generatePersonalizedRoadmap([
      { skill: 'Dynamic Programming', importance: 'critical', currentProficiency: 20, targetProficiency: 80 },
      { skill: 'Distributed Systems', importance: 'critical', currentProficiency: 30, targetProficiency: 85 },
      { skill: 'SQL & Indexing', importance: 'important', currentProficiency: 50, targetProficiency: 80 },
    ]);

    assert.ok(Array.isArray(roadmap));
    assert.ok(roadmap.length > 0);

    for (let i = 0; i < roadmap.length; i++) {
      assert.strictEqual(roadmap[i].step, i + 1);
      assert.ok(roadmap[i].title);
      assert.ok(roadmap[i].description);
      assert.ok(roadmap[i].estimatedWeeks > 0);
    }
  });

  test('6. Placement probability bounds checking (10% to 98% realistic clamping)', () => {
    const lowProb = advisorService.calculatePlacementProbability(1000, 30, 20);
    assert.ok(lowProb >= 10 && lowProb <= 40);

    const highProb = advisorService.calculatePlacementProbability(2400, 98, 95);
    assert.ok(highProb >= 85 && highProb <= 98);
  });
});
