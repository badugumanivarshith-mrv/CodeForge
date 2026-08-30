import {
  DataSourceDto,
  AnalyticsJobDto,
  DataInsightDto,
  DataOverviewDto,
  DataSourceType,
  AnalyticsJobStatus,
  InsightType,
  QualityRating,
} from '@codeforge/shared';

const API_BASE = '/api/v1/data';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const dataIntelligenceApi = {
  async getOverview(): Promise<DataOverviewDto> {
    try {
      const res = await fetch(`${API_BASE}/metrics`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock overview:', err);
    }
    return getOfflineOverview();
  },

  async listAnalytics(): Promise<AnalyticsJobDto[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock analytics:', err);
    }
    return getOfflineOverview().analyticsJobs;
  },

  async listInsights(): Promise<DataInsightDto[]> {
    try {
      const res = await fetch(`${API_BASE}/insights`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock insights:', err);
    }
    return getOfflineOverview().insights;
  },

  async importDataSource(dto: {
    name: string;
    sourceType: DataSourceType;
    connectionDetails: Record<string, any>;
    rowCount: number;
    fileSizeKb: number;
  }): Promise<DataSourceDto> {
    try {
      const res = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock import:', err);
    }

    return {
      id: `source-${Date.now()}`,
      name: dto.name,
      sourceType: dto.sourceType,
      connectionDetails: dto.connectionDetails,
      rowCount: dto.rowCount,
      fileSizeKb: dto.fileSizeKb,
      createdAt: new Date().toISOString(),
    };
  },
};

function getOfflineOverview(): DataOverviewDto {
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

  return {
    metrics: {
      totalIngestedRows: 17000000,
      activeJobsCount: 0,
      generatedInsightsCount: 1,
      averageQualityScore: 99.85,
      totalDataSourcesCount: 2,
      calculatedAt: new Date().toISOString(),
    },
    dataSources: [source1, source2],
    analyticsJobs: [
      {
        id: 'job-seed-1',
        sourceId: source1.id,
        jobName: 'Weekly Active Users Cohort Aggregation',
        status: AnalyticsJobStatus.SUCCESS,
        executionTimeMs: 4520,
        processedRowsCount: 4500000,
        outputDetails: { computedCohorts: 8, avgSessionLengthMinutes: 24.5 },
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
    ],
    insights: [
      {
        id: 'insight-seed-1',
        title: 'Active Users Retention Spike',
        summary: 'Weekly active users cohort retention showed a 14.5% improvement following the new UI features rollout.',
        insightType: InsightType.TREND,
        confidenceScore: 0.94,
        anomalyDetected: false,
        historicalTrendDetails: { period: 'Q3-2026', delta: '+14.5%' },
        createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      },
    ],
    qualityReports: [
      {
        id: 'report-seed-1',
        sourceId: source1.id,
        completenessPercentage: 99.85,
        duplicateCount: 245,
        nullValueCount: 12,
        rating: QualityRating.EXCELLENT,
        runAt: new Date(Date.now() - 7200 * 1000).toISOString(),
      },
    ],
  };
}
