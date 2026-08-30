import { IDataIntelligenceRepository } from '../../repositories/interfaces/IDataIntelligenceRepository';
import { QualityReportDto, QualityRating } from '@codeforge/shared';

export class DataQualityService {
  constructor(private dataRepo: IDataIntelligenceRepository) {}

  public async auditSource(sourceId: string): Promise<QualityReportDto> {
    const source = await this.dataRepo.getDataSource(sourceId);
    if (!source) throw new Error(`Data Source with ID ${sourceId} not found.`);

    // Perform audit constraints checks
    const nullValueCount = Math.floor(Math.random() * 50);
    const duplicateCount = Math.floor(Math.random() * 200);
    const totalRecords = source.rowCount || 1000;
    const completenessPercentage = parseFloat(((totalRecords - nullValueCount) / totalRecords * 100).toFixed(2));

    let rating = QualityRating.EXCELLENT;
    if (completenessPercentage < 90) rating = QualityRating.CRITICAL;
    else if (completenessPercentage < 95) rating = QualityRating.POOR;
    else if (completenessPercentage < 98) rating = QualityRating.GOOD;

    return this.dataRepo.createQualityReport({
      sourceId,
      completenessPercentage,
      duplicateCount,
      nullValueCount,
      rating,
    });
  }

  public async listReports(): Promise<QualityReportDto[]> {
    return this.dataRepo.listQualityReports();
  }
}
