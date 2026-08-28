import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import {
  UniversityDto,
  CreateUniversityDto,
  UpdateUniversityDto,
  BatchDto,
  CreateBatchDto,
  StudentProfileDto,
  RegisterStudentDto,
  AcademicRecordDto,
  PlacementRecordDto,
  CreatePlacementRecordDto,
  UniversityAnalyticsDto,
} from '@codeforge/shared';
import { logger } from '../../core/utils/logger';

export class UniversityService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async createUniversity(data: CreateUniversityDto): Promise<UniversityDto> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('University name is required.');
    }
    const uni = await this.enterpriseRepo.createUniversity(data);
    logger.info({ uniId: uni.id, name: uni.name }, 'University onboarded successfully');
    return uni;
  }

  async getUniversity(idOrSlug: string): Promise<UniversityDto | null> {
    const uni = await this.enterpriseRepo.getUniversityById(idOrSlug);
    if (uni) return uni;
    return this.enterpriseRepo.getUniversityBySlug(idOrSlug);
  }

  async listUniversities(): Promise<UniversityDto[]> {
    return this.enterpriseRepo.listUniversities();
  }

  async updateUniversity(uniId: string, data: UpdateUniversityDto): Promise<UniversityDto | null> {
    return this.enterpriseRepo.updateUniversity(uniId, data);
  }

  async createBatch(uniId: string, data: CreateBatchDto): Promise<BatchDto> {
    if (!data.name || !data.graduationYear) {
      throw new Error('Batch name and graduation year are required.');
    }
    return this.enterpriseRepo.createBatch(uniId, data);
  }

  async listBatches(uniId: string): Promise<BatchDto[]> {
    return this.enterpriseRepo.listBatches(uniId);
  }

  async registerStudent(userId: string, data: RegisterStudentDto): Promise<StudentProfileDto> {
    if (!data.universityId || !data.studentRollNumber) {
      throw new Error('University ID and Student Roll Number are required.');
    }
    return this.enterpriseRepo.registerStudent(userId, data);
  }

  async getStudentByUserId(userId: string): Promise<StudentProfileDto | null> {
    return this.enterpriseRepo.getStudentByUserId(userId);
  }

  async getStudentById(studentId: string): Promise<StudentProfileDto | null> {
    return this.enterpriseRepo.getStudentById(studentId);
  }

  async listStudents(uniId?: string, batchId?: string): Promise<StudentProfileDto[]> {
    return this.enterpriseRepo.listStudents(uniId, batchId);
  }

  async addAcademicRecord(
    studentId: string,
    data: { semester: number; sgpa: number; creditsCompleted?: number; backlogCount?: number; termDate?: string },
  ): Promise<AcademicRecordDto> {
    if (data.semester < 1 || data.sgpa < 0 || data.sgpa > 10) {
      throw new Error('Invalid academic semester or SGPA value (must be 0-10).');
    }
    return this.enterpriseRepo.addAcademicRecord(studentId, data);
  }

  async getAcademicRecords(studentId: string): Promise<AcademicRecordDto[]> {
    return this.enterpriseRepo.getAcademicRecords(studentId);
  }

  async recordPlacement(data: CreatePlacementRecordDto): Promise<PlacementRecordDto> {
    if (!data.studentId || !data.universityId || !data.companyName || !data.role) {
      throw new Error('Student ID, University ID, Company Name, and Role are required.');
    }
    return this.enterpriseRepo.createPlacementRecord(data);
  }

  async listPlacementRecords(uniId?: string): Promise<PlacementRecordDto[]> {
    return this.enterpriseRepo.listPlacementRecords(uniId);
  }

  async getUniversityAnalytics(uniId: string): Promise<UniversityAnalyticsDto> {
    return this.enterpriseRepo.getUniversityAnalytics(uniId);
  }
}

export const universityService = new UniversityService();
