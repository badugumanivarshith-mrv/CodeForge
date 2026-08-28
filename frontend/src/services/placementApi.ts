import { apiClient } from './apiClient';
import {
  ApiResponse,
  CompanyDto,
  RecruiterProfileDto,
  RegisterRecruiterDto,
  JobPostingDto,
  CreateJobPostingDto,
  JobFilterQueryDto,
  JobMatchScoreDto,
  JobRecommendationDto,
  JobApplicationDto,
  CreateApplicationDto,
  UpdateApplicationStageDto,
  ApplicationStageHistoryDto,
  CareerAdvisorAnalysisDto,
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

export const placementApi = {
  // Companies & Recruiters
  async listCompanies(search?: string, isVerified?: boolean): Promise<CompanyDto[]> {
    const res = await apiClient.get<ApiResponse<CompanyDto[]>>('/companies', {
      params: { search, isVerified },
    });
    return res.data.data;
  },

  async getCompany(idOrSlug: string): Promise<CompanyDto> {
    const res = await apiClient.get<ApiResponse<CompanyDto>>(`/companies/${idOrSlug}`);
    return res.data.data;
  },

  async registerRecruiter(dto: RegisterRecruiterDto): Promise<RecruiterProfileDto> {
    const res = await apiClient.post<ApiResponse<RecruiterProfileDto>>('/companies/recruiter/register', dto);
    return res.data.data;
  },

  async getRecruiterProfile(): Promise<RecruiterProfileDto | null> {
    const res = await apiClient.get<ApiResponse<RecruiterProfileDto>>('/companies/recruiter/me');
    return res.data.data;
  },

  // Job Postings
  async listJobs(filters?: JobFilterQueryDto): Promise<{ jobs: JobPostingDto[]; total: number }> {
    const res = await apiClient.get<ApiResponse<{ jobs: JobPostingDto[]; total: number }>>('/jobs', {
      params: filters,
    });
    return res.data.data;
  },

  async getJob(idOrSlug: string): Promise<JobPostingDto> {
    const res = await apiClient.get<ApiResponse<JobPostingDto>>(`/jobs/${idOrSlug}`);
    return res.data.data;
  },

  async createJob(dto: CreateJobPostingDto): Promise<JobPostingDto> {
    const res = await apiClient.post<ApiResponse<JobPostingDto>>('/jobs', dto);
    return res.data.data;
  },

  async getRecommendedJobs(limit: number = 10): Promise<JobRecommendationDto[]> {
    const res = await apiClient.get<ApiResponse<JobRecommendationDto[]>>('/jobs/recommended', {
      params: { limit },
    });
    return res.data.data;
  },

  async calculateJobMatch(jobId: string): Promise<JobMatchScoreDto> {
    const res = await apiClient.get<ApiResponse<JobMatchScoreDto>>(`/jobs/${jobId}/match`);
    return res.data.data;
  },

  // Applications & ATS
  async applyForJob(dto: CreateApplicationDto): Promise<JobApplicationDto> {
    const res = await apiClient.post<ApiResponse<JobApplicationDto>>('/applications', dto);
    return res.data.data;
  },

  async getMyApplications(): Promise<JobApplicationDto[]> {
    const res = await apiClient.get<ApiResponse<JobApplicationDto[]>>('/applications/my');
    return res.data.data;
  },

  async getApplication(id: string): Promise<JobApplicationDto> {
    const res = await apiClient.get<ApiResponse<JobApplicationDto>>(`/applications/${id}`);
    return res.data.data;
  },

  async getJobApplications(jobId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]> {
    const res = await apiClient.get<ApiResponse<JobApplicationDto[]>>(`/applications/job/${jobId}`, {
      params: { stage },
    });
    return res.data.data;
  },

  async getCompanyApplications(companyId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]> {
    const res = await apiClient.get<ApiResponse<JobApplicationDto[]>>(`/applications/company/${companyId}`, {
      params: { stage },
    });
    return res.data.data;
  },

  async updateApplicationStage(id: string, dto: UpdateApplicationStageDto): Promise<JobApplicationDto> {
    const res = await apiClient.put<ApiResponse<JobApplicationDto>>(`/applications/${id}/stage`, dto);
    return res.data.data;
  },

  async getApplicationTimeline(id: string): Promise<ApplicationStageHistoryDto[]> {
    const res = await apiClient.get<ApiResponse<ApplicationStageHistoryDto[]>>(`/applications/${id}/timeline`);
    return res.data.data;
  },

  // AI Career Advisor
  async getCareerAdvice(targetRole?: string): Promise<CareerAdvisorAnalysisDto> {
    const res = await apiClient.get<ApiResponse<CareerAdvisorAnalysisDto>>('/advisor/advice', {
      params: { targetRole },
    });
    return res.data.data;
  },

  // Referrals
  async submitReferral(dto: CreateReferralDto): Promise<ReferralDto> {
    const res = await apiClient.post<ApiResponse<ReferralDto>>('/referrals', dto);
    return res.data.data;
  },

  async getMyReferrals(): Promise<ReferralDto[]> {
    const res = await apiClient.get<ApiResponse<ReferralDto[]>>('/referrals/my');
    return res.data.data;
  },

  async getCompanyReferrals(companyId: string): Promise<ReferralDto[]> {
    const res = await apiClient.get<ApiResponse<ReferralDto[]>>(`/referrals/company/${companyId}`);
    return res.data.data;
  },

  async updateReferralStatus(id: string, status: ReferralStatus, notes?: string): Promise<ReferralDto> {
    const res = await apiClient.put<ApiResponse<ReferralDto>>(`/referrals/${id}/status`, { status, notes });
    return res.data.data;
  },

  async requestReferral(dto: CreateReferralRequestDto): Promise<ReferralRequestDto> {
    const res = await apiClient.post<ApiResponse<ReferralRequestDto>>('/referrals/requests', dto);
    return res.data.data;
  },

  async getMyReferralRequests(): Promise<ReferralRequestDto[]> {
    const res = await apiClient.get<ApiResponse<ReferralRequestDto[]>>('/referrals/requests/my');
    return res.data.data;
  },

  async getCompanyReferralRequests(companyId: string): Promise<ReferralRequestDto[]> {
    const res = await apiClient.get<ApiResponse<ReferralRequestDto[]>>(`/referrals/requests/company/${companyId}`);
    return res.data.data;
  },

  // Hiring Challenges
  async listHiringChallenges(companyId?: string): Promise<HiringChallengeDto[]> {
    const res = await apiClient.get<ApiResponse<HiringChallengeDto[]>>('/hiring-challenges', {
      params: { companyId },
    });
    return res.data.data;
  },

  async getHiringChallenge(id: string): Promise<HiringChallengeDto> {
    const res = await apiClient.get<ApiResponse<HiringChallengeDto>>(`/hiring-challenges/${id}`);
    return res.data.data;
  },

  async createHiringChallenge(dto: CreateHiringChallengeDto): Promise<HiringChallengeDto> {
    const res = await apiClient.post<ApiResponse<HiringChallengeDto>>('/hiring-challenges', dto);
    return res.data.data;
  },

  async getHiringChallengeStandings(id: string): Promise<HiringChallengeStandingDto[]> {
    const res = await apiClient.get<ApiResponse<HiringChallengeStandingDto[]>>(`/hiring-challenges/${id}/standings`);
    return res.data.data;
  },

  // Interview Pipeline
  async scheduleInterview(dto: ScheduleInterviewDto): Promise<HiringInterviewDto> {
    const res = await apiClient.post<ApiResponse<HiringInterviewDto>>('/pipeline/schedule', dto);
    return res.data.data;
  },

  async getInterview(id: string): Promise<HiringInterviewDto> {
    const res = await apiClient.get<ApiResponse<HiringInterviewDto>>(`/pipeline/${id}`);
    return res.data.data;
  },

  async getApplicationInterviews(applicationId: string): Promise<HiringInterviewDto[]> {
    const res = await apiClient.get<ApiResponse<HiringInterviewDto[]>>(`/pipeline/application/${applicationId}`);
    return res.data.data;
  },

  async getCompanyInterviews(companyId: string): Promise<HiringInterviewDto[]> {
    const res = await apiClient.get<ApiResponse<HiringInterviewDto[]>>(`/pipeline/company/${companyId}`);
    return res.data.data;
  },

  async submitInterviewFeedback(interviewId: string, dto: SubmitInterviewFeedbackDto): Promise<HiringInterviewDto> {
    const res = await apiClient.post<ApiResponse<HiringInterviewDto>>(`/pipeline/${interviewId}/feedback`, dto);
    return res.data.data;
  },

  // Talent Analytics
  async getTalentAnalytics(companyId: string): Promise<TalentAnalyticsDto> {
    const res = await apiClient.get<ApiResponse<TalentAnalyticsDto>>(`/companies/${companyId}/analytics`);
    return res.data.data;
  },
};
