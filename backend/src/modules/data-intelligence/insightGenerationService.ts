import { IDataIntelligenceRepository } from '../../repositories/interfaces/IDataIntelligenceRepository';
import { CreateDataInsightDto, DataInsightDto } from '@codeforge/shared';

export class InsightGenerationService {
  constructor(private dataRepo: IDataIntelligenceRepository) {}

  public async generateInsight(dto: CreateDataInsightDto): Promise<DataInsightDto> {
    return this.dataRepo.createInsight(dto);
  }

  public async listInsights(): Promise<DataInsightDto[]> {
    return this.dataRepo.listInsights();
  }
}
