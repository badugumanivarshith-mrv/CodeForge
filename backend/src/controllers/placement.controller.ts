import { Request, Response, NextFunction } from 'express';
import { PlacementRepository } from '../repositories/PlacementRepository';
import {
  CompanyService,
  JobPostingService,
  JobMatchingService,
  ApplicationTrackingService,
  CareerAdvisorService,
  ReferralService,
  HiringChallengeService,
  InterviewPipelineService,
  TalentAnalyticsService,
} from '../modules/recruiters';
import { sendSuccess } from '../core/utils/response';
import { ApplicationStage, ReferralStatus, UserRole } from '@codeforge/shared';

export class PlacementController {
  private placementRepo: PlacementRepository;
  private companyService: CompanyService;
  private jobService: JobPostingService;
  private matchingService: JobMatchingService;
  private atsService: ApplicationTrackingService;
  private careerAdvisorService: CareerAdvisorService;
  private referralService: ReferralService;
  private challengeService: HiringChallengeService;
  private interviewService: InterviewPipelineService;
  private analyticsService: TalentAnalyticsService;

  constructor() {
    this.placementRepo = new PlacementRepository();
    this.matchingService = new JobMatchingService();
    this.companyService = new CompanyService(this.placementRepo);
    this.jobService = new JobPostingService(this.placementRepo, this.matchingService);
    this.atsService = new ApplicationTrackingService(this.placementRepo, this.matchingService);
    this.careerAdvisorService = new CareerAdvisorService();
    this.referralService = new ReferralService(this.placementRepo);
    this.challengeService = new HiringChallengeService(this.placementRepo);
    this.interviewService = new InterviewPipelineService(this.placementRepo);
    this.analyticsService = new TalentAnalyticsService(this.placementRepo);
  }

  // ==========================================
  // Companies & Recruiters
  // ==========================================

