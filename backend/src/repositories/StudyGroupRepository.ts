import { eq, and, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  studyGroups,
  studyGroupMembers,
  studyGroupDiscussions,
  studyGroupGoals,
  users,
  userProfiles,
} from '../database/schema';

import { IStudyGroupRepository } from './interfaces/IStudyGroupRepository';
import {
  StudyGroupDto,
  StudyGroupMemberDto,
  StudyGroupDiscussionDto,
  StudyGroupGoalDto,
  CreateStudyGroupDto,
  CreateDiscussionDto,
  StudyGroupRole,
} from '@codeforge/shared';

export class StudyGroupRepository implements IStudyGroupRepository {
  async listGroups(userId?: string): Promise<StudyGroupDto[]> {
    const rows = await db
      .select({
        id: studyGroups.id,
        name: studyGroups.name,
        slug: studyGroups.slug,
        description: studyGroups.description,
        ownerId: studyGroups.ownerId,
        avatarUrl: studyGroups.avatarUrl,
        isPrivate: studyGroups.isPrivate,
        maxMembers: studyGroups.maxMembers,
        createdAt: studyGroups.createdAt,
        updatedAt: studyGroups.updatedAt,
      })
      .from(studyGroups)
      .orderBy(desc(studyGroups.createdAt));

    const groups: StudyGroupDto[] = [];
    for (const row of rows) {
      const members = await db
        .select()
        .from(studyGroupMembers)
        .where(eq(studyGroupMembers.groupId, row.id));

      let userRole: StudyGroupRole | undefined;
      if (userId) {
        const myMembership = members.find(m => m.userId === userId);
        if (myMembership) {
          userRole = myMembership.role as StudyGroupRole;
        }
      }

      groups.push({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        ownerId: row.ownerId,
        avatarUrl: row.avatarUrl || undefined,
        isPrivate: row.isPrivate,
        maxMembers: row.maxMembers,
        memberCount: members.length,
        userRole,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      });
    }

    return groups;
  }

