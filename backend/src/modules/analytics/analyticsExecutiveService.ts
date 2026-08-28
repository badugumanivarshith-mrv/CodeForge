import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import { ExecutiveAnalyticsDto } from '@codeforge/shared';

export class AnalyticsExecutiveService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async getExecutiveDashboardMetrics(): Promise<ExecutiveAnalyticsDto> {
    return this.enterpriseRepo.getExecutiveAnalytics();
  }

  async getExecutiveRollup(): Promise<ExecutiveAnalyticsDto> {
    return this.enterpriseRepo.getExecutiveAnalytics();
  }
}

export const analyticsExecutiveService = new AnalyticsExecutiveService();
