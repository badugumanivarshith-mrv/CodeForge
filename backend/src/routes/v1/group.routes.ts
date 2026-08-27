import { Router } from 'express';
import { StudyGroupController } from '../../controllers/group.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const groupRouter = Router();
const controller = new StudyGroupController();

groupRouter.get('/', controller.listGroups);
groupRouter.post('/', authGuard, controller.createGroup);
groupRouter.get('/:id', controller.getGroup);
groupRouter.post('/:id/join', authGuard, controller.joinGroup);
groupRouter.post('/:id/leave', authGuard, controller.leaveGroup);
groupRouter.get('/:id/members', controller.getMembers);
groupRouter.get('/:id/discussions', controller.getDiscussions);
groupRouter.post('/:id/discussions', authGuard, controller.createDiscussion);
groupRouter.get('/:id/goals', controller.getGoals);
groupRouter.post('/:id/goals', authGuard, controller.createGoal);
groupRouter.get('/:id/leaderboard', controller.getLeaderboard);
