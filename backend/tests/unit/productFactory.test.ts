import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ProductFactoryService } from '../../src/modules/organization-engine/productFactoryService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { ProductLifecycleStage } from '@codeforge/shared';

describe('Phase 19: Autonomous Product Factory Unit Tests', () => {
  it('should discover product opportunity and construct feature roadmap', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new ProductFactoryService(repo);

    const prod = await service.discoverProductOpportunity({
      organizationId: 'org-test-1',
      productName: 'Synthetix Autonomous IDE',
      targetPersona: 'Enterprise Software Engineers',
      coreDifferentiator: 'Sub-millisecond speculative AI compilation',
    });

    assert.ok(prod);
    assert.strictEqual(prod.productName, 'Synthetix Autonomous IDE');
    assert.strictEqual(prod.lifecycleStage, ProductLifecycleStage.DISCOVERY);
    assert.ok(prod.monthlyActiveUsersEstimate > 0);
    assert.ok(prod.productHealthScore >= 90);
    assert.strictEqual(prod.featuresRoadmap.length, 3);
  });

  it('should evaluate product telemetry and advance lifecycle stage', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new ProductFactoryService(repo);

    const prod = await service.discoverProductOpportunity({
      organizationId: 'org-test-1',
      productName: 'MeshRouter ZK',
    });

    const telemetry = await service.evaluateProductTelemetry(prod.id);
    assert.ok(telemetry);
    assert.strictEqual(telemetry.productId, prod.id);
    assert.ok(telemetry.healthScore >= 90);
    assert.strictEqual(telemetry.lifecycleRecommendation, ProductLifecycleStage.ALPHA);

    const updated = await service.advanceLifecycleStage(prod.id, ProductLifecycleStage.ALPHA);
    assert.ok(updated);
    assert.strictEqual(updated?.lifecycleStage, ProductLifecycleStage.ALPHA);
  });
});
