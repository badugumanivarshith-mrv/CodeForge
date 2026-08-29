import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { AIFounderService, StartupGenerationService } from '../../src/modules/startup-builder';
import { StartupCategory } from '@codeforge/shared';

describe('Phase 20: AI Founder Operating System Unit Tests', () => {
  it('should formulate 3/6/12-month horizon strategic plans with resource allocations', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const founderService = new AIFounderService(repo);

    const startup = await genService.createStartup({
      name: 'Agentix Core',
      tagline: 'Autonomous AI engineer swarms',
      category: StartupCategory.AI_DEVTOOLS,
    });

    const plan = await founderService.getStrategicPlan(startup.id);
    assert.ok(plan);
    assert.strictEqual(plan.startupId, startup.id);
    assert.strictEqual(plan.topPriorities.length, 3);
    assert.strictEqual(plan.topPriorities[0].horizonMonths, 3);
    assert.strictEqual(plan.topPriorities[1].horizonMonths, 6);
    assert.strictEqual(plan.topPriorities[2].horizonMonths, 12);
    assert.ok(plan.resourceAllocations.engineering >= 40);
    assert.ok(plan.riskMitigationMatrix.length > 0);
  });

  it('should simulate multi-option founder decision scenarios and provide strategic rationale', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const founderService = new AIFounderService(repo);

    const startup = await genService.createStartup({
      name: 'DevSwarm AI',
      tagline: 'Autonomous developer teams',
      category: StartupCategory.AUTONOMOUS_AGENTS,
    });

    const decision = await founderService.getFounderDecisionSupport({
      startupId: startup.id,
      decisionTitle: 'Choose Enterprise GTM Strategy',
      context: 'Evaluating developer-led bottoms up vs top-down enterprise sales.',
      options: [
        'Pure Developer Open-Core Free Tier',
        'Top-Down Enterprise Direct Sales',
        'Hybrid Product-Led Growth with Enterprise Security Tier',
      ],
    });

    assert.ok(decision);
    assert.strictEqual(decision.startupId, startup.id);
    assert.strictEqual(decision.simulatedScenarios.length, 3);
    assert.ok(decision.confidenceScore >= 80);
    assert.ok(decision.recommendedOption.length > 0);
    assert.ok(decision.strategicRationale.length > 10);
    assert.ok(decision.recommendedOption.includes('Hybrid'));
  });
});
