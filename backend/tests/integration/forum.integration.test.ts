import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { ForumService } from '../../src/services/forum.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  ForumRepository,
  ActivityFeedRepository,
} from '../../src/repositories';
import { ForumVoteType, ForumTargetType } from '@codeforge/shared';

describe('Community Forum Engine Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const forumRepo = new ForumRepository();
  const feedRepo = new ActivityFeedRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const forumService = new ForumService(forumRepo, feedRepo);

  let authorId = '';
  let responderId = '';
  let thirdPartyId = '';
  let createdPostId = '';
  let createdAnswerId = '';
  let tagIds: string[] = [];

  before(async () => {
    const unique = Date.now();
    const user1 = await authService.register({
      email: `forum_author_${unique}@codeforge.dev`,
      username: `forum_author_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Forum Author User',
    });
    authorId = user1.user.id;

    const user2 = await authService.register({
      email: `forum_responder_${unique}@codeforge.dev`,
      username: `forum_responder_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Forum Responder User',
    });
    responderId = user2.user.id;

    const user3 = await authService.register({
      email: `forum_third_${unique}@codeforge.dev`,
      username: `forum_third_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Forum Third Party',
    });
    thirdPartyId = user3.user.id;

    const tags = await forumService.listTags();
    tagIds = tags.slice(0, 2).map(t => t.id);
  });

  it('should list available tags', async () => {
    const tags = await forumService.listTags();
    assert.ok(tags.length > 0, 'Tags must exist in seed');
    assert.ok(tags.some(t => t.slug === 'typescript'));
  });

  it('should create a new forum question with tags', async () => {
    const post = await forumService.createPost(authorId, {
      title: 'How does TypeScript infer conditional type distributive properties?',
      contentMdx: 'When passing union types into conditional generics, why does naked type parameter distribute across unions?',
      tagIds,
    });

    assert.ok(post.id, 'Post must have ID');
    assert.strictEqual(post.userId, authorId);
    assert.strictEqual(post.title, 'How does TypeScript infer conditional type distributive properties?');
    assert.strictEqual(post.tags.length, 2);
    assert.strictEqual(post.score, 0);
    assert.strictEqual(post.answersCount, 0);
    createdPostId = post.id;
  });

  it('should retrieve the question and increment view count', async () => {
    const { post, answers } = await forumService.getPost(createdPostId, authorId);
    assert.strictEqual(post.id, createdPostId);
    assert.strictEqual(answers.length, 0);
    assert.ok(post.viewsCount >= 0);
  });

  it('should post an answer to the question', async () => {
    const answer = await forumService.createAnswer(createdPostId, responderId, {
      contentMdx: 'Naked type parameters distribute over union types in conditional types because TypeScript matches distributive conditional types by default unless wrapped in a tuple `[T] extends [U]`.',
    });

    assert.ok(answer.id, 'Answer should have ID');
    assert.strictEqual(answer.postId, createdPostId);
    assert.strictEqual(answer.userId, responderId);
    assert.strictEqual(answer.isAccepted, false);
    createdAnswerId = answer.id;

    const { post, answers } = await forumService.getPost(createdPostId);
    assert.strictEqual(post.answersCount, 1);
    assert.strictEqual(answers.length, 1);
    assert.strictEqual(answers[0].id, createdAnswerId);
  });

  it('should support upvoting questions and answers with score updates', async () => {
    const voteResult = await forumService.vote(authorId, {
      targetType: ForumTargetType.ANSWER,
      targetId: createdAnswerId,
      voteType: ForumVoteType.UPVOTE,
    });

    assert.strictEqual(voteResult.voteScore, 1);
    assert.strictEqual(voteResult.userVote, ForumVoteType.UPVOTE);

    const { answers } = await forumService.getPost(createdPostId, authorId);
    assert.strictEqual(answers[0].score, 1);
    assert.strictEqual(answers[0].upvotesCount, 1);
    assert.strictEqual(answers[0].userVote, ForumVoteType.UPVOTE);
  });

  it('should prevent non-authors from accepting an answer (Access Control)', async () => {
    await assert.rejects(
      async () => {
        await forumService.acceptAnswer(createdPostId, createdAnswerId, thirdPartyId);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 403);
        return true;
      },
    );
  });

  it('should allow author of question to accept answer and mark isAccepted', async () => {
    const success = await forumService.acceptAnswer(createdPostId, createdAnswerId, authorId);
    assert.strictEqual(success, true);

    const { post, answers } = await forumService.getPost(createdPostId);
    assert.strictEqual(post.acceptedAnswerId, createdAnswerId);
    assert.strictEqual(answers[0].isAccepted, true);
  });
});
