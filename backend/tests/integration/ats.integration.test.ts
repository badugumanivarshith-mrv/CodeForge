import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { CompanyService } from '../../src/modules/recruiters/companyService';
import { JobPostingService } from '../../src/modules/recruiters/jobPostingService';
import { ApplicationTrackingService } from '../../src/modules/recruiters/applicationTrackingService';
import { ApplicationStage, JobType, WorkplaceType } from '@codeforge/shared';

describe('Application Tracking System (ATS) Integration Tests', () => {
  const authService = new AuthService();
  const companyService = new CompanyService();
  const jobService = new JobPostingService();
  const atsService = new ApplicationTrackingService();

  let recruiterUserId = '';
  let candidateUserId = '';
  let companyId = '';
  let jobId = '';
  let applicationId = '';

  test('Setup: Prepare recruiter, job posting, and candidate', async () => {
    const unique = Date.now();
    const recUser = await authService.register({
      email: `ats_recruiter_${unique}@uber.dev`,
      username: `ats_rec_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'ATS Lead Recruiter',
    });
    recruiterUserId = recUser.user.id;

    const candUser = await authService.register({
      email: `ats_candidate_${unique}@codeforge.dev`,
      username: `ats_cand_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'ATS Candidate Dev',
    });
    candidateUserId = candUser.user.id;

    const recruiterProf = await companyService.registerRecruiter(recruiterUserId, {
      companyName: `Uber Systems ${unique}`,
      title: 'Senior Technical Talent Partner',
      department: 'Core Mobility Engineering',
    });
    companyId = recruiterProf.companyId;

    const job = await jobService.createJob(recruiterUserId, {
      title: 'Distributed Real-Time Dispatch Engineer',
      description: 'Build real-time geofence dispatching engines.',
      requirements: 'Golang, gRPC, Distributed Systems, High Concurrency.',
      skillsRequired: ['Go', 'gRPC', 'Distributed Systems', 'Kafka'],
      jobType: JobType.FULL_TIME,
      workplaceType: WorkplaceType.HYBRID,
      location: 'San Francisco, CA',
      experienceLevel: 'Mid-Senior Level',
      targetRole: 'Backend Engineer',
    });
    jobId = job.id;
    assert.ok(jobId);
  });

  test('1. Submit job application with cover letter and profile references', async () => {
    const application = await atsService.applyForJob(candidateUserId, {
      jobId,
      coverLetter: 'I have built real-time pub-sub streaming systems in Golang with 100k msg/sec throughput.',
    });

    assert.ok(application);
    assert.ok(application.id);
    assert.strictEqual(application.jobId, jobId);
    assert.strictEqual(application.candidateId, candidateUserId);
    assert.strictEqual(application.stage, ApplicationStage.APPLIED);
    assert.ok(typeof application.matchScore === 'number');
    assert.ok(application.matchCategory);

    applicationId = application.id;
  });

  test('2. Prevent duplicate active applications for the same job posting', async () => {
    await assert.rejects(
      async () => {
        await atsService.applyForJob(candidateUserId, {
          jobId,
          coverLetter: 'Duplicate application attempt',
        });
      },
      (err: any) => {
        assert.ok(err.message.includes('already applied') || err.message.includes('Active application already exists'));
        return true;
      }
    );
  });

  test('3. Recruiter updates application stage through ATS stages', async () => {
    // Advance: APPLIED -> SCREENING
    const screenRes = await atsService.updateStage(recruiterUserId, applicationId, {
      stage: ApplicationStage.SCREENING,
      notes: 'Resume and Elo contest history verified by recruiter.',
    });
    assert.strictEqual(screenRes.stage, ApplicationStage.SCREENING);

    // Advance: SCREENING -> TECHNICAL_ROUND
    const techRes = await atsService.updateStage(recruiterUserId, applicationId, {
      stage: ApplicationStage.TECHNICAL_ROUND,
      notes: 'Passed initial recruiter screening. Moving to live coding round.',
    });
    assert.strictEqual(techRes.stage, ApplicationStage.TECHNICAL_ROUND);

    // Advance: TECHNICAL_ROUND -> OFFER
    const offerRes = await atsService.updateStage(recruiterUserId, applicationId, {
      stage: ApplicationStage.OFFER,
      notes: 'Strong hire recommendation across all technical scorecards.',
    });
    assert.strictEqual(offerRes.stage, ApplicationStage.OFFER);
  });

  test('4. Verify immutable application stage history timeline audit trail', async () => {
    const timeline = await atsService.getApplicationTimeline(applicationId);

    assert.ok(Array.isArray(timeline));
    assert.ok(timeline.length >= 3, `Expected at least 3 stage transitions, got ${timeline.length}`);

    // Verify sequential stage transitions
    const stagesLogged = timeline.map(t => t.toStage);
    assert.ok(stagesLogged.includes(ApplicationStage.SCREENING));
    assert.ok(stagesLogged.includes(ApplicationStage.TECHNICAL_ROUND));
    assert.ok(stagesLogged.includes(ApplicationStage.OFFER));

    for (const entry of timeline) {
      assert.strictEqual(entry.applicationId, applicationId);
      assert.ok(entry.changedAt);
      assert.ok(
        entry.changedByUserId === recruiterUserId || entry.changedByUserId === candidateUserId,
        `Expected changedByUserId to be recruiter or candidate, got ${entry.changedByUserId}`
      );
    }
  });

  test('5. Candidate views their own application pipeline and real-time stage status', async () => {
    const myApps = await atsService.getCandidateApplications(candidateUserId);

    assert.ok(Array.isArray(myApps));
    assert.ok(myApps.length >= 1);
    const found = myApps.find(a => a.id === applicationId);
    assert.ok(found);
    assert.strictEqual(found.stage, ApplicationStage.OFFER);
  });

  test('6. Recruiter fetches company application Kanban dataset', async () => {
    const companyApps = await atsService.getCompanyApplications(recruiterUserId, companyId);

    assert.ok(Array.isArray(companyApps));
    assert.ok(companyApps.length >= 1);
    const found = companyApps.find(a => a.id === applicationId);
    assert.ok(found);
    assert.strictEqual(found.companyId, companyId);
  });
});
