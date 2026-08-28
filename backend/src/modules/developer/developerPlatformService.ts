import crypto from 'crypto';
import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import {
  DeveloperAppDto,
  CreateDeveloperAppDto,
  ApiKeyDto,
  CreateApiKeyDto,
  WebhookDto,
  CreateWebhookDto,
  WebhookDeliveryDto,
  WebhookEvent,
} from '@codeforge/shared';

export class DeveloperPlatformService {
  constructor(private repo: IEcosystemRepository) {}

  // 1. Developer Apps
  async createApp(userId: string, data: CreateDeveloperAppDto): Promise<DeveloperAppDto> {
    if (!data.appName || data.appName.trim().length === 0) {
      throw new Error('Application name is required');
    }
    return this.repo.createDeveloperApp(userId, data);
  }

  async getApp(id: string, userId: string): Promise<DeveloperAppDto | null> {
    return this.repo.getDeveloperAppById(id, userId);
  }

  async listApps(userId: string): Promise<DeveloperAppDto[]> {
    return this.repo.listDeveloperApps(userId);
  }

  async deleteApp(id: string, userId: string): Promise<boolean> {
    return this.repo.deleteDeveloperApp(id, userId);
  }

  // 2. API Keys
  async generateApiKey(userId: string, data: CreateApiKeyDto): Promise<ApiKeyDto> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('API key name is required');
    }

    // Generate random secure token
    const randomBytes = crypto.randomBytes(24).toString('hex');
    const rawKey = `cf_live_${randomBytes}`;
    const keyPrefix = rawKey.substring(0, 12);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const created = await this.repo.createApiKey(userId, data, keyHash, keyPrefix);

    return {
      ...created,
      rawKey, // Only returned once upon creation
    };
  }

  async listApiKeys(userId: string): Promise<ApiKeyDto[]> {
    return this.repo.listApiKeys(userId);
  }

  async revokeApiKey(id: string, userId: string): Promise<boolean> {
    return this.repo.revokeApiKey(id, userId);
  }

  async authenticateApiKey(rawKey: string): Promise<{
    authenticated: boolean;
    apiKey?: ApiKeyDto;
    error?: string;
  }> {
    if (!rawKey || !rawKey.startsWith('cf_')) {
      return { authenticated: false, error: 'Invalid API key format' };
    }

    const keyPrefix = rawKey.substring(0, 12);
    const candidate = await this.repo.findApiKeyByPrefix(keyPrefix);
    if (!candidate || !candidate.isActive) {
      return { authenticated: false, error: 'API key not found or revoked' };
    }

    if (candidate.expiresAt && new Date(candidate.expiresAt) < new Date()) {
      return { authenticated: false, error: 'API key has expired' };
    }

    await this.repo.incrementApiKeyUsage(candidate.id);
    return { authenticated: true, apiKey: candidate };
  }

  // 3. Webhooks
  async registerWebhook(userId: string, data: CreateWebhookDto): Promise<WebhookDto> {
    if (!data.targetUrl || !data.targetUrl.startsWith('http')) {
      throw new Error('Valid HTTPS target URL is required');
    }
    if (!data.subscribedEvents || data.subscribedEvents.length === 0) {
      throw new Error('At least one subscribed event is required');
    }

    const secret = `whsec_${crypto.randomBytes(20).toString('hex')}`;
    const secretHash = crypto.createHash('sha256').update(secret).digest('hex');

    const created = await this.repo.createWebhook(userId, data, secretHash);

    return {
      ...created,
      secret, // Only returned on creation
    };
  }

  async listWebhooks(userId: string): Promise<WebhookDto[]> {
    return this.repo.listWebhooks(userId);
  }

  async deleteWebhook(id: string, userId: string): Promise<boolean> {
    return this.repo.deleteWebhook(id, userId);
  }

  async dispatchWebhookEvent(
    webhookId: string,
    event: WebhookEvent,
    payload: Record<string, unknown>
  ): Promise<WebhookDeliveryDto> {
    const signature = crypto
      .createHmac('sha256', 'codeforge-webhook-signing-key')
      .update(JSON.stringify(payload))
      .digest('hex');

    return {
      webhookId,
      event,
      payload: {
        ...payload,
        _signature: `t=${Date.now()},v1=${signature}`,
      },
      statusCode: 200,
      deliveredAt: new Date().toISOString(),
      success: true,
    };
  }

  getSdkDocumentation(): {
    language: string;
    packageManager: string;
    installSnippet: string;
    codeExample: string;
  }[] {
    return [
      {
        language: 'TypeScript / Node.js',
        packageManager: 'npm install @codeforge/sdk',
        installSnippet: 'npm install @codeforge/sdk',
        codeExample: `import { CodeForgeClient } from '@codeforge/sdk';

const client = new CodeForgeClient({
  apiKey: process.env.CODEFORGE_API_KEY,
});

// Run autonomous agent task
const result = await client.agents.executeTask({
  agentType: 'CODING_AGENT',
  task: 'Audit Raft log compaction edge cases',
});
console.log('Task Completed:', result.output);`,
      },
      {
        language: 'Python',
        packageManager: 'pip install codeforge-sdk',
        installSnippet: 'pip install codeforge-sdk',
        codeExample: `from codeforge import CodeForgeClient

client = CodeForgeClient(api_key="cf_live_...")

# Run deep research report
report = client.research.generate_report(
    topic="Lock-free memory reclamation in Rust",
    category="system_architecture"
)
print("Research Summary:", report["executive_summary"])`,
      },
      {
        language: 'cURL / REST',
        packageManager: 'cURL',
        installSnippet: 'curl --version',
        codeExample: `curl -X POST https://api.codeforge.dev/v1/ecosystem/agents/run \\
  -H "Authorization: Bearer cf_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentType": "CAREER_AGENT",
    "goal": "Model L6 promotion velocity"
  }'`,
      },
    ];
  }
}
