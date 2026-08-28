import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { CompanyService } from '../../src/modules/recruiters/companyService';
import { JobPostingService } from '../../src/modules/recruiters/jobPostingService';
import { ApplicationTrackingService } from '../../src/modules/recruiters/applicationTrackingService';
import { InterviewPipelineService } from '../../src/modules/recruiters/interviewPipelineService';
import {
  ApplicationStage,
  JobType,
  WorkplaceType,
  HiringInterviewType,
  OfferRecommendation,
} from '@codeforge/shared';

describe('Phase 10: Placement Security & Authorization Hardening Tests', () => {
  const authService = new AuthService();
  const companyService = new CompanyService();
  const jobService = new JobPostingService();
  const atsService = new ApplicationTrackingService();
  const pipelineService = new InterviewPipelineService();

  let recruiterAId = '';
  let recruiterBId = '';
  let candidateAId = '';
  let candidateBId = '';
  let companyAId = '';
  let companyBId = '';
  let jobAId = '';
  let applicationAId = '';
  let interviewAId = '';

  test('Setup: Provision isolated recruiters and candidates', async () => {
    const unique = Date.now();

    // Recruiter A (Company Alpha)
    const recA = await authService.register({
      email: `sec_rec_a_${unique}@alpha.dev`,
      username: `sec_rec_a_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Alpha Recruiter',
    });
    recruiterAId = recA.user.id;
    const profA = await companyService.registerRecruiter(recruiterAId, {
      companyName: `Alpha Corp ${unique}`,
      title: 'Senior Recruiter',
    });
    companyAId = profA.companyId;

    // Recruiter B (Company Beta)
    const recB = await authService.register({
      email: `sec_rec_b_${unique}@beta.dev`,
      username: `sec_rec_b_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Beta Recruiter',
    });
    recruiterBId = recB.user.id;
    const profB = await companyService.registerRecruiter(recruiterBId, {
      companyName: `Beta Corp ${unique}`,
      title: 'Senior Recruiter',
    });
    companyBId = profB.companyId;

    // Candidate A & B
    const candA = await authService.register({
      email: `sec_cand_a_${unique}@codeforge.dev`,
      username: `sec_cand_a_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Candidate Alice',
    });
    candidateAId = candA.user.id;

    const candB = await authService.register({
      email: `sec_cand_b_${unique}@codeforge.dev`,
      username: `sec_cand_b_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Candidate Bob',
    });
    candidateBId = candB.user.id;

    // Company A creates Job A
    const jobA = await jobService.createJob(recruiterAId, {
      title: 'Alpha Security Specialist',
      description: 'Zero trust security architecture.',
      requirements: 'Rust, Cryptography, OAuth2.',
      skillsRequired: ['Rust', 'Security', 'Cryptography'],
      jobType: JobType.FULL_TIME,
      workplaceType: WorkplaceType.REMOTE,
      experienceLevel: 'Senior Level',
      targetRole: 'Security Engineer',
    });
    jobAId = jobA.id;

    // Candidate A applies to Job A
    const appA = await atsService.applyForJob(candidateAId, {
      jobId: jobAId,
      coverLetter: 'Top secret credentials & security clearances.',
    });
    applicationAId = appA.id;

    // Recruiter A schedules Interview A
    const interviewA = await pipelineService.scheduleInterview(recruiterAId, {
      applicationId: applicationAId,
      interviewType: HiringInterviewType.TECHNICAL,
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      durationMinutes: 45,
    });
    interviewAId = interviewA.id;
  });

  test('1. Recruiter Isolation: Recruiter B cannot view or modify Company A applications', async () => {
    // Recruiter B attempts to view Company A applications
    await assert.rejects(
      async () => {
        await atsService.getCompanyApplications(recruiterBId, companyAId);
      },
      (err: any) => {
        assert.ok(
          err.message.includes('Unauthorized') ||
            err.message.includes('not authorized') ||
            err.message.includes('belong') ||
            err.message.includes('Forbidden')
        );
        return true;
      }
    );

    // Recruiter B attempts to advance stage of Company A application
    await assert.rejects(
      async () => {
        await atsService.updateStage(recruiterBId, applicationAId, {
          stage: ApplicationStage.OFFER,
        });
      },
      (err: any) => {
        assert.ok(
          err.message.includes('Unauthorized') ||
            err.message.includes('not authorized') ||
            err.message.includes('Forbidden')
        );
        return true;
      }
    );
  });

  test('2. Candidate Data Privacy: Candidate B cannot access Candidate A application details', async () => {
    // Candidate B fetching own applications must NOT contain Application A
    const candBApps = await atsService.getCandidateApplications(candidateBId);
    const leakedApp = candBApps.find(a => a.id === applicationAId);
    assert.strictEqual(leakedApp, undefined, 'Candidate B must never see Candidate A application');
  });

  test('3. Unauthorized Stage Modification: Regular candidate cannot advance their own application stage', async () => {
    // Candidate A (not a recruiter for company A) attempts to advance stage
    await assert.rejects(
      async () => {
        await atsService.updateStage(candidateAId, applicationAId, {
          stage: ApplicationStage.HIRED,
        });
      },
      (err: any) => {
        assert.ok(
          err.message.includes('Unauthorized') ||
            err.message.includes('Recruiter profile required') ||
            err.message.includes('not authorized')
        );
        return true;
      }
    );
  });

  test('4. Interview Scorecard Protection: Unauthorized user cannot submit interview scorecards', async () => {
    // Candidate B attempts to submit feedback for Interview A
    await assert.rejects(
      async () => {
        await pipelineService.submitInterviewFeedback(candidateBId, interviewAId, {
          feedbackNotes: 'Malicious forged scorecard',
          technicalScore: 5,
          communicationScore: 5,
          problemSolvingScore: 5,
          recommendation: OfferRecommendation.STRONG_HIRE,
        });
      },
      (err: any) => {
        assert.ok(
          err.message.includes('Unauthorized') ||
            err.message.includes('Recruiter profile required') ||
            err.message.includes('not authorized')
        );
        return true;
      }
    );
  });
});
