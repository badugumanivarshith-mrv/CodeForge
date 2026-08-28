import {
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
  UpdateUniversityDto,
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
  ExecutiveAnalyticsDto,
  OrgMemberRole,
} from '@codeforge/shared';

export interface IEnterpriseRepository {
  // Organizations
  createOrganization(data: CreateOrganizationDto): Promise<OrganizationDto>;
  getOrganizationById(id: string): Promise<OrganizationDto | null>;
  getOrganizationBySlug(slug: string): Promise<OrganizationDto | null>;
  listOrganizations(): Promise<OrganizationDto[]>;
  updateOrganization(id: string, data: UpdateOrganizationDto): Promise<OrganizationDto | null>;
  addOrganizationMember(orgId: string, data: AddOrgMemberDto): Promise<OrganizationMemberDto>;
  listOrganizationMembers(orgId: string): Promise<OrganizationMemberDto[]>;
  getMemberRole(orgId: string, userId: string): Promise<OrgMemberRole | null>;
  createDepartment(orgId: string, data: CreateDepartmentDto): Promise<DepartmentDto>;
  listDepartments(orgId: string): Promise<DepartmentDto[]>;
  createTeam(orgId: string, data: CreateTeamDto): Promise<TeamDto>;
  listTeams(orgId: string): Promise<TeamDto[]>;
  createCohort(orgId: string, data: CreateCohortDto): Promise<CohortDto>;
  listCohorts(orgId: string): Promise<CohortDto[]>;

  // Universities
  createUniversity(data: CreateUniversityDto): Promise<UniversityDto>;
  getUniversityById(id: string): Promise<UniversityDto | null>;
  getUniversityBySlug(slug: string): Promise<UniversityDto | null>;
  listUniversities(): Promise<UniversityDto[]>;
  updateUniversity(id: string, data: UpdateUniversityDto): Promise<UniversityDto | null>;
  createBatch(uniId: string, data: CreateBatchDto): Promise<BatchDto>;
  listBatches(uniId: string): Promise<BatchDto[]>;
  registerStudent(userId: string, data: RegisterStudentDto): Promise<StudentProfileDto>;
  getStudentByUserId(userId: string): Promise<StudentProfileDto | null>;
  getStudentById(studentId: string): Promise<StudentProfileDto | null>;
  listStudents(uniId?: string, batchId?: string): Promise<StudentProfileDto[]>;
  addAcademicRecord(studentId: string, data: { semester: number; sgpa: number; creditsCompleted?: number; backlogCount?: number; termDate?: string }): Promise<AcademicRecordDto>;
  getAcademicRecords(studentId: string): Promise<AcademicRecordDto[]>;
  createPlacementRecord(data: CreatePlacementRecordDto): Promise<PlacementRecordDto>;
  listPlacementRecords(uniId?: string): Promise<PlacementRecordDto[]>;
  getUniversityAnalytics(uniId: string): Promise<UniversityAnalyticsDto>;

  // Faculty & Mentors
  registerMentor(userId: string, data: RegisterMentorDto): Promise<MentorProfileDto>;
  getMentorByUserId(userId: string): Promise<MentorProfileDto | null>;
  getMentorById(mentorId: string): Promise<MentorProfileDto | null>;
  listMentors(orgId?: string): Promise<MentorProfileDto[]>;
  bookMentorSession(menteeUserId: string, data: BookMentorSessionDto): Promise<FacultyMentorSessionDto>;
  listMentorSessions(mentorId?: string, menteeUserId?: string): Promise<FacultyMentorSessionDto[]>;
  submitSessionFeedback(sessionId: string, data: SubmitSessionFeedbackDto): Promise<FacultyMentorSessionDto | null>;
  createStudentMentorship(mentorId: string, studentId: string, goals: string[]): Promise<StudentMentorshipDto>;
  listStudentMentorships(mentorId?: string, studentId?: string): Promise<StudentMentorshipDto[]>;

  // LMS & Certifications
  createCourse(data: CreateCourseDto): Promise<CourseDto>;
  getCourseById(id: string): Promise<CourseDto | null>;
  getCourseBySlug(slug: string): Promise<CourseDto | null>;
  listCourses(orgId?: string): Promise<CourseDto[]>;
  updateCourse(id: string, data: UpdateCourseDto): Promise<CourseDto | null>;
  createCourseModule(courseId: string, data: CreateCourseModuleDto): Promise<CourseModuleDto>;
  listCourseModules(courseId: string): Promise<CourseModuleDto[]>;
  enrollCourse(userId: string, courseId: string, cohortId?: string): Promise<CourseEnrollmentDto>;
  getUserEnrollments(userId: string): Promise<CourseEnrollmentDto[]>;
  updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<CourseEnrollmentDto | null>;
  createLearningPath(data: CreateLearningPathDto): Promise<LearningPathDto>;
  listLearningPaths(orgId?: string): Promise<LearningPathDto[]>;
  createCertificateTemplate(data: CreateCertificateTemplateDto): Promise<CertificateTemplateDto>;
  listCertificateTemplates(orgId?: string): Promise<CertificateTemplateDto[]>;
  issueCertification(data: IssueCertificationDto): Promise<CertificationDto>;
  getCertificationById(id: string): Promise<CertificationDto | null>;
  getCertificationByNumberOrHash(identifier: string): Promise<CertificationDto | null>;
  listUserCertifications(userId: string): Promise<CertificationDto[]>;
  verifyCertificate(identifier: string, ip?: string, userAgent?: string): Promise<CertificateVerificationResultDto>;
  revokeCertificate(id: string): Promise<boolean>;

  // Executive Analytics
  getExecutiveAnalytics(): Promise<ExecutiveAnalyticsDto>;
}
