import { IPlatformIntegrationRepository } from '../../repositories/interfaces/IPlatformIntegrationRepository';
import { UnifiedContextDto, CreateUnifiedContextDto } from '@codeforge/shared';

export class UnifiedContextService {
  constructor(private platformRepo: IPlatformIntegrationRepository) {}

  public async saveContext(userId: string, dto: CreateUnifiedContextDto): Promise<UnifiedContextDto> {
    return this.platformRepo.saveUnifiedContext(userId, dto);
  }

  public async getContext(userId: string, key: string): Promise<UnifiedContextDto | null> {
    return this.platformRepo.getUnifiedContext(userId, key);
  }

  public async getKeys(userId: string): Promise<string[]> {
    return this.platformRepo.listUnifiedContextKeys(userId);
  }
}
