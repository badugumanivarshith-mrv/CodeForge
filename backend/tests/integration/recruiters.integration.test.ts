import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { CompanyService } from '../../src/modules/recruiters/companyService';
import { PlacementRepository } from '../../src/repositories/PlacementRepository';

describe('Recruiters & Companies Integration Tests', () => {
  const authService = new AuthService();
  const companyService = new CompanyService();
  const placementRepo = new PlacementRepository();

  let recruiterUserId = '';
  let registeredCompanyId = '';

  test('Setup: Create test user for recruiter onboarding', async () => {
    const unique = Date.now();
    const u = await authService.register({
      email: `recruiter_${unique}@techcorp.dev`,
      username: `recruiter_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'TechCorp Lead Recruiter',
    });
    recruiterUserId = u.user.id;
    assert.ok(recruiterUserId);
  });

  test('1. Register recruiter profile and onboard company', async () => {
    const unique = Date.now();
    const profile = await companyService.registerRecruiter(recruiterUserId, {
      companyName: `Apex Cloud Systems ${unique}`,
      title: 'Principal Technical Recruiter',
      department: 'Cloud & AI Infrastructure',
      linkedinUrl: 'https://linkedin.com/in/recruiter-apex',
      website: 'https://apexcloud.dev',
      industry: 'Cloud Computing & Distributed Systems',
    });

    assert.ok(profile);
    assert.strictEqual(profile.userId, recruiterUserId);
    assert.ok(profile.companyId);
    assert.strictEqual(profile.title, 'Principal Technical Recruiter');
    registeredCompanyId = profile.companyId;
  });

  test('2. Fetch company public profile and verify details', async () => {
    const company = await companyService.getCompany(registeredCompanyId);

    assert.ok(company);
    assert.strictEqual(company.id, registeredCompanyId);
    assert.ok(company.name.startsWith('Apex Cloud Systems'));
    assert.ok(company.slug);
    assert.strictEqual(company.website, 'https://apexcloud.dev');
  });

  test('3. List verified companies with search filter', async () => {
    const companies = await companyService.listCompanies('Apex', false);

    assert.ok(Array.isArray(companies));
    assert.ok(companies.length >= 1);
    const found = companies.find(c => c.id === registeredCompanyId);
    assert.ok(found, 'Newly registered company should be discoverable via search');
  });

  test('4. Retrieve logged-in recruiter profile and department details', async () => {
    const profile = await companyService.getRecruiterProfile(recruiterUserId);

    assert.ok(profile);
    assert.strictEqual(profile.userId, recruiterUserId);
    assert.strictEqual(profile.companyId, registeredCompanyId);
    assert.strictEqual(profile.department, 'Cloud & AI Infrastructure');
  });
});
