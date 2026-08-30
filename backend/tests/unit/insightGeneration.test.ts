import { test, describe } from 'node:test';
import assert from 'node:assert';
import { InsightGenerationService } from '../../src/modules/data-intelligence/insightGenerationService';
import { DataIntelligenceRepository } from '../../src/repositories/DataIntelligenceRepository';
import { InsightType } from '@codeforge/shared';

describe('Phase 27: Insight Generation Service Unit Tests', () => {
  const repo = new DataIntelligenceRepository();
  const insightService = new InsightGenerationService(repo);

  test('should generate new insight successfully', async () => {
    const insight = await insightService.generateInsight({
      title: 'Weekly Active Users Growth Forecast',
      summary: 'Projected spike of 15% in daily engagement metrics.',
      insightType: InsightType.FORECAST,
      confidenceScore: 0.91,
      anomalyDetected: false,
      historicalTrendDetails: { forecastPeriod: 'Q4-2026' },
    });

    assert.ok(insight.id);
    assert.strictEqual(insight.insightType, InsightType.FORECAST);
    assert.strictEqual(insight.confidenceScore, 0.91);
  });

  test('should list all insights reports', async () => {
    const insights = await insightService.listInsights();
    assert.ok(insights.length >= 1);
  });
});
