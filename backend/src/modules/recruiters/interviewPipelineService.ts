import { IPlacementRepository } from '../../repositories/interfaces/IPlacementRepository';
import { PlacementRepository } from '../../repositories/PlacementRepository';
import {
  HiringInterviewDto,
  ScheduleInterviewDto,
  SubmitInterviewFeedbackDto,
  ApplicationStage,
} from '@codeforge/shared';

export class InterviewPipelineService {
  constructor(private placementRepo: IPlacementRepository = new PlacementRepository()) {}

  public async scheduleInterview(
    arg1: string | ScheduleInterviewDto,
    arg2?: ScheduleInterviewDto | string,
  ): Promise<HiringInterviewDto> {
    let dto: ScheduleInterviewDto;
    let interviewerId: string;

    if (typeof arg1 === 'string') {
      interviewerId = arg1;
      dto = arg2 as ScheduleInterviewDto;
    } else {
      dto = arg1 as ScheduleInterviewDto;
      interviewerId = (arg2 as string) || dto.interviewerId || 'system';
    }

    const interview = await this.placementRepo.scheduleInterview(dto, dto.interviewerId || interviewerId);

    // Automatically transition application stage to INTERVIEW
    try {
      const app = await this.placementRepo.getApplicationById(dto.applicationId);
      if (app && (app.stage === ApplicationStage.APPLIED || app.stage === ApplicationStage.SCREENING)) {
        await this.placementRepo.updateApplicationStage(
          dto.applicationId,
          ApplicationStage.INTERVIEW,
          interviewerId,
          `Interview scheduled: ${dto.interviewType}`,
        );
      }
    } catch {
      // Ignore
    }

    return interview;
  }

  public async schedule(dto: ScheduleInterviewDto, interviewerId: string): Promise<HiringInterviewDto> {
    return await this.scheduleInterview(interviewerId, dto);
  }

  public async getById(id: string): Promise<HiringInterviewDto> {
    const interview = await this.placementRepo.getInterviewById(id);
    if (!interview) {
      throw new Error(`Interview with ID '${id}' not found.`);
    }
    return interview;
  }

  public async getInterview(id: string): Promise<HiringInterviewDto> {
    return await this.getById(id);
  }

  public async listByApplication(applicationId: string): Promise<HiringInterviewDto[]> {
    return await this.placementRepo.listInterviewsByApplication(applicationId);
  }

  public async listByInterviewer(interviewerId: string): Promise<HiringInterviewDto[]> {
    return await this.placementRepo.listInterviewsByInterviewer(interviewerId);
  }

  public async listByCompany(companyId: string): Promise<HiringInterviewDto[]> {
    return await this.placementRepo.listInterviewsByCompany(companyId);
  }

  public async submitInterviewFeedback(
    arg1: string,
    arg2: string | SubmitInterviewFeedbackDto,
    arg3?: SubmitInterviewFeedbackDto,
  ): Promise<HiringInterviewDto> {
    let interviewId: string;
    let userId: string;
    let dto: SubmitInterviewFeedbackDto;

    if (typeof arg2 === 'object') {
      interviewId = arg1;
      dto = arg2;
      userId = 'system';
    } else {
      userId = arg1;
      interviewId = arg2;
      dto = arg3!;
    }

    if (userId !== 'system') {
      const recruiter = await this.placementRepo.getRecruiterByUserId(userId);
      const interview = await this.placementRepo.getInterviewById(interviewId);
      if (!interview) {
        throw new Error(`Interview with ID '${interviewId}' not found.`);
      }
      if (!recruiter || (recruiter.companyId !== interview.companyId && interview.interviewerId !== userId)) {
        throw new Error('Unauthorized: Recruiter profile required or user not authorized to submit feedback for this interview.');
      }
    }

    const updated = await this.placementRepo.submitInterviewFeedback(interviewId, dto);
    if (!updated) {
      throw new Error(`Interview with ID '${interviewId}' not found.`);
    }
    return updated;
  }

  public async submitFeedback(interviewId: string, dto: SubmitInterviewFeedbackDto): Promise<HiringInterviewDto> {
    return await this.submitInterviewFeedback(interviewId, dto);
  }
}
