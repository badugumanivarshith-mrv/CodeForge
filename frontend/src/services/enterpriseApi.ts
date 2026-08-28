import { apiClient } from './apiClient';
import {
  ApiResponse,
  OrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationMemberDto,
  AddOrgMemberDto,
  DepartmentDto,
  CreateDepartmentDto,
  TeamDto,
  CreateTeamDto,
  CohortDto,
  CreateCohortDto,
  UniversityDto,
  CreateUniversityDto,
  BatchDto,
  CreateBatchDto,
  StudentProfileDto,
  RegisterStudentDto,
  AcademicRecordDto,
  PlacementRecordDto,
  CreatePlacementRecordDto,
  UniversityAnalyticsDto,
  MentorProfileDto,
  RegisterMentorDto,
  FacultyMentorSessionDto,
  BookMentorSessionDto,
  SubmitSessionFeedbackDto,
  StudentMentorshipDto,
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
  CourseModuleDto,
  CreateCourseModuleDto,
  CourseEnrollmentDto,
  LearningPathDto,
  CreateLearningPathDto,
  CertificateTemplateDto,
  CreateCertificateTemplateDto,
  CertificationDto,
  IssueCertificationDto,
  CertificateVerificationResultDto,
  WorkforceIntelligenceDto,
  ExecutiveAnalyticsDto,
  AdminCopilotInsightsDto,
  WhiteLabelConfigDto,
  UpdateWhiteLabelDto,
} from '@codeforge/shared';

