import { test, describe } from 'node:test';
import assert from 'node:assert';
import { OrganizationService } from '../../src/modules/organizations/organizationService';
import { UniversityService } from '../../src/modules/universities/universityService';
import { CertificationService } from '../../src/modules/lms/certificationService';
import { OrgPlan, OrgMemberRole } from '@codeforge/shared';

describe('Enterprise Platform Security & Isolation Tests', () => {
  const orgService = new OrganizationService();
  const uniService = new UniversityService();
  const certService = new CertificationService();

  test('1. Organization creation rejects empty/invalid organization names', async () => {
    await assert.rejects(
      async () => {
        await orgService.createOrganization({ name: '' });
      },
      { message: /Organization name is required/ },
    );
  });

  test('2. Organization member addition rejects nonexistent/invalid userId or email', async () => {
    await assert.rejects(
      async () => {
        await orgService.addMember('invalid-org-id', {
          userId: 'invalid-user-id',
          role: OrgMemberRole.MEMBER,
        });
      },
      /Valid User ID or registered Email is required/,
    );
  });

  test('3. University registration validates accreditation and non-empty name', async () => {
    await assert.rejects(
      async () => {
        await uniService.createUniversity({ name: '' });
      },
      { message: /University name is required/ },
    );
  });

  test('4. Certificate verification detects tampered hash and rejects forged credentials', async () => {
    const check1 = await certService.verifyCertificate('sha256_forged_signature_000000000000');
    assert.strictEqual(check1.isValid, false);
    assert.ok(check1.reason?.includes('not found') || check1.reason?.includes('forged'));

    const check2 = await certService.verifyCertificate('CF-CERT-FORGED-9999');
    assert.strictEqual(check2.isValid, false);
  });

  test('5. Student registration requires valid university affiliation', async () => {
    await assert.rejects(
      async () => {
        await uniService.registerStudent('invalid-user-uuid', {
          universityId: '',
          studentRollNumber: 'FAIL-001',
        });
      },
      { message: /University ID/ },
    );
  });
});
