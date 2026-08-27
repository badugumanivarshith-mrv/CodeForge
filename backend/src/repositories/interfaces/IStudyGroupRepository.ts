import {
  StudyGroupDto,
  StudyGroupMemberDto,
  StudyGroupDiscussionDto,
  StudyGroupGoalDto,
  CreateStudyGroupDto,
  CreateDiscussionDto,
  StudyGroupRole,
} from '@codeforge/shared';

export interface IStudyGroupRepository {
  listGroups(userId?: string): Promise<StudyGroupDto[]>;
  getGroupById(id: string): Promise<StudyGroupDto | null>;
  getGroupBySlug(slug: string): Promise<StudyGroupDto | null>;
  createGroup(ownerId: string, data: CreateStudyGroupDto): Promise<StudyGroupDto>;
  getMember(groupId: string, userId: string): Promise<StudyGroupMemberDto | null>;
  getMembers(groupId: string): Promise<StudyGroupMemberDto[]>;
  addMember(groupId: string, userId: string, role?: StudyGroupRole): Promise<StudyGroupMemberDto>;
  removeMember(groupId: string, userId: string): Promise<boolean>;
  getDiscussions(groupId: string): Promise<StudyGroupDiscussionDto[]>;
  createDiscussion(groupId: string, userId: string, data: CreateDiscussionDto): Promise<StudyGroupDiscussionDto>;
  getGoals(groupId: string): Promise<StudyGroupGoalDto[]>;
  createGoal(groupId: string, goal: { title: string; targetTopicId?: string; targetContestId?: string; targetDate?: string }): Promise<StudyGroupGoalDto>;
  toggleGoal(goalId: string, isCompleted: boolean): Promise<boolean>;
}
