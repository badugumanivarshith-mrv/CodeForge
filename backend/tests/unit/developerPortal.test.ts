import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DeveloperPlatformService } from '../../src/modules/developer/developerPlatformService';
import {
  WebhookEvent,
} from '@codeforge/shared';

describe('Developer API Platform & Webhook Subscriptions Unit Tests', () => {
  const createMockRepo = () => {
    const apps = new Map<string, any>();
    const keys = new Map<string, any>();
    const webhooks = new Map<string, any>();
    const deliveries = new Map<string, any[]>();

    return {
      apps,
      keys,
      webhooks,
      deliveries,
      async createDeveloperApp(developerId: string, data: any) {
        const app = {
          id: `app-${Date.now()}-${Math.random()}`,
          developerId,
          name: data.appName,
          description: data.description,
          homepageUrl: data.homepageUrl || null,
          redirectUris: data.redirectUris || [],
          clientId: `cf_client_${Math.random().toString(36).substring(2, 10)}`,
          clientSecretHash: 'mock-secret-hash',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        apps.set(app.id, app);
        return app;
      },
      async listDeveloperApps(developerId: string) {
        return Array.from(apps.values()).filter(a => a.developerId === developerId);
      },
      async createApiKey(userId: string, data: any, keyHash: string, keyPrefix: string) {
        const key = {
          id: `key-${Date.now()}-${Math.random()}`,
          userId,
          name: data.name,
          keyPrefix,
          keyHash,
          permissions: data.permissions || ['*'],
          expiresAt: data.expiresInDays ? new Date(Date.now() + data.expiresInDays * 86400000).toISOString() : null,
          lastUsedAt: null,
          usageCount: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        keys.set(key.id, key);
        return key;
      },
      async listApiKeys(userId: string) {
        return Array.from(keys.values()).filter(k => k.userId === userId && k.isActive);
      },
      async findApiKeyByPrefix(prefix: string) {
        for (const k of keys.values()) {
          if (k.keyPrefix === prefix && k.isActive) return k;
        }
        return null;
      },
      async getApiKeyByHash(keyHash: string) {
        for (const k of keys.values()) {
          if (k.keyHash === keyHash && k.isActive) return k;
        }
        return null;
      },
      async revokeApiKey(id: string, userId: string) {
        const k = keys.get(id);
        if (!k || k.userId !== userId) return false;
        k.isActive = false;
        return true;
      },
      async incrementApiKeyUsage(id: string) {
        const k = keys.get(id);
        if (k) {
          k.usageCount += 1;
          k.lastUsedAt = new Date().toISOString();
        }
      },
      async createWebhook(userId: string, data: any, secretHash: string) {
        const webhook = {
          id: `wh-${Date.now()}-${Math.random()}`,
          userId,
          targetUrl: data.targetUrl,
          secretHash,
          subscribedEvents: data.subscribedEvents || [],
          isActive: true,
          failureCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        webhooks.set(webhook.id, webhook);
        return webhook;
      },
      async listWebhooks(userId: string) {
        return Array.from(webhooks.values()).filter(w => w.userId === userId && w.isActive);
      },
      async deleteWebhook(id: string, userId: string) {
        const w = webhooks.get(id);
        if (!w || w.userId !== userId) return false;
        w.isActive = false;
        return true;
      },
      async recordWebhookDelivery(webhookId: string, event: string, payload: any, statusCode: number, responseBody: string) {
        const del = {
          id: `del-${Date.now()}`,
          webhookId,
          event,
          payload,
          statusCode,
          responseBody,
          durationMs: 45,
          createdAt: new Date().toISOString(),
        };
        const list = deliveries.get(webhookId) || [];
        list.push(del);
        deliveries.set(webhookId, list);
        return del;
      },
    };
  };

  test('1. generates cryptographically random API key with prefix masking and SHA-256 hash', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const apiKey = await service.generateApiKey('dev-user-1', {
      name: 'CI/CD Pipeline Runner Token',
      permissions: ['agents:run', 'workflows:execute'],
      expiresInDays: 30,
    });

    assert.ok(apiKey.id);
    assert.ok(apiKey.rawKey);
    assert.ok(apiKey.rawKey?.startsWith('cf_live_'));
    assert.strictEqual(apiKey.name, 'CI/CD Pipeline Runner Token');
    assert.ok(apiKey.expiresAt);
  });

  test('2. verifies and authenticates raw API key, incrementing usage telemetry', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const generated = await service.generateApiKey('dev-auth', {
      name: 'Auth Verification Test Key',
    });

    const result = await service.authenticateApiKey(generated.rawKey!);
    assert.strictEqual(result.authenticated, true);
    assert.strictEqual(result.apiKey?.userId, 'dev-auth');
    assert.strictEqual(result.apiKey?.usageCount, 1);
  });

  test('3. rejects invalid or malformed API token', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const result = await service.authenticateApiKey('cf_live_invalid_token_123456');
    assert.strictEqual(result.authenticated, false);
  });

  test('4. revokes API key and blocks subsequent authentication attempts', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const generated = await service.generateApiKey('dev-revoke', { name: 'To Be Revoked' });
    const revoked = await service.revokeApiKey(generated.id, 'dev-revoke');
    assert.strictEqual(revoked, true);

    const attempt = await service.authenticateApiKey(generated.rawKey!);
    assert.strictEqual(attempt.authenticated, false);
  });

  test('5. registers event webhook endpoint and verifies subscriptions', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const webhook = await service.registerWebhook('dev-wh', {
      targetUrl: 'https://api.company.com/webhooks/agents',
      subscribedEvents: [WebhookEvent.AGENT_EXECUTED, WebhookEvent.WORKFLOW_TRIGGERED],
    });

    assert.ok(webhook.id);
    assert.strictEqual(webhook.targetUrl, 'https://api.company.com/webhooks/agents');
    assert.strictEqual(webhook.subscribedEvents.length, 2);

    const list = await service.listWebhooks('dev-wh');
    assert.strictEqual(list.length, 1);
  });

  test('6. dispatches mock webhook event and records delivery log', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);

    const delivery = await service.dispatchWebhookEvent('wh-123', WebhookEvent.TASK_COMPLETED, {
      taskId: 'task-999',
      status: 'completed',
      tokensUsed: 450,
    });

    assert.ok(delivery);
    assert.strictEqual(delivery.event, WebhookEvent.TASK_COMPLETED);
    assert.strictEqual(delivery.statusCode, 200);
    assert.strictEqual(delivery.success, true);
  });

  test('7. returns multi-language SDK documentation with code examples', async () => {
    const mockRepo = createMockRepo();
    const service = new DeveloperPlatformService(mockRepo as any);
    const docs = service.getSdkDocumentation();

    assert.strictEqual(docs.length, 3);
    assert.ok(docs.some(d => d.language === 'TypeScript / Node.js'));
    assert.ok(docs.some(d => d.language === 'Python'));
    assert.ok(docs.some(d => d.language === 'cURL / REST'));
  });
});
