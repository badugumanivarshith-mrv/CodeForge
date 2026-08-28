import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchCivilizationService } from '../../src/modules/planetary-network/researchCivilizationService';

function createMockResearchRepo() {
  const federations: Map<string, any> = new Map();
  const collaborations: any[] = [];

  return {
    async listResearchFederations() {
      return Array.from(federations.values());
    },
    async createResearchFederation(data: any) {
      const item = { ...data, id: `fed-${Date.now()}` };
      federations.set(item.id, item);
      return item;
    },
    async getResearchFederation(id: string) {
      return federations.get(id) || null;
    },
    async createResearchCollaboration(collab: any) {
      const item = { ...collab, id: `collab-${Date.now()}` };
      collaborations.unshift(item);
      const fed = federations.get(item.federationId);
      if (fed) fed.activeCollaborationsCount += 1;
      return item;
    },
    async listCollaborationsByFederation(federationId: string) {
      return collaborations.filter((c) => c.federationId === federationId);
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: AI Research Civilization Unit Tests', () => {
  it('should establish an academic research federation', async () => {
    const repo = createMockResearchRepo();
    const service = new ResearchCivilizationService(repo);

    const fed = await service.createFederation({
      federationName: 'Autonomous Formal Logic Mesh',
      leadInstitutionId: 'inst-princeton',
      memberInstitutionIds: ['inst-inria', 'inst-cambridge'],
      focusArea: 'Interactive Theorem Proving with LLM Speculative Trees',
    });

    assert.ok(fed);
    assert.strictEqual(fed.federationName, 'Autonomous Formal Logic Mesh');
    assert.strictEqual(fed.leadInstitutionId, 'inst-princeton');
  });

  it('should launch verified research collaboration with validation proof', async () => {
    const repo = createMockResearchRepo();
    const service = new ResearchCivilizationService(repo);

    const fed = await service.createFederation({
      federationName: 'Quantum ML Research Federation',
      leadInstitutionId: 'inst-caltech',
    });

    const collab = await service.launchCollaboration({
      federationId: fed.id,
      title: 'Polynomial Speedup in Multi-Agent Consensus Verification',
      principalInvestigator: 'Dr. Claude Shannon',
      impactScore: 98.2,
      validationProof: 'zk-proof-hash-0x981273918237198',
    });

    assert.ok(collab);
    assert.strictEqual(collab.federationId, fed.id);
    assert.strictEqual(collab.principalInvestigator, 'Dr. Claude Shannon');
    assert.strictEqual(collab.impactScore, 98.2);

    const collabs = await service.listCollaborations(fed.id);
    assert.strictEqual(collabs.length, 1);
  });

  it('should reject collaboration launch under non-existent federation', async () => {
    const repo = createMockResearchRepo();
    const service = new ResearchCivilizationService(repo);

    await assert.rejects(
      async () => {
        await service.launchCollaboration({
          federationId: 'non-existent-fed-id',
          title: 'Orphan Collaboration',
          principalInvestigator: 'Dr. Unknown',
        });
      },
      /Research federation not found/
    );
  });
});
