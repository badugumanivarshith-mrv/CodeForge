import { test, describe } from 'node:test';
import assert from 'node:assert';
import { WorkflowMarketplaceService } from '../../src/modules/workflows/workflowMarketplaceService';
import {
  WorkflowCategory,
  WorkflowTriggerType,
  AgentType,
  AgentStatus,
  WorkflowStatus,
} from '@codeforge/shared';

describe('Workflow Marketplace & Template Cloning Unit Tests', () => {
  const createMockRepo = () => {
    const templates = new Map<string, any>();
    const clonedWorkflows = new Map<string, any>();

    const repo = {
      templates,
      clonedWorkflows,
      async createWorkflowTemplate(creatorId: string, data: any) {
        const item = {
          id: `tmpl-${Date.now()}-${Math.random()}`,
          creatorId,
          title: data.title,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          category: data.category,
          triggerType: data.triggerType,
          steps: data.steps,
          isEnterprise: data.isEnterprise || false,
          ratingAverage: 5.0,
          ratingCount: 0,
          downloadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        templates.set(item.id, item);
        return item;
      },
      async getWorkflowTemplateById(id: string) {
        return templates.get(id) || null;
      },
      async listWorkflowTemplates(category?: string) {
        let list = Array.from(templates.values());
        if (category) {
          list = list.filter(t => t.category === category);
        }
        return list;
      },
      async deleteWorkflowTemplate(id: string, creatorId: string) {
        const t = templates.get(id);
        if (!t || t.creatorId !== creatorId) return false;
        templates.delete(id);
        return true;
      },
    };

    const workspaceRepo = {
      async createWorkflow(userId: string, data: any) {
        const wf = {
          id: `wf-${Date.now()}-${Math.random()}`,
          userId,
          title: data.title,
          description: data.description,
          triggerType: data.triggerType,
          scheduleCron: data.scheduleCron || null,
          status: WorkflowStatus.ACTIVE,
          steps: data.steps.map((s: any) => ({
            ...s,
            status: AgentStatus.IDLE,
          })),
          lastRunAt: null,
          nextRunAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        clonedWorkflows.set(wf.id, wf);
        return wf;
      },
    };

    return { repo, workspaceRepo };
  };

  test('1. initializes 5 standard prebuilt workflow templates', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);
    const catalog = await service.initializeStarterTemplates('system-admin');

    assert.strictEqual(catalog.length, 5);
    assert.ok(catalog.some(t => t.category === WorkflowCategory.INTERVIEW_PREP));
    assert.ok(catalog.some(t => t.category === WorkflowCategory.CAREER_PLANNING));
    assert.ok(catalog.some(t => t.category === WorkflowCategory.DEVOPS_AUTOMATION));
  });

  test('2. publishes new custom multi-agent template to marketplace', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);

    const template = await service.publishTemplate('creator-wf', {
      title: 'Distributed Log Consensus Verification Pipeline',
      description: 'Chains coding agent and research agent for raft log verification.',
      category: WorkflowCategory.DEVOPS_AUTOMATION,
      triggerType: WorkflowTriggerType.EVENT_DRIVEN,
      steps: [
        {
          stepId: 's1',
          stepNumber: 1,
          agentType: AgentType.CODING_AGENT,
          action: 'Run Paxos Invariant Check',
          inputTemplate: 'Execute tests against consensus harness.',
          dependencies: [],
        },
      ],
      isEnterprise: false,
    });

    assert.ok(template.id);
    assert.strictEqual(template.title, 'Distributed Log Consensus Verification Pipeline');
    assert.strictEqual(template.steps.length, 1);
  });

  test('3. filters workflow templates by category', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);
    await service.initializeStarterTemplates('system-admin');

    const devopsTemplates = await service.listTemplates(WorkflowCategory.DEVOPS_AUTOMATION);
    assert.ok(devopsTemplates.length >= 1);
    for (const t of devopsTemplates) {
      assert.strictEqual(t.category, WorkflowCategory.DEVOPS_AUTOMATION);
    }
  });

  test('4. clones template directly into user automated workspace', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);
    const catalog = await service.initializeStarterTemplates('system-admin');

    const cloned = await service.cloneTemplateToWorkspace(catalog[0].id, 'user-clone-target');
    assert.ok(cloned?.id);
    assert.strictEqual(cloned?.userId, 'user-clone-target');
    assert.ok(cloned?.title.includes('[Cloned]'));
    assert.strictEqual(cloned?.steps.length, catalog[0].steps.length);
  });

  test('5. throws error when cloning non-existent template', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);

    await assert.rejects(
      async () => {
        await service.cloneTemplateToWorkspace('non-existent-id', 'user-1');
      },
      /Workflow template not found/
    );
  });

  test('6. deletes template cleanly when requested by creator', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);

    const template = await service.publishTemplate('creator-owner', {
      title: 'Temporary Pipeline',
      description: 'Temporary',
      category: WorkflowCategory.SPRINT_PLANNING,
      triggerType: WorkflowTriggerType.MANUAL,
      steps: [{ stepId: '1', stepNumber: 1, agentType: AgentType.CODING_AGENT, action: 'Run', inputTemplate: 'in', dependencies: [] }],
    });

    const unauthorized = await service.deleteTemplate(template.id, 'intruder');
    assert.strictEqual(unauthorized, false);

    const authorized = await service.deleteTemplate(template.id, 'creator-owner');
    assert.strictEqual(authorized, true);
  });

  test('7. rejects template publishing without execution steps', async () => {
    const { repo, workspaceRepo } = createMockRepo();
    const service = new WorkflowMarketplaceService(repo as any, workspaceRepo as any);

    await assert.rejects(
      async () => {
        await service.publishTemplate('creator-1', {
          title: 'Empty Steps Template',
          description: 'Desc',
          category: WorkflowCategory.INTERVIEW_PREP,
          triggerType: WorkflowTriggerType.MANUAL,
          steps: [],
        });
      },
      /Workflow must contain at least 1 execution step/
    );
  });
});
