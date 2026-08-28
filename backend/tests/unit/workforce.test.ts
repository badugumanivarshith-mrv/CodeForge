import { test, describe } from 'node:test';
import assert from 'node:assert';
import { WorkforceService } from '../../src/modules/agent-cloud/workforceService';
import { WorkforceAgentRole } from '@codeforge/shared';

describe('Organizational AI Workforces Unit Tests', () => {
  const createMockRepo = () => {
    const teams = new Map<string, any>();
    const orgs = new Map<string, any>();
    return {
      teams,
      orgs,
      async assignTeamAgent(teamId: string, agentId: string, role: WorkforceAgentRole, workflows?: string[], permissions?: string[]) {
        const item = { id: `team_ag_${Date.now()}`, teamId, agentId, role, workflows: workflows || [], permissions: permissions || [], assignedAt: new Date().toISOString() };
        teams.set(`${teamId}_${agentId}`, item);
        return item;
      },
      async listTeamAgents(teamId: string) {
        return Array.from(teams.values()).filter(t => t.teamId === teamId);
      },
      async assignOrgAgent(orgId: string, agentId: string, department: string, role: WorkforceAgentRole, isEnterpriseShared = false) {
        const item = { id: `org_ag_${Date.now()}`, orgId, agentId, department, role, isEnterpriseShared, assignedAt: new Date().toISOString() };
        orgs.set(`${orgId}_${agentId}`, item);
        return item;
      },
      async listOrgAgents(orgId: string) {
        return Array.from(orgs.values()).filter(o => o.orgId === orgId);
      },
    };
  };

  test('1. should assign workforce agents to organizations and generate workforce optimization report', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkforceService(mockRepo as any);

    await service.assignOrgAgent('org-tech-corp', 'agent-recruiter', 'Talent Acquisition', WorkforceAgentRole.RECRUITER_AGENT);
    await service.assignOrgAgent('org-tech-corp', 'agent-faculty', 'Learning & Development', WorkforceAgentRole.FACULTY_AGENT);

    const orgAgents = await service.listOrgAgents('org-tech-corp');
    assert.strictEqual(orgAgents.length, 2);

    const report = await service.getWorkforceOptimizationReport('org-tech-corp');
    assert.ok(report.totalAgents > 0);
    assert.strictEqual(report.scopeId, 'org-tech-corp');
    assert.ok(report.agentRoleDistribution.length > 0);
  });

  test('2. should assign agent to cross-functional agile team with workflows & permissions', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkforceService(mockRepo as any);

    const teamAgent = await service.assignTeamAgent(
      'team-alpha',
      'agent-pm-1',
      WorkforceAgentRole.PROJECT_MANAGER_AGENT,
      ['sprint-planning', 'retrospective-analysis'],
      ['read_jira', 'write_github']
    );

    assert.strictEqual(teamAgent.teamId, 'team-alpha');
    assert.strictEqual(teamAgent.role, WorkforceAgentRole.PROJECT_MANAGER_AGENT);

    const teamAgents = await service.listTeamAgents('team-alpha');
    assert.strictEqual(teamAgents.length, 1);
  });
});
