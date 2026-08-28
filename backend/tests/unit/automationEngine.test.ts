import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AutomationEngine } from '../../src/modules/agent-cloud/automationEngine';
import { GlobalEventType } from '@codeforge/shared';

describe('Automation Engine Unit Tests', () => {
  const createMockRepo = () => {
    const rules = new Map<string, any>();
    return {
      rules,
      async createAutomationRule(userId: string, data: any) {
        const rule = {
          id: `rule_${Date.now()}_${Math.random()}`,
          userId,
          name: data.name,
          description: data.description || null,
          triggerEvent: data.triggerEvent,
          targetWorkflowId: data.targetWorkflowId || null,
          targetAgentId: data.targetAgentId || null,
          conditionExpression: data.conditionExpression || null,
          isActive: true,
          executionCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        rules.set(rule.id, rule);
        return rule;
      },
      async listAutomationRules(userId: string, triggerEvent?: GlobalEventType) {
        let list = Array.from(rules.values()).filter(r => r.userId === userId);
        if (triggerEvent) list = list.filter(r => r.triggerEvent === triggerEvent);
        return list;
      },
      async incrementRuleExecution(id: string) {
        const r = rules.get(id);
        if (r) r.executionCount += 1;
      },
    };
  };

  test('1. should evaluate condition expression and increment rule execution count', async () => {
    const mockRepo = createMockRepo();
    const mockEventBus = { subscribe: () => () => {} };
    const mockWorkflowEngine = { executeWorkflow: async () => {} };
    const mockAgentCloud = { runAgent: async () => {} };

    const engine = new AutomationEngine(
      mockRepo as any,
      mockEventBus as any,
      mockWorkflowEngine as any,
      mockAgentCloud as any
    );

    const rule = await engine.createRule('user-1', {
      name: 'On Job Applied Trigger Career Coach',
      triggerEvent: GlobalEventType.JOB_APPLIED,
      conditionExpression: "role == 'senior_engineer'",
    });

    assert.strictEqual(rule.name, 'On Job Applied Trigger Career Coach');
    assert.strictEqual(rule.executionCount, 0);

    // Matching event
    await engine.handleEvent({
      id: 'ev-1',
      eventType: GlobalEventType.JOB_APPLIED,
      source: 'Job Board',
      userId: 'user-1',
      payload: { role: 'senior_engineer', candidate: 'Alice' },
      timestamp: new Date().toISOString(),
    });

    const updatedRules = await engine.listRules('user-1');
    assert.strictEqual(updatedRules[0].executionCount, 1);
  });

  test('2. should skip execution if condition expression evaluates to false', async () => {
    const mockRepo = createMockRepo();
    const mockEventBus = { subscribe: () => () => {} };
    const mockWorkflowEngine = { executeWorkflow: async () => {} };
    const mockAgentCloud = { runAgent: async () => {} };

    const engine = new AutomationEngine(
      mockRepo as any,
      mockEventBus as any,
      mockWorkflowEngine as any,
      mockAgentCloud as any
    );

    await engine.createRule('user-1', {
      name: 'On Score Over 90',
      triggerEvent: GlobalEventType.ASSESSMENT_COMPLETED,
      conditionExpression: 'score > 90',
    });

    // Non-matching event (score 75 <= 90)
    await engine.handleEvent({
      id: 'ev-2',
      eventType: GlobalEventType.ASSESSMENT_COMPLETED,
      source: 'Quiz Engine',
      userId: 'user-1',
      payload: { score: 75 },
      timestamp: new Date().toISOString(),
    });

    const updatedRules = await engine.listRules('user-1');
    assert.strictEqual(updatedRules[0].executionCount, 0);
  });

  test('3. should dispatch target agent run on matched event', async () => {
    const mockRepo = createMockRepo();
    const mockEventBus = { subscribe: () => () => {} };
    const mockWorkflowEngine = { executeWorkflow: async () => {} };

    let agentDispatched = false;
    const mockAgentCloud = {
      runAgent: async (agentId: string) => {
        if (agentId === 'ag-target') agentDispatched = true;
      },
    };

    const engine = new AutomationEngine(
      mockRepo as any,
      mockEventBus as any,
      mockWorkflowEngine as any,
      mockAgentCloud as any
    );

    await engine.createRule('user-1', {
      name: 'Dispatch Target Agent',
      triggerEvent: GlobalEventType.COURSE_COMPLETED,
      targetAgentId: 'ag-target',
    });

    await engine.handleEvent({
      id: 'ev-3',
      eventType: GlobalEventType.COURSE_COMPLETED,
      source: 'LMS',
      userId: 'user-1',
      payload: { courseId: 'c1' },
      timestamp: new Date().toISOString(),
    });

    assert.strictEqual(agentDispatched, true);
  });
});
