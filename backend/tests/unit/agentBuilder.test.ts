import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MarketplaceService } from '../../src/modules/marketplace/marketplaceService';
import {
  MarketplaceCategory,
  PricingModel,
  AgentVerificationStatus,
} from '@codeforge/shared';

describe('AI Agent Builder Studio Unit Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();

    return {
      agents,
      async createMarketplaceAgent(creatorId: string, data: any) {
        const agent = {
          id: `agent-built-${Date.now()}-${Math.random()}`,
          creatorId,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          category: data.category,
          pricingModel: data.pricingModel || PricingModel.FREE,
          priceCents: data.priceCents || 0,
          capabilities: data.capabilities || [],
          systemPrompt: data.systemPrompt || '',
          configSchema: data.configSchema || {},
          verificationStatus: AgentVerificationStatus.COMMUNITY,
          downloadCount: 0,
          ratingAverage: 5.0,
          ratingCount: 0,
          isFeatured: false,
          isEnterpriseApproved: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        agents.set(agent.id, agent);
        return agent;
      },
      async getMarketplaceAgentById(id: string) {
        return agents.get(id) || null;
      },
      async updateMarketplaceAgent(id: string, creatorId: string, data: any) {
        const a = agents.get(id);
        if (!a || a.creatorId !== creatorId) return null;
        const updated = { ...a, ...data, updatedAt: new Date().toISOString() };
        agents.set(id, updated);
        return updated;
      },
    };
  };

  test('1. builds custom agent with system prompt and capability bindings', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('builder-user-1', {
      name: 'Compiler Optimization & AST Transformer Agent',
      description: 'Performs dead code elimination, loop unrolling, and constant propagation.',
      category: MarketplaceCategory.CODING,
      capabilities: ['AST Tree Rewriting', 'SSA Form Generation', 'Constant Folding'],
      systemPrompt: 'You are an LLVM-grade compiler optimization engineer.',
      pricingModel: PricingModel.FREE,
    });

    assert.ok(agent.id);
    assert.strictEqual(agent.capabilities.length, 3);
    assert.strictEqual(agent.systemPrompt, 'You are an LLVM-grade compiler optimization engineer.');
  });

  test('2. rejects builder submission missing agent name or description', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    await assert.rejects(
      async () => {
        await service.publishAgent('user-1', {
          name: '',
          description: 'Desc',
          category: MarketplaceCategory.CODING,
          capabilities: [],
          systemPrompt: 'System',
        });
      },
      /Agent name and description are required/
    );
  });

  test('3. rejects builder submission missing system prompt directive', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    await assert.rejects(
      async () => {
        await service.publishAgent('user-1', {
          name: 'Agent Name',
          description: 'Desc',
          category: MarketplaceCategory.CODING,
          capabilities: [],
          systemPrompt: '',
        });
      },
      /System prompt is required/
    );
  });

  test('4. enforces pricing model validation in agent builder', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    await assert.rejects(
      async () => {
        await service.publishAgent('user-1', {
          name: 'Paid Agent Without Price',
          description: 'Desc',
          category: MarketplaceCategory.CODING,
          capabilities: [],
          systemPrompt: 'Prompt',
          pricingModel: PricingModel.PAID_ONE_TIME,
          priceCents: 0,
        });
      },
      /Paid agents must have a price greater than 0/
    );
  });

  test('5. updates agent prompt and config schema iteratively in studio', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('builder-dev', {
      name: 'Evolving Agent',
      description: 'Initial iteration',
      category: MarketplaceCategory.ANALYTICS,
      capabilities: ['Initial Capability'],
      systemPrompt: 'Version 1 directive',
    });

    const updated = await service.updateAgent(agent.id, 'builder-dev', {
      description: 'Second enhanced iteration',
      systemPrompt: 'Version 2 directive with strict reasoning constraints.',
      capabilities: ['Initial Capability', 'Vector Index Analysis'],
    });

    assert.strictEqual(updated?.systemPrompt, 'Version 2 directive with strict reasoning constraints.');
    assert.strictEqual(updated?.capabilities.length, 2);
  });

  test('6. assigns enterprise configuration schema with custom parameters', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const schema = {
      type: 'object',
      properties: {
        maxMemoryMb: { type: 'number', default: 512 },
        enableSandboxing: { type: 'boolean', default: true },
      },
    };

    const agent = await service.publishAgent('enterprise-builder', {
      name: 'Sandbox Constrained Agent',
      description: 'Operates within 512MB RAM memory limit',
      category: MarketplaceCategory.SECURITY,
      capabilities: ['Memory Boundary Check'],
      systemPrompt: 'Secure executor',
      configSchema: schema,
    });

    assert.deepStrictEqual(agent.configSchema, schema);
  });

  test('7. prevents unauthorized builder updates from other tenants', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('legitimate-owner', {
      name: 'Owner Agent',
      description: 'Protected',
      category: MarketplaceCategory.CODING,
      capabilities: [],
      systemPrompt: 'Prompt',
    });

    const maliciousUpdate = await service.updateAgent(agent.id, 'attacker-user', {
      name: 'Hacked Agent Name',
    });

    assert.strictEqual(maliciousUpdate, null);
  });
});
