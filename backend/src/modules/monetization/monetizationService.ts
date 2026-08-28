import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import {
  SubscriptionDto,
  CreateSubscriptionDto,
  TransactionDto,
  CreatorPayoutDto,
  TransactionType,
  PricingModel,
} from '@codeforge/shared';

export class MonetizationService {
  constructor(private repo: IEcosystemRepository) {}

  // 1. Subscriptions
  async subscribe(userId: string, data: CreateSubscriptionDto): Promise<SubscriptionDto> {
    if (!data.itemType || !data.itemId) {
      throw new Error('Item type and Item ID are required for subscription');
    }

    const sub = await this.repo.createSubscription(userId, data);

    // Record subscription transaction
    await this.repo.createTransaction(userId, {
      transactionType: TransactionType.SUBSCRIPTION_RENEWAL,
      referenceId: sub.id,
      amountCents: sub.amountCents,
      feeCents: Math.round(sub.amountCents * 0.15),
      netCents: sub.amountCents - Math.round(sub.amountCents * 0.15),
      currency: 'USD',
      status: 'succeeded',
      paymentMethod: 'card_autopay',
    });

    return sub;
  }

  async getSubscription(userId: string, itemType: string, itemId: string): Promise<SubscriptionDto | null> {
    return this.repo.getSubscription(userId, itemType, itemId);
  }

  async listSubscriptions(userId: string): Promise<SubscriptionDto[]> {
    return this.repo.listUserSubscriptions(userId);
  }

  async cancelSubscription(id: string, userId: string): Promise<SubscriptionDto | null> {
    return this.repo.cancelSubscription(id, userId);
  }

  // 2. Purchases & Transactions
  async purchaseAgent(userId: string, agentId: string, amountCents: number): Promise<TransactionDto> {
    if (amountCents <= 0) {
      throw new Error('Purchase amount must be positive');
    }

    const agent = await this.repo.getMarketplaceAgentById(agentId);
    if (agent) {
      if (agent.pricingModel === PricingModel.FREE) {
        throw new Error('Agent is free and does not require purchase');
      }
      if (agent.creatorId === userId) {
        throw new Error('Cannot purchase your own item');
      }
    }

    const feeCents = Math.round(amountCents * 0.15); // 15% platform take-rate
    const netCents = amountCents - feeCents; // 85% to creator

    const tx = await this.repo.createTransaction(userId, {
      transactionType: TransactionType.AGENT_PURCHASE,
      referenceId: agentId,
      amountCents,
      feeCents,
      netCents,
      currency: 'USD',
      status: 'succeeded',
      paymentMethod: 'stripe_checkout',
    });

    // Record download for buyer
    await this.repo.recordDownload(agentId, userId);

    return tx;
  }

  async purchasePlugin(userId: string, pluginId: string, amountCents: number): Promise<TransactionDto> {
    if (amountCents <= 0) {
      throw new Error('Purchase amount must be positive');
    }

    const plugin = await this.repo.getPluginById(pluginId);
    if (plugin && plugin.creatorId === userId) {
      throw new Error('Cannot purchase your own item');
    }

    const feeCents = Math.round(amountCents * 0.15);
    const netCents = amountCents - feeCents;

    const tx = await this.repo.createTransaction(userId, {
      transactionType: TransactionType.PLUGIN_PURCHASE,
      referenceId: pluginId,
      amountCents,
      feeCents,
      netCents,
      currency: 'USD',
      status: 'succeeded',
      paymentMethod: 'stripe_checkout',
    });

    // Install plugin
    await this.repo.installPlugin(userId, { pluginId });

    return tx;
  }

  async listUserTransactions(userId: string): Promise<TransactionDto[]> {
    return this.repo.listUserTransactions(userId);
  }

  async getUserPurchaseHistory(userId: string): Promise<TransactionDto[]> {
    return this.listUserTransactions(userId);
  }

  // 3. Creator Payouts
  async requestPayout(creatorId: string, amountCents: number, payoutMethod: string = 'stripe_connect'): Promise<CreatorPayoutDto> {
    if (amountCents < 5000) {
      throw new Error('Minimum payout threshold is $50.00 (5,000 cents)');
    }
    return this.repo.createPayout(creatorId, amountCents, payoutMethod);
  }

  async listPayouts(creatorId: string): Promise<CreatorPayoutDto[]> {
    return this.repo.listCreatorPayouts(creatorId);
  }

  async getCreatorPayoutHistory(creatorId: string): Promise<CreatorPayoutDto[]> {
    return this.listPayouts(creatorId);
  }
}
