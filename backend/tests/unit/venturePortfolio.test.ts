import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { VenturePortfolioService, StartupGenerationService } from '../../src/modules/startup-builder';
import { StartupCategory, VentureHealthStatus } from '@codeforge/shared';

describe('Phase 20: Venture Portfolio Management Unit Tests', () => {
  it('should create portfolio and attach multiple venture holdings', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const portfolioService = new VenturePortfolioService(repo);

    const s1 = await genService.createStartup({
      name: 'AlphaVenture',
      tagline: 'Autonomous AI verification',
      category: StartupCategory.AI_DEVTOOLS,
    });
    const s2 = await genService.createStartup({
      name: 'BetaVenture',
      tagline: 'Autonomous AI security',
      category: StartupCategory.CYBERSECURITY_AI,
    });

    const portfolio = await portfolioService.createPortfolio({
      portfolioName: 'Horizon Studio Fund I',
      description: 'Autonomous AI software venture portfolio',
    });

    assert.ok(portfolio);
    assert.strictEqual(portfolio.portfolioName, 'Horizon Studio Fund I');

    const updated = await portfolioService.addStartupToPortfolio(
      portfolio.id,
      s1.id,
      s1.name,
      s1.stage,
      s1.valuationUsd
    );
    await portfolioService.addStartupToPortfolio(
      portfolio.id,
      s2.id,
      s2.name,
      s2.stage,
      s2.valuationUsd
    );

    assert.ok(updated);
    assert.strictEqual(updated.ventures.length, 2);
    assert.strictEqual(updated.totalVentureCount, 2);
    assert.ok(updated.aggregateValuationUsd > 0);
  });

  it('should assess portfolio health, venture health distribution, and capital reallocation', async () => {
    const repo = new StartupBuilderRepository();
    const portfolioService = new VenturePortfolioService(repo);

    const list = await portfolioService.listPortfolios();
    assert.ok(list.length > 0);

    const health = await portfolioService.evaluatePortfolioHealth(list[0].id);
    assert.ok(health);
    assert.strictEqual(health.portfolio.id, list[0].id);
    assert.ok(health.healthDistribution);
    assert.ok(health.capitalReallocationAdvice.length > 0);
  });
});
