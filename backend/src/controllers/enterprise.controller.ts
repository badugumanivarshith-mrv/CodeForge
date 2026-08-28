import { Request, Response, NextFunction } from 'express';
import {
  organizationService,
  universityService,
  mentorService,
  lmsService,
  certificationService,
  workforceIntelligenceService,
  analyticsExecutiveService,
  adminCopilotService,
  whiteLabelService,
} from '../modules/enterprise';
import { ApiResponse } from '@codeforge/shared';

export class EnterpriseController {
  // ==========================================
  // Organizations
  // ==========================================

  async createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const org = await organizationService.createOrganization(req.body, userId);
      const response: ApiResponse = { success: true, data: org };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgs = await organizationService.listOrganizations();
      const response: ApiResponse = { success: true, data: orgs };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.getOrganization(req.params.idOrSlug);
      if (!org) {
        res.status(404).json({ success: false, error: 'Organization not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: org };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await organizationService.updateOrganization(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Organization not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: updated };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await organizationService.addMember(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: member };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const members = await organizationService.listMembers(req.params.id);
      const response: ApiResponse = { success: true, data: members };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dept = await organizationService.createDepartment(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: dept };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const depts = await organizationService.listDepartments(req.params.id);
      const response: ApiResponse = { success: true, data: depts };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await organizationService.createTeam(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: team };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teams = await organizationService.listTeams(req.params.id);
      const response: ApiResponse = { success: true, data: teams };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createCohort(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cohort = await organizationService.createCohort(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: cohort };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listCohorts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cohorts = await organizationService.listCohorts(req.params.id);
      const response: ApiResponse = { success: true, data: cohorts };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Universities & Students
  // ==========================================

  async createUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uni = await universityService.createUniversity(req.body);
      const response: ApiResponse = { success: true, data: uni };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listUniversities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const unis = await universityService.listUniversities();
      const response: ApiResponse = { success: true, data: unis };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uni = await universityService.getUniversity(req.params.idOrSlug);
      if (!uni) {
        res.status(404).json({ success: false, error: 'University not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: uni };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await universityService.updateUniversity(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'University not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: updated };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const batch = await universityService.createBatch(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: batch };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listBatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const batches = await universityService.listBatches(req.params.id);
      const response: ApiResponse = { success: true, data: batches };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async registerStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id || req.body.userId;
      const student = await universityService.registerStudent(userId, req.body);
      const response: ApiResponse = { success: true, data: student };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await universityService.getStudentById(req.params.id);
      if (!student) {
        res.status(404).json({ success: false, error: 'Student record not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: student };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uniId = req.query.universityId as string | undefined;
      const batchId = req.query.batchId as string | undefined;
      const students = await universityService.listStudents(uniId, batchId);
      const response: ApiResponse = { success: true, data: students };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addAcademicRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await universityService.addAcademicRecord(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: record };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAcademicRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await universityService.getAcademicRecords(req.params.id);
      const response: ApiResponse = { success: true, data: records };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async recordPlacement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await universityService.recordPlacement(req.body);
      const response: ApiResponse = { success: true, data: record };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listPlacements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uniId = req.query.universityId as string | undefined;
      const records = await universityService.listPlacementRecords(uniId);
      const response: ApiResponse = { success: true, data: records };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUniversityAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await universityService.getUniversityAnalytics(req.params.id);
      const response: ApiResponse = { success: true, data: analytics };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Faculty & Mentors
  // ==========================================

  async registerMentor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id || req.body.userId;
      const mentor = await mentorService.registerMentor(userId, req.body);
      const response: ApiResponse = { success: true, data: mentor };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listMentors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const mentors = await mentorService.listMentors(orgId);
      const response: ApiResponse = { success: true, data: mentors };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMentor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mentor = await mentorService.getMentorById(req.params.id);
      if (!mentor) {
        res.status(404).json({ success: false, error: 'Mentor not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: mentor };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async bookMentorSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menteeUserId = req.user?.userId || (req.user as any)?.id || req.body.menteeUserId;
      const session = await mentorService.bookSession(menteeUserId, req.body);
      const response: ApiResponse = { success: true, data: session };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listMentorSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mentorId = req.query.mentorId as string | undefined;
      const menteeUserId = req.query.menteeUserId as string | undefined;
      const sessions = await mentorService.listSessions(mentorId, menteeUserId);
      const response: ApiResponse = { success: true, data: sessions };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async submitSessionFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await mentorService.submitFeedback(req.params.id, req.body);
      if (!session) {
        res.status(404).json({ success: false, error: 'Session not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: session };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createStudentMentorship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { mentorId, studentId, goals } = req.body;
      const mentorship = await mentorService.createMentorship(mentorId, studentId, goals);
      const response: ApiResponse = { success: true, data: mentorship };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listStudentMentorships(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mentorId = req.query.mentorId as string | undefined;
      const studentId = req.query.studentId as string | undefined;
      const list = await mentorService.listMentorships(mentorId, studentId);
      const response: ApiResponse = { success: true, data: list };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // LMS & Courses
  // ==========================================

  async createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const course = await lmsService.createCourse(req.body);
      const response: ApiResponse = { success: true, data: course };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const courses = await lmsService.listCourses(orgId);
      const response: ApiResponse = { success: true, data: courses };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const course = await lmsService.getCourse(req.params.idOrSlug);
      if (!course) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: course };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await lmsService.updateCourse(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: updated };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addCourseModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await lmsService.addModule(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: mod };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listCourseModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mods = await lmsService.listModules(req.params.id);
      const response: ApiResponse = { success: true, data: mods };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async enrollCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id || req.body.userId;
      const { courseId, cohortId } = req.body;
      const enrollment = await lmsService.enroll(userId, courseId, cohortId);
      const response: ApiResponse = { success: true, data: enrollment };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserEnrollments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id || req.params.userId;
      const enrollments = await lmsService.getUserEnrollments(userId);
      const response: ApiResponse = { success: true, data: enrollments };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateEnrollmentProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { progress } = req.body;
      const updated = await lmsService.updateProgress(req.params.id, progress);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Enrollment record not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: updated };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createLearningPath(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const path = await lmsService.createLearningPath(req.body);
      const response: ApiResponse = { success: true, data: path };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listLearningPaths(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const paths = await lmsService.listLearningPaths(orgId);
      const response: ApiResponse = { success: true, data: paths };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Certifications
  // ==========================================

  async createCertificateTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const template = await certificationService.createTemplate(req.body);
      const response: ApiResponse = { success: true, data: template };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listCertificateTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const templates = await certificationService.listTemplates(orgId);
      const response: ApiResponse = { success: true, data: templates };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async issueCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cert = await certificationService.issueCertificate(req.body);
      const response: ApiResponse = { success: true, data: cert };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cert = await certificationService.getCertificate(req.params.id);
      if (!cert) {
        res.status(404).json({ success: false, error: 'Certificate not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: cert };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id || req.params.userId;
      const certs = await certificationService.listUserCertificates(userId);
      const response: ApiResponse = { success: true, data: certs };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async verifyCertificatePublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const identifier = req.params.identifier || (req.query.identifier as string);
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const result = await certificationService.verifyCertificate(identifier, ip, userAgent);
      const response: ApiResponse = { success: true, data: result };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async revokeCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await certificationService.revokeCertificate(req.params.id);
      const response: ApiResponse<{ revoked: boolean }> = { success: true, data: { revoked: success } };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Workforce Intelligence & Executive Analytics
  // ==========================================

  async getWorkforceIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeLearners = Number(req.query.activeLearners) || 480;
      const avgScore = Number(req.query.avgScore) || 84;
      const assessmentsPassed = Number(req.query.assessmentsPassed) || 390;
      const forecast = workforceIntelligenceService.generateForecast(activeLearners, avgScore, assessmentsPassed);
      const response: ApiResponse = { success: true, data: forecast };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getExecutiveDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await analyticsExecutiveService.getExecutiveDashboardMetrics();
      const response: ApiResponse = { success: true, data: metrics };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAdminCopilotInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const insights = adminCopilotService.getAdminInsights();
      const response: ApiResponse = { success: true, data: insights };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getWhiteLabelConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await whiteLabelService.getWhiteLabelConfig(req.params.orgIdOrSlug);
      if (!config) {
        res.status(404).json({ success: false, error: 'White label configuration not found' });
        return;
      }
      const response: ApiResponse = { success: true, data: config };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateWhiteLabelConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await whiteLabelService.updateWhiteLabelConfig(req.params.orgId, req.body);
      if (!config) {
        res.status(404).json({ success: false, error: 'Failed to update white label config' });
        return;
      }
      const response: ApiResponse = { success: true, data: config };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const enterpriseController = new EnterpriseController();
