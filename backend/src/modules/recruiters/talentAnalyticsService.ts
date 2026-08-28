import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import { TalentAnalyticsDto } from '@codeforge/shared';

export class TalentAnalyticsService {
  constructor(private placementRepo: IPlacementRepository = new PlacementRepository()) {}

  public async getAnalytics(companyId: string): Promise<TalentAnalyticsDto> {
    return await this.placementRepo.getCompanyTalentAnalytics(companyId);
  }

  public async getTalentAnalytics(companyId: string): Promise<TalentAnalyticsDto> {
    return await this.getAnalytics(companyId);
  }
}
