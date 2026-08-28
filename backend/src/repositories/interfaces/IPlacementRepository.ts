import {
  CompanyDto,
  CreateCompanyDto,
  UpdateCompanyDto,
  RecruiterProfileDto,
  RegisterRecruiterDto,
  JobPostingDto,
  CreateJobPostingDto,
  UpdateJobPostingDto,
  JobFilterQueryDto,
  JobApplicationDto,
  CreateApplicationDto,
  UpdateApplicationStageDto,
  ApplicationStageHistoryDto,
  ReferralDto,
  CreateReferralDto,
  ReferralRequestDto,
  CreateReferralRequestDto,
  HiringChallengeDto,
  CreateHiringChallengeDto,
  HiringChallengeStandingDto,
  HiringInterviewDto,
  ScheduleInterviewDto,
  SubmitInterviewFeedbackDto,
  TalentAnalyticsDto,
  ApplicationStage,
  ReferralStatus,
} from '@codeforge/shared';

export interface IPlacementRepository {
  // Companies
  createCompany(dto: CreateCompanyDto): Promise<CompanyDto>;
  getCompanyById(id: string): Promise<CompanyDto | null>;
  getCompanyBySlug(slug: string): Promise<CompanyDto | null>;
  updateCompany(id: string, dto: UpdateCompanyDto): Promise<CompanyDto | null>;
  listCompanies(search?: string, isVerified?: boolean): Promise<CompanyDto[]>;

  // Recruiters
  createRecruiter(userId: string, companyId: string, title: string, department?: string, linkedinUrl?: string, isPrimary?: boolean): Promise<RecruiterProfileDto>;
  registerRecruiter(userId: string, companyId: string, dto: RegisterRecruiterDto): Promise<RecruiterProfileDto>;
  getRecruiterByUserId(userId: string): Promise<RecruiterProfileDto | null>;
  getRecruiterById(id: string): Promise<RecruiterProfileDto | null>;
  listRecruitersByCompany(companyId: string): Promise<RecruiterProfileDto[]>;

  // Job Postings
  createJobPosting(companyId: string, recruiterId: string, dto: CreateJobPostingDto): Promise<JobPostingDto>;
  getJobPostingById(id: string): Promise<JobPostingDto | null>;
  getJobPostingBySlug(slug: string): Promise<JobPostingDto | null>;
  updateJobPosting(id: string, dto: UpdateJobPostingDto): Promise<JobPostingDto | null>;
  listJobPostings(filters?: JobFilterQueryDto): Promise<{ jobs: JobPostingDto[]; total: number }>;

  // Applications
  createApplication(candidateId: string, dto: CreateApplicationDto, matchScore: number, matchCategory: any): Promise<JobApplicationDto>;
  getApplicationById(id: string): Promise<JobApplicationDto | null>;
  getApplicationByCandidateAndJob(candidateId: string, jobId: string): Promise<JobApplicationDto | null>;
  updateApplicationStage(applicationId: string, stage: ApplicationStage, changedByUserId: string, notes?: string, rejectionReason?: string): Promise<JobApplicationDto | null>;
  listApplicationsByCandidate(candidateId: string): Promise<JobApplicationDto[]>;
  listApplicationsByJob(jobId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]>;
  listApplicationsByCompany(companyId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]>;
  getApplicationTimeline(applicationId: string): Promise<ApplicationStageHistoryDto[]>;

  // Candidate Shortlists
  shortlistCandidate(companyId: string, recruiterId: string, candidateId: string, jobId?: string, notes?: string, tags?: string[]): Promise<any>;
  listShortlistsByCompany(companyId: string): Promise<any[]>;

  // Referrals
  createReferral(referrerId: string, dto: CreateReferralDto): Promise<ReferralDto>;
  listReferralsByCompany(companyId: string): Promise<ReferralDto[]>;
  listReferralsByReferrer(referrerId: string): Promise<ReferralDto[]>;
  updateReferralStatus(referralId: string, status: ReferralStatus, notes?: string): Promise<ReferralDto | null>;

  // Referral Requests
  createReferralRequest(candidateId: string, dto: CreateReferralRequestDto, targetCompanyId: string): Promise<ReferralRequestDto>;
  listReferralRequestsByCandidate(candidateId: string): Promise<ReferralRequestDto[]>;
  listReferralRequestsByCompany(companyId: string): Promise<ReferralRequestDto[]>;
  updateReferralRequestStatus(requestId: string, status: ReferralStatus): Promise<ReferralRequestDto | null>;

  // Hiring Challenges
  createHiringChallenge(companyId: string, recruiterId: string, dto: CreateHiringChallengeDto): Promise<HiringChallengeDto>;
  getHiringChallengeById(id: string): Promise<HiringChallengeDto | null>;
  listHiringChallenges(companyId?: string): Promise<HiringChallengeDto[]>;
  getHiringChallengeStandings(challengeId: string): Promise<HiringChallengeStandingDto[]>;

  // Hiring Interviews
  scheduleInterview(dto: ScheduleInterviewDto, interviewerId: string): Promise<HiringInterviewDto>;
  getInterviewById(id: string): Promise<HiringInterviewDto | null>;
  listInterviewsByApplication(applicationId: string): Promise<HiringInterviewDto[]>;
  listInterviewsByInterviewer(interviewerId: string): Promise<HiringInterviewDto[]>;
  listInterviewsByCompany(companyId: string): Promise<HiringInterviewDto[]>;
  submitInterviewFeedback(interviewId: string, dto: SubmitInterviewFeedbackDto): Promise<HiringInterviewDto | null>;

  // Talent Analytics
  getCompanyTalentAnalytics(companyId: string): Promise<TalentAnalyticsDto>;
}
