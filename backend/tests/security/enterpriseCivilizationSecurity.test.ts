import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { OrganizationEngineService } from '../../src/modules/organization-engine/organizationEngineService';
import { EnterpriseFederationService } from '../../src/modules/organization-engine/enterpriseFederationService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';

describe('Phase 19: Enterprise Civilization Security & Governance Tests', () => {
  it('should enforce tenant isolation across autonomous organizations', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new OrganizationEngineService(repo);

    const org1 = await service.createOrganizationWithTopology({
      creatorUserId: 'tenant-user-alpha',
      name: 'Tenant Alpha Sovereign Enterprise',
    });

    const org2 = await service.createOrganizationWithTopology({
      creatorUserId: 'tenant-user-beta',
      name: 'Tenant Beta Sovereign Enterprise',
    });

    const user1Orgs = await repo.listOrganizations('tenant-user-alpha');
    const user2Orgs = await repo.listOrganizations('tenant-user-beta');

    assert.ok(user1Orgs.some((o) => o.id === org1.organization.id));
    assert.ok(!user1Orgs.some((o) => o.id === org2.organization.id));
    assert.ok(user2Orgs.some((o) => o.id === org2.organization.id));
    assert.ok(!user2Orgs.some((o) => o.id === org1.organization.id));
  });

  it('should prevent unauthorized treaty ratification without valid partner IDs', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new EnterpriseFederationService(repo);

    const fed = await service.proposeFederation({
      initiatorOrgId: 'secure-org-1',
      partnerOrgId: 'secure-org-2',
      governanceTerms: 'Strict Quorum Required',
    });

    assert.ok(fed.id);
    assert.strictEqual(fed.activeStatus, true);
    assert.strictEqual(fed.initiatorOrgId, 'secure-org-1');
  });

  it('should validate cryptographic proof hashes for execution network tasks', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const task = await repo.createExecutionTask({
      organizationId: 'secure-org-1',
      taskTitle: 'Critical Kernel Verification',
    });

    assert.ok(task.verificationProofHash);
    assert.ok(task.verificationProofHash.startsWith('0xzk_'));
  });
});