export const enterpriseApi = {
  // ==========================================
  // Organizations
  // ==========================================
  async listOrganizations(): Promise<OrganizationDto[]> {
    const res = await apiClient.get<ApiResponse<OrganizationDto[]>>('/organizations');
    return res.data.data;
  },

  async createOrganization(data: CreateOrganizationDto): Promise<OrganizationDto> {
    const res = await apiClient.post<ApiResponse<OrganizationDto>>('/organizations', data);
    return res.data.data;
  },

  async getOrganization(idOrSlug: string): Promise<OrganizationDto> {
    const res = await apiClient.get<ApiResponse<OrganizationDto>>(`/organizations/${idOrSlug}`);
    return res.data.data;
  },

  async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<OrganizationDto> {
    const res = await apiClient.put<ApiResponse<OrganizationDto>>(`/organizations/${id}`, data);
    return res.data.data;
  },

  async listMembers(orgId: string): Promise<OrganizationMemberDto[]> {
    const res = await apiClient.get<ApiResponse<OrganizationMemberDto[]>>(`/organizations/${orgId}/members`);
    return res.data.data;
  },

  async addMember(orgId: string, data: AddOrgMemberDto): Promise<OrganizationMemberDto> {
    const res = await apiClient.post<ApiResponse<OrganizationMemberDto>>(`/organizations/${orgId}/members`, data);
    return res.data.data;
  },

  async listDepartments(orgId: string): Promise<DepartmentDto[]> {
    const res = await apiClient.get<ApiResponse<DepartmentDto[]>>(`/organizations/${orgId}/departments`);
    return res.data.data;
  },

  async createDepartment(orgId: string, data: CreateDepartmentDto): Promise<DepartmentDto> {
    const res = await apiClient.post<ApiResponse<DepartmentDto>>(`/organizations/${orgId}/departments`, data);
    return res.data.data;
  },

  async listTeams(orgId: string): Promise<TeamDto[]> {
    const res = await apiClient.get<ApiResponse<TeamDto[]>>(`/organizations/${orgId}/teams`);
    return res.data.data;
  },

  async createTeam(orgId: string, data: CreateTeamDto): Promise<TeamDto> {
    const res = await apiClient.post<ApiResponse<TeamDto>>(`/organizations/${orgId}/teams`, data);
    return res.data.data;
  },

  async listCohorts(orgId: string): Promise<CohortDto[]> {
    const res = await apiClient.get<ApiResponse<CohortDto[]>>(`/organizations/${orgId}/cohorts`);
    return res.data.data;
  },

  async createCohort(orgId: string, data: CreateCohortDto): Promise<CohortDto> {
    const res = await apiClient.post<ApiResponse<CohortDto>>(`/organizations/${orgId}/cohorts`, data);
    return res.data.data;
  },

  async getWhiteLabelBranding(orgIdOrSlug: string): Promise<WhiteLabelConfigDto> {
    const res = await apiClient.get<ApiResponse<WhiteLabelConfigDto>>(`/organizations/${orgIdOrSlug}/branding`);
    return res.data.data;
  },

  async updateWhiteLabelBranding(orgId: string, data: UpdateWhiteLabelDto): Promise<WhiteLabelConfigDto> {
    const res = await apiClient.put<ApiResponse<WhiteLabelConfigDto>>(`/organizations/${orgId}/branding`, data);
    return res.data.data;
  },

  // ==========================================
  // Universities & Students
  // ==========================================
  async listUniversities(): Promise<UniversityDto[]> {
    const res = await apiClient.get<ApiResponse<UniversityDto[]>>('/universities');
    return res.data.data;
  },

  async createUniversity(data: CreateUniversityDto): Promise<UniversityDto> {
    const res = await apiClient.post<ApiResponse<UniversityDto>>('/universities', data);
    return res.data.data;
  },

  async getUniversity(idOrSlug: string): Promise<UniversityDto> {
    const res = await apiClient.get<ApiResponse<UniversityDto>>(`/universities/${idOrSlug}`);
    return res.data.data;
  },

  async listBatches(uniId: string): Promise<BatchDto[]> {
    const res = await apiClient.get<ApiResponse<BatchDto[]>>(`/universities/${uniId}/batches`);
    return res.data.data;
  },

  async createBatch(uniId: string, data: CreateBatchDto): Promise<BatchDto> {
    const res = await apiClient.post<ApiResponse<BatchDto>>(`/universities/${uniId}/batches`, data);
    return res.data.data;
  },

  async listStudents(universityId?: string, batchId?: string): Promise<StudentProfileDto[]> {
    const res = await apiClient.get<ApiResponse<StudentProfileDto[]>>('/universities/students/list', {
      params: { universityId, batchId },
    });
    return res.data.data;
  },

  async registerStudent(data: RegisterStudentDto): Promise<StudentProfileDto> {
    const res = await apiClient.post<ApiResponse<StudentProfileDto>>('/universities/students/register', data);
    return res.data.data;
  },

  async getStudent(id: string): Promise<StudentProfileDto> {
    const res = await apiClient.get<ApiResponse<StudentProfileDto>>(`/universities/students/${id}`);
    return res.data.data;
  },

  async getAcademicRecords(studentId: string): Promise<AcademicRecordDto[]> {
    const res = await apiClient.get<ApiResponse<AcademicRecordDto[]>>(`/universities/students/${studentId}/academic-records`);
    return res.data.data;
  },

  async addAcademicRecord(
    studentId: string,
    data: { semester: number; sgpa: number; creditsCompleted?: number; backlogCount?: number; termDate?: string },
  ): Promise<AcademicRecordDto> {
    const res = await apiClient.post<ApiResponse<AcademicRecordDto>>(
      `/universities/students/${studentId}/academic-records`,
      data,
    );
    return res.data.data;
  },

  async listPlacements(universityId?: string): Promise<PlacementRecordDto[]> {
    const res = await apiClient.get<ApiResponse<PlacementRecordDto[]>>('/universities/placements/list', {
      params: { universityId },
    });
    return res.data.data;
  },

  async recordPlacement(data: CreatePlacementRecordDto): Promise<PlacementRecordDto> {
    const res = await apiClient.post<ApiResponse<PlacementRecordDto>>('/universities/placements/record', data);
    return res.data.data;
  },

  async getUniversityAnalytics(uniId: string): Promise<UniversityAnalyticsDto> {
    const res = await apiClient.get<ApiResponse<UniversityAnalyticsDto>>(`/universities/${uniId}/analytics`);
    return res.data.data;
  },

  // ==========================================
  // Faculty & Mentors
  // ==========================================
  async listMentors(organizationId?: string): Promise<MentorProfileDto[]> {
    const res = await apiClient.get<ApiResponse<MentorProfileDto[]>>('/faculty-mentors', {
      params: { organizationId },
    });
    return res.data.data;
  },

  async registerMentor(data: RegisterMentorDto): Promise<MentorProfileDto> {
    const res = await apiClient.post<ApiResponse<MentorProfileDto>>('/faculty-mentors/register', data);
    return res.data.data;
  },

  async getMentor(id: string): Promise<MentorProfileDto> {
    const res = await apiClient.get<ApiResponse<MentorProfileDto>>(`/faculty-mentors/${id}`);
    return res.data.data;
  },

  async listMentorSessions(mentorId?: string, menteeUserId?: string): Promise<FacultyMentorSessionDto[]> {
    const res = await apiClient.get<ApiResponse<FacultyMentorSessionDto[]>>('/faculty-mentors/sessions/list', {
      params: { mentorId, menteeUserId },
    });
    return res.data.data;
  },

  async bookMentorSession(data: BookMentorSessionDto): Promise<FacultyMentorSessionDto> {
    const res = await apiClient.post<ApiResponse<FacultyMentorSessionDto>>('/faculty-mentors/sessions/book', data);
    return res.data.data;
  },

  async submitSessionFeedback(sessionId: string, data: SubmitSessionFeedbackDto): Promise<FacultyMentorSessionDto> {
    const res = await apiClient.post<ApiResponse<FacultyMentorSessionDto>>(`/faculty-mentors/sessions/${sessionId}/feedback`, data);
    return res.data.data;
  },

  async listStudentMentorships(mentorId?: string, studentId?: string): Promise<StudentMentorshipDto[]> {
    const res = await apiClient.get<ApiResponse<StudentMentorshipDto[]>>('/faculty-mentors/mentorships/list', {
      params: { mentorId, studentId },
    });
    return res.data.data;
  },

  async createStudentMentorship(mentorId: string, studentId: string, goals: string[]): Promise<StudentMentorshipDto> {
    const res = await apiClient.post<ApiResponse<StudentMentorshipDto>>('/faculty-mentors/mentorships/create', {
      mentorId,
      studentId,
      goals,
    });
    return res.data.data;
  },

  // ==========================================
  // LMS & Courses
  // ==========================================
  async listCourses(organizationId?: string): Promise<CourseDto[]> {
    const res = await apiClient.get<ApiResponse<CourseDto[]>>('/lms/courses', {
      params: { organizationId },
    });
    return res.data.data;
  },

  async createCourse(data: CreateCourseDto): Promise<CourseDto> {
    const res = await apiClient.post<ApiResponse<CourseDto>>('/lms/courses', data);
    return res.data.data;
  },

  async getCourse(idOrSlug: string): Promise<CourseDto> {
    const res = await apiClient.get<ApiResponse<CourseDto>>(`/lms/courses/${idOrSlug}`);
    return res.data.data;
  },

  async updateCourse(id: string, data: UpdateCourseDto): Promise<CourseDto> {
    const res = await apiClient.put<ApiResponse<CourseDto>>(`/lms/courses/${id}`, data);
    return res.data.data;
  },

  async listCourseModules(courseId: string): Promise<CourseModuleDto[]> {
    const res = await apiClient.get<ApiResponse<CourseModuleDto[]>>(`/lms/courses/${courseId}/modules`);
    return res.data.data;
  },

  async addCourseModule(courseId: string, data: CreateCourseModuleDto): Promise<CourseModuleDto> {
    const res = await apiClient.post<ApiResponse<CourseModuleDto>>(`/lms/courses/${courseId}/modules`, data);
    return res.data.data;
  },

  async enrollCourse(courseId: string, cohortId?: string): Promise<CourseEnrollmentDto> {
    const res = await apiClient.post<ApiResponse<CourseEnrollmentDto>>('/lms/enroll', {
      courseId,
      cohortId,
    });
    return res.data.data;
  },

  async getUserEnrollments(userId: string): Promise<CourseEnrollmentDto[]> {
    const res = await apiClient.get<ApiResponse<CourseEnrollmentDto[]>>(`/lms/enrollments/user/${userId}`);
    return res.data.data;
  },

  async updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<CourseEnrollmentDto> {
    const res = await apiClient.put<ApiResponse<CourseEnrollmentDto>>(`/lms/enrollments/${enrollmentId}/progress`, {
      progress,
    });
    return res.data.data;
  },

  async listLearningPaths(organizationId?: string): Promise<LearningPathDto[]> {
    const res = await apiClient.get<ApiResponse<LearningPathDto[]>>('/lms/learning-paths', {
      params: { organizationId },
    });
    return res.data.data;
  },

  async createLearningPath(data: CreateLearningPathDto): Promise<LearningPathDto> {
    const res = await apiClient.post<ApiResponse<LearningPathDto>>('/lms/learning-paths', data);
    return res.data.data;
  },

  // ==========================================
  // Certifications
  // ==========================================
  async listCertificateTemplates(organizationId?: string): Promise<CertificateTemplateDto[]> {
    const res = await apiClient.get<ApiResponse<CertificateTemplateDto[]>>('/certifications/templates', {
      params: { organizationId },
    });
    return res.data.data;
  },

  async createCertificateTemplate(data: CreateCertificateTemplateDto): Promise<CertificateTemplateDto> {
    const res = await apiClient.post<ApiResponse<CertificateTemplateDto>>('/certifications/templates', data);
    return res.data.data;
  },

  async issueCertificate(data: IssueCertificationDto): Promise<CertificationDto> {
    const res = await apiClient.post<ApiResponse<CertificationDto>>('/certifications/issue', data);
    return res.data.data;
  },

  async getCertificate(id: string): Promise<CertificationDto> {
    const res = await apiClient.get<ApiResponse<CertificationDto>>(`/certifications/${id}`);
    return res.data.data;
  },

  async listUserCertificates(userId: string): Promise<CertificationDto[]> {
    const res = await apiClient.get<ApiResponse<CertificationDto[]>>(`/certifications/user/${userId}`);
    return res.data.data;
  },

  async verifyCertificatePublic(identifier: string): Promise<CertificateVerificationResultDto> {
    const res = await apiClient.get<ApiResponse<CertificateVerificationResultDto>>(
      `/certifications/public/verify/${identifier}`,
    );
    return res.data.data;
  },

  async revokeCertificate(id: string): Promise<boolean> {
    const res = await apiClient.post<ApiResponse<{ revoked: boolean }>>(`/certifications/${id}/revoke`);
    return res.data.data.revoked;
  },

  // ==========================================
  // Workforce Intelligence & Executive Analytics
  // ==========================================
  async getWorkforceIntelligence(activeLearners?: number): Promise<WorkforceIntelligenceDto> {
    const res = await apiClient.get<ApiResponse<WorkforceIntelligenceDto>>('/workforce-intelligence', {
      params: { activeLearners },
    });
    return res.data.data;
  },

  async getExecutiveAnalytics(): Promise<ExecutiveAnalyticsDto> {
    const res = await apiClient.get<ApiResponse<ExecutiveAnalyticsDto>>('/analytics-executive');
    return res.data.data;
  },

  async getAdminCopilotInsights(universityId?: string, organizationId?: string): Promise<AdminCopilotInsightsDto> {
    const res = await apiClient.get<ApiResponse<AdminCopilotInsightsDto>>('/admin-copilot/insights', {
      params: { universityId, organizationId },
    });
    return res.data.data;
  },
};
