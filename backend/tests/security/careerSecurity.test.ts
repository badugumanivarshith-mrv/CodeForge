import { test, describe } from 'node:test';
import assert from 'node:assert';
import { careerOsRepository } from '../../src/repositories/CareerOsRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { CareerGoalType, NetworkRelationType } from '@codeforge/shared';

describe('Career OS Security & Data Privacy Tests', () => {
  const userRepo = new UserRepository();
  let userAId: string;
  let userBId: string;
  let userATwinId: string;
  let userAGoalId: string;
  let userAMilestoneId: string;
  let userAConnId: string;

  test('1. Setup: Provision User A and User B with isolated Career OS resources', async () => {
    const { user: userA } = await userRepo.create({
      email: `user_a_sec_${Date.now()}@codeforge.io`,
      username: `user_a_${Date.now()}`,
      passwordHash: 'hashed_pw_a',
    });
    userAId = userA.id;

    const { user: userB } = await userRepo.create({
      email: `user_b_sec_${Date.now()}@codeforge.io`,
      username: `user_b_${Date.now()}`,
      passwordHash: 'hashed_pw_b',
    });
    userBId = userB.id;

    const twinA = await careerOsRepository.createTwin(userAId, {
      currentRole: 'Senior Engineer',
      currentLevel: 'L5',
      targetRole: 'Staff Architect',
      targetLevel: 'L6',
      yearsOfExperience: 6,
      primarySkills: ['Rust', 'PostgreSQL'],
      currentSalaryUsd: 175000,
      targetSalaryUsd: 240000,
    });
    userATwinId = twinA.id;

    const goalA = await careerOsRepository.createGoal(userATwinId, userAId, {
      type: CareerGoalType.SALARY,
      title: 'Confidential Salary Progression Goal',
      description: 'Reach $240k total compensation ceiling',
      targetSalaryUsd: 240000,
    });
    userAGoalId = goalA.id;

    const milestoneA = await careerOsRepository.createMilestone(
      userATwinId,
      userAId,
      'Secret Promotion Milestone',
      'Confidential executive alignment',
      'PROMOTION'
    );
    userAMilestoneId = milestoneA.id;

    const connA = await careerOsRepository.createNetworkConnection(userAId, {
      contactName: 'Executive Sponsor',
      contactRole: 'VP of Engineering',
      contactCompany: 'Confidential Corp',
      relationType: NetworkRelationType.MENTOR,
      strengthScore: 95,
      notes: 'Secret sponsorship discussions',
    });
    userAConnId = connA.id;

    assert.ok(userAId);
    assert.ok(userBId);
    assert.ok(userATwinId);
  });

  test('2. Digital Twin Privacy: User B cannot fetch or modify User A twin', async () => {
    // Attempt to update User A's twin as User B
    const updateResult = await careerOsRepository.updateTwin(userBId, {
      targetRole: 'Compromised Role',
    });
    assert.strictEqual(updateResult, null);

    // Fetching twin for User B returns null (isolated)
    const twinB = await careerOsRepository.getTwinByUserId(userBId);
    assert.strictEqual(twinB, null);

    // User A's twin remains intact
    const twinA = await careerOsRepository.getTwinByUserId(userAId);
    assert.ok(twinA);
    assert.strictEqual(twinA.targetRole, 'Staff Architect');
  });

  test('3. Goal Privacy: User B cannot modify or delete User A goals', async () => {
    // User B tries to update User A's confidential goal
    const updateResult = await careerOsRepository.updateGoal(userAGoalId, userBId, {
      title: 'Malicious Update',
      targetSalaryUsd: 0,
    });

    assert.strictEqual(updateResult, null);

    // User B tries to delete User A's goal
    const deleteResult = await careerOsRepository.deleteGoal(userAGoalId, userBId);
    assert.strictEqual(deleteResult, false);

    // Goal should remain unchanged
    const goalsA = await careerOsRepository.listGoals(userAId);
    const intactGoal = goalsA.find(g => g.id === userAGoalId);
    assert.ok(intactGoal);
    assert.strictEqual(intactGoal.title, 'Confidential Salary Progression Goal');
  });

  test('4. Milestone Isolation: User B cannot achieve or mutate User A milestones', async () => {
    const achieveResult = await careerOsRepository.achieveMilestone(userAMilestoneId, userBId);
    assert.strictEqual(achieveResult, null);

    const milestonesA = await careerOsRepository.listMilestones(userAId);
    const intactMilestone = milestonesA.find(m => m.id === userAMilestoneId);
    assert.ok(intactMilestone);
    assert.strictEqual(intactMilestone.isAchieved, false);
  });

  test('5. Network Graph Privacy: User B cannot delete or access User A connections', async () => {
    const deleteResult = await careerOsRepository.deleteNetworkConnection(userAConnId, userBId);
    assert.strictEqual(deleteResult, false);

    const connectionsA = await careerOsRepository.listNetworkConnections(userAId);
    const intactConn = connectionsA.find(c => c.id === userAConnId);
    assert.ok(intactConn);
    assert.strictEqual(intactConn.contactName, 'Executive Sponsor');
  });

  test('6. Data Leakage Prevention: User B query returns empty list for user A events & snapshots', async () => {
    const snapshotsB = await careerOsRepository.getSnapshots(userBId);
    assert.strictEqual(snapshotsB.length, 0);

    const eventsB = await careerOsRepository.listEvents(userBId);
    assert.strictEqual(eventsB.length, 0);

    const connectionsB = await careerOsRepository.listNetworkConnections(userBId);
    assert.strictEqual(connectionsB.length, 0);
  });
});
