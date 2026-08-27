import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { StudyGroupService } from '../../src/services/studyGroup.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  StudyGroupRepository,
  RatingRepository,
  GamificationRepository,
} from '../../src/repositories';
import { StudyGroupRole } from '@codeforge/shared';

describe('Study Groups & Peer Learning Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const groupRepo = new StudyGroupRepository();
  const ratingRepo = new RatingRepository();
  const gamificationRepo = new GamificationRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const groupService = new StudyGroupService(
    groupRepo,
    ratingRepo,
    gamificationRepo,
  );

  let user1Id = '';
  let user2Id = '';
  let user3Id = '';
  let testGroupId = '';

  before(async () => {
    const unique = Date.now();
    const user1 = await authService.register({
      email: `group_user1_${unique}@codeforge.dev`,
      username: `group_owner_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Study Group Owner',
    });
    user1Id = user1.user.id;

    const user2 = await authService.register({
      email: `group_user2_${unique}@codeforge.dev`,
      username: `group_member_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Study Group Member',
    });
    user2Id = user2.user.id;

    const user3 = await authService.register({
      email: `group_user3_${unique}@codeforge.dev`,
      username: `group_outsider_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Study Group Outsider',
    });
    user3Id = user3.user.id;
  });

  it('should create a study group and automatically assign creator as OWNER', async () => {
    const group = await groupService.createGroup(user1Id, {
      name: 'Algorithms Masters Club',
      description: 'Weekly DP and Graph algorithm sessions.',
      maxMembers: 10,
      isPrivate: false,
    });

    assert.ok(group.id, 'Group ID should exist');
    assert.strictEqual(group.name, 'Algorithms Masters Club');
    assert.strictEqual(group.ownerId, user1Id);
    assert.strictEqual(group.memberCount, 1);
    testGroupId = group.id;

    const members = await groupService.getGroupMembers(testGroupId);
    assert.strictEqual(members.length, 1);
    assert.strictEqual(members[0].userId, user1Id);
    assert.strictEqual(members[0].role, StudyGroupRole.OWNER);
  });

  it('should allow another user to join the study group as MEMBER', async () => {
    const membership = await groupService.joinGroup(testGroupId, user2Id);
    assert.strictEqual(membership.groupId, testGroupId);
    assert.strictEqual(membership.userId, user2Id);
    assert.strictEqual(membership.role, StudyGroupRole.MEMBER);

    const group = await groupService.getGroup(testGroupId, user2Id);
    assert.strictEqual(group.memberCount, 2);
    assert.strictEqual(group.userRole, StudyGroupRole.MEMBER);
  });

  it('should allow members to create and view discussions', async () => {
    const discussion = await groupService.createDiscussion(testGroupId, user2Id, {
      title: 'How to approach Tree DP problems?',
      contentMdx: 'Let us discuss rerooting techniques and subtree aggregation patterns.',
    });

    assert.ok(discussion.id, 'Discussion should be created');
    assert.strictEqual(discussion.groupId, testGroupId);
    assert.strictEqual(discussion.userId, user2Id);

    const discussions = await groupService.getGroupDiscussions(testGroupId);
    assert.strictEqual(discussions.length, 1);
    assert.strictEqual(discussions[0].id, discussion.id);
  });

  it('should block non-members from posting discussions (Access Control)', async () => {
    await assert.rejects(
      async () => {
        await groupService.createDiscussion(testGroupId, user3Id, {
          title: 'Spam post by outsider',
          contentMdx: 'I am not a member of this study group.',
        });
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 403);
        assert.strictEqual(err.code, 'NOT_A_MEMBER');
        return true;
      },
    );
  });

  it('should allow owner to create group study goals, and block non-admin members', async () => {
    await assert.rejects(
      async () => {
        await groupService.createGroupGoal(testGroupId, user2Id, {
          title: 'Solve 20 Dynamic Programming problems this week',
        });
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 403);
        assert.strictEqual(err.code, 'UNAUTHORIZED');
        return true;
      },
    );

    const goal = await groupService.createGroupGoal(testGroupId, user1Id, {
      title: 'Complete Bi-weekly Contest 10',
    });
    assert.ok(goal.id);
    assert.strictEqual(goal.title, 'Complete Bi-weekly Contest 10');

    const goals = await groupService.getGroupGoals(testGroupId);
    assert.strictEqual(goals.length, 1);
  });

  it('should calculate live group leaderboard ranked by XP and ratings', async () => {
    const leaderboard = await groupService.getGroupLeaderboard(testGroupId);
    assert.strictEqual(leaderboard.length, 2);
    assert.strictEqual(leaderboard[0].rank, 1);
    assert.strictEqual(leaderboard[1].rank, 2);
    assert.ok(leaderboard[0].rating >= 1200);
  });

  it('should allow member to leave group', async () => {
    await groupService.leaveGroup(testGroupId, user2Id);
    const members = await groupService.getGroupMembers(testGroupId);
    assert.strictEqual(members.length, 1);
    assert.strictEqual(members[0].userId, user1Id);
  });
});
