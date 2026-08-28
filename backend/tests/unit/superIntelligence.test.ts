import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SuperIntelligenceService } from '../../src/modules/global-network/superIntelligenceService';
import { SuperintelligenceScope } from '@codeforge/shared';

describe('Phase 16: Executive Superintelligence & Command Center Unit Tests', () => {
  const createMockRepo = () => {
    return {
      async listNodes() {
        return [{ id: 'node-1' }, { id: 'node-2' }];
      },
      async listTrends() {
        return [];
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should generate command center planetary telemetry overview', async () => {
    const service = new SuperIntelligenceService(createMockRepo());
    const overview = await service.getCommandCenterOverview();

    assert.ok(overview.totalNetworkNodes >= 1200);
    assert.ok(overview.activeAutonomousAgents >= 300);
    assert.ok(overview.networkHealthScore >= 98);
    assert.ok(overview.trends.length >= 2);
  });

  test('should synthesize executive superintelligence insights across strategic horizons', async () => {
    const service = new SuperIntelligenceService(createMockRepo());
    const insights = await service.generateStrategicInsights(SuperintelligenceScope.STRATEGIC);

    assert.ok(insights.length >= 2);
    const strategic = insights[0];
    assert.strictEqual(strategic.scope, SuperintelligenceScope.STRATEGIC);
    assert.ok(strategic.opportunityScore > 90);
    assert.ok(strategic.strategicActions.length >= 3);
  });

  test('should evaluate ecosystem risk and compute risk mitigation directives', async () => {
    const service = new SuperIntelligenceService(createMockRepo());
    const insights = await service.generateStrategicInsights(SuperintelligenceScope.RISK);

    const riskInsight = insights.find(i => i.scope === SuperintelligenceScope.RISK);
    assert.ok(riskInsight, 'Should find risk intelligence report');
    assert.ok(riskInsight.riskScore > 0);
  });
});
