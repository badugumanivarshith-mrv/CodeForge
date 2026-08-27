import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../core/utils/response';

export class UserController {
  constructor(private userService = new UserService()) {}

  public getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.userService.getMyProfile(req.user!.userId);
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  };

  public updateMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.userService.updateMyProfile(req.user!.userId, req.body);
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  };

  public getPublicProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.userService.getPublicProfile(req.params.username);
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  };

  public getMyPreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const preferences = await this.userService.getMyPreferences(req.user!.userId);
      sendSuccess(res, preferences);
    } catch (error) {
      next(error);
    }
  };

  public updateMyPreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.userService.updateMyPreferences(req.user!.userId, req.body);
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  };
}
