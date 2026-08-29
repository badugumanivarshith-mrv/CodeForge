import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import {
  DealSourcingService,
  OpportunityDiscoveryService,
  FounderScoringService,
} from '../../src/modules/venture-capital';
import { DealStage, DealPriority, StartupCategory } from '@codeforge/shared';

describe('Phase 21: Deal Sourcing & Pipeline Unit Tests', () => {
  it('should discover high-conviction startups and filter by fit score', async () => {
    const repo = new VentureCapitalRepository();
    const dealService = new DealSourcingService(repo);

    const deals = await dealService.discoverDeals({ minFitScore: 90.0 });
    assert.ok(Array.isArray(deals));
    assert.ok(deals.length >= 2);
    assert.ok(deals.every((d) => d.fitScore >= 90.0));
  });

  it('should create new deal, advance stage through Kanban pipeline, and record notes', async () => {
    const repo = new VentureCapitalRepository();
    const dealService = new DealSourcingService(repo);

    const created = await dealService.createDeal({
      startupName: 'AxiomQuantum AI',
      tagline: 'Autonomous quantum-resilient cryptographic proofs for smart contracts',
      category: StartupCategory.CYBERSECURITY_AI,
      stage: DealStage.INBOX,
      priority: DealPriority.HIGH,
      targetRaiseUsd: 2500000,
      initialValuationUsd: 12000000,
      fitScore: 94.0,
    });

    assert.ok(created);
    assert.strictEqual(created.startupName, 'AxiomQuantum AI');
    assert.strictEqual(created.stage, DealStage.INBOX);

    const advanced = await dealService.advanceDealStage(
      created.id,
      DealStage.DUE_DILIGENCE,
      'Partner sponsor approved deep technical diligence'
    );

    assert.ok(advanced);
    assert.strictEqual(advanced.stage, DealStage.DUE_DILIGENCE);
    assert.ok(advanced.notes?.includes('Partner sponsor'));
  });

  it('should generate deal pipeline summary with stage breakdown and capital metrics', async () => {
    const repo = new VentureCapitalRepository();
    const dealService = new DealSourcingService(repo);

    await dealService.discoverDeals();
    const summary = await dealService.getDealPipelineSummary();

    assert.ok(summary);
    assert.ok(summary.totalDeals >= 3);
    assert.ok(summary.activePipelineCount >= 1);
    assert.ok(summary.averageFitScore >= 85.0);
    assert.ok(summary.totalTargetCapitalUsd > 0);
  });

  it('should evaluate market opportunity scoring and TAM scalability', async () => {
    const repo = new VentureCapitalRepository();
    const oppService = new OpportunityDiscoveryService(repo);

    const opp = await oppService.evaluateMarketOpportunity('startup-test-1');
    assert.ok(opp);
    assert.strictEqual(opp.startupId, 'startup-test-1');
    assert.ok(opp.compositeScore >= 85.0);
    assert.ok(opp.marketTamScore >= 90.0);
    assert.ok(opp.keyDrivers.length > 0);
    assert.ok(opp.majorRisks.length > 0);
  });

  it('should evaluate founder conviction, technical depth, and execution velocity', async () => {
    const repo = new VentureCapitalRepository();
    const founderService = new FounderScoringService(repo);

    const founder = await founderService.evaluateFounder('startup-test-1', {
      name: 'Dr. Sarah Chen',
      background: 'Ex-DeepMind Principal Researcher',
    });

    assert.ok(founder);
    assert.strictEqual(founder.startupId, 'startup-test-1');
    assert.strictEqual(founder.founderName, 'Dr. Sarah Chen');
    assert.ok(founder.technicalDepthScore >= 90.0);
    assert.ok(founder.convictionScore >= 90.0);
    assert.ok(founder.compositeScore >= 88.0);
    assert.ok(founder.strengths.length > 0);
  });
});
