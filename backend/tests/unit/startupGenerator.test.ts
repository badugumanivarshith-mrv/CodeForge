import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import {
  StartupGenerationService,
  StartupValidationService,
  StartupLifecycleService,
} from '../../src/modules/startup-builder';
import { StartupCategory, StartupStage, MarketRiskLevel } from '@codeforge/shared';

describe('Phase 20: Autonomous Startup Generator Unit Tests', () => {
  it('should generate high-conviction startup ideas from domain keywords', async () => {
    const repo = new StartupBuilderRepository();
    const service = new StartupGenerationService(repo);

    const idea = await service.generateStartupIdea({
      category: StartupCategory.AI_DEVTOOLS,
      domainKeywords: ['autonomous verification', 'AST mutation', 'zero-config'],
      targetAudience: 'Enterprise Engineering Leads',
    });

    assert.ok(idea);
    assert.ok(idea.id);
    assert.strictEqual(idea.category, StartupCategory.AI_DEVTOOLS);
    assert.ok(idea.viabilityScore >= 70);
    assert.ok(idea.problemStatement.length > 10);
    assert.ok(idea.proposedSolution.length > 10);
    assert.ok(idea.leanCanvasKeywords.length > 0);
  });

  it('should create a startup and synthesize a complete 7-part Business Model Canvas blueprint', async () => {
    const repo = new StartupBuilderRepository();
    const service = new StartupGenerationService(repo);

    const startup = await service.createStartup({
      name: 'AgentForge Studio',
      tagline: 'Autonomous AI engineer swarms for formal verification',
      category: StartupCategory.AUTONOMOUS_AGENTS,
      stage: StartupStage.IDEATION,
      problemStatement: 'Developers spend 40% of time debugging regression cascades.',
      solutionDescription: 'Autonomous swarm reasoning engine that isolates faults and creates verified patches.',
      targetMarket: 'Global Cloud Software Teams',
    });

    assert.ok(startup);
    assert.strictEqual(startup.name, 'AgentForge Studio');
    assert.strictEqual(startup.valuationUsd, 3500000);
    assert.strictEqual(startup.runwayMonths, 18);

    const blueprint = await service.generateStartupBlueprint(startup.id);
    assert.ok(blueprint);
    assert.strictEqual(blueprint.startup.id, startup.id);
    assert.ok(blueprint.businessModelCanvas.keyPartners.length > 0);
    assert.ok(blueprint.businessModelCanvas.valuePropositions.length > 0);
    assert.ok(blueprint.businessModelCanvas.customerSegments.length > 0);
    assert.ok(blueprint.businessModelCanvas.costStructure.length > 0);
    assert.ok(blueprint.businessModelCanvas.revenueStreams.length > 0);
    assert.ok(blueprint.riskAssessment.identifiedRisks.length > 0);
  });

  it('should validate startup feasibility, risk rating, and defensibility moats', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const valService = new StartupValidationService(repo);

    const startup = await genService.createStartup({
      name: 'Veritas AI',
      tagline: 'Formal code verification at scale',
      category: StartupCategory.CYBERSECURITY_AI,
    });

    const validation = await valService.validateStartupViability(startup.id);
    assert.ok(validation);
    assert.strictEqual(validation.startupId, startup.id);
    assert.ok(validation.viabilityScore >= 75);
    assert.ok(validation.technicalFeasibilityScore >= 70);
    assert.ok(validation.marketAttractivenessScore >= 70);
    assert.strictEqual(validation.riskLevel, MarketRiskLevel.LOW);
    assert.ok(validation.defensibilityMoats.length > 0);
  });

  it('should manage startup lifecycle stage gates and record transition events', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const lifeService = new StartupLifecycleService(repo);

    const startup = await genService.createStartup({
      name: 'ScaleForge',
      tagline: 'Autonomous data engineering platform',
      category: StartupCategory.ENTERPRISE_INFRA,
    });

    assert.strictEqual(startup.stage, StartupStage.IDEATION);

    const updated = await lifeService.advanceStartupStage(
      startup.id,
      StartupStage.VALIDATION,
      'Validated demand with 25 enterprise design partners'
    );

    assert.strictEqual(updated.stage, StartupStage.VALIDATION);

    const events = await lifeService.getStartupEvents(startup.id);
    assert.ok(events.length > 0);
    assert.strictEqual(events[0].metadata.toStage, StartupStage.VALIDATION);
  });
});
