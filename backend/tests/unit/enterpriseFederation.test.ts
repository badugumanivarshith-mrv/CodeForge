import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EnterpriseFederationService } from '../../src/modules/organization-engine/enterpriseFederationService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { EnterpriseFederationType } from '@codeforge/shared';

describe('Phase 19: Enterprise Federation & Treaties Unit Tests', () => {
  it('should propose and ratify multi-enterprise treaty', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new EnterpriseFederationService(repo);

    const fed = await service.proposeFederation({
      initiatorOrgId: 'org-civ-1',
      partnerOrgId: 'org-civ-2',
      federationType: EnterpriseFederationType.STRATEGIC_ALLIANCE,
      treatyTitle: 'Global GPU Compute & Dialectic Proofs Mesh',
      sharedResourcesDescription: '50,000 H100 GPU compute nodes and automated talent interchange',
      governanceTerms: 'Equal 50/50 quorum with automated SLA slashing penalties',
    });

    assert.ok(fed);
    assert.strictEqual(fed.treatyTitle, 'Global GPU Compute & Dialectic Proofs Mesh');
    assert.strictEqual(fed.federationType, EnterpriseFederationType.STRATEGIC_ALLIANCE);
    assert.strictEqual(fed.activeStatus, true);
  });

  it('should evaluate treaty compliance and resource balance', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new EnterpriseFederationService(repo);

    const fed = await service.proposeFederation({
      initiatorOrgId: 'org-civ-1',
      partnerOrgId: 'org-civ-2',
    });

    const compliance = await service.evaluateTreatyCompliance(fed.id);
    assert.ok(compliance);
    assert.strictEqual(compliance.federationId, fed.id);
    assert.ok(compliance.complianceScore >= 95);
    assert.strictEqual(compliance.auditStatus, 'HEALTHY_COMPLIANT');
    assert.ok(compliance.sharedTelemetry.jointComputeTokensExchanged > 0);
  });
});
