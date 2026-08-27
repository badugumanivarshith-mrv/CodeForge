import { eq, and, sql, desc, ilike } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  forumPosts,
  forumAnswers,
  forumTags,
  forumPostsTags,
  forumVotes,
  forumReputations,
  users,
  userProfiles,
} from '../database/schema';

import { IForumRepository } from './interfaces/IForumRepository';
import {
  ForumPostDto,
  ForumAnswerDto,
  ForumTagDto,
  CreateForumPostDto,
  ForumTargetType,
  ForumVoteType,
} from '@codeforge/shared';

export class ForumRepository implements IForumRepository {
  async listTags(): Promise<ForumTagDto[]> {
    const rows = await db
      .select()
      .from(forumTags)
      .orderBy(desc(forumTags.postsCount));

    return rows.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || undefined,
      postsCount: r.postsCount,
    }));
  }

  async getTagBySlug(slug: string): Promise<ForumTagDto | null> {
    const rows = await db
      .select()
      .from(forumTags)
      .where(eq(forumTags.slug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || undefined,
      postsCount: r.postsCount,
    };
  }

  async createTag(name: string, slug: string, description?: string): Promise<ForumTagDto> {
    const [inserted] = await db
      .insert(forumTags)
      .values({
        name,
        slug,
        description,
        postsCount: 0,
      })
      .onConflictDoUpdate({
        target: forumTags.slug,
        set: { name, description },
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      slug: inserted.slug,
      description: inserted.description || undefined,
      postsCount: inserted.postsCount,
    };
  }

  async listPosts(
    tagSlug?: string,
    searchQuery?: string,
    currentUserId?: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ForumPostDto[]> {
    let baseQuery = db
      .select({
        id: forumPosts.id,
        userId: forumPosts.userId,
        title: forumPosts.title,
        slug: forumPosts.slug,
        contentMdx: forumPosts.contentMdx,
        viewsCount: forumPosts.viewsCount,
        upvotesCount: forumPosts.upvotesCount,
        downvotesCount: forumPosts.downvotesCount,
        score: forumPosts.score,
        answersCount: forumPosts.answersCount,
        acceptedAnswerId: forumPosts.acceptedAnswerId,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .$dynamic();

    if (searchQuery) {
      baseQuery = baseQuery.where(ilike(forumPosts.title, `%${searchQuery}%`));
    }

    const rows = await baseQuery
      .orderBy(desc(forumPosts.createdAt))
      .limit(limit)
      .offset(offset);

    const posts: ForumPostDto[] = [];
    for (const r of rows) {
      // Tags for this post
      const tagRows = await db
        .select({
          id: forumTags.id,
          name: forumTags.name,
          slug: forumTags.slug,
          description: forumTags.description,
          postsCount: forumTags.postsCount,
        })
        .from(forumPostsTags)
        .innerJoin(forumTags, eq(forumPostsTags.tagId, forumTags.id))
        .where(eq(forumPostsTags.postId, r.id));

      if (tagSlug && !tagRows.some(t => t.slug === tagSlug)) {
        continue;
      }

      let userVote: ForumVoteType | undefined;
      if (currentUserId) {
        userVote = (await this.getVote(currentUserId, ForumTargetType.POST, r.id)) || undefined;
      }

      posts.push({
        id: r.id,
        userId: r.userId,
        authorName: r.fullName || r.username,
        authorAvatar: r.avatarUrl || undefined,
        title: r.title,
        slug: r.slug,
        contentMdx: r.contentMdx,
        viewsCount: r.viewsCount,
        upvotesCount: r.upvotesCount,
        downvotesCount: r.downvotesCount,
        score: r.score,
        answersCount: r.answersCount,
        acceptedAnswerId: r.acceptedAnswerId || undefined,
        tags: tagRows.map(t => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          description: t.description || undefined,
          postsCount: t.postsCount,
        })),
        userVote,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      });
    }

    return posts;
  }

  async getPostById(id: string, currentUserId?: string): Promise<ForumPostDto | null> {
    const rows = await db
      .select({
        id: forumPosts.id,
        userId: forumPosts.userId,
        title: forumPosts.title,
        slug: forumPosts.slug,
        contentMdx: forumPosts.contentMdx,
        viewsCount: forumPosts.viewsCount,
        upvotesCount: forumPosts.upvotesCount,
        downvotesCount: forumPosts.downvotesCount,
        score: forumPosts.score,
        answersCount: forumPosts.answersCount,
        acceptedAnswerId: forumPosts.acceptedAnswerId,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(forumPosts.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    const tagRows = await db
      .select({
        id: forumTags.id,
        name: forumTags.name,
        slug: forumTags.slug,
        description: forumTags.description,
        postsCount: forumTags.postsCount,
      })
      .from(forumPostsTags)
      .innerJoin(forumTags, eq(forumPostsTags.tagId, forumTags.id))
      .where(eq(forumPostsTags.postId, r.id));

    let userVote: ForumVoteType | undefined;
    if (currentUserId) {
      userVote = (await this.getVote(currentUserId, ForumTargetType.POST, r.id)) || undefined;
    }

    return {
      id: r.id,
      userId: r.userId,
      authorName: r.fullName || r.username,
      authorAvatar: r.avatarUrl || undefined,
      title: r.title,
      slug: r.slug,
      contentMdx: r.contentMdx,
      viewsCount: r.viewsCount,
      upvotesCount: r.upvotesCount,
      downvotesCount: r.downvotesCount,
      score: r.score,
      answersCount: r.answersCount,
      acceptedAnswerId: r.acceptedAnswerId || undefined,
      tags: tagRows.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description || undefined,
        postsCount: t.postsCount,
      })),
      userVote,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async getPostBySlug(slug: string, currentUserId?: string): Promise<ForumPostDto | null> {
    const rows = await db
      .select({ id: forumPosts.id })
      .from(forumPosts)
      .where(eq(forumPosts.slug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    return this.getPostById(rows[0].id, currentUserId);
  }

  async createPost(userId: string, data: CreateForumPostDto): Promise<ForumPostDto> {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const [inserted] = await db
      .insert(forumPosts)
      .values({
        userId,
        title: data.title,
        slug,
        contentMdx: data.contentMdx,
        viewsCount: 0,
        upvotesCount: 0,
        downvotesCount: 0,
        score: 0,
        answersCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Attach tags
    for (const tagId of data.tagIds) {
      await db
        .insert(forumPostsTags)
        .values({ postId: inserted.id, tagId })
        .onConflictDoNothing();

      await db
        .update(forumTags)
        .set({ postsCount: sql`${forumTags.postsCount} + 1` })
        .where(eq(forumTags.id, tagId));
    }

    const post = await this.getPostById(inserted.id, userId);
    return post!;
  }

  async incrementViews(postId: string): Promise<void> {
    await db
      .update(forumPosts)
      .set({ viewsCount: sql`${forumPosts.viewsCount} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async listAnswers(postId: string, currentUserId?: string): Promise<ForumAnswerDto[]> {
    const rows = await db
      .select({
        id: forumAnswers.id,
        postId: forumAnswers.postId,
        userId: forumAnswers.userId,
        contentMdx: forumAnswers.contentMdx,
        upvotesCount: forumAnswers.upvotesCount,
        downvotesCount: forumAnswers.downvotesCount,
        score: forumAnswers.score,
        isAccepted: forumAnswers.isAccepted,
        createdAt: forumAnswers.createdAt,
        updatedAt: forumAnswers.updatedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(forumAnswers)
      .innerJoin(users, eq(forumAnswers.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(forumAnswers.postId, postId))
      .orderBy(desc(forumAnswers.isAccepted), desc(forumAnswers.score), forumAnswers.createdAt);

    const answers: ForumAnswerDto[] = [];
    for (const r of rows) {
      let userVote: ForumVoteType | undefined;
      if (currentUserId) {
        userVote = (await this.getVote(currentUserId, ForumTargetType.ANSWER, r.id)) || undefined;
      }

      answers.push({
        id: r.id,
        postId: r.postId,
        userId: r.userId,
        authorName: r.fullName || r.username,
        authorAvatar: r.avatarUrl || undefined,
        contentMdx: r.contentMdx,
        upvotesCount: r.upvotesCount,
        downvotesCount: r.downvotesCount,
        score: r.score,
        isAccepted: r.isAccepted,
        userVote,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      });
    }

    return answers;
  }

  async getAnswerById(id: string): Promise<ForumAnswerDto | null> {
    const rows = await db
      .select({
        id: forumAnswers.id,
        postId: forumAnswers.postId,
        userId: forumAnswers.userId,
        contentMdx: forumAnswers.contentMdx,
        upvotesCount: forumAnswers.upvotesCount,
        downvotesCount: forumAnswers.downvotesCount,
        score: forumAnswers.score,
        isAccepted: forumAnswers.isAccepted,
        createdAt: forumAnswers.createdAt,
        updatedAt: forumAnswers.updatedAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(forumAnswers)
      .innerJoin(users, eq(forumAnswers.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(forumAnswers.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      postId: r.postId,
      userId: r.userId,
      authorName: r.fullName || r.username,
      authorAvatar: r.avatarUrl || undefined,
      contentMdx: r.contentMdx,
      upvotesCount: r.upvotesCount,
      downvotesCount: r.downvotesCount,
      score: r.score,
      isAccepted: r.isAccepted,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async createAnswer(postId: string, userId: string, contentMdx: string): Promise<ForumAnswerDto> {
    const [inserted] = await db
      .insert(forumAnswers)
      .values({
        postId,
        userId,
        contentMdx,
        upvotesCount: 0,
        downvotesCount: 0,
        score: 0,
        isAccepted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await db
      .update(forumPosts)
      .set({ answersCount: sql`${forumPosts.answersCount} + 1` })
      .where(eq(forumPosts.id, postId));

    const answer = await this.getAnswerById(inserted.id);
    return answer!;
  }

  async acceptAnswer(postId: string, answerId: string): Promise<boolean> {
    // Unaccept all other answers for this post
    await db
      .update(forumAnswers)
      .set({ isAccepted: false })
      .where(eq(forumAnswers.postId, postId));

    // Accept this answer
    const [updatedAnswer] = await db
      .update(forumAnswers)
      .set({ isAccepted: true })
      .where(eq(forumAnswers.id, answerId))
      .returning();

    if (!updatedAnswer) return false;

    // Update post acceptedAnswerId
    await db
      .update(forumPosts)
      .set({ acceptedAnswerId: answerId })
      .where(eq(forumPosts.id, postId));

    // Award reputation (+15) to answer author
    await this.addReputation(updatedAnswer.userId, 15, 'ANSWER_ACCEPTED', answerId);

    return true;
  }

  async getVote(userId: string, targetType: ForumTargetType, targetId: string): Promise<ForumVoteType | null> {
    const rows = await db
      .select()
      .from(forumVotes)
      .where(
        and(
          eq(forumVotes.userId, userId),
          eq(forumVotes.targetType, targetType),
          eq(forumVotes.targetId, targetId),
        ),
      )
      .limit(1);

    if (rows.length === 0) return null;
    return rows[0].voteType as ForumVoteType;
  }

  async castVote(
    userId: string,
    targetType: ForumTargetType,
    targetId: string,
    voteType: ForumVoteType,
  ): Promise<{ newScore: number; userVote: ForumVoteType }> {
    const existing = await this.getVote(userId, targetType, targetId);

    if (existing) {
      if (existing === voteType) {
        // Vote already recorded
      } else {
        // Switch vote
        await db
          .update(forumVotes)
          .set({ voteType })
          .where(
            and(
              eq(forumVotes.userId, userId),
              eq(forumVotes.targetType, targetType),
              eq(forumVotes.targetId, targetId),
            ),
          );
      }
    } else {
      await db.insert(forumVotes).values({
        userId,
        targetType,
        targetId,
        voteType,
        createdAt: new Date(),
      });
    }

    // Recalculate upvotes and downvotes
    const allVotes = await db
      .select()
      .from(forumVotes)
      .where(and(eq(forumVotes.targetType, targetType), eq(forumVotes.targetId, targetId)));

    const upvotes = allVotes.filter(v => v.voteType === ForumVoteType.UPVOTE).length;
    const downvotes = allVotes.filter(v => v.voteType === ForumVoteType.DOWNVOTE).length;
    const score = upvotes - downvotes;

    if (targetType === ForumTargetType.POST) {
      await db
        .update(forumPosts)
        .set({ upvotesCount: upvotes, downvotesCount: downvotes, score })
        .where(eq(forumPosts.id, targetId));
    } else {
      await db
        .update(forumAnswers)
        .set({ upvotesCount: upvotes, downvotesCount: downvotes, score })
        .where(eq(forumAnswers.id, targetId));
    }

    return { newScore: score, userVote: voteType };
  }

  async addReputation(userId: string, pointsDelta: number, reason: string, referenceId?: string): Promise<number> {
    const currentRep = await this.getUserReputation(userId);
    const newScore = Math.max(0, currentRep + pointsDelta);

    await db.insert(forumReputations).values({
      userId,
      score: newScore,
      pointsDelta,
      reason,
      referenceId,
      createdAt: new Date(),
    });

    return newScore;
  }

  async getUserReputation(userId: string): Promise<number> {
    const rows = await db
      .select({ score: forumReputations.score })
      .from(forumReputations)
      .where(eq(forumReputations.userId, userId))
      .orderBy(desc(forumReputations.createdAt))
      .limit(1);

    if (rows.length === 0) return 0;
    return rows[0].score;
  }
}
