import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import { JobMatchingService } from './jobMatchingService';
import {
  JobPostingDto,
  CreateJobPostingDto,
  UpdateJobPostingDto,
  JobFilterQueryDto,
  JobRecommendationDto,
  JobMatchScoreDto,
} from '@codeforge/shared';

export class JobPostingService {
  constructor(
    private placementRepo: IPlacementRepository = new PlacementRepository(),
    private matchingService: JobMatchingService = new JobMatchingService(),
  ) {}

  public async createJob(
    arg1: string,
    arg2: string | CreateJobPostingDto,
    arg3?: CreateJobPostingDto,
  ): Promise<JobPostingDto> {
    let companyId: string;
    let recruiterId: string;
    let dto: CreateJobPostingDto;

    if (typeof arg2 === 'object') {
      recruiterId = arg1;
      dto = arg2 as CreateJobPostingDto;
      const recruiter = await this.placementRepo.getRecruiterByUserId(recruiterId);
      if (!recruiter) {
        throw new Error('Unauthorized: Recruiter profile required to create job postings.');
      }
      companyId = recruiter.companyId;
    } else {
      companyId = arg1;
      recruiterId = arg2 as string;
      dto = arg3!;
    }

    return await this.placementRepo.createJobPosting(companyId, recruiterId, dto);
  }

  public async getJobById(id: string, candidateId?: string): Promise<JobPostingDto> {
    const job = await this.placementRepo.getJobPostingById(id);
    if (!job) {
      throw new Error(`Job posting with ID '${id}' not found.`);
    }

    if (candidateId) {
      try {
        const match = await this.matchingService.calculateJobMatch(candidateId, id);
        job.matchScore = match.overallScore;
        job.matchCategory = match.category;
      } catch {
        // Fallback without match score
      }
    }

    return job;
  }

  public async getJobBySlug(slug: string, candidateId?: string): Promise<JobPostingDto> {
    const job = await this.placementRepo.getJobPostingBySlug(slug);
    if (!job) {
      throw new Error(`Job posting with slug '${slug}' not found.`);
    }

    if (candidateId) {
      try {
        const match = await this.matchingService.calculateJobMatch(candidateId, job.id);
        job.matchScore = match.overallScore;
        job.matchCategory = match.category;
      } catch {
        // Fallback
      }
    }

    return job;
  }

  public async getJob(idOrSlug: string, candidateId?: string): Promise<JobPostingDto> {
    let job = await this.placementRepo.getJobPostingById(idOrSlug);
    if (!job) {
      job = await this.placementRepo.getJobPostingBySlug(idOrSlug);
    }
    if (!job) {
      throw new Error(`Job posting '${idOrSlug}' not found.`);
    }

    if (candidateId) {
      try {
        const match = await this.matchingService.calculateJobMatch(candidateId, job.id);
        job.matchScore = match.overallScore;
        job.matchCategory = match.category;
      } catch {
        // Fallback
      }
    }

    return job;
  }

  public async updateJob(
    arg1: string,
    arg2: string | UpdateJobPostingDto,
    arg3?: UpdateJobPostingDto,
  ): Promise<JobPostingDto> {
    let jobId: string;
    let dto: UpdateJobPostingDto;

    if (typeof arg2 === 'object') {
      jobId = arg1;
      dto = arg2 as UpdateJobPostingDto;
    } else {
      jobId = arg2 as string;
      dto = arg3!;
    }

    const updated = await this.placementRepo.updateJobPosting(jobId, dto);
    if (!updated) {
      throw new Error(`Job posting with ID '${jobId}' not found.`);
    }
    return updated;
  }

  public async listJobs(
    filters?: JobFilterQueryDto,
    candidateId?: string,
  ): Promise<{ jobs: JobPostingDto[]; total: number }> {
    const res = await this.placementRepo.listJobPostings(filters);

    if (candidateId && res.jobs.length > 0) {
      await Promise.all(
        res.jobs.map(async job => {
          try {
            const match = await this.matchingService.calculateJobMatch(candidateId, job.id);
            job.matchScore = match.overallScore;
            job.matchCategory = match.category;
          } catch {
            // Ignore
          }
        }),
      );

      if (filters?.sortBy === 'matchScore') {
        res.jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }
    }

    return res;
  }

  public async calculateMatch(candidateId: string, jobId: string): Promise<JobMatchScoreDto> {
    return await this.matchingService.calculateJobMatch(candidateId, jobId);
  }

  public async getRecommendedJobsForCandidate(
    candidateId: string,
    limit: number = 10,
  ): Promise<JobRecommendationDto[]> {
    const { jobs } = await this.placementRepo.listJobPostings({ limit: 50 });
    const scoredJobs: JobRecommendationDto[] = [];

    for (const job of jobs) {
      try {
        const match = await this.matchingService.calculateJobMatch(candidateId, job.id);
        job.matchScore = match.overallScore;
        job.matchCategory = match.category;
        scoredJobs.push({ job, match });
      } catch {
        // Ignore
      }
    }

    scoredJobs.sort((a, b) => b.match.overallScore - a.match.overallScore);
    return scoredJobs.slice(0, limit);
  }

  public async getRecommendedJobs(candidateId: string, limit: number = 10): Promise<JobRecommendationDto[]> {
    return await this.getRecommendedJobsForCandidate(candidateId, limit);
  }
}
