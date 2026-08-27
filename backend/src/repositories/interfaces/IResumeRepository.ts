import {
  ResumeDto,
  CreateResumeDto,
  UpdateResumeDto,
} from '@codeforge/shared';

export interface IResumeRepository {
  createResume(userId: string, data: CreateResumeDto): Promise<ResumeDto>;
  getResumeById(id: string): Promise<ResumeDto | null>;
  getResumesByUserId(userId: string): Promise<ResumeDto[]>;
  updateResume(id: string, userId: string, data: UpdateResumeDto): Promise<ResumeDto | null>;
  deleteResume(id: string, userId: string): Promise<boolean>;
}
