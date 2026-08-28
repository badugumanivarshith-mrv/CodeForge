import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import {
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
  CourseModuleDto,
  CreateCourseModuleDto,
  CourseEnrollmentDto,
  LearningPathDto,
  CreateLearningPathDto,
} from '@codeforge/shared';
import { logger } from '../../core/utils/logger';

export class LMSService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async createCourse(data: CreateCourseDto): Promise<CourseDto> {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Course title is required.');
    }
    const course = await this.enterpriseRepo.createCourse(data);
    logger.info({ courseId: course.id, title: course.title }, 'Course created successfully');
    return course;
  }

  async getCourse(idOrSlug: string): Promise<CourseDto | null> {
    const course = await this.enterpriseRepo.getCourseById(idOrSlug);
    if (course) return course;
    return this.enterpriseRepo.getCourseBySlug(idOrSlug);
  }

  async listCourses(orgId?: string): Promise<CourseDto[]> {
    return this.enterpriseRepo.listCourses(orgId);
  }

  async updateCourse(courseId: string, data: UpdateCourseDto): Promise<CourseDto | null> {
    return this.enterpriseRepo.updateCourse(courseId, data);
  }

  async addModule(courseId: string, data: CreateCourseModuleDto): Promise<CourseModuleDto> {
    if (!data.title) {
      throw new Error('Module title is required.');
    }
    return this.enterpriseRepo.createCourseModule(courseId, data);
  }

  async listModules(courseId: string): Promise<CourseModuleDto[]> {
    return this.enterpriseRepo.listCourseModules(courseId);
  }

  async enroll(userId: string, courseId: string, cohortId?: string): Promise<CourseEnrollmentDto> {
    return this.enterpriseRepo.enrollCourse(userId, courseId, cohortId);
  }

  async getUserEnrollments(userId: string): Promise<CourseEnrollmentDto[]> {
    return this.enterpriseRepo.getUserEnrollments(userId);
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<CourseEnrollmentDto | null> {
    return this.enterpriseRepo.updateEnrollmentProgress(enrollmentId, progress);
  }

  async createLearningPath(data: CreateLearningPathDto): Promise<LearningPathDto> {
    if (!data.title || !data.targetRole) {
      throw new Error('Learning path title and target role are required.');
    }
    return this.enterpriseRepo.createLearningPath(data);
  }

  async listLearningPaths(orgId?: string): Promise<LearningPathDto[]> {
    return this.enterpriseRepo.listLearningPaths(orgId);
  }
}

export const LmsService = LMSService;
export const lmsService = new LMSService();