  async getGroupById(id: string): Promise<StudyGroupDto | null> {
    const rows = await db
      .select()
      .from(studyGroups)
      .where(eq(studyGroups.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    const members = await db
      .select()
      .from(studyGroupMembers)
      .where(eq(studyGroupMembers.groupId, r.id));

    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      ownerId: r.ownerId,
      avatarUrl: r.avatarUrl || undefined,
      isPrivate: r.isPrivate,
      maxMembers: r.maxMembers,
      memberCount: members.length,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async getGroupBySlug(slug: string): Promise<StudyGroupDto | null> {
    const rows = await db
      .select()
      .from(studyGroups)
      .where(eq(studyGroups.slug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    const members = await db
      .select()
      .from(studyGroupMembers)
      .where(eq(studyGroupMembers.groupId, r.id));

    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      ownerId: r.ownerId,
      avatarUrl: r.avatarUrl || undefined,
      isPrivate: r.isPrivate,
      maxMembers: r.maxMembers,
      memberCount: members.length,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async createGroup(ownerId: string, data: CreateStudyGroupDto): Promise<StudyGroupDto> {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const [inserted] = await db
      .insert(studyGroups)
      .values({
        name: data.name,
        slug,
        description: data.description,
        ownerId,
        avatarUrl: data.avatarUrl,
        isPrivate: data.isPrivate ?? false,
        maxMembers: data.maxMembers ?? 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Add owner as OWNER member
    await db.insert(studyGroupMembers).values({
      groupId: inserted.id,
      userId: ownerId,
      role: StudyGroupRole.OWNER,
      joinedAt: new Date(),
    });

    return {
      id: inserted.id,
      name: inserted.name,
      slug: inserted.slug,
      description: inserted.description,
      ownerId: inserted.ownerId,
      avatarUrl: inserted.avatarUrl || undefined,
      isPrivate: inserted.isPrivate,
      maxMembers: inserted.maxMembers,
      memberCount: 1,
      userRole: StudyGroupRole.OWNER,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  }

  async getMember(groupId: string, userId: string): Promise<StudyGroupMemberDto | null> {
    const rows = await db
      .select({
        groupId: studyGroupMembers.groupId,
        userId: studyGroupMembers.userId,
        role: studyGroupMembers.role,
        joinedAt: studyGroupMembers.joinedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(studyGroupMembers)
      .innerJoin(users, eq(studyGroupMembers.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(and(eq(studyGroupMembers.groupId, groupId), eq(studyGroupMembers.userId, userId)))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      groupId: r.groupId,
      userId: r.userId,
      username: r.username,
      fullName: r.fullName || r.username,
      avatarUrl: r.avatarUrl || undefined,
      role: r.role as StudyGroupRole,
      joinedAt: r.joinedAt.toISOString(),
    };
  }

  async getMembers(groupId: string): Promise<StudyGroupMemberDto[]> {
    const rows = await db
      .select({
        groupId: studyGroupMembers.groupId,
        userId: studyGroupMembers.userId,
        role: studyGroupMembers.role,
        joinedAt: studyGroupMembers.joinedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(studyGroupMembers)
      .innerJoin(users, eq(studyGroupMembers.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(studyGroupMembers.groupId, groupId))
      .orderBy(studyGroupMembers.joinedAt);

    return rows.map(r => ({
      groupId: r.groupId,
      userId: r.userId,
      username: r.username,
      fullName: r.fullName || r.username,
      avatarUrl: r.avatarUrl || undefined,
      role: r.role as StudyGroupRole,
      joinedAt: r.joinedAt.toISOString(),
    }));
  }

  async addMember(groupId: string, userId: string, role: StudyGroupRole = StudyGroupRole.MEMBER): Promise<StudyGroupMemberDto> {
    const [inserted] = await db
      .insert(studyGroupMembers)
      .values({
        groupId,
        userId,
        role,
        joinedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [studyGroupMembers.groupId, studyGroupMembers.userId],
        set: { role },
      })
      .returning();

    const member = await this.getMember(groupId, userId);
    return member || {
      groupId: inserted.groupId,
      userId: inserted.userId,
      username: 'User',
      fullName: 'User',
      role: inserted.role as StudyGroupRole,
      joinedAt: inserted.joinedAt.toISOString(),
    };
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const res = await db
      .delete(studyGroupMembers)
      .where(and(eq(studyGroupMembers.groupId, groupId), eq(studyGroupMembers.userId, userId)))
      .returning();

    return res.length > 0;
  }

  async getDiscussions(groupId: string): Promise<StudyGroupDiscussionDto[]> {
    const rows = await db
      .select({
        id: studyGroupDiscussions.id,
        groupId: studyGroupDiscussions.groupId,
        userId: studyGroupDiscussions.userId,
        title: studyGroupDiscussions.title,
        contentMdx: studyGroupDiscussions.contentMdx,
        createdAt: studyGroupDiscussions.createdAt,
        updatedAt: studyGroupDiscussions.updatedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(studyGroupDiscussions)
      .innerJoin(users, eq(studyGroupDiscussions.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(studyGroupDiscussions.groupId, groupId))
      .orderBy(desc(studyGroupDiscussions.createdAt));

    return rows.map(r => ({
      id: r.id,
      groupId: r.groupId,
      userId: r.userId,
      authorName: r.fullName || r.username,
      authorAvatar: r.avatarUrl || undefined,
      title: r.title,
      contentMdx: r.contentMdx,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async createDiscussion(
    groupId: string,
    userId: string,
    data: CreateDiscussionDto,
  ): Promise<StudyGroupDiscussionDto> {
    const [inserted] = await db
      .insert(studyGroupDiscussions)
      .values({
        groupId,
        userId,
        title: data.title,
        contentMdx: data.contentMdx,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const userRows = await db
      .select({
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, userId))
      .limit(1);

    const u = userRows[0];

    return {
      id: inserted.id,
      groupId: inserted.groupId,
      userId: inserted.userId,
      authorName: u ? u.fullName || u.username : 'User',
      authorAvatar: u?.avatarUrl || undefined,
      title: inserted.title,
      contentMdx: inserted.contentMdx,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  }

  async getGoals(groupId: string): Promise<StudyGroupGoalDto[]> {
    const rows = await db
      .select()
      .from(studyGroupGoals)
      .where(eq(studyGroupGoals.groupId, groupId))
      .orderBy(desc(studyGroupGoals.createdAt));

    return rows.map(r => ({
      id: r.id,
      groupId: r.groupId,
      title: r.title,
      targetTopicId: r.targetTopicId || undefined,
      targetContestId: r.targetContestId || undefined,
      targetDate: r.targetDate ? r.targetDate.toISOString() : undefined,
      isCompleted: r.isCompleted,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createGoal(
    groupId: string,
    goal: { title: string; targetTopicId?: string; targetContestId?: string; targetDate?: string },
  ): Promise<StudyGroupGoalDto> {
    const [inserted] = await db
      .insert(studyGroupGoals)
      .values({
        groupId,
        title: goal.title,
        targetTopicId: goal.targetTopicId,
        targetContestId: goal.targetContestId,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
        isCompleted: false,
        createdAt: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      groupId: inserted.groupId,
      title: inserted.title,
      targetTopicId: inserted.targetTopicId || undefined,
      targetContestId: inserted.targetContestId || undefined,
      targetDate: inserted.targetDate ? inserted.targetDate.toISOString() : undefined,
      isCompleted: inserted.isCompleted,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async toggleGoal(goalId: string, isCompleted: boolean): Promise<boolean> {
    const res = await db
      .update(studyGroupGoals)
      .set({ isCompleted })
      .where(eq(studyGroupGoals.id, goalId))
      .returning();

    return res.length > 0;
  }
}
