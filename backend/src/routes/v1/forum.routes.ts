import { Router } from 'express';
import { ForumController } from '../../controllers/forum.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const forumRouter = Router();
const controller = new ForumController();

forumRouter.get('/tags', controller.listTags);
forumRouter.get('/posts', controller.listPosts);
forumRouter.post('/posts', authGuard, controller.createPost);
forumRouter.get('/posts/:idOrSlug', controller.getPost);
forumRouter.post('/posts/:postId/answers', authGuard, controller.createAnswer);
forumRouter.post('/posts/:postId/answers/:answerId/accept', authGuard, controller.acceptAnswer);
forumRouter.post('/votes', authGuard, controller.vote);
