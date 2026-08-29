import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { IncubationEngineService, StartupGenerationService } from '../../src/modules/startup-builder';
import { IncubationPhase, StartupCategory } from '@codeforge/shared';

describe('Phase 20: Product Incubation Engine Unit Tests', () => {
  it('should initialize product incubation with MVP feature set roadmap', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const incService = new IncubationEngineService(repo);

    const startup = await genService.createStartup({
      name: 'CodeGenius AI',
      tagline: 'Instant verified code synthesis',
      category: StartupCategory.AI_DEVTOOLS,
    });

    const incubation = await incService.incubateProduct({
      startupId: startup.id,
      productName: 'CodeGenius IDE Engine',
      conceptSummary: 'Autonomous compiler plugin for formal verification',
    });

    assert.ok(incubation);
    assert.strictEqual(incubation.startupId, startup.id);
    assert.strictEqual(incubation.productName, 'CodeGenius IDE Engine');
    assert.strictEqual(incubation.phase, IncubationPhase.CONCEPT);
    assert.ok(incubation.mvpFeatureSet.length >= 3);
    assert.ok(incubation.validationMetrics.earlyAccessSignups > 0);
  });

  it('should evaluate Product-Market Fit (PMF) and Sean Ellis Index', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const incService = new IncubationEngineService(repo);

    const startup = await genService.createStartup({
      name: 'AgentMesh',
      tagline: 'Decentralized AI coordination protocol',
      category: StartupCategory.AUTONOMOUS_AGENTS,
    });

    const incubation = await incService.incubateProduct({
      startupId: startup.id,
      productName: 'AgentMesh Node',
      conceptSummary: 'P2P mesh node for agentic swarms',
    });

    const pmf = await incService.getProductMarketFit(incubation.id);
    assert.ok(pmf);
    assert.strictEqual(pmf.incubationId, incubation.id);
    assert.ok(pmf.productMarketFitScore >= 75);
    assert.ok(pmf.seanEllisScorePercent >= 50);
    assert.ok(pmf.keyGrowthDrivers.length > 0);
    assert.ok(pmf.recommendedProductRefinements.length > 0);
  });
});
