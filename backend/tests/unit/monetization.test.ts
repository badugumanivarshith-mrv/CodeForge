import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MonetizationService } from '../../src/modules/monetization/monetizationService';
import {
  TransactionType,
  PricingModel,
} from '@codeforge/shared';

describe('Monetization & Revenue Sharing Engine Unit Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();
    const plugins = new Map<string, any>();
    const transactions = new Map<string, any>();
    const payouts = new Map<string, any>();

    return {
      agents,
      plugins,
      transactions,
      payouts,
      async getMarketplaceAgentById(id: string) {
        return agents.get(id) || null;
      },
      async getPluginById(id: string) {
        return plugins.get(id) || null;
      },
      async createTransaction(userId: string, data: any) {
        const tx = {
          id: `tx-${Date.now()}-${Math.random()}`,
          userId,
          creatorId: data.creatorId || null,
          targetType: data.targetType || 'agent',
          targetId: data.referenceId || data.targetId,
          transactionType: data.transactionType,
          amountCents: data.amountCents,
          feeCents: data.feeCents,
          netCents: data.netCents,
          currency: data.currency || 'USD',
          status: data.status || 'completed',
          createdAt: new Date().toISOString(),
        };
        transactions.set(tx.id, tx);
        return tx;
      },
      async listUserTransactions(userId: string) {
        return Array.from(transactions.values()).filter(t => t.userId === userId);
      },
      async createPayout(creatorId: string, amountCents: number, payoutMethod: string = 'stripe_connect') {
        const payout = {
          id: `payout-${Date.now()}-${Math.random()}`,
          creatorId,
          amountCents,
          currency: 'usd',
          payoutMethod,
          status: 'pending',
          processedAt: null,
          createdAt: new Date().toISOString(),
        };
        payouts.set(payout.id, payout);
        return payout;
      },
      async listCreatorPayouts(creatorId: string) {
        return Array.from(payouts.values()).filter(p => p.creatorId === creatorId);
      },
      async recordDownload() {
        return {};
      },
      async installPlugin() {
        return {};
      },
    };
  };

  test('1. executes agent purchase and computes exact 85/15 creator/platform revenue split', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    mockRepo.agents.set('agent-paid-1', {
      id: 'agent-paid-1',
      creatorId: 'creator-alpha',
      name: 'Algorithm Synthesizer',
      pricingModel: PricingModel.PAID_ONE_TIME,
      priceCents: 10000, // $100.00
    });

    const tx = await service.purchaseAgent('buyer-1', 'agent-paid-1', 10000);
    assert.ok(tx.id);
    assert.strictEqual(tx.amountCents, 10000);
    assert.strictEqual(tx.feeCents, 1500); // 15% ($15.00)
    assert.strictEqual(tx.netCents, 8500); // 85% ($85.00)
  });

  test('2. rejects purchase of free agents with positive payment', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    mockRepo.agents.set('agent-free', {
      id: 'agent-free',
      creatorId: 'creator-free',
      name: 'Free Agent',
      pricingModel: PricingModel.FREE,
      priceCents: 0,
    });

    await assert.rejects(
      async () => {
        await service.purchaseAgent('buyer-1', 'agent-free', 2000);
      },
      /Agent is free and does not require purchase/
    );
  });

  test('3. prevents self-purchase of own published agents', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    mockRepo.agents.set('agent-self', {
      id: 'agent-self',
      creatorId: 'creator-self',
      pricingModel: PricingModel.PAID_ONE_TIME,
      priceCents: 5000,
    });

    await assert.rejects(
      async () => {
        await service.purchaseAgent('creator-self', 'agent-self', 5000);
      },
      /Cannot purchase your own item/
    );
  });

  test('4. initiates creator payout when threshold ($50.00 / 5000 cents) is satisfied', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    const payout = await service.requestPayout('creator-earnings', 6500, 'stripe_connect');
    assert.ok(payout.id);
    assert.strictEqual(payout.amountCents, 6500);
    assert.strictEqual(payout.status, 'pending');
    assert.strictEqual(payout.payoutMethod, 'stripe_connect');
  });

  test('5. rejects creator payout below the $50.00 minimum threshold', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    await assert.rejects(
      async () => {
        await service.requestPayout('creator-low', 4900); // $49.00
      },
      /Minimum payout threshold is \$50\.00/
    );
  });

  test('6. purchases premium plugin with 85/15 revenue split calculation', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    mockRepo.plugins.set('plugin-paid-1', {
      id: 'plugin-paid-1',
      creatorId: 'creator-plugin',
      name: 'Enterprise Security Plugin',
    });

    const tx = await service.purchasePlugin('corp-buyer', 'plugin-paid-1', 20000); // $200.00
    assert.strictEqual(tx.amountCents, 20000);
    assert.strictEqual(tx.feeCents, 3000); // $30.00
    assert.strictEqual(tx.netCents, 17000); // $170.00
  });

  test('7. lists user purchase history and creator payout requests', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    mockRepo.agents.set('agent-history', {
      id: 'agent-history',
      creatorId: 'creator-h',
      pricingModel: PricingModel.PAID_ONE_TIME,
      priceCents: 3000,
    });

    await service.purchaseAgent('buyer-history', 'agent-history', 3000);
    const purchases = await service.getUserPurchaseHistory('buyer-history');
    assert.strictEqual(purchases.length, 1);

    await service.requestPayout('creator-h', 5000);
    const payouts = await service.getCreatorPayoutHistory('creator-h');
    assert.strictEqual(payouts.length, 1);
  });
});
