import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CivilizationEngineService } from '../../src/modules/planetary-network/civilizationEngineService';
import { CivilizationHealthTier } from '@codeforge/shared';

function createMockPlanetaryRepo() {
  let metrics: any = {
    id: 'met-1',
    civilizationHealthScore: 98.0,
    healthTier: CivilizationHealthTier.PRISTINE,
    innovationIndex: 94.0,
    knowledgeGrowthIndex: 96.0,
    economicActivityIndex: 92.0,
    workforceReadinessIndex: 95.0,
    researchProductivityIndex: 90.0,
    recordedAt: new Date().toISOString(),
  };
  const reports: any[] = [];

  return {
    async getLatestCivilizationMetrics() {
      return metrics;
    },
    async recordCivilizationMetrics(m: any) {
      metrics = { ...metrics, ...m, id: `met-${Date.now()}` };
      return metrics;
    },
    async createCivilizationReport(r: any) {
      const rep = { ...r, id: `rep-${Date.now()}` };
      reports.unshift(rep);
      return rep;
    },
    async listCivilizationReports() {
      return reports;
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: Digital Civilization Engine Unit Tests', () => {
  it('should compute civilization health score and determine health tier correctly', async () => {
    const repo = createMockPlanetaryRepo();
    const service = new CivilizationEngineService(repo);

    const computed = await service.computeCivilizationHealth();
    assert.ok(computed);
    assert.ok(computed.civilizationHealthScore > 90, 'Health score should be > 90');
    assert.strictEqual(computed.healthTier, CivilizationHealthTier.ADVANCING);
  });

  it('should generate comprehensive civilization report with forecasts and opportunity maps', async () => {
    const repo = createMockPlanetaryRepo();
    const service = new CivilizationEngineService(repo);

    const report = await service.generateCivilizationReport();
    assert.ok(report);
    assert.ok(report.title.includes('Planetary Civilization Health'));
    assert.ok(report.growthForecasts.length > 0);
    assert.ok(report.opportunityMap.length > 0);
    assert.ok(report.riskMap.length > 0);
  });

  it('should list historical civilization reports', async () => {
    const repo = createMockPlanetaryRepo();
    const service = new CivilizationEngineService(repo);

    await service.generateCivilizationReport();
    await service.generateCivilizationReport();

    const reports = await service.listReports(10);
    assert.strictEqual(reports.length, 2);
  });
});
