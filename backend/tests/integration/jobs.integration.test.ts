import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { CompanyService } from '../../src/modules/recruiters/companyService';
import { JobPostingService } from '../../src/modules/recruiters/jobPostingService';
import { JobType, WorkplaceType, JobPostingStatus } from '@codeforge/shared';

describe('Job Postings & AI Matching Integration Tests', () => {
  const authService = new AuthService();
  const companyService = new CompanyService();
  const jobService = new JobPostingService();

  let recruiterUserId = '';
  let candidateUserId = '';
  let companyId = '';
  let createdJobId = '';
  let createdJobSlug = '';

  test('Setup: Create recruiter and candidate test users', async () => {
    const unique = Date.now();
    const recUser = await authService.register({
      email: `job_recruiter_${unique}@nexus.dev`,
      username: `job_recruiter_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Nexus Lead Recruiter',
    });
    recruiterUserId = recUser.user.id;

    const candUser = await authService.register({
      email: `job_candidate_${unique}@codeforge.dev`,
      username: `job_candidate_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Nexus Candidate Engineer',
    });
    candidateUserId = candUser.user.id;

    const recruiterProf = await companyService.registerRecruiter(recruiterUserId, {
      companyName: `Nexus Distributed Systems ${unique}`,
      title: 'Head of Engineering Talent',
      department: 'Infrastructure',
    });
    companyId = recruiterProf.companyId;
    assert.ok(companyId);
  });

  test('1. Create new job posting as recruiter with skills, salary range, and type', async () => {
    const job = await jobService.createJob(recruiterUserId, {
      title: 'Senior Distributed Database Engineer',
      description: 'Design high-throughput distributed database engines and consensus algorithms.',
      requirements: '5+ years experience in C++/Rust, Raft/Paxos consensus, and LSM trees.',
      skillsRequired: ['C++', 'Rust', 'Distributed Systems', 'Raft', 'PostgreSQL'],
      jobType: JobType.FULL_TIME,
      workplaceType: WorkplaceType.REMOTE,
      location: 'Remote (Global)',
      minSalary: 160000,
      maxSalary: 210000,
      minRating: 1700,
      minAssessmentScore: 75,
      experienceLevel: 'Senior Level',
      targetRole: 'Systems Engineer',
    });

    assert.ok(job);
    assert.ok(job.id);
    assert.strictEqual(job.companyId, companyId);
    assert.strictEqual(job.title, 'Senior Distributed Database Engineer');
    assert.strictEqual(job.status, JobPostingStatus.ACTIVE);
    assert.strictEqual(job.skillsRequired.length, 5);

    createdJobId = job.id;
    createdJobSlug = job.slug;
  });

  test('2. List jobs with full-text search, workplace type, and employment filters', async () => {
    const listResult = await jobService.listJobs({
      search: 'Database',
      jobType: JobType.FULL_TIME,
      workplaceType: WorkplaceType.REMOTE,
    });

    assert.ok(listResult);
    assert.ok(Array.isArray(listResult.jobs));
    assert.ok(listResult.total >= 1);
    const found = listResult.jobs.find(j => j.id === createdJobId);
    assert.ok(found, 'Created job must match filter criteria');
  });

  test('3. Fetch job posting by ID and by URL slug', async () => {
    const byId = await jobService.getJob(createdJobId);
    assert.ok(byId);
    assert.strictEqual(byId.id, createdJobId);

    const bySlug = await jobService.getJob(createdJobSlug);
    assert.ok(bySlug);
    assert.strictEqual(bySlug.id, createdJobId);
  });

  test('4. Calculate real-time candidate AI match score for a job', async () => {
    const match = await jobService.calculateMatch(candidateUserId, createdJobId);

    assert.ok(match);
    assert.strictEqual(match.jobId, createdJobId);
    assert.strictEqual(match.candidateId, candidateUserId);
    assert.ok(typeof match.overallScore === 'number');
    assert.ok(match.overallScore >= 0 && match.overallScore <= 100);
    assert.ok(match.category);
    assert.ok(match.breakdown);
    assert.ok(Array.isArray(match.matchedSkills));
    assert.ok(Array.isArray(match.missingSkills));
  });

  test('5. Get personalized AI recommended jobs for a candidate', async () => {
    const recommendations = await jobService.getRecommendedJobs(candidateUserId, 5);

    assert.ok(Array.isArray(recommendations));
    assert.ok(recommendations.length >= 1);

    for (const rec of recommendations) {
      assert.ok(rec.job);
      assert.ok(rec.match);
      assert.ok(typeof rec.match.overallScore === 'number');
    }
  });

  test('6. Validate job posting status lifecycle and update', async () => {
    const updated = await jobService.updateJob(recruiterUserId, createdJobId, {
      status: JobPostingStatus.CLOSED,
    });

    assert.ok(updated);
    assert.strictEqual(updated.status, JobPostingStatus.CLOSED);

    // Reopen job for downstream tests
    const reopened = await jobService.updateJob(recruiterUserId, createdJobId, {
      status: JobPostingStatus.ACTIVE,
    });
    assert.strictEqual(reopened.status, JobPostingStatus.ACTIVE);
  });
});
