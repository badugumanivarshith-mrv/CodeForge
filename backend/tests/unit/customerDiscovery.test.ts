import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { CustomerDiscoveryService, StartupGenerationService } from '../../src/modules/startup-builder';
import { CustomerPersonaType, StartupCategory } from '@codeforge/shared';

describe('Phase 20: Customer Discovery & Persona Validation Unit Tests', () => {
  it('should generate rich customer personas with demographics, pain points, and WTP', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const discService = new CustomerDiscoveryService(repo);

    const startup = await genService.createStartup({
      name: 'CloudGuard AI',
      tagline: 'Autonomous zero-trust security orchestration',
      category: StartupCategory.CYBERSECURITY_AI,
    });

    const persona = await discService.generateCustomerPersona(startup.id, CustomerPersonaType.SECURITY_OFFICER);
    assert.ok(persona);
    assert.strictEqual(persona.startupId, startup.id);
    assert.strictEqual(persona.personaType, CustomerPersonaType.SECURITY_OFFICER);
    assert.ok(persona.demographics.budgetAuthorityUsd >= 50000);
    assert.ok(persona.willingnessToPayMonthlyUsd > 0);
    assert.ok(persona.painPoints.length > 0);
    assert.ok(persona.buyingMotivations.length > 0);
  });

  it('should map end-to-end customer journey touchpoints with friction and delight moments', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const discService = new CustomerDiscoveryService(repo);

    const startup = await genService.createStartup({
      name: 'InfraScale AI',
      tagline: 'Autonomous multi-cloud fleet management',
      category: StartupCategory.ENTERPRISE_INFRA,
    });

    const journey = await discService.getUserJourneyMap(startup.id, CustomerPersonaType.STARTUP_CTO);
    assert.ok(journey);
    assert.strictEqual(journey.startupId, startup.id);
    assert.strictEqual(journey.journeyStages.length, 5);
    assert.strictEqual(journey.journeyStages[0].stage, 'DISCOVERY');
    assert.strictEqual(journey.journeyStages[4].stage, 'EXPANSION');
    assert.ok(journey.journeyStages[0].frictionPoint.length > 0);
    assert.ok(journey.journeyStages[0].delightMoment.length > 0);
  });

  it('should aggregate discovery interview telemetry and compute demand projection', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const discService = new CustomerDiscoveryService(repo);

    const startup = await genService.createStartup({
      name: 'DataPulse',
      tagline: 'Autonomous telemetry ETL pipelines',
      category: StartupCategory.DATA_INTELLIGENCE,
    });

    const feedback = await discService.getInterviewFeedbackSynthesis(startup.id);
    assert.ok(feedback);
    assert.strictEqual(feedback.startupId, startup.id);
    assert.ok(feedback.totalInterviewsAnalyzed >= 10);
    assert.ok(feedback.problemResonanceScore >= 70);
    assert.ok(feedback.willingnessToBuyPercent >= 60);
    assert.ok(feedback.demandProjectionScore >= 70);
  });
});
