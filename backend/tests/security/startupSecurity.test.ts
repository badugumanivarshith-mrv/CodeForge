import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import {
  StartupGenerationService,
  StartupLifecycleService,
  FundraisingService,
} from '../../src/modules/startup-builder';
import { StartupCategory, StartupStage, StartupFundingStage } from '@codeforge/shared';

describe('Phase 20: Startup Builder Security & Governance Tests', () => {
  it('should enforce startup entity isolation and prevent cross-venture data leakage', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);

    const s1 = await genService.createStartup({
      name: 'Venture Alpha',
      category: StartupCategory.AI_DEVTOOLS,
    });
    const s2 = await genService.createStartup({
      name: 'Venture Beta',
      category: StartupCategory.CYBERSECURITY_AI,
    });

    const s1Record = await repo.getStartupById(s1.id);
    const s2Record = await repo.getStartupById(s2.id);

    assert.ok(s1Record);
    assert.ok(s2Record);
    assert.notStrictEqual(s1Record.id, s2Record.id);
    assert.notStrictEqual(s1Record.name, s2Record.name);
    assert.strictEqual(s1Record.category, StartupCategory.AI_DEVTOOLS);
    assert.strictEqual(s2Record.category, StartupCategory.CYBERSECURITY_AI);
  });

  it('should log immutable audit events on state and valuation transitions', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const lifeService = new StartupLifecycleService(repo);

    const startup = await genService.createStartup({
      name: 'AuditVenture AI',
      category: StartupCategory.AUTONOMOUS_AGENTS,
    });

    await lifeService.advanceStartupStage(startup.id, StartupStage.PROTOTYPE, 'Validated MVP Prototype');
    await lifeService.recordVenturePivot(
      startup.id,
      'Pivoted GTM model from B2C to Enterprise PLG',
      'Increased market size by 4x'
    );

    const events = await lifeService.getStartupEvents(startup.id);
    assert.ok(events.length >= 3); // CREATED, STAGE_TRANSITION, PIVOT
    assert.ok(events.every((e) => e.startupId === startup.id));
    assert.ok(events.some((e) => e.eventType === 'PIVOT'));
    assert.ok(events.some((e) => e.eventType === 'STAGE_TRANSITION'));
  });

  it('should enforce strict cap table mathematics ensuring 100% equity conservation', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const fundService = new FundraisingService(repo);

    const startup = await genService.createStartup({
      name: 'MathVenture AI',
      category: StartupCategory.ENTERPRISE_INFRA,
    });

    const sim = await fundService.simulateFundingRound({
      startupId: startup.id,
      stage: StartupFundingStage.SERIES_A,
      targetRaiseUsd: 10000000,
      preMoneyValuationUsd: 40000000,
    });

    const totalEquity = sim.capTableSummary.reduce((sum, item) => sum + item.ownershipPercent, 0);
    assert.strictEqual(Math.round(totalEquity), 100);
    assert.strictEqual(sim.investorEquityPercent, 20.0);
  });
});
