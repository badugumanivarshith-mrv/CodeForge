import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ResearchNetworkService } from '../../src/modules/global-network/researchNetworkService';
import { PublicationStatus } from '@codeforge/shared';

describe('Phase 16: Global Research Network Unit Tests', () => {
  const createMockRepo = () => {
    const publications = new Map<string, any>();
    const citations = new Map<string, any[]>();

    return {
      publications,
      citations,
      async createPublication(authorUserId: string, data: any) {
        const pub = {
          id: `pub-${Date.now()}`,
          authorUserId,
          title: data.title || 'Untitled',
          abstract: data.abstract || '',
          domain: data.domain || 'General AI',
          status: data.status || PublicationStatus.PUBLISHED,
          peerReviewScore: data.peerReviewScore || 90.0,
          citationsCount: data.citationsCount || 0,
          downloadCount: data.downloadCount || 0,
          datasetUrls: data.datasetUrls || [],
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        publications.set(pub.id, pub);
        return pub;
      },
      async getPublicationById(id: string) {
        return publications.get(id) || null;
      },
      async listPublications(domain?: string, status?: PublicationStatus) {
        let list = Array.from(publications.values());
        if (domain) list = list.filter(p => p.domain === domain);
        if (status) list = list.filter(p => p.status === status);
        return list;
      },
      async recordCitation(sourceId: string, targetId: string, snippet: string, weight: number = 1.0) {
        const cit = {
          id: `cit-${Date.now()}`,
          sourcePublicationId: sourceId,
          targetPublicationId: targetId,
          contextSnippet: snippet,
          citationWeight: weight,
          weight,
          createdAt: new Date().toISOString(),
        };
        const list = citations.get(targetId) || [];
        list.push(cit);
        citations.set(targetId, list);

        const targetPub = publications.get(targetId);
        if (targetPub) targetPub.citationsCount += 1;

        return cit;
      },
      async createCitation(sourceId: string, targetId: string, snippet: string = '', weight: number = 1.0) {
        return this.recordCitation(sourceId, targetId, snippet, weight);
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should publish a scientific paper to the global research network', async () => {
    const repo = createMockRepo();
    const service = new ResearchNetworkService(repo);

    const pub = await service.publishPaper('researcher-1', {
      title: 'Decentralized Epistemic Networks in Multi-Agent Reasoning',
      abstract: 'We formalize convergence bounds for belief state propagation across decentralized autonomous graphs.',
      domain: 'Multi-Agent Systems',
      peerReviewScore: 96.2,
    });

    assert.strictEqual(pub.title, 'Decentralized Epistemic Networks in Multi-Agent Reasoning');
    assert.strictEqual(pub.domain, 'Multi-Agent Systems');
    assert.strictEqual(pub.peerReviewScore, 96.2);
  });

  test('should record citations and calculate citation momentum', async () => {
    const repo = createMockRepo();
    const service = new ResearchNetworkService(repo);

    const p1 = await service.publishPaper('author-1', {
      title: 'Foundational Model Reasoning Boundaries',
    });
    const p2 = await service.publishPaper('author-2', {
      title: 'Extensions to Foundational Model Boundaries',
    });

    const cit = await service.citePaper(p2.id, p1.id, 'As proven by author-1...', 1.0);
    assert.strictEqual(cit.sourcePublicationId, p2.id);
    assert.strictEqual(cit.targetPublicationId, p1.id);

    const updatedP1 = await service.getPaper(p1.id);
    assert.strictEqual(updatedP1.citationsCount, 1);
  });

  test('should discover emerging research trends with citation velocity', async () => {
    const repo = createMockRepo();
    const service = new ResearchNetworkService(repo);

    const trends = await service.getEmergingResearchTrends();
    assert.ok(Array.isArray(trends));
    assert.ok(trends.length >= 3);
    assert.ok(trends[0].citationVelocity > 0);
  });
});
