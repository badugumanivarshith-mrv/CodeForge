import { Request, Response, NextFunction } from 'express';
import { StudyGroupService } from '../services/studyGroup.service';
import { ApiResponse } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class StudyGroupController {
  private groupService: StudyGroupService;

  constructor(groupService = new StudyGroupService()) {
    this.groupService = groupService;
  }

  listGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groups = await this.groupService.listGroups(req.user?.userId);
      const response: ApiResponse<typeof groups> = {
        success: true,
        data: groups,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const group = await this.groupService.getGroup(id, req.user?.userId);
      const response: ApiResponse<typeof group> = {
        success: true,
        data: group,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const group = await this.groupService.createGroup(req.user.userId, req.body);
      const response: ApiResponse<typeof group> = {
        success: true,
        data: group,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  joinGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const membership = await this.groupService.joinGroup(id, req.user.userId);
      const response: ApiResponse<typeof membership> = {
        success: true,
        data: membership,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  leaveGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      await this.groupService.leaveGroup(id, req.user.userId);
      const response: ApiResponse<{ left: true }> = {
        success: true,
        data: { left: true },
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const members = await this.groupService.getGroupMembers(id);
      const response: ApiResponse<typeof members> = {
        success: true,
        data: members,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getDiscussions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const discussions = await this.groupService.getGroupDiscussions(id);
      const response: ApiResponse<typeof discussions> = {
        success: true,
        data: discussions,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  createDiscussion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const discussion = await this.groupService.createDiscussion(id, req.user.userId, req.body);
      const response: ApiResponse<typeof discussion> = {
        success: true,
        data: discussion,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  getGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const goals = await this.groupService.getGroupGoals(id);
      const response: ApiResponse<typeof goals> = {
        success: true,
        data: goals,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const goal = await this.groupService.createGroupGoal(id, req.user.userId, req.body);
      const response: ApiResponse<typeof goal> = {
        success: true,
        data: goal,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const leaderboard = await this.groupService.getGroupLeaderboard(id);
      const response: ApiResponse<typeof leaderboard> = {
        success: true,
        data: leaderboard,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
