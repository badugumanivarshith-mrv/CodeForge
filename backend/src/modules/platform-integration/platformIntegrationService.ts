import { IPlatformIntegrationRepository } from '../../repositories/interfaces/IPlatformIntegrationRepository';
import { PlatformEventDto, CreatePlatformEventDto, PlatformOverviewDto, GlobalSearchResultDto, PlatformHealthDto } from '@codeforge/shared';

export class PlatformIntegrationService {
  constructor(private platformRepo: IPlatformIntegrationRepository) {}

  public async logEvent(dto: CreatePlatformEventDto): Promise<PlatformEventDto> {
    return this.platformRepo.createPlatformEvent(dto);
  }

  public async listEvents(): Promise<PlatformEventDto[]> {
    return this.platformRepo.listPlatformEvents();
  }

  public async getOverview(userId: string): Promise<PlatformOverviewDto> {
    return this.platformRepo.getOverview(userId);
  }

  public async getHealth(): Promise<PlatformHealthDto> {
    return this.platformRepo.getHealth();
  }

  public async search(queryStr: string): Promise<GlobalSearchResultDto[]> {
    return this.platformRepo.globalSearch(queryStr);
  }
}
