import { IDataIntelligenceRepository } from './interfaces/IDataIntelligenceRepository';
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
  DataSourceType,
  AnalyticsJobStatus,
  InsightType,
  QualityRating,
} from '@codeforge/shared';

export class DataIntelligenceRepository implements IDataIntelligenceRepository {
  private sourcesMap = new Map<string, DataSourceDto>();
  private jobsMap = new Map<string, AnalyticsJobDto>();
  private insightsList: DataInsightDto[] = [];
  private reportsMap = new Map<string, QualityReportDto>();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const source1: DataSourceDto = {
      id: 'source-seed-1',
      name: 'Main Application DB Replica',
      sourceType: DataSourceType.DATABASE,
      connectionDetails: { host: 'db-replica.internal', port: 5432, database: 'production' },
      rowCount: 4500000,
      fileSizeKb: 852400,
      createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
    };

    const source2: DataSourceDto = {
      id: 'source-seed-2',
      name: 'S3 User Activity Logs Bucket',
      sourceType: DataSourceType.CLOUD_STORAGE,
      connectionDetails: { bucket: 'codeforge-activity-logs', region: 'us-east-1' },
      rowCount: 12500000,
      fileSizeKb: 2450800,
      createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    };

    this.sourcesMap.set(source1.id, source1);
    this.sourcesMap.set(source2.id, source2);

    const job1: AnalyticsJobDto = {
      id: 'job-seed-1',
      sourceId: source1.id,
      jobName: 'Weekly Active Users Cohort Aggregation',
      status: AnalyticsJobStatus.SUCCESS,
      executionTimeMs: 4520,
      processedRowsCount: 4500000,
      outputDetails: { computedCohorts: 8, avgSessionLengthMinutes: 24.5 },
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    };

    this.jobsMap.set(job1.id, job1);

    const insight1: DataInsightDto = {
      id: 'insight-seed-1',
      title: 'Active Users Retention Spike',
      summary: 'Weekly active users cohort retention showed a 14.5% improvement following the new UI features rollout.',
      insightType: InsightType.TREND,
      confidenceScore: 0.94,
      anomalyDetected: false,
      historicalTrendDetails: { period: 'Q3-2026', delta: '+14.5%' },
      createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    };

    this.insightsList.push(insight1);

    const report1: QualityReportDto = {
      id: 'report-seed-1',
      sourceId: source1.id,
      completenessPercentage: 99.85,
      duplicateCount: 245,
      nullValueCount: 12,
      rating: QualityRating.EXCELLENT,
      runAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    };

    this.reportsMap.set(report1.id, report1);
  }

  public async createDataSource(dto: CreateDataSourceDto): Promise<DataSourceDto> {
    const source: DataSourceDto = {
      id: `source-${Date.now()}`,
      name: dto.name,
      sourceType: dto.sourceType,
      connectionDetails: dto.connectionDetails,
      rowCount: dto.rowCount,
      fileSizeKb: dto.fileSizeKb,
      createdAt: new Date().toISOString(),
    };
    this.sourcesMap.set(source.id, source);
    return source;
  }

  public async getDataSource(id: string): Promise<DataSourceDto | null> {
    return this.sourcesMap.get(id) || null;
  }

  public async listDataSources(): Promise<DataSourceDto[]> {
    return Array.from(this.sourcesMap.values());
  }

  public async createAnalyticsJob(dto: CreateAnalyticsJobDto): Promise<AnalyticsJobDto> {
    const source = this.sourcesMap.get(dto.sourceId);
    const rowCount = source ? source.rowCount : 0;
    const job: AnalyticsJobDto = {
      id: `job-${Date.now()}`,
      sourceId: dto.sourceId,
      jobName: dto.jobName,
      status: AnalyticsJobStatus.PENDING,
      executionTimeMs: 0,
      processedRowsCount: rowCount,
      outputDetails: {},
      createdAt: new Date().toISOString(),
    };
    this.jobsMap.set(job.id, job);
    return job;
  }

  public async updateJobStatus(id: string, status: AnalyticsJobStatus, outputDetails?: Record<string, any>): Promise<AnalyticsJobDto> {
    const job = this.jobsMap.get(id);
    if (!job) throw new Error(`Analytics Job with ID ${id} not found.`);
    job.status = status;
    if (outputDetails) {
      job.outputDetails = outputDetails;
      job.executionTimeMs = Math.floor(Math.random() * 5000) + 500;
    }
    this.jobsMap.set(id, job);
    return job;
  }

  public async getAnalyticsJob(id: string): Promise<AnalyticsJobDto | null> {
    return this.jobsMap.get(id) || null;
  }

  public async listAnalyticsJobs(): Promise<AnalyticsJobDto[]> {
    return Array.from(this.jobsMap.values());
  }

  public async createInsight(dto: CreateDataInsightDto): Promise<DataInsightDto> {
    const insight: DataInsightDto = {
      id: `insight-${Date.now()}`,
      title: dto.title,
      summary: dto.summary,
      insightType: dto.insightType,
      confidenceScore: dto.confidenceScore,
      anomalyDetected: dto.anomalyDetected,
      historicalTrendDetails: dto.historicalTrendDetails,
      createdAt: new Date().toISOString(),
    };
    this.insightsList.push(insight);
    return insight;
  }

  public async listInsights(): Promise<DataInsightDto[]> {
    return this.insightsList;
  }

  public async createQualityReport(dto: CreateQualityReportDto): Promise<QualityReportDto> {
    const report: QualityReportDto = {
      id: `report-${Date.now()}`,
      sourceId: dto.sourceId,
      completenessPercentage: dto.completenessPercentage,
      duplicateCount: dto.duplicateCount,
      nullValueCount: dto.nullValueCount,
      rating: dto.rating,
      runAt: new Date().toISOString(),
    };
    this.reportsMap.set(report.id, report);
    return report;
  }

  public async listQualityReports(): Promise<QualityReportDto[]> {
    return Array.from(this.reportsMap.values());
  }

  public async getOverview(): Promise<DataOverviewDto> {
    const dataSources = Array.from(this.sourcesMap.values());
    const analyticsJobs = Array.from(this.jobsMap.values());
    const insights = this.insightsList.slice(-10);
    const qualityReports = Array.from(this.reportsMap.values());

    let totalIngestedRows = 0;
    dataSources.forEach((src) => {
      totalIngestedRows += src.rowCount;
    });

    const activeJobsCount = analyticsJobs.filter((j) => j.status === AnalyticsJobStatus.RUNNING || j.status === AnalyticsJobStatus.PENDING).length;

    let totalQuality = 0;
    qualityReports.forEach((rep) => {
      totalQuality += rep.completenessPercentage;
    });
    const averageQualityScore = qualityReports.length > 0 ? parseFloat((totalQuality / qualityReports.length).toFixed(2)) : 100.0;

    return {
      metrics: {
        totalIngestedRows,
        activeJobsCount,
        generatedInsightsCount: this.insightsList.length,
        averageQualityScore,
        totalDataSourcesCount: dataSources.length,
        calculatedAt: new Date().toISOString(),
      },
      dataSources,
      analyticsJobs,
      insights,
      qualityReports,
    };
  }
}

export const dataIntelligenceRepository = new DataIntelligenceRepository();
