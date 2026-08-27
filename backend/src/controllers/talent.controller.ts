import { Request, Response, NextFunction } from 'express';
import { TalentService } from '../services/talent.service';
import { ApiResponse } from '@codeforge/shared';

export class TalentController {
  private talentService: TalentService;

  constructor(talentService = new TalentService()) {
    this.talentService = talentService;
  }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, language, skill, minRating, experience, limit, offset } = req.query;
      const result = await this.talentService.searchTalent({
        role: role as string | undefined,
        language: language as string | undefined,
        skill: skill as string | undefined,
        minRating: minRating ? Number(minRating) : undefined,
        experience: experience as string | undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
