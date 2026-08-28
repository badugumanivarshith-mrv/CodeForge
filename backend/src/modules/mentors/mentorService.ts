import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import {
  MentorProfileDto,
  RegisterMentorDto,
  FacultyMentorSessionDto,
  BookMentorSessionDto,
  SubmitSessionFeedbackDto,
  StudentMentorshipDto,
} from '@codeforge/shared';
import { logger } from '../../core/utils/logger';

export class MentorService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async registerMentor(userId: string, data: RegisterMentorDto): Promise<MentorProfileDto> {
    if (!data.bio) {
      throw new Error('Mentor bio is required.');
    }
    const mentor = await this.enterpriseRepo.registerMentor(userId, data);
    logger.info({ mentorId: mentor.id, userId }, 'Mentor profile registered successfully');
    return mentor;
  }

  async getMentorByUserId(userId: string): Promise<MentorProfileDto | null> {
    return this.enterpriseRepo.getMentorByUserId(userId);
  }

  async getMentorById(mentorId: string): Promise<MentorProfileDto | null> {
    return this.enterpriseRepo.getMentorById(mentorId);
  }

  async listMentors(orgId?: string): Promise<MentorProfileDto[]> {
    return this.enterpriseRepo.listMentors(orgId);
  }

  async bookSession(menteeUserId: string, data: BookMentorSessionDto): Promise<FacultyMentorSessionDto> {
    if (!data.mentorId || !data.topic || !data.scheduledAt) {
      throw new Error('Mentor ID, session topic, and schedule time are required.');
    }
    return this.enterpriseRepo.bookMentorSession(menteeUserId, data);
  }

  async listSessions(mentorId?: string, menteeUserId?: string): Promise<FacultyMentorSessionDto[]> {
    return this.enterpriseRepo.listMentorSessions(mentorId, menteeUserId);
  }

  async submitFeedback(sessionId: string, data: SubmitSessionFeedbackDto): Promise<FacultyMentorSessionDto | null> {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5 stars.');
    }
    return this.enterpriseRepo.submitSessionFeedback(sessionId, data);
  }

  async createMentorship(mentorId: string, studentId: string, goals: string[]): Promise<StudentMentorshipDto> {
    if (!mentorId || !studentId) {
      throw new Error('Mentor ID and Student ID are required.');
    }
    return this.enterpriseRepo.createStudentMentorship(mentorId, studentId, goals || []);
  }

  async listMentorships(mentorId?: string, studentId?: string): Promise<StudentMentorshipDto[]> {
    return this.enterpriseRepo.listStudentMentorships(mentorId, studentId);
  }
}

export const mentorService = new MentorService();
