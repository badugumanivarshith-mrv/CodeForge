import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MarketplaceService } from '../../src/modules/marketplace/marketplaceService';
import { PluginEngineService } from '../../src/modules/plugins/pluginEngineService';
import { DeveloperPlatformService } from '../../src/modules/developer/developerPlatformService';
import { MonetizationService } from '../../src/modules/monetization/monetizationService';
import {
  PluginPermission,
  PricingModel,
  MarketplaceCategory,
} from '@codeforge/shared';

describe('Ecosystem Security, Sandboxing & Permission Enforcement Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();
    const plugins = new Map<string, any>();
    const keys = new Map<string, any>();
    const transactions = new Map<string, any>();

    return {
      agents,
      plugins,
      keys,
      transactions,
      async createMarketplaceAgent(creatorId: string, data: any) {
        const a = { id: `sec-a-${Date.now()}`, creatorId, ...data };
        agents.set(a.id, a);
        return a;
      },
      async getMarketplaceAgentById(id: string) {
        return agents.get(id) || null;
      },
      async updateMarketplaceAgent(id: string, creatorId: string, data: any) {
        const a = agents.get(id);
        if (!a || a.creatorId !== creatorId) return null;
        const u = { ...a, ...data };
        agents.set(id, u);
        return u;
      },
      async deleteMarketplaceAgent(id: string, creatorId: string) {
        const a = agents.get(id);
        if (!a || a.creatorId !== creatorId) return false;
        agents.delete(id);
        return true;
      },
      async createApiKey(userId: string, data: any, keyHash: string, keyPrefix: string) {
        const k = { id: `key-${Date.now()}`, userId, name: data.name, keyPrefix, keyHash, permissions: data.permissions || ['*'], isActive: true, usageCount: 0 };
        keys.set(k.id, k);
        return k;
      },
      async findApiKeyByPrefix(prefix: string) {
        for (const k of keys.values()) {
          if (k.keyPrefix === prefix && k.isActive) return k;
        }
        return null;
      },
      async getApiKeyByHash(hash: string) {
        for (const k of keys.values()) {
          if (k.keyHash === hash && k.isActive) return k;
        }
        return null;
      },
      async incrementApiKeyUsage(id: string) {
        const k = keys.get(id);
        if (k) k.usageCount += 1;
      },
      async revokeApiKey(id: string, userId: string) {
        const k = keys.get(id);
        if (!k || k.userId !== userId) return false;
        k.isActive = false;
        return true;
      },
      async createTransaction(userId: string, data: any) {
        const tx = { id: `tx-${Date.now()}`, userId, ...data };
        transactions.set(tx.id, tx);
        return tx;
      },
      async createPayout(creatorId: string, data: any) {
        return { id: `p-${Date.now()}`, creatorId, ...data, status: 'pending' };
      },
    };
  };

  test('1. enforces sandboxing audit and flags dangerous EXECUTE_CODE permission', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);

    const audit = await service.auditPluginPermissions('plugin-code-exec', [
      PluginPermission.READ_WORKSPACE,
      PluginPermission.EXECUTE_CODE,
    ]);

    assert.strictEqual(audit.isSafe, false);
    assert.ok(audit.highRiskPermissions.includes(PluginPermission.EXECUTE_CODE));
    assert.ok(audit.reason.includes('privileged sandbox access'));
  });

  test('2. flags high-risk DATABASE_ACCESS and ACCESS_MEMORY permissions', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);

    const audit = await service.auditPluginPermissions('plugin-db-access', [
      PluginPermission.DATABASE_ACCESS,
      PluginPermission.ACCESS_MEMORY,
    ]);

    assert.strictEqual(audit.isSafe, false);
    assert.strictEqual(audit.highRiskPermissions.length, 2);
  });

  test('3. prevents unauthorized agent deletion by unprivileged tenant', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('creator-owner', {
      name: 'Confidential Proprietary Agent',
      description: 'Internal LLM weights',
      category: MarketplaceCategory.ENTERPRISE,
      capabilities: [],
      systemPrompt: 'Internal directive',
    });

    const maliciousAttempt = await service.deleteAgent(agent.id, 'attacker-tenant');
    assert.strictEqual(maliciousAttempt, false);

    const check = await service.getAgentById(agent.id);
    assert.ok(check);
  });

  test('4. prevents unauthorized agent modification across tenants', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('creator-legit', {
      name: 'Legit Agent',
      description: 'Original description',
      category: MarketplaceCategory.CODING,
      capabilities: [],
      systemPrompt: 'Safe system prompt',
    });

    const maliciousUpdate = await service.updateAgent(agent.id, 'attacker-tenant', {
      systemPrompt: 'Malicious injected system prompt payload',
    });
    assert.strictEqual(maliciousUpdate, null);

    const check = await service.getAgentById(agent.id);
    assert.strictEqual(check?.systemPrompt, 'Safe system prompt');
  });

  test('5. prevents unauthorized API key revocation by malicious user', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const key = await service.generateApiKey('authorized-user', { name: 'Prod Key' });
    const maliciousRevoke = await service.revokeApiKey(key.id, 'attacker-user');
    assert.strictEqual(maliciousRevoke, false);

    const auth = await service.authenticateApiKey(key.rawKey!);
    assert.ok(auth);
  });

  test('6. prevents zero and negative payout amounts', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    await assert.rejects(
      async () => {
        await service.requestPayout('creator-1', 0);
      },
      /Minimum payout threshold is \$50\.00/
    );

    await assert.rejects(
      async () => {
        await service.requestPayout('creator-1', -5000);
      },
      /Minimum payout threshold is \$50\.00/
    );
  });

  test('7. rejects negative or zero purchase amounts on paid agents', async () => {
    const mockRepo = createMockRepo();
    const service = new MonetizationService(mockRepo as any);

    mockRepo.agents.set('paid-agent-x', {
      id: 'paid-agent-x',
      creatorId: 'creator-x',
      pricingModel: PricingModel.PAID_ONE_TIME,
      priceCents: 5000,
    });

    await assert.rejects(
      async () => {
        await service.purchaseAgent('buyer-1', 'paid-agent-x', -1000);
      },
      /Purchase amount must be positive/
    );
  });
});
