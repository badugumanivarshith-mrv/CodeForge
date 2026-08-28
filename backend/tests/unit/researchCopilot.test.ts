import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ResearchCopilotService } from '../../src/modules/agents/researchCopilotService';

describe('Deep Research Copilot Unit Tests', () => {
  const createMockRepo = () => {
    const reports = new Map<string, any>();

    return {
      reports,
      async createResearchReport(userId: string, data: any) {
        const report = {
          id: `rep-${Date.now()}-${Math.random()}`,
          userId,
          topic: data.topic,
          category: data.category || 'SYSTEMS_ARCHITECTURE',
          executiveSummary: data.executiveSummary,
          reportContent: data.reportContent,
          swotAnalysis: data.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
          opportunityMatrix: data.opportunityMatrix || [],
          keyTrends: data.keyTrends || [],
          recommendations: data.recommendations || [],
          sources: data.sources || [],
          createdAt: new Date().toISOString(),
        };
        reports.set(report.id, report);
        return report;
      },
      async getResearchReportById(reportId: string, userId: string) {
        const r = reports.get(reportId);
        if (r && r.userId === userId) return r;
        return null;
      },
      async listResearchReports(userId: string, category?: string) {
        let list = Array.from(reports.values()).filter(r => r.userId === userId);
        if (category) list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
        return list;
      },
      async deleteResearchReport(reportId: string, userId: string) {
        const r = reports.get(reportId);
        if (r && r.userId === userId) {
          reports.delete(reportId);
          return true;
        }
        return false;
      },
    };
  };

  test('1. conducts multi-source deep research and generates structured report', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    const report = await service.conductResearch('user-res-1', {
      topic: 'Zero-Copy LSM-Tree Storage Compaction',
      category: 'SYSTEMS_ARCHITECTURE',
    });

    assert.ok(report.id);
    assert.strictEqual(report.topic, 'Zero-Copy LSM-Tree Storage Compaction');
    assert.ok(report.executiveSummary.length > 20);
    assert.ok(report.reportContent.includes('Deep Research Report'));
  });

  test('2. synthesizes complete 4-quadrant SWOT analysis matrix', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    const report = await service.conductResearch('user-res-2', {
      topic: 'WebAssembly Micro-Runtimes for Edge Computing',
    });

    assert.ok(report.swotAnalysis.strengths.length > 0);
    assert.ok(report.swotAnalysis.weaknesses.length > 0);
    assert.ok(report.swotAnalysis.opportunities.length > 0);
    assert.ok(report.swotAnalysis.threats.length > 0);
  });

  test('3. constructs opportunity matrix with impact and feasibility scores', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    const report = await service.conductResearch('user-res-3', {
      topic: 'eBPF Kernel Tracing for Distributed Observability',
    });

    assert.ok(report.opportunityMatrix.length >= 2);
    const firstOpp = report.opportunityMatrix[0];
    assert.ok(firstOpp.impactScore >= 0 && firstOpp.impactScore <= 100);
    assert.ok(firstOpp.feasibilityScore >= 0 && firstOpp.feasibilityScore <= 100);
    assert.ok(firstOpp.recommendation.length > 5);
  });

  test('4. indexes credible academic and industry sources with credibility scores', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    const report = await service.conductResearch('user-res-4', {
      topic: 'Raft Consensus Protocol Verification',
    });

    assert.ok(report.sources.length >= 2);
    const source = report.sources[0];
    assert.ok(source.url.startsWith('https://'));
    assert.ok(source.credibilityScore >= 90);
  });

  test('5. filters research reports by domain category', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    await service.conductResearch('user-res-5', { topic: 'Rust Concurrency', category: 'SYSTEMS_ARCHITECTURE' });
    await service.conductResearch('user-res-5', { topic: 'Transformer Inference', category: 'AI_ML' });

    const filtered = await service.listReports('user-res-5', 'AI_ML');
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].category, 'AI_ML');
  });

  test('6. deletes research report successfully', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    const report = await service.conductResearch('user-res-6', { topic: 'Temporary Topic' });
    const deleted = await service.deleteReport(report.id, 'user-res-6');

    assert.strictEqual(deleted, true);
    const fetched = await service.getReport(report.id, 'user-res-6');
    assert.strictEqual(fetched, null);
  });

  test('7. enforces multi-tenant isolation on research reports', async () => {
    const mockRepo = createMockRepo();
    const service = new ResearchCopilotService(mockRepo as any);

    const report = await service.conductResearch('user-A', { topic: 'User A Secret Tech' });
    const leaked = await service.getReport(report.id, 'user-B');

    assert.strictEqual(leaked, null);
  });
});
