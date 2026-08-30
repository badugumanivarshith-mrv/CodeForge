import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { ResearchMetricsService } from '../../src/modules/research-university/researchMetricsService';

describe('Phase 22: Academic Command Center & Metrics Unit Tests', () => {
  it('should compute institutional research metrics including estimated h-index and grant pool', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new ResearchMetricsService(repo);

    const metrics = await service.getMetrics();
    assert.ok(metrics);
    assert.ok(metrics.totalPrograms >= 2);
    assert.ok(metrics.activeLabsCount >= 2);
    assert.ok(metrics.publicationsCount >= 1);
    assert.ok(metrics.totalCitationsCount >= 40);
    assert.ok(metrics.hIndexEstimated >= 1);
    assert.ok(metrics.averageReproducibilityRate >= 95.0);
  });

  it('should aggregate top-level Academic Command Center overview', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new ResearchMetricsService(repo);

    const overview = await service.getAcademicCommandCenterOverview();
    assert.ok(overview);
    assert.ok(overview.universityName.includes('CodeForge Autonomous Research University'));
    assert.ok(overview.topPrograms.length >= 1);
    assert.ok(overview.activeLabs.length >= 1);
    assert.ok(overview.recentPublications.length >= 1);
    assert.ok(overview.recentDiscoveries.length >= 1);
    assert.ok(overview.openGrants.length >= 1);
  });
});
