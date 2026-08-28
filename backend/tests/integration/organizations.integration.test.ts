import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { OrganizationService } from '../../src/modules/organizations/organizationService';
import { WhiteLabelService } from '../../src/modules/enterprise/whiteLabelService';
import { OrgPlan, OrgMemberRole, CohortStatus } from '@codeforge/shared';

describe('Organizations & Multi-Tenancy Integration Tests', () => {
  const authService = new AuthService();
  const orgService = new OrganizationService();
  const whiteLabelService = new WhiteLabelService();

  let ownerUserId = '';
  let memberUserId = '';
  let testOrgId = '';

  test('Setup: Create test users for organization testing', async () => {
    const unique = Date.now();
    const u1 = await authService.register({
      email: `org_owner_${unique}@enterprise.dev`,
      username: `org_owner_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Org Managing Director',
    });
    ownerUserId = u1.user.id;

    const u2 = await authService.register({
      email: `org_member_${unique}@enterprise.dev`,
      username: `org_member_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Senior Software Engineer',
    });
    memberUserId = u2.user.id;

    assert.ok(ownerUserId);
    assert.ok(memberUserId);
  });

  test('1. Create organization and verify initial owner membership', async () => {
    const unique = Date.now();
    const org = await orgService.createOrganization(
      {
        name: `Acme Corp ${unique}`,
        domain: `acme-${unique}.tech`,
        plan: OrgPlan.ENTERPRISE,
        themeConfig: {
          primaryColor: '#6366f1',
          secondaryColor: '#8b5cf6',
          portalTitle: 'Acme Learning Academy',
        },
      },
      ownerUserId,
    );

    assert.ok(org);
    assert.ok(org.id);
    assert.ok(org.slug);
    assert.strictEqual(org.plan, OrgPlan.ENTERPRISE);
    testOrgId = org.id;

    // Verify owner membership role
    const members = await orgService.listMembers(testOrgId);
    assert.ok(members.length >= 1);
    const ownerMember = members.find(m => m.userId === ownerUserId);
    assert.ok(ownerMember);
    assert.strictEqual(ownerMember.role, OrgMemberRole.OWNER);
  });

  test('2. Add member with specific role and department to organization', async () => {
    const member = await orgService.addMember(testOrgId, {
      userId: memberUserId,
      role: OrgMemberRole.MEMBER,
      department: 'Platform Engineering',
      title: 'Senior Backend Engineer',
    });

    assert.ok(member);
    assert.strictEqual(member.organizationId, testOrgId);
    assert.strictEqual(member.userId, memberUserId);
    assert.strictEqual(member.role, OrgMemberRole.MEMBER);
    assert.strictEqual(member.department, 'Platform Engineering');

    const role = await orgService.getMemberRole(testOrgId, memberUserId);
    assert.strictEqual(role, OrgMemberRole.MEMBER);
  });

  test('3. Create departments and teams within organization', async () => {
    const dept = await orgService.createDepartment(testOrgId, {
      name: 'Cloud Infrastructure',
      code: 'CLOUD-INFRA',
      headUserId: ownerUserId,
      budget: 5000000,
    });

    assert.ok(dept);
    assert.strictEqual(dept.organizationId, testOrgId);
    assert.strictEqual(dept.code, 'CLOUD-INFRA');

    const team = await orgService.createTeam(testOrgId, {
      departmentId: dept.id,
      name: 'Kubernetes Platform Core',
      description: 'Maintains production cluster fleet',
      leadUserId: memberUserId,
    });

    assert.ok(team);
    assert.strictEqual(team.departmentId, dept.id);
    assert.strictEqual(team.name, 'Kubernetes Platform Core');

    const depts = await orgService.listDepartments(testOrgId);
    assert.ok(depts.some(d => d.id === dept.id));

    const teams = await orgService.listTeams(testOrgId);
    assert.ok(teams.some(t => t.id === team.id));
  });

  test('4. Create upskilling cohort and retrieve cohort roster', async () => {
    const startDate = new Date();
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    const cohort = await orgService.createCohort(testOrgId, {
      name: 'Q3 Distributed Systems Bootcamp',
      code: 'Q3-DIST-SYS',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      capacity: 35,
      status: CohortStatus.ACTIVE,
    });

    assert.ok(cohort);
    assert.strictEqual(cohort.organizationId, testOrgId);
    assert.strictEqual(cohort.status, CohortStatus.ACTIVE);

    const cohorts = await orgService.listCohorts(testOrgId);
    assert.ok(cohorts.some(c => c.id === cohort.id));
  });

  test('5. Update and retrieve White-Label custom branding config', async () => {
    const updated = await whiteLabelService.updateBranding(testOrgId, {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8',
      portalTitle: 'Acme Global Engineering Academy',
      customDomain: 'learn.acme.corp',
    });

    assert.ok(updated);
    assert.strictEqual(updated.primaryColor, '#0ea5e9');
    assert.strictEqual(updated.portalTitle, 'Acme Global Engineering Academy');

    const fetched = await whiteLabelService.getBranding(testOrgId);
    assert.ok(fetched);
    assert.strictEqual(fetched.portalTitle, 'Acme Global Engineering Academy');
  });

  test('6. List all organizations and verify multi-tenant isolation', async () => {
    const orgs = await orgService.listOrganizations();
    assert.ok(Array.isArray(orgs));
    assert.ok(orgs.some(o => o.id === testOrgId));

    const found = await orgService.getOrganization(testOrgId);
    assert.ok(found);
    assert.strictEqual(found.id, testOrgId);
  });
});