  public createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comp = await this.companyService.createCompany(req.body);
      sendSuccess(res, comp, 201);
    } catch (err) {
      next(err);
    }
  };

  public getCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idOrSlug } = req.params;
      let comp;
      if (idOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        comp = await this.companyService.getCompanyById(idOrSlug);
      } else {
        comp = await this.companyService.getCompanyBySlug(idOrSlug);
      }
      sendSuccess(res, comp);
    } catch (err) {
      next(err);
    }
  };

  public updateCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const comp = await this.companyService.updateCompany(id, req.body);
      sendSuccess(res, comp);
    } catch (err) {
      next(err);
    }
  };

  public listCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const isVerified = req.query.isVerified !== undefined ? req.query.isVerified === 'true' : undefined;
      const comps = await this.companyService.listCompanies(search, isVerified);
      sendSuccess(res, comps);
    } catch (err) {
      next(err);
    }
  };

  public registerRecruiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const profile = await this.companyService.registerRecruiter(userId, req.body);
      sendSuccess(res, profile, 201);
    } catch (err) {
      next(err);
    }
  };

  public getRecruiterProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const profile = await this.companyService.getRecruiterProfile(userId);
      sendSuccess(res, profile);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // Job Postings
  // ==========================================

  public createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const recruiter = await this.placementRepo.getRecruiterByUserId(userId);
      if (!recruiter) {
        res.status(403).json({ success: false, error: 'User is not registered as a recruiter.' });
        return;
      }

      const job = await this.jobService.createJob(recruiter.companyId, recruiter.id, req.body);
      sendSuccess(res, job, 201);
    } catch (err) {
      next(err);
    }
  };

  public getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idOrSlug } = req.params;
      const candidateId = (req as any).user?.id;
      let job;
      if (idOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        job = await this.jobService.getJobById(idOrSlug, candidateId);
      } else {
        job = await this.jobService.getJobBySlug(idOrSlug, candidateId);
      }
      sendSuccess(res, job);
    } catch (err) {
      next(err);
    }
  };

  public updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await this.jobService.updateJob(id, req.body);
      sendSuccess(res, job);
    } catch (err) {
      next(err);
    }
  };

  public listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user?.id;
      const filters = {
        search: req.query.search as string,
        jobType: req.query.jobType as any,
        workplaceType: req.query.workplaceType as any,
        location: req.query.location as string,
        companyId: req.query.companyId as string,
        status: req.query.status as any,
        minMatchScore: req.query.minMatchScore ? Number(req.query.minMatchScore) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : 50,
        offset: req.query.offset ? Number(req.query.offset) : 0,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await this.jobService.listJobs(filters, candidateId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  public getRecommendedJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const recommended = await this.jobService.getRecommendedJobsForCandidate(candidateId, limit);
      sendSuccess(res, recommended);
    } catch (err) {
      next(err);
    }
  };

  public calculateJobMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const { jobId } = req.params;
      const match = await this.matchingService.calculateJobMatch(candidateId, jobId);
      sendSuccess(res, match);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // Applications & ATS
  // ==========================================

  public applyForJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const app = await this.atsService.applyForJob(candidateId, req.body);
      sendSuccess(res, app, 201);
    } catch (err) {
      next(err);
    }
  };

  public getApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const app = await this.atsService.getApplicationDetail(id);
      sendSuccess(res, app);
    } catch (err) {
      next(err);
    }
  };

  public updateStage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const app = await this.atsService.updateStage(id, userId, req.body);
      sendSuccess(res, app);
    } catch (err) {
      next(err);
    }
  };

  public listCandidateApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const apps = await this.atsService.listCandidateApplications(candidateId);
      sendSuccess(res, apps);
    } catch (err) {
      next(err);
    }
  };

  public listJobApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;
      const stage = req.query.stage as ApplicationStage | undefined;
      const apps = await this.atsService.listJobApplications(jobId, stage);
      sendSuccess(res, apps);
    } catch (err) {
      next(err);
    }
  };

  public listCompanyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;
      const stage = req.query.stage as ApplicationStage | undefined;
      const apps = await this.atsService.listCompanyApplications(companyId, stage);
      sendSuccess(res, apps);
    } catch (err) {
      next(err);
    }
  };

  public getTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const timeline = await this.atsService.getTimeline(id);
      sendSuccess(res, timeline);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // AI Career Advisor
  // ==========================================

  public getCareerAdvice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const targetRole = req.query.targetRole as string | undefined;
      const advice = await this.careerAdvisorService.generateCareerAdvice(candidateId, targetRole);
      sendSuccess(res, advice);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // Referrals
  // ==========================================

  public createReferral = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const referrerId = (req as any).user.id;
      const ref = await this.referralService.submitReferral(referrerId, req.body);
      sendSuccess(res, ref, 201);
    } catch (err) {
      next(err);
    }
  };

  public listMyReferrals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const refs = await this.referralService.listUserReferrals(userId);
      sendSuccess(res, refs);
    } catch (err) {
      next(err);
    }
  };

  public listCompanyReferrals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;
      const refs = await this.referralService.listCompanyReferrals(companyId);
      sendSuccess(res, refs);
    } catch (err) {
      next(err);
    }
  };

  public updateReferralStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const ref = await this.referralService.updateReferral(id, status as ReferralStatus, notes);
      sendSuccess(res, ref);
    } catch (err) {
      next(err);
    }
  };

  public requestReferral = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const request = await this.referralService.requestReferral(candidateId, req.body);
      sendSuccess(res, request, 201);
    } catch (err) {
      next(err);
    }
  };

  public listMyReferralRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = (req as any).user.id;
      const requests = await this.referralService.listCandidateReferralRequests(candidateId);
      sendSuccess(res, requests);
    } catch (err) {
      next(err);
    }
  };

  public listCompanyReferralRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;
      const requests = await this.referralService.listCompanyReferralRequests(companyId);
      sendSuccess(res, requests);
    } catch (err) {
      next(err);
    }
  };

  public updateReferralRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const request = await this.referralService.updateReferralRequest(id, status as ReferralStatus);
      sendSuccess(res, request);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // Hiring Challenges
  // ==========================================

  public createChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const recruiter = await this.placementRepo.getRecruiterByUserId(userId);
      if (!recruiter) {
        res.status(403).json({ success: false, error: 'User is not registered as a recruiter.' });
        return;
      }

      const challenge = await this.challengeService.createChallenge(recruiter.companyId, recruiter.id, req.body);
      sendSuccess(res, challenge, 201);
    } catch (err) {
      next(err);
    }
  };

  public getChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const challenge = await this.challengeService.getChallengeById(id);
      sendSuccess(res, challenge);
    } catch (err) {
      next(err);
    }
  };

  public listChallenges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.query.companyId as string | undefined;
      const challenges = await this.challengeService.listChallenges(companyId);
      sendSuccess(res, challenges);
    } catch (err) {
      next(err);
    }
  };

  public getChallengeStandings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const standings = await this.challengeService.getStandings(id);
      sendSuccess(res, standings);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // Interview Pipeline
  // ==========================================

  public scheduleInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const interviewerId = (req as any).user.id;
      const interview = await this.interviewService.schedule(req.body, interviewerId);
      sendSuccess(res, interview, 201);
    } catch (err) {
      next(err);
    }
  };

  public getInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const interview = await this.interviewService.getById(id);
      sendSuccess(res, interview);
    } catch (err) {
      next(err);
    }
  };

  public listApplicationInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const interviews = await this.interviewService.listByApplication(applicationId);
      sendSuccess(res, interviews);
    } catch (err) {
      next(err);
    }
  };

  public listCompanyInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;
      const interviews = await this.interviewService.listByCompany(companyId);
      sendSuccess(res, interviews);
    } catch (err) {
      next(err);
    }
  };

  public submitInterviewFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const interview = await this.interviewService.submitFeedback(id, req.body);
      sendSuccess(res, interview);
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // Talent Analytics
  // ==========================================

  public getTalentAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;
      const analytics = await this.analyticsService.getAnalytics(companyId);
      sendSuccess(res, analytics);
    } catch (err) {
      next(err);
    }
  };
}
