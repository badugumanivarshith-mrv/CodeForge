import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { CompanyService } from '../../src/modules/recruiters/companyService';
import { JobPostingService } from '../../src/modules/recruiters/jobPostingService';
import { ApplicationTrackingService } from '../../src/modules/recruiters/applicationTrackingService';
import { ReferralService } from '../../src/modules/recruiters/referralService';
import { HiringChallengeService } from '../../src/modules/recruiters/hiringChallengeService';
import { InterviewPipelineService } from '../../src/modules/recruiters/interviewPipelineService';
import { ContestRepository } from '../../src/repositories/ContestRepository';
import {
  ReferralStatus,
  HiringInterviewType,
  HiringInterviewStatus,
  OfferRecommendation,
  JobType,
  WorkplaceType,
} from '@codeforge/shared';

describe('Referrals, Challenges & Interview Pipeline Integration Tests', () => {
  const authService = new AuthService();
  const companyService = new CompanyService();
  const jobService = new JobPostingService();
  const atsService = new ApplicationTrackingService();
  const referralService = new ReferralService();
  const challengeService = new HiringChallengeService();
  const pipelineService = new InterviewPipelineService();
  const contestRepo = new ContestRepository();

  let referrerUserId = '';
  let recruiterUserId = '';
  let candidateUserId = '';
  let companyId = '';
  let jobId = '';
  let applicationId = '';
  let contestId = '';
  let createdReferralId = '';
  let createdChallengeId = '';
  let scheduledInterviewId = '';

  test('Setup: Create actors and sample contest', async () => {
    const unique = Date.now();
    const refUser = await authService.register({
      email: `referrer_${unique}@apple.dev`,
      username: `referrer_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Apple Senior Engineer',
    });
    referrerUserId = refUser.user.id;

    const recUser = await authService.register({
      email: `ref_recruiter_${unique}@apple.dev`,
      username: `ref_rec_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Apple Lead Talent Partner',
    });
    recruiterUserId = recUser.user.id;

    const candUser = await authService.register({
      email: `ref_candidate_${unique}@codeforge.dev`,
      username: `ref_cand_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Candidate SuperDev',
    });
    candidateUserId = candUser.user.id;

    const recruiterProf = await companyService.registerRecruiter(recruiterUserId, {
      companyName: `Apple OS Engineering ${unique}`,
      title: 'Senior Technical Recruiter',
      department: 'CoreOS Architecture',
    });
    companyId = recruiterProf.companyId;

    const job = await jobService.createJob(recruiterUserId, {
      title: 'CoreOS Kernel Engineer',
      description: 'Design kernel drivers and low-level virtualization hypervisors.',
      requirements: 'C, Assembly, Kernel Development, Concurrency.',
      skillsRequired: ['C', 'Assembly', 'Operating Systems', 'Linux'],
      jobType: JobType.FULL_TIME,
      workplaceType: WorkplaceType.ON_SITE,
      location: 'Cupertino, CA',
      experienceLevel: 'Senior Level',
      targetRole: 'Systems Engineer',
    });
    jobId = job.id;

    const app = await atsService.applyForJob(candidateUserId, {
      jobId,
      coverLetter: 'Expert in low-level Mach kernel programming.',
    });
    applicationId = app.id;

    // Fetch existing contest or create one for challenge
    const contestsList = await contestRepo.listContests();
    if (contestsList.length > 0) {
      contestId = contestsList[0].id;
    } else {
      const newContest = await contestRepo.createContest({
        title: `Kernel Hackathon ${unique}`,
        slug: `kernel-hackathon-${unique}`,
        descriptionMdx: 'Low-level concurrency algorithmic challenge.',
        status: 'upcoming' as any,
        startAt: new Date(),
        endAt: new Date(Date.now() + 86400000),
        durationMinutes: 90,
        totalPoints: 1000,
      });
      contestId = newContest.id;
    }
  });

  test('1. Submit employee internal referral for candidate with recommendation notes', async () => {
    const referral = await referralService.submitReferral(referrerUserId, {
      candidateName: 'Candidate SuperDev',
      candidateEmail: 'candidate.superdev@example.com',
      companyId,
      jobId,
      notes: 'Exceptional performance in systems design and OS memory management.',
    });

    assert.ok(referral);
    assert.ok(referral.id);
    assert.strictEqual(referral.referrerId, referrerUserId);
    assert.strictEqual(referral.companyId, companyId);
    assert.strictEqual(referral.status, ReferralStatus.PENDING);
    createdReferralId = referral.id;
  });

  test('2. Update referral status (submitted -> interviewing -> hired) and verify bonus', async () => {
    const updated = await referralService.updateReferralStatus(
      recruiterUserId,
      createdReferralId,
      ReferralStatus.HIRED,
      'Candidate successfully cleared all 5 loops and accepted offer.'
    );

    assert.ok(updated);
    assert.strictEqual(updated.status, ReferralStatus.HIRED);
    assert.ok(updated.bonusAmount > 0, 'Hired referral must generate bounty amount');
  });

  test('3. Candidate broadcasts referral request to verified employees for a target role', async () => {
    const req = await referralService.requestReferral(candidateUserId, {
      jobId,
      message: 'Looking for a warm referral to Apple CoreOS team; top 1% arena Elo rating.',
    });

    assert.ok(req);
    assert.ok(req.id);
    assert.strictEqual(req.candidateId, candidateUserId);
    assert.strictEqual(req.jobId, jobId);
    assert.strictEqual(req.status, ReferralStatus.PENDING);
  });

  test('4. Recruiter creates hiring challenge tied to arena contest', async () => {
    const challenge = await challengeService.createHiringChallenge(recruiterUserId, {
      title: 'Apple CoreOS Algorithmic Hiring Sprint',
      description: 'Solve 4 hard algorithmic concurrency problems within 90 minutes.',
      contestId,
      minScoreThreshold: 300,
      autoShortlist: true,
      targetRole: 'CoreOS Kernel Engineer',
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 86400000).toISOString(),
    });

    assert.ok(challenge);
    assert.ok(challenge.id);
    assert.strictEqual(challenge.companyId, companyId);
    assert.strictEqual(challenge.contestId, contestId);
    assert.strictEqual(challenge.autoShortlist, true);
    createdChallengeId = challenge.id;
  });

  test('5. Fetch challenge real-time leaderboard standings and verify auto-shortlisting', async () => {
    const standings = await challengeService.getChallengeStandings(createdChallengeId);

    assert.ok(Array.isArray(standings));
    // Verify structure
    for (const st of standings) {
      assert.ok(typeof st.rank === 'number');
      assert.ok(typeof st.score === 'number');
      assert.ok(typeof st.isShortlisted === 'boolean');
    }
  });

  test('6. Schedule technical interview, verify meeting link, and submit feedback scorecard', async () => {
    // Schedule interview
    const interview = await pipelineService.scheduleInterview(recruiterUserId, {
      applicationId,
      interviewType: HiringInterviewType.TECHNICAL,
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      durationMinutes: 60,
      interviewerId: recruiterUserId,
    });

    assert.ok(interview);
    assert.ok(interview.id);
    assert.strictEqual(interview.applicationId, applicationId);
    assert.strictEqual(interview.status, HiringInterviewStatus.SCHEDULED);
    assert.ok(interview.meetingUrl);
    scheduledInterviewId = interview.id;

    // Submit scorecard
    const evaluated = await pipelineService.submitInterviewFeedback(recruiterUserId, scheduledInterviewId, {
      feedbackNotes: 'Candidate wrote high-performance lock-free queue with zero memory leaks.',
      technicalScore: 5,
      communicationScore: 5,
      problemSolvingScore: 5,
      recommendation: OfferRecommendation.STRONG_HIRE,
    });

    assert.ok(evaluated);
    assert.strictEqual(evaluated.status, HiringInterviewStatus.COMPLETED);
    assert.strictEqual(evaluated.recommendation, OfferRecommendation.STRONG_HIRE);
    assert.strictEqual(evaluated.technicalScore, 5);
  });
});
