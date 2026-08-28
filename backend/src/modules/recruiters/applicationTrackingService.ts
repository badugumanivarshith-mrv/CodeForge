import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import { JobMatchingService } from './jobMatchingService';
import {
  JobApplicationDto,
  CreateApplicationDto,
  UpdateApplicationStageDto,
  ApplicationStageHistoryDto,
  ApplicationStage,
  MatchCategory,
} from '@codeforge/shared';

export class ApplicationTrackingService {
  constructor(
    private placementRepo: IPlacementRepository = new PlacementRepository(),
    private matchingService: JobMatchingService = new JobMatchingService(),
  ) {}

  public async applyForJob(candidateId: string, dto: CreateApplicationDto): Promise<JobApplicationDto> {
    const existing = await this.placementRepo.getApplicationByCandidateAndJob(candidateId, dto.jobId);
    if (existing) {
      throw new Error('You have already applied for this job posting. Active application already exists.');
    }

    let matchScore = 75;
    let matchCategory = MatchCategory.GOOD_MATCH;
    try {
      const match = await this.matchingService.calculateJobMatch(candidateId, dto.jobId);
      matchScore = match.overallScore;
      matchCategory = match.category;
    } catch {
      // Default match score
    }

    return await this.placementRepo.createApplication(candidateId, dto, matchScore, matchCategory);
  }

  public async getApplicationDetail(id: string): Promise<JobApplicationDto> {
    const app = await this.placementRepo.getApplicationById(id);
    if (!app) {
      throw new Error(`Application with ID '${id}' not found.`);
    }
    return app;
  }

  public async getApplicationById(id: string): Promise<JobApplicationDto> {
    return await this.getApplicationDetail(id);
  }

  public async updateStage(
    arg1: string,
    arg2: string | UpdateApplicationStageDto,
    arg3?: UpdateApplicationStageDto,
  ): Promise<JobApplicationDto> {
    let applicationId: string;
    let changedByUserId: string;
    let dto: UpdateApplicationStageDto;

    if (typeof arg2 === 'object') {
      applicationId = arg1;
      dto = arg2;
      changedByUserId = 'system';
    } else {
      changedByUserId = arg1;
      applicationId = arg2;
      dto = arg3!;
    }

    // Verify recruiter belongs to the company of the application
    if (changedByUserId !== 'system') {
      const recruiter = await this.placementRepo.getRecruiterByUserId(changedByUserId);
      if (!recruiter) {
        throw new Error('Unauthorized: Recruiter profile required to modify application stage.');
      }
      const app = await this.placementRepo.getApplicationById(applicationId);
      if (!app) {
        throw new Error(`Application with ID '${applicationId}' not found.`);
      }
      if (recruiter.companyId !== app.companyId) {
        throw new Error('Unauthorized: Recruiter does not belong to the hiring company for this application.');
      }
    }

    const updated = await this.placementRepo.updateApplicationStage(
      applicationId,
      dto.stage,
      changedByUserId,
      dto.notes,
      dto.rejectionReason,
    );

    if (!updated) {
      throw new Error(`Application with ID '${applicationId}' not found.`);
    }
    return updated;
  }

  public async getCandidateApplications(candidateId: string): Promise<JobApplicationDto[]> {
    return await this.placementRepo.listApplicationsByCandidate(candidateId);
  }

  public async listCandidateApplications(candidateId: string): Promise<JobApplicationDto[]> {
    return await this.placementRepo.listApplicationsByCandidate(candidateId);
  }

  public async listJobApplications(jobId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]> {
    return await this.placementRepo.listApplicationsByJob(jobId, stage);
  }

  public async getCompanyApplications(
    recruiterUserId: string,
    companyId: string,
    stage?: ApplicationStage,
  ): Promise<JobApplicationDto[]> {
    const recruiter = await this.placementRepo.getRecruiterByUserId(recruiterUserId);
    if (!recruiter || recruiter.companyId !== companyId) {
      throw new Error('Unauthorized: Recruiter is not authorized to view applications for this company.');
    }
    return await this.placementRepo.listApplicationsByCompany(companyId, stage);
  }

  public async listCompanyApplications(companyId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]> {
    return await this.placementRepo.listApplicationsByCompany(companyId, stage);
  }

  public async getApplicationTimeline(applicationId: string): Promise<ApplicationStageHistoryDto[]> {
    return await this.placementRepo.getApplicationTimeline(applicationId);
  }

  public async getTimeline(applicationId: string): Promise<ApplicationStageHistoryDto[]> {
    return await this.placementRepo.getApplicationTimeline(applicationId);
  }
}
