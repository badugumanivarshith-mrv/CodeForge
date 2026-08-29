import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { OrganizationEngineService } from '../../src/modules/organization-engine/organizationEngineService';
import { OrganizationalDesignService } from '../../src/modules/organization-engine/organizationalDesignService';
import { WorkforcePlanningService } from '../../src/modules/organization-engine/workforcePlanningService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { OrganizationCivilizationType, DigitalEmployeeRole } from '@codeforge/shared';

describe('Phase 19: Organization Engine Unit Tests', () => {
  it('should create autonomous organization with structured topology and seed departments', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new OrganizationEngineService(repo);

    const result = await service.createOrganizationWithTopology({
      creatorUserId: 'user-org-test-1',
      name: 'Apex Autonomous Systems',
      organizationType: OrganizationCivilizationType.ENTERPRISE,
      missionStatement: 'Autonomous enterprise computing scale-up',
      headquartersRegion: 'Global-Mesh-US',
      seedDepartments: [
        { name: 'Autonomous Core Engineering', charter: 'Lead architectural execution' },
        { name: 'Strategic Intelligence', charter: 'Predictive market modeling' },
      ],
    });

    assert.ok(result.organization);
    assert.strictEqual(result.organization.name, 'Apex Autonomous Systems');
    assert.strictEqual(result.organization.organizationType, OrganizationCivilizationType.ENTERPRISE);
    assert.strictEqual(result.departments.length, 2);
    assert.strictEqual(result.teams.length, 2);
    assert.strictEqual(result.organization.totalDepartmentsCount, 2);
  });

  it('should design department and team hierarchy with budget tokens allocation', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const orgService = new OrganizationEngineService(repo);
    const designService = new OrganizationalDesignService(repo);

    const orgRes = await orgService.createOrganizationWithTopology({
      creatorUserId: 'user-org-test-1',
      name: 'Titan Autonomous Labs',
      organizationType: OrganizationCivilizationType.RESEARCH_LAB,
    });

    const dept = await designService.createDepartmentStructure(orgRes.organization.id, {
      name: 'Quantum AI Systems',
      charter: 'Frontier model research and optimization',
      allocatedBudgetTokens: 5000000,
    });

    assert.ok(dept);
    assert.strictEqual(dept.name, 'Quantum AI Systems');
    assert.strictEqual(dept.allocatedBudgetTokens, 5000000);

    const team = await designService.createTeamStructure(dept.id, orgRes.organization.id, {
      name: 'Kernel Optimization Team',
      focusArea: 'GPU LLM Kernel Engineering',
    });

    assert.ok(team);
    assert.strictEqual(team.departmentId, dept.id);
    assert.strictEqual(team.focusArea, 'GPU LLM Kernel Engineering');
  });

  it('should analyze workforce capacity and recommend targeted hires', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const orgService = new OrganizationEngineService(repo);
    const workforceService = new WorkforcePlanningService(repo);

    const orgRes = await orgService.createOrganizationWithTopology({
      creatorUserId: 'user-org-test-1',
      name: 'Omega Sovereign Cloud',
    });

    const analysis = await workforceService.analyzeWorkforceCapacity(orgRes.organization.id);
    assert.ok(analysis);
    assert.ok(analysis.optimalHeadcount >= analysis.currentHeadcount);
    assert.ok(analysis.utilizationRate >= 90);
    assert.ok(analysis.recommendedHires.length > 0);
    assert.strictEqual(analysis.recommendedHires[0].role, DigitalEmployeeRole.AI_ENGINEER);
  });
});
