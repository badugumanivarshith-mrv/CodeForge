import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MarketplaceService } from '../../src/modules/marketplace/marketplaceService';
import {
  MarketplaceCategory,
  PricingModel,
  AgentVerificationStatus,
} from '@codeforge/shared';

describe('Agent Marketplace Engine Unit Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();
    const reviews = new Map<string, any[]>();
    const downloads = new Map<string, any[]>();

    return {
      agents,
      reviews,
      downloads,
      async createMarketplaceAgent(creatorId: string, data: any) {
        const agent = {
          id: `mp-agent-${Date.now()}-${Math.random()}`,
          creatorId,
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          category: data.category,
          pricingModel: data.pricingModel || PricingModel.FREE,
          priceCents: data.priceCents || 0,
          capabilities: data.capabilities || [],
          systemPrompt: data.systemPrompt || '',
          configSchema: data.configSchema || {},
          verificationStatus: data.verificationStatus || AgentVerificationStatus.COMMUNITY,
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
      async listMarketplaceAgents(params?: any) {
        let list = Array.from(agents.values());
        if (params?.category) {
          list = list.filter(a => a.category === params.category);
        }
        if (params?.pricing) {
          list = list.filter(a => a.pricingModel === params.pricing);
        }
        return list;
      },
      async updateMarketplaceAgent(id: string, creatorId: string, data: any) {
        const a = agents.get(id);
        if (!a) return null;
        if (a.creatorId !== creatorId && !creatorId.includes('admin')) return null;
        const updated = { ...a, ...data, updatedAt: new Date().toISOString() };
        agents.set(id, updated);
        return updated;
      },
      async deleteMarketplaceAgent(id: string, creatorId: string) {
        const a = agents.get(id);
        if (!a || a.creatorId !== creatorId) return false;
        agents.delete(id);
        return true;
      },
      async createReview(userId: string, data: any) {
        const review = {
          id: `rev-${Date.now()}`,
          agentId: data.agentId,
          userId,
          rating: data.rating,
          reviewText: data.reviewText,
          isVerifiedBuyer: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const list = reviews.get(data.agentId) || [];
        list.push(review);
        reviews.set(data.agentId, list);

        const agent = agents.get(data.agentId);
        if (agent) {
          const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
          agent.ratingAverage = Math.round(avg * 10) / 10;
          agent.ratingCount = list.length;
        }
        return review;
      },
      async listReviewsByAgentId(agentId: string) {
        return reviews.get(agentId) || [];
      },
      async recordDownload(agentId: string, userId: string, version: string = '1.0.0') {
        const download = {
          id: `dl-${Date.now()}`,
          agentId,
          userId,
          version,
          createdAt: new Date().toISOString(),
        };
        const list = downloads.get(agentId) || [];
        list.push(download);
        downloads.set(agentId, list);

        const agent = agents.get(agentId);
        if (agent) {
          agent.downloadCount += 1;
        }
        return download;
      },
    };
  };

  test('1. initializes starter agent catalog with 6 domain specialized agents', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);
    const catalog = await service.initializeStarterAgents('system-admin');

    assert.strictEqual(catalog.length, 6);
    assert.ok(catalog.some(a => a.category === MarketplaceCategory.CODING));
    assert.ok(catalog.some(a => a.category === MarketplaceCategory.RESEARCH));
    assert.ok(catalog.some(a => a.category === MarketplaceCategory.ENTERPRISE));
  });

  test('2. publishes new custom agent to marketplace with required invariants', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('creator-1', {
      name: 'Raft Consensus Verification Agent',
      description: 'Verifies state machine replication and log compaction edge cases.',
      category: MarketplaceCategory.CODING,
      pricingModel: PricingModel.PAID_ONE_TIME,
      priceCents: 2900,
      capabilities: ['Formal Invariant Check', 'Log Partition Simulation'],
      systemPrompt: 'You are a formal verification engineer verifying Raft invariants.',
    });

    assert.ok(agent.id);
    assert.strictEqual(agent.name, 'Raft Consensus Verification Agent');
    assert.strictEqual(agent.priceCents, 2900);
    assert.strictEqual(agent.pricingModel, PricingModel.PAID_ONE_TIME);
  });

  test('3. filters agents by category correctly', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);
    await service.initializeStarterAgents('system-admin');

    const codingAgents = await service.listAgents({ category: MarketplaceCategory.CODING });
    assert.ok(codingAgents.length >= 1);
    for (const a of codingAgents) {
      assert.strictEqual(a.category, MarketplaceCategory.CODING);
    }
  });

  test('4. downloads agent and increments installation telemetry', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);
    const catalog = await service.initializeStarterAgents('system-admin');
    const targetAgent = catalog[0];

    assert.strictEqual(targetAgent.downloadCount, 0);

    const download = await service.downloadAgent(targetAgent.id, 'user-buyer');
    assert.ok(download.id);
    assert.strictEqual(download.agentId, targetAgent.id);

    const updated = await service.getAgentById(targetAgent.id);
    assert.strictEqual(updated?.downloadCount, 1);
  });

  test('5. submits user review and recalculates average rating', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);
    const catalog = await service.initializeStarterAgents('system-admin');
    const target = catalog[0];

    const review1 = await service.submitReview('user-1', {
      agentId: target.id,
      rating: 4,
      reviewText: 'Excellent at finding concurrency deadlocks in Go channels.',
    });
    assert.strictEqual(review1.rating, 4);

    const review2 = await service.submitReview('user-2', {
      agentId: target.id,
      rating: 5,
      reviewText: 'Saved 10 hours debugging complex raft state machines.',
    });
    assert.strictEqual(review2.rating, 5);

    const reviews = await service.listReviews(target.id);
    assert.strictEqual(reviews.length, 2);

    const updated = await service.getAgentById(target.id);
    assert.strictEqual(updated?.ratingAverage, 4.5);
    assert.strictEqual(updated?.ratingCount, 2);
  });

  test('6. approves agent for enterprise private catalog', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);
    const catalog = await service.initializeStarterAgents('system-admin');

    const approved = await service.approveEnterpriseAgent(catalog[0].id, 'admin-1');
    assert.strictEqual(approved?.isEnterpriseApproved, true);
    assert.strictEqual(approved?.verificationStatus, AgentVerificationStatus.ENTERPRISE_APPROVED);
  });

  test('7. rejects review with invalid rating score outside 1-5', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);
    const catalog = await service.initializeStarterAgents('system-admin');

    await assert.rejects(
      async () => {
        await service.submitReview('user-1', {
          agentId: catalog[0].id,
          rating: 6,
          reviewText: 'Out of bounds rating score',
        });
      },
      /Rating must be between 1 and 5/
    );
  });

  test('8. deletes agent cleanly and prevents unauthorized deletion', async () => {
    const mockRepo = createMockRepo();
    const service = new MarketplaceService(mockRepo as any);

    const agent = await service.publishAgent('creator-auth', {
      name: 'Temporary Agent',
      description: 'Temporary',
      category: MarketplaceCategory.PRODUCTIVITY,
      capabilities: [],
      systemPrompt: 'Prompt',
    });

    const unauthorizedDelete = await service.deleteAgent(agent.id, 'intruder');
    assert.strictEqual(unauthorizedDelete, false);

    const authorizedDelete = await service.deleteAgent(agent.id, 'creator-auth');
    assert.strictEqual(authorizedDelete, true);

    const fetched = await service.getAgentById(agent.id);
    assert.strictEqual(fetched, null);
  });
});
