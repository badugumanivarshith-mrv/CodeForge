import { test, describe } from 'node:test';
import assert from 'node:assert';
import { IntegrationHubService } from '../../src/modules/integrations/integrationHubService';
import {
  IntegrationProvider,
  IntegrationStatus,
} from '@codeforge/shared';

describe('External Integration Hub Unit Tests', () => {
  const createMockRepo = () => {
    const integrations = new Map<string, any>();

    return {
      integrations,
      async connectIntegration(userId: string, data: any) {
        const item = {
          id: `int-${Date.now()}-${Math.random()}`,
          userId,
          provider: data.provider,
          status: IntegrationStatus.CONNECTED,
          config: data.config || {},
          lastSyncedAt: new Date().toISOString(),
          errorLog: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        integrations.set(`${userId}-${data.provider}`, item);
        return item;
      },
      async getIntegration(userId: string, provider: string) {
        return integrations.get(`${userId}-${provider}`) || null;
      },
      async listUserIntegrations(userId: string) {
        return Array.from(integrations.values()).filter(i => i.userId === userId);
      },
      async updateIntegrationStatus(id: string, userId: string, status: string, errorLog?: string) {
        for (const item of integrations.values()) {
          if (item.id === id && item.userId === userId) {
            item.status = status;
            item.errorLog = errorLog || null;
            item.lastSyncedAt = new Date().toISOString();
            return item;
          }
        }
        return null;
      },
      async disconnectIntegration(userId: string, provider: string) {
        const key = `${userId}-${provider}`;
        if (!integrations.has(key)) return false;
        integrations.delete(key);
        return true;
      },
    };
  };

  test('1. returns 10 supported providers in integration catalog', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);
    const catalog = await service.getIntegrationCatalog();

    assert.strictEqual(catalog.length, 10);
    assert.ok(catalog.some(c => c.provider === IntegrationProvider.GITHUB));
    assert.ok(catalog.some(c => c.provider === IntegrationProvider.JIRA));
    assert.ok(catalog.some(c => c.provider === IntegrationProvider.NOTION));
    assert.ok(catalog.some(c => c.provider === IntegrationProvider.SLACK));
    assert.ok(catalog.some(c => c.provider === IntegrationProvider.LINKEDIN));
  });

  test('2. connects GitHub integration and stores configuration', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);

    const int = await service.connect('user-1', {
      provider: IntegrationProvider.GITHUB,
      config: { repos: ['codeforge/core', 'codeforge/docs'] },
    });

    assert.ok(int.id);
    assert.strictEqual(int.provider, IntegrationProvider.GITHUB);
    assert.strictEqual(int.status, IntegrationStatus.CONNECTED);
  });

  test('3. synchronizes GitHub activity and returns item telemetry', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);

    await service.connect('user-sync', {
      provider: IntegrationProvider.GITHUB,
      config: {},
    });

    const syncRes = await service.syncIntegration('user-sync', IntegrationProvider.GITHUB);
    assert.strictEqual(syncRes.provider, IntegrationProvider.GITHUB);
    assert.strictEqual(syncRes.status, IntegrationStatus.CONNECTED);
    assert.ok(syncRes.itemsSynced > 0);
    assert.ok(syncRes.details.includes('pull requests'));
  });

  test('4. synchronizes Jira sprint issues telemetry', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);

    await service.connect('user-jira', {
      provider: IntegrationProvider.JIRA,
      config: { boardId: 'BOARD-101' },
    });

    const syncRes = await service.syncIntegration('user-jira', IntegrationProvider.JIRA);
    assert.strictEqual(syncRes.provider, IntegrationProvider.JIRA);
    assert.ok(syncRes.itemsSynced > 0);
    assert.ok(syncRes.details.includes('sprint issues'));
  });

  test('5. throws error when syncing an unconnected provider', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);

    await assert.rejects(
      async () => {
        await service.syncIntegration('user-empty', IntegrationProvider.DISCORD);
      },
      /is not connected/
    );
  });

  test('6. disconnects integration cleanly', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);

    await service.connect('user-dc', { provider: IntegrationProvider.SLACK });
    const disconnected = await service.disconnect('user-dc', IntegrationProvider.SLACK);
    assert.strictEqual(disconnected, true);

    const int = await service.getIntegration('user-dc', IntegrationProvider.SLACK);
    assert.strictEqual(int, null);
  });

  test('7. isolates connected integrations strictly per user', async () => {
    const mockRepo = createMockRepo();
    const service = new IntegrationHubService(mockRepo as any);

    await service.connect('user-A', { provider: IntegrationProvider.NOTION });
    const userAInts = await service.listIntegrations('user-A');
    const userBInts = await service.listIntegrations('user-B');

    assert.strictEqual(userAInts.length, 1);
    assert.strictEqual(userBInts.length, 0);
  });
});
