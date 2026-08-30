import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { ResearchFundingService } from '../../src/modules/research-university/researchFundingService';
import { AcademicDepartment, GrantType, GrantStatus } from '@codeforge/shared';

describe('Phase 22: Research Funding & Grant Intelligence Unit Tests', () => {
  it('should register a global grant pool and match eligible departments', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new ResearchFundingService(repo);

    const grant = await service.registerGrantPool({
      grantTitle: 'Planetary Advanced Computing & Superintelligence Grant',
      grantType: GrantType.GOVERNMENT_GRANT,
      fundingAgency: 'Planetary Science Council',
      totalPoolUsd: 25000000,
      maximumAwardUsd: 5000000,
      matchingDepartments: [AcademicDepartment.ARTIFICIAL_INTELLIGENCE, AcademicDepartment.COMPUTER_SCIENCE],
    });

    assert.ok(grant);
    assert.ok(grant.id);
    assert.strictEqual(grant.status, GrantStatus.OPEN);
    assert.strictEqual(grant.totalPoolUsd, 25000000);

    const matched = await service.matchGrantsForDepartment(AcademicDepartment.ARTIFICIAL_INTELLIGENCE);
    assert.ok(matched.length >= 2);
    assert.ok(matched.some((g) => g.id === grant.id));
  });

  it('should apply for and award a research grant, disbursing capital into program budget', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new ResearchFundingService(repo);

    const program = await repo.getProgramById('prog-quantum-ai');
    const initialBudget = program?.allocatedBudgetUsd || 0;

    const applied = await service.applyForGrant('grant-nsf-ai', 'prog-quantum-ai');
    assert.strictEqual(applied.status, GrantStatus.APPLIED);
    assert.strictEqual(applied.fundedProgramId, 'prog-quantum-ai');

    const awarded = await service.awardGrant('grant-nsf-ai', 2000000);
    assert.strictEqual(awarded.status, GrantStatus.AWARDED);
    assert.strictEqual(awarded.awardedAmountUsd, 2000000);

    const updatedProg = await repo.getProgramById('prog-quantum-ai');
    assert.strictEqual(updatedProg?.allocatedBudgetUsd, initialBudget + 2000000);
  });
});
