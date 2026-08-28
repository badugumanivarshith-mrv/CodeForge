import { test, describe } from 'node:test';
import assert from 'node:assert';
import { WorkspaceAutomationService } from '../../src/modules/agents/workspaceAutomationService';
import { WorkflowStatus, WorkflowTriggerType, AgentType } from '@codeforge/shared';

describe('Autonomous Workflow Engine Unit Tests', () => {
  const createMockRepo = () => {
    const workflows = new Map<string, any>();

    return {
      workflows,
      async createWorkflow(userId: string, data: any) {
        const wf = {
          id: `wf-${Date.now()}-${Math.random()}`,
          userId,
          title: data.title,
          description: data.description,
          triggerType: data.triggerType,
          status: WorkflowStatus.ACTIVE,
          steps: data.steps || [],
          scheduleCron: data.scheduleCron,
          lastRunAt: null,
          nextRunAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        workflows.set(wf.id, wf);
        return wf;
      },
      async getWorkflowById(workflowId: string, userId: string) {
        const wf = workflows.get(workflowId);
        if (wf && wf.userId === userId) return wf;
        return null;
      },
      async listWorkflows(userId: string) {
        return Array.from(workflows.values()).filter(w => w.userId === userId);
      },
      async updateWorkflow(workflowId: string, userId: string, data: any) {
        const wf = workflows.get(workflowId);
        if (!wf || wf.userId !== userId) return null;
        const updated = { ...wf, ...data, updatedAt: new Date().toISOString() };
        workflows.set(workflowId, updated);
        return updated;
      },
      async deleteWorkflow(workflowId: string, userId: string) {
        const wf = workflows.get(workflowId);
        if (wf && wf.userId === userId) {
          workflows.delete(workflowId);
          return true;
        }
        return false;
      },
    };
  };

  test('1. initializes the 5 standard automated workflows for a user', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);

    const workflows = await service.initializeDefaultWorkflows('user-wf-1');
    assert.strictEqual(workflows.length, 5);

    const titles = workflows.map(w => w.title);
    assert.ok(titles.includes('Weekly Career & Promotion Review'));
    assert.ok(titles.includes('Adaptive Learning & Spaced Repetition Review'));
    assert.ok(titles.includes('Mock Interview Prep & Readiness Drill'));
    assert.ok(titles.includes('Automated Job Matching & Application Pipeline'));
    assert.ok(titles.includes('Enterprise Certification Verification Sweep'));
  });

  test('2. triggers workflow execution and transitions status to COMPLETED', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);
    const workflows = await service.initializeDefaultWorkflows('user-wf-2');

    const firstWf = workflows[0];
    const completed = await service.triggerWorkflow(firstWf.id, 'user-wf-2');

    assert.strictEqual(completed.status, WorkflowStatus.COMPLETED);
  });

  test('3. executes all workflow steps in sequential order with agent outputs', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);
    const workflows = await service.initializeDefaultWorkflows('user-wf-3');

    const firstWf = workflows[0];
    const executed = await service.triggerWorkflow(firstWf.id, 'user-wf-3');

    assert.strictEqual(executed.steps.length, firstWf.steps.length);
    for (const step of executed.steps) {
      assert.ok(step.outputSummary);
      assert.ok(step.outputSummary.includes('executed successfully'));
    }
  });

  test('4. creates a new custom autonomous workflow', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);

    const custom = await service.createWorkflow('user-wf-4', {
      title: 'Daily Micro-Benchmarking Workflow',
      description: 'Executes benchmark suite on master branch commit',
      triggerType: WorkflowTriggerType.EVENT_DRIVEN,
      steps: [
        {
          stepId: 'step-1',
          stepNumber: 1,
          agentType: AgentType.CODING_AGENT,
          action: 'Run Criterion Benchmark',
          inputTemplate: 'Execute cargo bench --bench throughput',
          dependencies: [],
        },
      ],
    });

    assert.ok(custom.id);
    assert.strictEqual(custom.title, 'Daily Micro-Benchmarking Workflow');
    assert.strictEqual(custom.triggerType, WorkflowTriggerType.EVENT_DRIVEN);
  });

  test('5. updates workflow status and parameters', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);
    const workflows = await service.initializeDefaultWorkflows('user-wf-5');

    const updated = await service.updateWorkflow(workflows[0].id, 'user-wf-5', {
      status: WorkflowStatus.PAUSED,
    });

    assert.strictEqual(updated?.status, WorkflowStatus.PAUSED);
  });

  test('6. deletes workflow cleanly', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);
    const workflows = await service.initializeDefaultWorkflows('user-wf-6');

    const deleted = await service.deleteWorkflow(workflows[0].id, 'user-wf-6');
    assert.strictEqual(deleted, true);

    const remaining = await mockRepo.listWorkflows('user-wf-6');
    assert.strictEqual(remaining.length, 4);

    const fetched = await service.getWorkflow(workflows[0].id, 'user-wf-6');
    assert.strictEqual(fetched, null);
  });

  test('7. isolates workflows strictly per user', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkspaceAutomationService(mockRepo as any);

    await service.initializeDefaultWorkflows('user-A');
    const userBWorkflows = await mockRepo.listWorkflows('user-B');

    assert.strictEqual(userBWorkflows.length, 0);
  });
});
