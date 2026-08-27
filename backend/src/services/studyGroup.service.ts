import {
  StudyGroupRepository,
  RatingRepository,
  GamificationRepository,
} from '../repositories';
import { db } from '../database/connection';
import { submissions } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import {
  StudyGroupDto,
  StudyGroupMemberDto,
  StudyGroupDiscussionDto,
  StudyGroupGoalDto,
  CreateStudyGroupDto,
  CreateDiscussionDto,
  GroupLeaderboardEntryDto,
  StudyGroupRole,
  SubmissionStatus,
} from '@codeforge/shared';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../core/errors';



export class StudyGroupService {
  private groupRepo: StudyGroupRepository;
  private ratingRepo: RatingRepository;
  private gamificationRepo: GamificationRepository;

  constructor(
    groupRepo = new StudyGroupRepository(),
    ratingRepo = new RatingRepository(),
    gamificationRepo = new GamificationRepository(),
  ) {
    this.groupRepo = groupRepo;
    this.ratingRepo = ratingRepo;
    this.gamificationRepo = gamificationRepo;
  }

  async listGroups(userId?: string): Promise<StudyGroupDto[]> {
    return this.groupRepo.listGroups(userId);
  }

  async getGroup(groupId: string, userId?: string): Promise<StudyGroupDto> {
    const group = await this.groupRepo.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Study group not found', 'GROUP_NOT_FOUND');
    }

    if (userId) {
      const membership = await this.groupRepo.getMember(groupId, userId);
      if (membership) {
        group.userRole = membership.role;
      }
    }

    return group;
  }

  async createGroup(userId: string, data: CreateStudyGroupDto): Promise<StudyGroupDto> {
    if (!data.name || data.name.trim().length < 3) {
      throw new BadRequestError('Group name must be at least 3 characters', 'INVALID_NAME');
    }
    return this.groupRepo.createGroup(userId, data);
  }

  async joinGroup(groupId: string, userId: string): Promise<StudyGroupMemberDto> {
    const group = await this.groupRepo.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Study group not found', 'GROUP_NOT_FOUND');
    }

    if (group.memberCount >= group.maxMembers) {
      throw new BadRequestError('This study group has reached its maximum member limit', 'GROUP_FULL');
    }

    const existing = await this.groupRepo.getMember(groupId, userId);
    if (existing) {
      return existing;
    }

    return this.groupRepo.addMember(groupId, userId, StudyGroupRole.MEMBER);
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const membership = await this.groupRepo.getMember(groupId, userId);
    if (!membership) {
      throw new BadRequestError('You are not a member of this study group', 'NOT_A_MEMBER');
    }

    if (membership.role === StudyGroupRole.OWNER) {
      const allMembers = await this.groupRepo.getMembers(groupId);
      if (allMembers.length > 1) {
        throw new BadRequestError('Transfer group ownership before leaving the study group', 'OWNER_CANNOT_LEAVE');
      }
    }

    await this.groupRepo.removeMember(groupId, userId);
  }

  async getGroupMembers(groupId: string): Promise<StudyGroupMemberDto[]> {
    return this.groupRepo.getMembers(groupId);
  }

  async getGroupDiscussions(groupId: string): Promise<StudyGroupDiscussionDto[]> {
    return this.groupRepo.getDiscussions(groupId);
  }

  async createDiscussion(
    groupId: string,
    userId: string,
    data: CreateDiscussionDto,
  ): Promise<StudyGroupDiscussionDto> {
    const membership = await this.groupRepo.getMember(groupId, userId);
    if (!membership) {
      throw new ForbiddenError('You must join the study group to participate in discussions', 'NOT_A_MEMBER');
    }

    if (!data.title || data.title.trim().length < 3) {
      throw new BadRequestError('Discussion title must be at least 3 characters', 'INVALID_TITLE');
    }

    return this.groupRepo.createDiscussion(groupId, userId, data);
  }

  async getGroupGoals(groupId: string): Promise<StudyGroupGoalDto[]> {
    return this.groupRepo.getGoals(groupId);
  }

  async createGroupGoal(
    groupId: string,
    userId: string,
    data: { title: string; targetTopicId?: string; targetContestId?: string; targetDate?: string },
  ): Promise<StudyGroupGoalDto> {
    const membership = await this.groupRepo.getMember(groupId, userId);
    if (!membership || (membership.role !== StudyGroupRole.OWNER && membership.role !== StudyGroupRole.ADMIN)) {
      throw new ForbiddenError('Only group owners and admins can create study goals', 'UNAUTHORIZED');
    }

    return this.groupRepo.createGoal(groupId, data);
  }


  async getGroupLeaderboard(groupId: string): Promise<GroupLeaderboardEntryDto[]> {
    const members = await this.groupRepo.getMembers(groupId);
    const leaderboard: GroupLeaderboardEntryDto[] = [];

    for (const m of members) {
      const stats = await this.gamificationRepo.getGamificationSummary(m.userId);
      const rating = await this.ratingRepo.getUserRating(m.userId);

      // Problems solved
      const solvedRows = await db
        .select()
        .from(submissions)
        .where(
          and(
            eq(submissions.userId, m.userId),
            eq(submissions.status, SubmissionStatus.ACCEPTED),
          ),
        );

      leaderboard.push({
        userId: m.userId,
        username: m.username,
        fullName: m.fullName,
        avatarUrl: m.avatarUrl,
        role: m.role,
        xp: stats?.totalXp || 0,
        problemsSolved: solvedRows.length,
        rating: rating?.currentRating || 1200,
        rank: 0,
      });
    }


    leaderboard.sort((a, b) => b.xp - a.xp || b.rating - a.rating);
    leaderboard.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return leaderboard;
  }
}
