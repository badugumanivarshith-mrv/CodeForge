import { IDataIntelligenceRepository } from '../../repositories/interfaces/IDataIntelligenceRepository';
import { CreateAnalyticsJobDto, AnalyticsJobDto, AnalyticsJobStatus } from '@codeforge/shared';

export class AnalyticsEngineService {
  constructor(private dataRepo: IDataIntelligenceRepository) {}

  public async triggerJob(dto: CreateAnalyticsJobDto): Promise<AnalyticsJobDto> {
    const job = await this.dataRepo.createAnalyticsJob(dto);
    // Simulate immediate successful processing run
    await this.dataRepo.updateJobStatus(job.id, AnalyticsJobStatus.RUNNING);
    const updated = await this.dataRepo.updateJobStatus(job.id, AnalyticsJobStatus.SUCCESS, {
      computedClusters: 5,
      recordsAnalyzed: job.processedRowsCount,
      accuracyRate: 0.985,
    });
    return updated;
  }

  public async getJob(id: string): Promise<AnalyticsJobDto | null> {
    return this.dataRepo.getAnalyticsJob(id);
  }

  public async listJobs(): Promise<AnalyticsJobDto[]> {
    return this.dataRepo.listAnalyticsJobs();
  }
}
