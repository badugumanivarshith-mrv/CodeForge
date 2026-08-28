import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ProductivityAnalyticsService } from '../../src/modules/agents/productivityAnalyticsService';
import { AgentType, AgentStatus } from '@codeforge/shared';

describe('Productivity Analytics & ROI Engine Unit Tests', () => {
  const createMockRepo = () => {
    const analytics = new Map<string, any>();
    const tasks: any[] = [];
    const agents: any[] = [];
    const workflows: any[] = [];

    return {
      analytics,
      tasks,
      agents,
      workflows,
      async listTasks(userId: string) {
        return tasks.filter(t => t.userId === userId);
      },
      async listAgents(userId: string) {
        return agents.filter(a => a.userId === userId);
      },
      async listWorkflows(userId: string) {
        return workflows.filter(w => w.userId === userId);
      },
      async saveAnalytics(userId: string, data: any) {
        const item = {
          id: `pa-${Date.now()}-${Math.random()}`,
          userId,
          timeframe: data.timeframe,
          periodDate: data.periodDate,
          focusMetrics: data.focusMetrics,
          learningVelocity: data.learningVelocity,
          careerGrowthVelocity: data.careerGrowthVelocity,
          tasksCompleted: data.tasksCompleted,
          agentEffectivenessScore: data.agentEffectivenessScore,
          agentBreakdown: data.agentBreakdown,
          recommendations: data.recommendations || [],
          createdAt: new Date().toISOString(),
        };
        analytics.set(item.id, item);
        return item;
      },
      async getLatestAnalytics(userId: string, timeframe = 'weekly') {
        const list = Array.from(analytics.values()).filter(a => a.userId === userId && a.timeframe === timeframe);
        return list.length ? list[list.length - 1] : null;
      },
      async listAnalytics(userId: string) {
        return Array.from(analytics.values()).filter(a => a.userId === userId);
      },
    };
  };

  test('1. calculates comprehensive productivity analytics rollup for weekly timeframe', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    const result = await service.calculateProductivityRollup('user-pa-1', 'weekly');
    assert.ok(result.id);
    assert.strictEqual(result.timeframe, 'weekly');
    assert.ok(result.focusMetrics.focusScore >= 0 && result.focusMetrics.focusScore <= 100);
    assert.ok(result.focusMetrics.deepWorkHours > 0);
  });

  test('2. computes focus score, deep work hours, and distraction index accurately', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    const result = await service.calculateProductivityRollup('user-pa-2', 'daily');
    assert.strictEqual(result.focusMetrics.distractionScore, 14);
    assert.strictEqual(result.focusMetrics.deepWorkHours, 5.5);
    assert.ok(result.focusMetrics.peakProductivityHours.includes('08:30'));
  });

  test('3. computes dual velocity metrics: learning velocity vs career growth velocity', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    const result = await service.calculateProductivityRollup('user-pa-3', 'monthly');
    assert.ok(result.learningVelocity >= 70);
    assert.ok(result.careerGrowthVelocity >= 70);
    assert.ok(result.agentEffectivenessScore >= 80);
  });

  test('4. synthesizes agent effectiveness ROI breakdown with hours saved', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    const result = await service.calculateProductivityRollup('user-pa-4', 'weekly');
    assert.ok(result.agentBreakdown.length >= 3);

    const codingAgent = result.agentBreakdown.find(b => b.agentType === AgentType.CODING_AGENT);
    assert.ok(codingAgent);
    assert.ok(codingAgent.hoursSaved > 10);
    assert.ok(codingAgent.qualityScore >= 90);
  });

  test('5. generates personal AI command center executive overview with multi-channel alerts', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    const overview = await service.getCommandCenterOverview('user-pa-5');
    assert.ok(overview.activeAgentsCount >= 1);
    assert.ok(overview.productivityScore >= 80);
    assert.ok(overview.todayPriorities.length > 0);
    assert.ok(overview.alerts.careerAlerts.length > 0);
    assert.ok(overview.alerts.learningAlerts.length > 0);
    assert.ok(overview.alerts.hiringAlerts.length > 0);
  });

  test('6. fetches latest cached analytics and handles timeframe changes', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    await service.calculateProductivityRollup('user-pa-6', 'weekly');
    const latest = await service.getLatestAnalytics('user-pa-6', 'weekly');

    assert.ok(latest);
    assert.strictEqual(latest.timeframe, 'weekly');
  });

  test('7. isolates productivity analytics strictly per user', async () => {
    const mockRepo = createMockRepo();
    const service = new ProductivityAnalyticsService(mockRepo as any);

    await service.calculateProductivityRollup('user-A', 'weekly');
    const userBAnalytics = await mockRepo.listAnalytics('user-B');

    assert.strictEqual(userBAnalytics.length, 0);
  });
});
