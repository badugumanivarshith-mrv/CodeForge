import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InnovationNetworkService } from '../../src/modules/planetary-network/innovationNetworkService';
import { InnovationDomain } from '@codeforge/shared';

function createMockInnovationRepo() {
  const records: Map<string, any> = new Map();
  const rankings: any[] = [];

  return {
    async createInnovationRecord(data: any) {
      const item = { ...data, id: `inv-${Date.now()}` };
      records.set(item.id, item);
      return item;
    },
    async getInnovationRecord(id: string) {
      return records.get(id) || null;
    },
    async listInnovationRecords(domain?: InnovationDomain) {
      let list = Array.from(records.values());
      if (domain) list = list.filter((r) => r.domain === domain);
      return list;
    },
    async recordInnovationRanking(ranking: any) {
      rankings.unshift(ranking);
      return ranking;
    },
    async recordPlanetaryEvent() {
      return { id: 'evt-1' };
    },
  } as any;
}

describe('Phase 17: Global Innovation Network Unit Tests', () => {
  it('should register breakthrough innovation record', async () => {
    const repo = createMockInnovationRepo();
    const service = new InnovationNetworkService(repo);

    const record = await service.recordInnovation({
      title: 'Post-Quantum Speculative Byzantine Fault Tolerance',
      domain: InnovationDomain.QUANTUM_COMPUTE,
      inventorOrganizationId: 'org-cern-quantum',
      commercialReadinessScore: 89.0,
      adoptionForecastPercent: 78.0,
      technologyMaturityLevel: 8,
    });

    assert.ok(record);
    assert.strictEqual(record.domain, InnovationDomain.QUANTUM_COMPUTE);
    assert.strictEqual(record.technologyMaturityLevel, 8);

    const fetched = await service.getInnovation(record.id);
    assert.ok(fetched);
    assert.strictEqual(fetched.title, 'Post-Quantum Speculative Byzantine Fault Tolerance');
  });

  it('should rank innovations by commercial readiness velocity', async () => {
    const repo = createMockInnovationRepo();
    const service = new InnovationNetworkService(repo);

    await service.recordInnovation({
      title: 'Autonomous Code Synthesis Kernel v3',
      domain: InnovationDomain.AI_REASONING,
      inventorOrganizationId: 'org-mit',
      commercialReadinessScore: 94.0,
    });

    await service.recordInnovation({
      title: 'Formal Verification LLM Prover',
      domain: InnovationDomain.AI_REASONING,
      inventorOrganizationId: 'org-oxford',
      commercialReadinessScore: 98.5,
    });

    const ranking = await service.rankInnovationsByDomain(InnovationDomain.AI_REASONING);
    assert.ok(ranking);
    assert.strictEqual(ranking.domain, InnovationDomain.AI_REASONING);
    assert.strictEqual(ranking.topInnovations.length, 2);
    assert.strictEqual(ranking.topInnovations[0].title, 'Formal Verification LLM Prover');
  });

  it('should filter innovations by specific technology domain', async () => {
    const repo = createMockInnovationRepo();
    const service = new InnovationNetworkService(repo);

    await service.recordInnovation({
      title: 'Clean Energy Micro-Kernel',
      domain: InnovationDomain.CLEANTECH,
      inventorOrganizationId: 'org-clean',
    });

    const aiInvs = await service.listInnovations(InnovationDomain.AI_REASONING);
    const cleanInvs = await service.listInnovations(InnovationDomain.CLEANTECH);

    assert.strictEqual(cleanInvs.length, 1);
    assert.strictEqual(aiInvs.length, 0);
  });
});
