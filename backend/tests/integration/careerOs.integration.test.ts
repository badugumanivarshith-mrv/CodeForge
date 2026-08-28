import { test, describe } from 'node:test';
import assert from 'node:assert';
import { careerOsRepository } from '../../src/repositories/CareerOsRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import {
  CareerGoalType,
  CareerGoalStatus,
  CareerEventType,
  CoachingFrequency,
  ForecastHorizon,
} from '@codeforge/shared';

describe('Career OS Integration Tests (Database & Repository Layer)', () => {
  const userRepo = new UserRepository();
  let testUserId: string;
  let twinId: string;

  test('1. Setup: Create test user and initialize Career Twin in PostgreSQL', async () => {
    const { user } = await userRepo.create({
      email: `careeros_test_${Date.now()}@codeforge.io`,
      username: `careeros_user_${Date.now()}`,
      passwordHash: 'hashed_pw_test',
    });
    testUserId = user.id;

    const twin = await careerOsRepository.createTwin(testUserId, {
      currentRole: 'Software Engineer',
      currentLevel: 'L4 / Mid-Level',
      targetRole: 'Senior Distributed Systems Engineer',
      targetLevel: 'L5 / Senior',
      yearsOfExperience: 3,
      primarySkills: ['TypeScript', 'Rust', 'PostgreSQL'],
    });

    twinId = twin.id;
    assert.ok(twin);
    assert.strictEqual(twin.userId, testUserId);
    assert.strictEqual(twin.currentRole, 'Software Engineer');
  });

  test('2. Career Twin: updateTwin recalculates values and persists updates', async () => {
    const updated = await careerOsRepository.updateTwin(testUserId, {
      targetRole: 'Staff Backend Architect',
    });

    assert.ok(updated);
    assert.strictEqual(updated.targetRole, 'Staff Backend Architect');
  });

  test('3. Career Snapshots: saveSnapshot and getSnapshots preserve telemetry history', async () => {
    const snap = await careerOsRepository.saveSnapshot(twinId, testUserId, 84, {
      learningVelocity: 88,
      careerMomentum: 80,
      marketCompetitiveness: 82,
      interviewReadiness: 75,
      salaryPositioning: 80,
      leadershipPotential: 70,
    });

    assert.ok(snap);
    assert.strictEqual(snap.healthScore, 84);

    const snapshots = await careerOsRepository.getSnapshots(testUserId, 5);
    assert.ok(Array.isArray(snapshots));
    assert.ok(snapshots.length >= 1);
    assert.strictEqual(snapshots[0].healthScore, 84);
  });

  test('4. Career Events: createEvent logs verified events into user history', async () => {
    const event = await careerOsRepository.createEvent(twinId, testUserId, {
      eventType: CareerEventType.PROMOTION,
      title: 'Promoted to Senior Engineer',
      description: 'Led database sharding architecture across 8 microservices',
      company: 'CodeForge Labs',
      role: 'Senior Engineer',
      salaryUsd: 165000,
    });

    assert.ok(event);
    assert.strictEqual(event.eventType, CareerEventType.PROMOTION);
    assert.strictEqual(event.salaryUsd, 165000);

    const events = await careerOsRepository.listEvents(testUserId);
    assert.ok(Array.isArray(events));
    assert.ok(events.length >= 1);
  });

  test('5. Career Milestones: createMilestone and achieveMilestone update state', async () => {
    const milestone = await careerOsRepository.createMilestone(
      twinId,
      testUserId,
      'Complete Distributed Systems Consensus Track',
      'Implement Paxos & Raft from scratch',
      'TECHNICAL'
    );

    assert.ok(milestone);
    assert.strictEqual(milestone.isAchieved, false);

    const achieved = await careerOsRepository.achieveMilestone(milestone.id, testUserId);
    assert.ok(achieved);
    assert.strictEqual(achieved.isAchieved, true);
    assert.ok(achieved.achievedDate);
  });

  test('6. Career Goals: createGoal, updateGoal, and deleteGoal execute correctly', async () => {
    const goal = await careerOsRepository.createGoal(twinId, testUserId, {
      type: CareerGoalType.PROMOTION,
      title: 'Achieve Staff Engineer Promotion',
      description: 'Author 3 architecture RFCs and mentor 2 junior engineers',
      targetRole: 'Staff Engineer',
      targetSalaryUsd: 220000,
      milestones: [
        { title: 'Publish Raft implementation', completed: true },
        { title: 'Conduct Architecture Review', completed: false },
      ],
    });

    assert.ok(goal);
    assert.strictEqual(goal.title, 'Achieve Staff Engineer Promotion');
    assert.strictEqual(goal.status, CareerGoalStatus.IN_PROGRESS);

    const updatedGoal = await careerOsRepository.updateGoal(goal.id, testUserId, {
      progressPercentage: 50,
      status: CareerGoalStatus.IN_PROGRESS,
    });

    assert.ok(updatedGoal);
    assert.strictEqual(updatedGoal.progressPercentage, 50);

    const deleted = await careerOsRepository.deleteGoal(goal.id, testUserId);
    assert.strictEqual(deleted, true);
  });

  test('7. Coaching Reports & Predictions: saveCoachingReport and savePredictions persist analytics', async () => {
    const coaching = await careerOsRepository.saveCoachingReport(twinId, testUserId, {
      frequency: CoachingFrequency.WEEKLY,
      summary: 'Strong progress on distributed systems competencies.',
      healthMetrics: {
        healthScore: 84,
        learningVelocity: 88,
        careerMomentum: 80,
        marketCompetitiveness: 82,
        interviewReadiness: 75,
        salaryPositioning: 80,
        leadershipPotential: 70,
      },
      strengths: ['High Commit Velocity'],
      riskAlerts: [],
      actionItems: [{ priority: 'HIGH', action: 'Lead technical RFC', category: 'LEADERSHIP' }],
      promotionReadiness: 78,
      burnoutRiskScore: 16,
    });

    assert.ok(coaching);
    assert.strictEqual(coaching.summary, 'Strong progress on distributed systems competencies.');

    const predictions = await careerOsRepository.savePredictions(twinId, testUserId, [
      {
        horizon: ForecastHorizon.MONTHS_6,
        promotionProbability: 78,
        salaryGrowthProbability: 82,
        jobSwitchProbability: 40,
        leadershipReadiness: 72,
        skillRelevanceScore: 92,
        careerRiskScore: 14,
        confidenceScore: 88,
        predictedRoles: ['Staff Engineer'],
        growthDrivers: ['Technical Depth'],
        riskFactors: ['Broaden Mentorship'],
      },
    ]);

    assert.ok(Array.isArray(predictions));
    assert.strictEqual(predictions.length, 1);
  });
});
