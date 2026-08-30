import {
  DataSourceDto,
  CreateDataSourceDto,
  AnalyticsJobDto,
  CreateAnalyticsJobDto,
  DataInsightDto,
  CreateDataInsightDto,
  QualityReportDto,
  CreateQualityReportDto,
  DataOverviewDto,
  AnalyticsJobStatus,
} from '@codeforge/shared';

export interface IDataIntelligenceRepository {
  createDataSource(dto: CreateDataSourceDto): Promise<DataSourceDto>;
  getDataSource(id: string): Promise<DataSourceDto | null>;
  listDataSources(): Promise<DataSourceDto[]>;

  createAnalyticsJob(dto: CreateAnalyticsJobDto): Promise<AnalyticsJobDto>;
  updateJobStatus(id: string, status: AnalyticsJobStatus, outputDetails?: Record<string, any>): Promise<AnalyticsJobDto>;
  getAnalyticsJob(id: string): Promise<AnalyticsJobDto | null>;
  listAnalyticsJobs(): Promise<AnalyticsJobDto[]>;

  createInsight(dto: CreateDataInsightDto): Promise<DataInsightDto>;
  listInsights(): Promise<DataInsightDto[]>;

  createQualityReport(dto: CreateQualityReportDto): Promise<QualityReportDto>;
  listQualityReports(): Promise<QualityReportDto[]>;

  getOverview(): Promise<DataOverviewDto>;
}
