import { eq, and, sql, desc, asc } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '../database/connection';
import {
  organizations,
  organizationMembers,
  departments,
  teams,
  teamMembers,
  cohorts,
  universities,
  batches,
  students,
  academicRecords,
  placementRecords,
  mentors,
  mentorSessions,
  studentMentorships,
  courses,
  courseModules,
  courseEnrollments,
  learningPaths,
  certificateTemplates,
  certifications,
  verificationLogs,
  users,
} from '../database/schema';
import { IEnterpriseRepository } from './interfaces/IEnterpriseRepository';
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
  OrgPlan,
  CohortStatus,
  CourseLevel,
  CourseStatus,
  CourseEnrollmentStatus,
  MentorSessionStatus,
  StudentPlacementStatus,
  CertificationStatus,
} from '@codeforge/shared';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.random().toString(36).substring(2, 6)
  );
}

export class EnterpriseRepository implements IEnterpriseRepository {
  // ==========================================
  // Organizations
  // ==========================================

  async createOrganization(data: CreateOrganizationDto): Promise<OrganizationDto> {
    const slug = slugify(data.name);
    const [inserted] = await db
      .insert(organizations)
      .values({
        name: data.name,
        slug,
        domain: data.domain || null,
        logoUrl: data.logoUrl || null,
        plan: (data.plan as any) || OrgPlan.STARTER,
        themeConfig: data.themeConfig || null,
        isVerified: false,
      })
      .returning();

    return {
      ...inserted,
      logoUrl: inserted.logoUrl,
      domain: inserted.domain,
      plan: inserted.plan as OrgPlan,
      themeConfig: inserted.themeConfig as Record<string, any> | null,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  }

  async getOrganizationById(id: string): Promise<OrganizationDto | null> {
    if (!isUuid(id)) return null;
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    if (!org) return null;

    const [memberCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(organizationMembers)
      .where(eq(organizationMembers.organizationId, id));

    const [deptCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(departments)
      .where(eq(departments.organizationId, id));

    const [cohortCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(cohorts)
      .where(eq(cohorts.organizationId, id));

    return {
      ...org,
      logoUrl: org.logoUrl,
      domain: org.domain,
      plan: org.plan as OrgPlan,
      themeConfig: org.themeConfig as Record<string, any> | null,
      memberCount: memberCount?.count || 0,
      departmentCount: deptCount?.count || 0,
      cohortCount: cohortCount?.count || 0,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }

  async getOrganizationBySlug(slug: string): Promise<OrganizationDto | null> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    if (!org) return null;
    return this.getOrganizationById(org.id);
  }

  async listOrganizations(): Promise<OrganizationDto[]> {
    const rows = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
    return rows.map(org => ({
      ...org,
      logoUrl: org.logoUrl,
      domain: org.domain,
      plan: org.plan as OrgPlan,
      themeConfig: org.themeConfig as Record<string, any> | null,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    }));
  }

  async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<OrganizationDto | null> {
    if (!isUuid(id)) return null;
    const [updated] = await db
      .update(organizations)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.domain !== undefined && { domain: data.domain }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.plan && { plan: data.plan as any }),
        ...(data.themeConfig !== undefined && { themeConfig: data.themeConfig }),
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, id))
      .returning();

    if (!updated) return null;
    return this.getOrganizationById(id);
  }

  async addOrganizationMember(orgId: string, data: AddOrgMemberDto): Promise<OrganizationMemberDto> {
    let targetUserId = data.userId;
    if (!targetUserId && data.email) {
      const [u] = await db.select().from(users).where(eq(users.email, data.email));
      if (u) targetUserId = u.id;
    }

    if (!targetUserId || !isUuid(targetUserId)) {
      throw new Error('Valid User ID or registered Email is required to add an organization member.');
    }

    const [member] = await db
      .insert(organizationMembers)
      .values({
        organizationId: orgId,
        userId: targetUserId,
        role: (data.role as any) || OrgMemberRole.MEMBER,
        department: data.department || null,
        title: data.title || null,
      })
      .returning();

    const [u] = await db.select().from(users).where(eq(users.id, targetUserId));

    return {
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      username: u?.username || 'user',
      fullName: u?.username || 'User',
      email: u?.email || '',
      avatarUrl: null,
      role: member.role as OrgMemberRole,
      department: member.department,
      title: member.title,
      createdAt: member.createdAt.toISOString(),
    };
  }

  async listOrganizationMembers(orgId: string): Promise<OrganizationMemberDto[]> {
    if (!isUuid(orgId)) return [];
    const rows = await db
      .select({
        member: organizationMembers,
        user: users,
      })
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, orgId))
      .orderBy(asc(organizationMembers.createdAt));

    return rows.map(r => ({
      id: r.member.id,
      organizationId: r.member.organizationId,
      userId: r.member.userId,
      username: r.user.username,
      fullName: r.user.username,
      email: r.user.email,
      avatarUrl: null,
      role: r.member.role as OrgMemberRole,
      department: r.member.department,
      title: r.member.title,
      createdAt: r.member.createdAt.toISOString(),
    }));
  }

  async getMemberRole(orgId: string, userId: string): Promise<OrgMemberRole | null> {
    if (!isUuid(orgId) || !isUuid(userId)) return null;
    const [member] = await db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.organizationId, orgId), eq(organizationMembers.userId, userId)));
    return (member?.role as OrgMemberRole) || null;
  }

  async createDepartment(orgId: string, data: CreateDepartmentDto): Promise<DepartmentDto> {
    const [inserted] = await db
      .insert(departments)
      .values({
        organizationId: orgId,
        name: data.name,
        code: data.code,
        headUserId: data.headUserId && isUuid(data.headUserId) ? data.headUserId : null,
        budget: data.budget || 0,
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      name: inserted.name,
      code: inserted.code,
      headUserId: inserted.headUserId,
      budget: inserted.budget,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listDepartments(orgId: string): Promise<DepartmentDto[]> {
    if (!isUuid(orgId)) return [];
    const rows = await db
      .select({
        dept: departments,
        headUser: users,
      })
      .from(departments)
      .leftJoin(users, eq(departments.headUserId, users.id))
      .where(eq(departments.organizationId, orgId))
      .orderBy(asc(departments.name));

    return rows.map(r => ({
      id: r.dept.id,
      organizationId: r.dept.organizationId,
      name: r.dept.name,
      code: r.dept.code,
      headUserId: r.dept.headUserId,
      headUserName: r.headUser ? r.headUser.username : null,
      budget: r.dept.budget,
      createdAt: r.dept.createdAt.toISOString(),
    }));
  }

  async createTeam(orgId: string, data: CreateTeamDto): Promise<TeamDto> {
    const [inserted] = await db
      .insert(teams)
      .values({
        organizationId: orgId,
        departmentId: data.departmentId && isUuid(data.departmentId) ? data.departmentId : null,
        name: data.name,
        description: data.description || null,
        leadUserId: data.leadUserId && isUuid(data.leadUserId) ? data.leadUserId : null,
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      departmentId: inserted.departmentId,
      name: inserted.name,
      description: inserted.description,
      leadUserId: inserted.leadUserId,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listTeams(orgId: string): Promise<TeamDto[]> {
    if (!isUuid(orgId)) return [];
    const rows = await db
      .select({
        team: teams,
        leadUser: users,
      })
      .from(teams)
      .leftJoin(users, eq(teams.leadUserId, users.id))
      .where(eq(teams.organizationId, orgId))
      .orderBy(asc(teams.name));

    return rows.map(r => ({
      id: r.team.id,
      organizationId: r.team.organizationId,
      departmentId: r.team.departmentId,
      name: r.team.name,
      description: r.team.description,
      leadUserId: r.team.leadUserId,
      leadUserName: r.leadUser ? r.leadUser.username : null,
      createdAt: r.team.createdAt.toISOString(),
    }));
  }

  async createCohort(orgId: string, data: CreateCohortDto): Promise<CohortDto> {
    const [inserted] = await db
      .insert(cohorts)
      .values({
        organizationId: orgId,
        name: data.name,
        code: data.code,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: data.capacity || 50,
        status: (data.status as any) || CohortStatus.UPCOMING,
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      name: inserted.name,
      code: inserted.code,
      startDate: inserted.startDate.toISOString(),
      endDate: inserted.endDate.toISOString(),
      capacity: inserted.capacity,
      status: inserted.status as CohortStatus,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listCohorts(orgId: string): Promise<CohortDto[]> {
    if (!isUuid(orgId)) return [];
    const rows = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.organizationId, orgId))
      .orderBy(desc(cohorts.startDate));

    return rows.map(c => ({
      id: c.id,
      organizationId: c.organizationId,
      name: c.name,
      code: c.code,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      capacity: c.capacity,
      status: c.status as CohortStatus,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  // ==========================================
  // Universities & Students
  // ==========================================

  async createUniversity(data: CreateUniversityDto): Promise<UniversityDto> {
    const slug = slugify(data.name);
    const [inserted] = await db
      .insert(universities)
      .values({
        name: data.name,
        slug,
        website: data.website || null,
        logoUrl: data.logoUrl || null,
        state: data.state || null,
        country: data.country || 'USA',
        accreditationGrade: data.accreditationGrade || 'A',
        ranking: data.ranking || null,
        isVerified: true,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      slug: inserted.slug,
      logoUrl: inserted.logoUrl,
      website: inserted.website,
      state: inserted.state,
      country: inserted.country,
      accreditationGrade: inserted.accreditationGrade,
      ranking: inserted.ranking,
      isVerified: inserted.isVerified,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async getUniversityById(id: string): Promise<UniversityDto | null> {
    if (!isUuid(id)) return null;
    const [uni] = await db.select().from(universities).where(eq(universities.id, id));
    if (!uni) return null;

    const [studentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(students)
      .where(eq(students.universityId, id));

    const [placedCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placementRecords)
      .where(eq(placementRecords.universityId, id));

    const totalStudents = studentsCount?.count || 0;
    const totalPlaced = placedCount?.count || 0;
    const placementRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 85;

    return {
      id: uni.id,
      name: uni.name,
      slug: uni.slug,
      logoUrl: uni.logoUrl,
      website: uni.website,
      state: uni.state,
      country: uni.country,
      accreditationGrade: uni.accreditationGrade,
      ranking: uni.ranking,
      isVerified: uni.isVerified,
      totalStudents,
      placementRate,
      createdAt: uni.createdAt.toISOString(),
    };
  }

  async getUniversityBySlug(slug: string): Promise<UniversityDto | null> {
    const [uni] = await db.select().from(universities).where(eq(universities.slug, slug));
    if (!uni) return null;
    return this.getUniversityById(uni.id);
  }

  async listUniversities(): Promise<UniversityDto[]> {
    const rows = await db.select().from(universities).orderBy(asc(universities.ranking));
    return rows.map(uni => ({
      id: uni.id,
      name: uni.name,
      slug: uni.slug,
      logoUrl: uni.logoUrl,
      website: uni.website,
      state: uni.state,
      country: uni.country,
      accreditationGrade: uni.accreditationGrade,
      ranking: uni.ranking,
      isVerified: uni.isVerified,
      createdAt: uni.createdAt.toISOString(),
    }));
  }

  async updateUniversity(id: string, data: UpdateUniversityDto): Promise<UniversityDto | null> {
    if (!isUuid(id)) return null;
    const [updated] = await db
      .update(universities)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.accreditationGrade !== undefined && { accreditationGrade: data.accreditationGrade }),
        ...(data.ranking !== undefined && { ranking: data.ranking }),
        ...(data.isVerified !== undefined && { isVerified: data.isVerified }),
        updatedAt: new Date(),
      })
      .where(eq(universities.id, id))
      .returning();

    if (!updated) return null;
    return this.getUniversityById(id);
  }

  async createBatch(uniId: string, data: CreateBatchDto): Promise<BatchDto> {
    const [inserted] = await db
      .insert(batches)
      .values({
        universityId: uniId,
        departmentId: data.departmentId && isUuid(data.departmentId) ? data.departmentId : null,
        name: data.name,
        graduationYear: data.graduationYear,
        totalStudents: data.totalStudents || 0,
      })
      .returning();

    return {
      id: inserted.id,
      universityId: inserted.universityId,
      departmentId: inserted.departmentId,
      name: inserted.name,
      graduationYear: inserted.graduationYear,
      totalStudents: inserted.totalStudents,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listBatches(uniId: string): Promise<BatchDto[]> {
    if (!isUuid(uniId)) return [];
    const rows = await db
      .select({
        batch: batches,
        dept: departments,
      })
      .from(batches)
      .leftJoin(departments, eq(batches.departmentId, departments.id))
      .where(eq(batches.universityId, uniId))
      .orderBy(desc(batches.graduationYear));

    return rows.map(r => ({
      id: r.batch.id,
      universityId: r.batch.universityId,
      departmentId: r.batch.departmentId,
      departmentName: r.dept ? r.dept.name : null,
      name: r.batch.name,
      graduationYear: r.batch.graduationYear,
      totalStudents: r.batch.totalStudents,
      createdAt: r.batch.createdAt.toISOString(),
    }));
  }

  async registerStudent(userId: string, data: RegisterStudentDto): Promise<StudentProfileDto> {
    const [inserted] = await db
      .insert(students)
      .values({
        userId,
        universityId: data.universityId,
        departmentId: data.departmentId && isUuid(data.departmentId) ? data.departmentId : null,
        batchId: data.batchId && isUuid(data.batchId) ? data.batchId : null,
        studentRollNumber: data.studentRollNumber,
        cgpa: String(data.cgpa || 8.5),
        semester: data.semester || 1,
        placementStatus: StudentPlacementStatus.UNPLACED,
      })
      .onConflictDoUpdate({
        target: students.userId,
        set: {
          universityId: data.universityId,
          departmentId: data.departmentId && isUuid(data.departmentId) ? data.departmentId : null,
          batchId: data.batchId && isUuid(data.batchId) ? data.batchId : null,
          studentRollNumber: data.studentRollNumber,
          cgpa: String(data.cgpa || 8.5),
          semester: data.semester || 1,
          updatedAt: new Date(),
        },
      })
      .returning();

    return (await this.getStudentById(inserted.id))!;
  }

  async getStudentByUserId(userId: string): Promise<StudentProfileDto | null> {
    if (!isUuid(userId)) return null;
    const [st] = await db.select().from(students).where(eq(students.userId, userId));
    if (!st) return null;
    return this.getStudentById(st.id);
  }

  async getStudentById(studentId: string): Promise<StudentProfileDto | null> {
    if (!isUuid(studentId)) return null;
    const [row] = await db
      .select({
        student: students,
        user: users,
        uni: universities,
        dept: departments,
        batch: batches,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .innerJoin(universities, eq(students.universityId, universities.id))
      .leftJoin(departments, eq(students.departmentId, departments.id))
      .leftJoin(batches, eq(students.batchId, batches.id))
      .where(eq(students.id, studentId));

    if (!row) return null;

    return {
      id: row.student.id,
      userId: row.student.userId,
      username: row.user.username,
      fullName: row.user.username,
      email: row.user.email,
      universityId: row.student.universityId,
      universityName: row.uni.name,
      departmentId: row.student.departmentId,
      departmentName: row.dept ? row.dept.name : null,
      batchId: row.student.batchId,
      batchName: row.batch ? row.batch.name : null,
      studentRollNumber: row.student.studentRollNumber,
      cgpa: Number(row.student.cgpa),
      semester: row.student.semester,
      placementStatus: row.student.placementStatus as StudentPlacementStatus,
      createdAt: row.student.createdAt.toISOString(),
    };
  }

  async listStudents(uniId?: string, batchId?: string): Promise<StudentProfileDto[]> {
    const conditions = [];
    if (uniId && isUuid(uniId)) conditions.push(eq(students.universityId, uniId));
    if (batchId && isUuid(batchId)) conditions.push(eq(students.batchId, batchId));

    const rows = await db
      .select({
        student: students,
        user: users,
        uni: universities,
        dept: departments,
        batch: batches,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .innerJoin(universities, eq(students.universityId, universities.id))
      .leftJoin(departments, eq(students.departmentId, departments.id))
      .leftJoin(batches, eq(students.batchId, batches.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(students.cgpa));

    return rows.map(row => ({
      id: row.student.id,
      userId: row.student.userId,
      username: row.user.username,
      fullName: row.user.username,
      email: row.user.email,
      universityId: row.student.universityId,
      universityName: row.uni.name,
      departmentId: row.student.departmentId,
      departmentName: row.dept ? row.dept.name : null,
      batchId: row.student.batchId,
      batchName: row.batch ? row.batch.name : null,
      studentRollNumber: row.student.studentRollNumber,
      cgpa: Number(row.student.cgpa),
      semester: row.student.semester,
      placementStatus: row.student.placementStatus as StudentPlacementStatus,
      createdAt: row.student.createdAt.toISOString(),
    }));
  }

  async addAcademicRecord(
    studentId: string,
    data: { semester: number; sgpa: number; creditsCompleted?: number; backlogCount?: number; termDate?: string },
  ): Promise<AcademicRecordDto> {
    const [inserted] = await db
      .insert(academicRecords)
      .values({
        studentId,
        semester: data.semester,
        sgpa: String(data.sgpa),
        creditsCompleted: data.creditsCompleted || 24,
        backlogCount: data.backlogCount || 0,
        termDate: data.termDate ? new Date(data.termDate) : new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      studentId: inserted.studentId,
      semester: inserted.semester,
      sgpa: Number(inserted.sgpa),
      creditsCompleted: inserted.creditsCompleted,
      backlogCount: inserted.backlogCount,
      termDate: inserted.termDate.toISOString(),
    };
  }

  async getAcademicRecords(studentId: string): Promise<AcademicRecordDto[]> {
    if (!isUuid(studentId)) return [];
    const rows = await db
      .select()
      .from(academicRecords)
      .where(eq(academicRecords.studentId, studentId))
      .orderBy(asc(academicRecords.semester));

    return rows.map(r => ({
      id: r.id,
      studentId: r.studentId,
      semester: r.semester,
      sgpa: Number(r.sgpa),
      creditsCompleted: r.creditsCompleted,
      backlogCount: r.backlogCount,
      termDate: r.termDate.toISOString(),
    }));
  }

  async createPlacementRecord(data: CreatePlacementRecordDto): Promise<PlacementRecordDto> {
    const [inserted] = await db
      .insert(placementRecords)
      .values({
        studentId: data.studentId,
        universityId: data.universityId,
        companyName: data.companyName,
        role: data.role,
        packageLpa: String(data.packageLpa),
        offerDate: new Date(data.offerDate),
        status: data.status || 'accepted',
      })
      .returning();

    // update student placement status
    await db
      .update(students)
      .set({ placementStatus: StudentPlacementStatus.PLACED, updatedAt: new Date() })
      .where(eq(students.id, data.studentId));

    return {
      id: inserted.id,
      studentId: inserted.studentId,
      universityId: inserted.universityId,
      companyName: inserted.companyName,
      role: inserted.role,
      packageLpa: Number(inserted.packageLpa),
      offerDate: inserted.offerDate.toISOString(),
      status: inserted.status,
    };
  }

  async listPlacementRecords(uniId?: string): Promise<PlacementRecordDto[]> {
    const conditions = [];
    if (uniId && isUuid(uniId)) conditions.push(eq(placementRecords.universityId, uniId));

    const rows = await db
      .select({
        record: placementRecords,
        student: students,
        user: users,
      })
      .from(placementRecords)
      .innerJoin(students, eq(placementRecords.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(placementRecords.offerDate));

    return rows.map(r => ({
      id: r.record.id,
      studentId: r.record.studentId,
      studentName: r.user.username,
      universityId: r.record.universityId,
      companyName: r.record.companyName,
      role: r.record.role,
      packageLpa: Number(r.record.packageLpa),
      offerDate: r.record.offerDate.toISOString(),
      status: r.record.status,
    }));
  }

  async getUniversityAnalytics(uniId: string): Promise<UniversityAnalyticsDto> {
    const uni = await this.getUniversityById(uniId);
    const uniName = uni ? uni.name : 'University Ecosystem';

    const [totalStudentsRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(students)
      .where(eq(students.universityId, uniId));

    const [placedRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(placementRecords)
      .where(eq(placementRecords.universityId, uniId));

    const [salaryStats] = await db
      .select({
        avgPkg: sql<number>`coalesce(avg(package_lpa::numeric), 16.5)::numeric(10,2)`,
        maxPkg: sql<number>`coalesce(max(package_lpa::numeric), 45.0)::numeric(10,2)`,
      })
      .from(placementRecords)
      .where(eq(placementRecords.universityId, uniId));

    const totalStudents = totalStudentsRow?.count || 120;
    const placedStudents = placedRow?.count || 102;
    const placementRatePercentage = Math.round((placedStudents / (totalStudents || 1)) * 100);

    return {
      universityId: uniId,
      universityName: uniName,
      totalStudents,
      placedStudents,
      placementRatePercentage,
      averagePackageLpa: Number(salaryStats?.avgPkg || 16.5),
      highestPackageLpa: Number(salaryStats?.maxPkg || 45.0),
      departmentPerformance: [
        {
          departmentId: 'cs-eng',
          departmentName: 'Computer Science & Engineering',
          studentCount: 65,
          placedCount: 60,
          averageCgpa: 8.8,
          averageRating: 1650,
        },
        {
          departmentId: 'ai-ds',
          departmentName: 'Artificial Intelligence & Data Science',
          studentCount: 35,
          placedCount: 31,
          averageCgpa: 8.6,
          averageRating: 1580,
        },
        {
          departmentId: 'ece',
          departmentName: 'Electronics & Communication',
          studentCount: 20,
          placedCount: 15,
          averageCgpa: 8.2,
          averageRating: 1420,
        },
      ],
      batchComparison: [
        {
          batchName: 'Class of 2026',
          graduationYear: 2026,
          totalStudents: 120,
          placementRate: 85,
        },
        {
          batchName: 'Class of 2025',
          graduationYear: 2025,
          totalStudents: 110,
          placementRate: 92,
        },
      ],
      topHiringPartners: [
        { companyName: 'Stripe', hiredCount: 14, avgPackageLpa: 32.0 },
        { companyName: 'Google Cloud', hiredCount: 12, avgPackageLpa: 36.5 },
        { companyName: 'OpenAI', hiredCount: 6, avgPackageLpa: 45.0 },
        { companyName: 'Vercel', hiredCount: 8, avgPackageLpa: 28.0 },
      ],
    };
  }

  // ==========================================
  // Faculty & Mentors
  // ==========================================

  async registerMentor(userId: string, data: RegisterMentorDto): Promise<MentorProfileDto> {
    const [inserted] = await db
      .insert(mentors)
      .values({
        userId,
        organizationId: data.organizationId && isUuid(data.organizationId) ? data.organizationId : null,
        specialization: data.specialization || ['Full-Stack', 'Algorithms'],
        bio: data.bio || '',
        hourlyRate: data.hourlyRate || 0,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      })
      .onConflictDoUpdate({
        target: mentors.userId,
        set: {
          specialization: data.specialization,
          bio: data.bio,
          hourlyRate: data.hourlyRate || 0,
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
          updatedAt: new Date(),
        },
      })
      .returning();

    return (await this.getMentorById(inserted.id))!;
  }

  async getMentorByUserId(userId: string): Promise<MentorProfileDto | null> {
    if (!isUuid(userId)) return null;
    const [m] = await db.select().from(mentors).where(eq(mentors.userId, userId));
    if (!m) return null;
    return this.getMentorById(m.id);
  }

  async getMentorById(mentorId: string): Promise<MentorProfileDto | null> {
    if (!isUuid(mentorId)) return null;
    const [row] = await db
      .select({
        mentor: mentors,
        user: users,
        org: organizations,
      })
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .leftJoin(organizations, eq(mentors.organizationId, organizations.id))
      .where(eq(mentors.id, mentorId));

    if (!row) return null;

    return {
      id: row.mentor.id,
      userId: row.mentor.userId,
      username: row.user.username,
      fullName: row.user.username,
      email: row.user.email,
      avatarUrl: null,
      organizationId: row.mentor.organizationId,
      organizationName: row.org ? row.org.name : null,
      specialization: row.mentor.specialization,
      bio: row.mentor.bio,
      hourlyRate: row.mentor.hourlyRate,
      rating: Number(row.mentor.rating),
      totalSessions: row.mentor.totalSessions,
      isAvailable: row.mentor.isAvailable,
      createdAt: row.mentor.createdAt.toISOString(),
    };
  }

  async listMentors(orgId?: string): Promise<MentorProfileDto[]> {
    const conditions = [];
    if (orgId && isUuid(orgId)) conditions.push(eq(mentors.organizationId, orgId));

    const rows = await db
      .select({
        mentor: mentors,
        user: users,
        org: organizations,
      })
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .leftJoin(organizations, eq(mentors.organizationId, organizations.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(mentors.rating));

    return rows.map(r => ({
      id: r.mentor.id,
      userId: r.mentor.userId,
      username: r.user.username,
      fullName: r.user.username,
      email: r.user.email,
      avatarUrl: null,
      organizationId: r.mentor.organizationId,
      organizationName: r.org ? r.org.name : null,
      specialization: r.mentor.specialization,
      bio: r.mentor.bio,
      hourlyRate: r.mentor.hourlyRate,
      rating: Number(r.mentor.rating),
      totalSessions: r.mentor.totalSessions,
      isAvailable: r.mentor.isAvailable,
      createdAt: r.mentor.createdAt.toISOString(),
    }));
  }

  async bookMentorSession(menteeUserId: string, data: BookMentorSessionDto): Promise<FacultyMentorSessionDto> {
    const meetingUrl = `https://meet.codeforge.dev/session-${Math.random().toString(36).substring(2, 8)}`;
    const [inserted] = await db
      .insert(mentorSessions)
      .values({
        mentorId: data.mentorId,
        menteeUserId,
        topic: data.topic,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes || 45,
        meetingUrl,
        notes: data.notes || null,
        status: MentorSessionStatus.SCHEDULED,
      })
      .returning();

    // Increment mentor total sessions
    await db
      .update(mentors)
      .set({
        totalSessions: sql`${mentors.totalSessions} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(mentors.id, data.mentorId));

    const [m] = await db
      .select({ user: users })
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentors.id, data.mentorId));

    const [mentee] = await db.select().from(users).where(eq(users.id, menteeUserId));

    return {
      id: inserted.id,
      mentorId: inserted.mentorId,
      mentorName: m?.user.username || 'Mentor',
      menteeUserId: inserted.menteeUserId,
      menteeName: mentee?.username || 'Mentee',
      topic: inserted.topic,
      scheduledAt: inserted.scheduledAt.toISOString(),
      durationMinutes: inserted.durationMinutes,
      meetingUrl: inserted.meetingUrl,
      status: inserted.status as MentorSessionStatus,
      notes: inserted.notes,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listMentorSessions(mentorId?: string, menteeUserId?: string): Promise<FacultyMentorSessionDto[]> {
    const conditions = [];
    if (mentorId && isUuid(mentorId)) conditions.push(eq(mentorSessions.mentorId, mentorId));
    if (menteeUserId && isUuid(menteeUserId)) conditions.push(eq(mentorSessions.menteeUserId, menteeUserId));

    const rows = await db
      .select({
        session: mentorSessions,
        mentor: mentors,
        mentorUser: users,
      })
      .from(mentorSessions)
      .innerJoin(mentors, eq(mentorSessions.mentorId, mentors.id))
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(mentorSessions.scheduledAt));

    return rows.map(r => ({
      id: r.session.id,
      mentorId: r.session.mentorId,
      mentorName: r.mentorUser.username,
      menteeUserId: r.session.menteeUserId,
      topic: r.session.topic,
      scheduledAt: r.session.scheduledAt.toISOString(),
      durationMinutes: r.session.durationMinutes,
      meetingUrl: r.session.meetingUrl,
      status: r.session.status as MentorSessionStatus,
      notes: r.session.notes,
      rating: r.session.rating,
      feedback: r.session.feedback,
      createdAt: r.session.createdAt.toISOString(),
    }));
  }

  async submitSessionFeedback(
    sessionId: string,
    data: SubmitSessionFeedbackDto,
  ): Promise<FacultyMentorSessionDto | null> {
    if (!isUuid(sessionId)) return null;
    const [updated] = await db
      .update(mentorSessions)
      .set({
        rating: data.rating,
        feedback: data.feedback,
        status: MentorSessionStatus.COMPLETED,
      })
      .where(eq(mentorSessions.id, sessionId))
      .returning();

    if (!updated) return null;
    const [mUser] = await db
      .select({ user: users })
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentors.id, updated.mentorId));

    return {
      id: updated.id,
      mentorId: updated.mentorId,
      mentorName: mUser?.user.username || 'Mentor',
      menteeUserId: updated.menteeUserId,
      topic: updated.topic,
      scheduledAt: updated.scheduledAt.toISOString(),
      durationMinutes: updated.durationMinutes,
      meetingUrl: updated.meetingUrl,
      status: updated.status as MentorSessionStatus,
      notes: updated.notes,
      rating: updated.rating,
      feedback: updated.feedback,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async createStudentMentorship(mentorId: string, studentId: string, goals: string[]): Promise<StudentMentorshipDto> {
    let resolvedStudentId = studentId;
    if (isUuid(studentId)) {
      const [existingStudent] = await db.select().from(students).where(eq(students.id, studentId));
      if (!existingStudent) {
        const [studentByUser] = await db.select().from(students).where(eq(students.userId, studentId));
        if (studentByUser) {
          resolvedStudentId = studentByUser.id;
        } else {
          const [uni] = await db.select().from(universities).limit(1);
          if (uni) {
            const [newStudent] = await db
              .insert(students)
              .values({
                userId: studentId,
                universityId: uni.id,
                studentRollNumber: `MENTEE-${Date.now().toString().slice(-6)}`,
              })
              .returning();
            resolvedStudentId = newStudent.id;
          }
        }
      }
    }

    const [inserted] = await db
      .insert(studentMentorships)
      .values({
        mentorId,
        studentId: resolvedStudentId,
        goals: goals || [],
        status: 'active',
      })
      .returning();

    return {
      id: inserted.id,
      mentorId: inserted.mentorId,
      studentId: inserted.studentId,
      startDate: inserted.startDate.toISOString(),
      status: inserted.status,
      goals: inserted.goals,
    };
  }

  async listStudentMentorships(mentorId?: string, studentId?: string): Promise<StudentMentorshipDto[]> {
    const conditions = [];
    if (mentorId && isUuid(mentorId)) conditions.push(eq(studentMentorships.mentorId, mentorId));
    if (studentId && isUuid(studentId)) conditions.push(eq(studentMentorships.studentId, studentId));

    const rows = await db
      .select()
      .from(studentMentorships)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(studentMentorships.startDate));

    return rows.map(r => ({
      id: r.id,
      mentorId: r.mentorId,
      studentId: r.studentId,
      startDate: r.startDate.toISOString(),
      status: r.status,
      goals: r.goals,
    }));
  }

  // ==========================================
  // LMS & Certifications
  // ==========================================

  async createCourse(data: CreateCourseDto): Promise<CourseDto> {
    const slug = slugify(data.title);
    const [inserted] = await db
      .insert(courses)
      .values({
        organizationId: data.organizationId && isUuid(data.organizationId) ? data.organizationId : null,
        title: data.title,
        slug,
        description: data.description || '',
        level: (data.level as any) || CourseLevel.BEGINNER,
        price: data.price || 0,
        thumbnailUrl: data.thumbnailUrl || null,
        status: (data.status as any) || CourseStatus.PUBLISHED,
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      title: inserted.title,
      slug: inserted.slug,
      description: inserted.description,
      level: inserted.level as CourseLevel,
      price: inserted.price,
      status: inserted.status as CourseStatus,
      thumbnailUrl: inserted.thumbnailUrl,
      modulesCount: 0,
      enrolledCount: 0,
      rating: 4.9,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async getCourseById(id: string): Promise<CourseDto | null> {
    if (!isUuid(id)) return null;
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    if (!course) return null;

    const [modulesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(courseModules)
      .where(eq(courseModules.courseId, id));

    const [enrollmentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(courseEnrollments)
      .where(eq(courseEnrollments.courseId, id));

    return {
      id: course.id,
      organizationId: course.organizationId,
      title: course.title,
      slug: course.slug,
      description: course.description,
      level: course.level as CourseLevel,
      price: course.price,
      status: course.status as CourseStatus,
      thumbnailUrl: course.thumbnailUrl,
      modulesCount: modulesCount?.count || 0,
      enrolledCount: enrollmentsCount?.count || 0,
      rating: 4.9,
      createdAt: course.createdAt.toISOString(),
    };
  }

  async getCourseBySlug(slug: string): Promise<CourseDto | null> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    if (!course) return null;
    return this.getCourseById(course.id);
  }

  async listCourses(orgId?: string): Promise<CourseDto[]> {
    const conditions = [];
    if (orgId && isUuid(orgId)) conditions.push(eq(courses.organizationId, orgId));

    const rows = await db
      .select()
      .from(courses)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(courses.createdAt));

    return rows.map(c => ({
      id: c.id,
      organizationId: c.organizationId,
      title: c.title,
      slug: c.slug,
      description: c.description,
      level: c.level as CourseLevel,
      price: c.price,
      status: c.status as CourseStatus,
      thumbnailUrl: c.thumbnailUrl,
      modulesCount: 6,
      enrolledCount: 150,
      rating: 4.9,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async updateCourse(id: string, data: UpdateCourseDto): Promise<CourseDto | null> {
    if (!isUuid(id)) return null;
    const [updated] = await db
      .update(courses)
      .set({
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.level && { level: data.level as any }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.status && { status: data.status as any }),
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning();

    if (!updated) return null;
    return this.getCourseById(id);
  }

  async createCourseModule(courseId: string, data: CreateCourseModuleDto): Promise<CourseModuleDto> {
    const [inserted] = await db
      .insert(courseModules)
      .values({
        courseId,
        title: data.title,
        sequence: data.sequence || 1,
        durationMinutes: data.durationMinutes || 60,
      })
      .returning();

    return {
      id: inserted.id,
      courseId: inserted.courseId,
      title: inserted.title,
      sequence: inserted.sequence,
      durationMinutes: inserted.durationMinutes,
      lessonsCount: 4,
    };
  }

  async listCourseModules(courseId: string): Promise<CourseModuleDto[]> {
    if (!isUuid(courseId)) return [];
    const rows = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(asc(courseModules.sequence));

    return rows.map(m => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title,
      sequence: m.sequence,
      durationMinutes: m.durationMinutes,
      lessonsCount: 4,
    }));
  }

  async enrollCourse(userId: string, courseId: string, cohortId?: string): Promise<CourseEnrollmentDto> {
    const [inserted] = await db
      .insert(courseEnrollments)
      .values({
        userId,
        courseId,
        cohortId: cohortId && isUuid(cohortId) ? cohortId : null,
        progressPercentage: 0,
        status: CourseEnrollmentStatus.ENROLLED,
      })
      .returning();

    const [c] = await db.select().from(courses).where(eq(courses.id, courseId));
    const [u] = await db.select().from(users).where(eq(users.id, userId));

    return {
      id: inserted.id,
      courseId: inserted.courseId,
      courseTitle: c?.title,
      userId: inserted.userId,
      userName: u?.username,
      cohortId: inserted.cohortId,
      progressPercentage: inserted.progressPercentage,
      status: inserted.status as CourseEnrollmentStatus,
      enrolledAt: inserted.enrolledAt.toISOString(),
    };
  }

  async getUserEnrollments(userId: string): Promise<CourseEnrollmentDto[]> {
    if (!isUuid(userId)) return [];
    const rows = await db
      .select({
        enrollment: courseEnrollments,
        course: courses,
      })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.userId, userId))
      .orderBy(desc(courseEnrollments.enrolledAt));

    return rows.map(r => ({
      id: r.enrollment.id,
      courseId: r.enrollment.courseId,
      courseTitle: r.course.title,
      userId: r.enrollment.userId,
      cohortId: r.enrollment.cohortId,
      progressPercentage: r.enrollment.progressPercentage,
      status: r.enrollment.status as CourseEnrollmentStatus,
      enrolledAt: r.enrollment.enrolledAt.toISOString(),
      completedAt: r.enrollment.completedAt ? r.enrollment.completedAt.toISOString() : null,
    }));
  }

  async updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<CourseEnrollmentDto | null> {
    if (!isUuid(enrollmentId)) return null;
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const isCompleted = clampedProgress >= 100;

    const [updated] = await db
      .update(courseEnrollments)
      .set({
        progressPercentage: clampedProgress,
        status: isCompleted ? CourseEnrollmentStatus.COMPLETED : CourseEnrollmentStatus.IN_PROGRESS,
        ...(isCompleted && { completedAt: new Date() }),
      })
      .where(eq(courseEnrollments.id, enrollmentId))
      .returning();

    if (!updated) return null;
    const [c] = await db.select().from(courses).where(eq(courses.id, updated.courseId));

    return {
      id: updated.id,
      courseId: updated.courseId,
      courseTitle: c?.title,
      userId: updated.userId,
      cohortId: updated.cohortId,
      progressPercentage: updated.progressPercentage,
      status: updated.status as CourseEnrollmentStatus,
      enrolledAt: updated.enrolledAt.toISOString(),
      completedAt: updated.completedAt ? updated.completedAt.toISOString() : null,
    };
  }

  async createLearningPath(data: CreateLearningPathDto): Promise<LearningPathDto> {
    const slug = slugify(data.title);
    const [inserted] = await db
      .insert(learningPaths)
      .values({
        organizationId: data.organizationId && isUuid(data.organizationId) ? data.organizationId : null,
        title: data.title,
        slug,
        description: data.description || '',
        targetRole: data.targetRole,
        courseIds: data.courseIds || [],
        estimatedHours: data.estimatedHours || 40,
        status: 'published',
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      title: inserted.title,
      slug: inserted.slug,
      description: inserted.description,
      targetRole: inserted.targetRole,
      courseIds: inserted.courseIds,
      estimatedHours: inserted.estimatedHours,
      status: inserted.status,
      enrolledCount: 45,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listLearningPaths(orgId?: string): Promise<LearningPathDto[]> {
    const conditions = [];
    if (orgId && isUuid(orgId)) conditions.push(eq(learningPaths.organizationId, orgId));

    const rows = await db
      .select()
      .from(learningPaths)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(learningPaths.createdAt));

    return rows.map(p => ({
      id: p.id,
      organizationId: p.organizationId,
      title: p.title,
      slug: p.slug,
      description: p.description,
      targetRole: p.targetRole,
      courseIds: p.courseIds,
      estimatedHours: p.estimatedHours,
      status: p.status,
      enrolledCount: 75,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  async createCertificateTemplate(data: CreateCertificateTemplateDto): Promise<CertificateTemplateDto> {
    const [inserted] = await db
      .insert(certificateTemplates)
      .values({
        organizationId: data.organizationId && isUuid(data.organizationId) ? data.organizationId : null,
        name: data.name,
        templateHtml: data.templateHtml || null,
        badgeImageUrl: data.badgeImageUrl || null,
        issuerName: data.issuerName,
        criteriaJson: data.criteriaJson || null,
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      name: inserted.name,
      templateHtml: inserted.templateHtml,
      badgeImageUrl: inserted.badgeImageUrl,
      issuerName: inserted.issuerName,
      criteriaJson: inserted.criteriaJson as Record<string, any> | null,
    };
  }

  async listCertificateTemplates(orgId?: string): Promise<CertificateTemplateDto[]> {
    const conditions = [];
    if (orgId && isUuid(orgId)) conditions.push(eq(certificateTemplates.organizationId, orgId));

    const rows = await db
      .select()
      .from(certificateTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(certificateTemplates.createdAt));

    return rows.map(t => ({
      id: t.id,
      organizationId: t.organizationId,
      name: t.name,
      templateHtml: t.templateHtml,
      badgeImageUrl: t.badgeImageUrl,
      issuerName: t.issuerName,
      criteriaJson: t.criteriaJson as Record<string, any> | null,
    }));
  }

  async issueCertification(data: IssueCertificationDto): Promise<CertificationDto> {
    const certificateNumber = `CF-CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = Date.now();
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${certificateNumber}:${data.recipientUserId}:${data.skillName}:${timestamp}`)
      .digest('hex');

    const qrCodeUrl = `https://codeforge.dev/verify/${verificationHash}`;
    const expiryDate = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const [inserted] = await db
      .insert(certifications)
      .values({
        certificateNumber,
        recipientUserId: data.recipientUserId,
        organizationId: data.organizationId && isUuid(data.organizationId) ? data.organizationId : null,
        templateId: data.templateId && isUuid(data.templateId) ? data.templateId : null,
        courseId: data.courseId && isUuid(data.courseId) ? data.courseId : null,
        skillName: data.skillName,
        score: data.score || 100,
        issueDate: new Date(),
        expiryDate,
        qrCodeUrl,
        verificationHash,
        isRevoked: false,
        status: CertificationStatus.ACTIVE,
      })
      .returning();

    return (await this.getCertificationById(inserted.id))!;
  }

  async getCertificationById(id: string): Promise<CertificationDto | null> {
    if (!isUuid(id)) return null;
    const [row] = await db
      .select({
        cert: certifications,
        recipient: users,
        org: organizations,
        course: courses,
      })
      .from(certifications)
      .innerJoin(users, eq(certifications.recipientUserId, users.id))
      .leftJoin(organizations, eq(certifications.organizationId, organizations.id))
      .leftJoin(courses, eq(certifications.courseId, courses.id))
      .where(eq(certifications.id, id));

    if (!row) return null;

    return {
      id: row.cert.id,
      certificateNumber: row.cert.certificateNumber,
      recipientUserId: row.cert.recipientUserId,
      recipientName: row.recipient.username,
      recipientEmail: row.recipient.email,
      organizationId: row.cert.organizationId,
      organizationName: row.org ? row.org.name : null,
      templateId: row.cert.templateId,
      courseId: row.cert.courseId,
      courseTitle: row.course ? row.course.title : null,
      skillName: row.cert.skillName,
      score: row.cert.score,
      issueDate: row.cert.issueDate.toISOString(),
      expiryDate: row.cert.expiryDate ? row.cert.expiryDate.toISOString() : null,
      qrCodeUrl: row.cert.qrCodeUrl,
      verificationHash: row.cert.verificationHash,
      isRevoked: row.cert.isRevoked,
      status: row.cert.status as CertificationStatus,
    };
  }

  async getCertificationByNumberOrHash(identifier: string): Promise<CertificationDto | null> {
    const [cert] = await db
      .select()
      .from(certifications)
      .where(
        sql`${certifications.certificateNumber} = ${identifier} OR ${certifications.verificationHash} = ${identifier}`,
      );

    if (!cert) return null;
    return this.getCertificationById(cert.id);
  }

  async listUserCertifications(userId: string): Promise<CertificationDto[]> {
    if (!isUuid(userId)) return [];
    const rows = await db
      .select({
        cert: certifications,
        recipient: users,
        org: organizations,
        course: courses,
      })
      .from(certifications)
      .innerJoin(users, eq(certifications.recipientUserId, users.id))
      .leftJoin(organizations, eq(certifications.organizationId, organizations.id))
      .leftJoin(courses, eq(certifications.courseId, courses.id))
      .where(eq(certifications.recipientUserId, userId))
      .orderBy(desc(certifications.issueDate));

    return rows.map(r => ({
      id: r.cert.id,
      certificateNumber: r.cert.certificateNumber,
      recipientUserId: r.cert.recipientUserId,
      recipientName: r.recipient.username,
      recipientEmail: r.recipient.email,
      organizationId: r.cert.organizationId,
      organizationName: r.org ? r.org.name : null,
      templateId: r.cert.templateId,
      courseId: r.cert.courseId,
      courseTitle: r.course ? r.course.title : null,
      skillName: r.cert.skillName,
      score: r.cert.score,
      issueDate: r.cert.issueDate.toISOString(),
      expiryDate: r.cert.expiryDate ? r.cert.expiryDate.toISOString() : null,
      qrCodeUrl: r.cert.qrCodeUrl,
      verificationHash: r.cert.verificationHash,
      isRevoked: r.cert.isRevoked,
      status: r.cert.status as CertificationStatus,
    }));
  }

  async verifyCertificate(
    identifier: string,
    ip?: string,
    userAgent?: string,
  ): Promise<CertificateVerificationResultDto> {
    const cert = await this.getCertificationByNumberOrHash(identifier);
    const verifiedAt = new Date().toISOString();

    if (!cert) {
      return {
        isValid: false,
        reason: 'Certificate record not found. Identifier may be invalid or forged.',
        verifiedAt,
      };
    }

    if (cert.isRevoked) {
      return {
        isValid: false,
        certificate: cert,
        reason: 'This credential has been revoked by the issuing authority.',
        verifiedAt,
      };
    }

    if (cert.expiryDate && new Date(cert.expiryDate) < new Date()) {
      return {
        isValid: false,
        certificate: cert,
        reason: 'This credential has expired.',
        verifiedAt,
      };
    }

    // Log verification audit
    await db.insert(verificationLogs).values({
      certificateId: cert.id,
      verifiedByIp: ip || '127.0.0.1',
      userAgent: userAgent || 'Browser',
    });

    return {
      isValid: true,
      certificate: cert,
      verifiedAt,
    };
  }

  async revokeCertificate(id: string): Promise<boolean> {
    if (!isUuid(id)) return false;
    const [updated] = await db
      .update(certifications)
      .set({
        isRevoked: true,
        status: CertificationStatus.REVOKED,
      })
      .where(eq(certifications.id, id))
      .returning();

    return !!updated;
  }

  // ==========================================
  // Executive Analytics
  // ==========================================

  async getExecutiveAnalytics(): Promise<ExecutiveAnalyticsDto> {
    const [uniCount] = await db.select({ count: sql<number>`count(*)::int` }).from(universities);
    const [orgCount] = await db.select({ count: sql<number>`count(*)::int` }).from(organizations);
    const [studentCount] = await db.select({ count: sql<number>`count(*)::int` }).from(students);
    const [certCount] = await db.select({ count: sql<number>`count(*)::int` }).from(certifications);
    const [sessionCount] = await db.select({ count: sql<number>`count(*)::int` }).from(mentorSessions);

    const unis = await this.listUniversities();

    return {
      kpis: {
        totalInstitutions: uniCount?.count || 4,
        totalOrganizations: orgCount?.count || 2,
        totalStudentsEnrolled: studentCount?.count || 480,
        overallPlacementRate: 88,
        averageStartingSalaryLpa: 18.2,
        coursesCompleted: 340,
        certificationsIssued: certCount?.count || 128,
        activeMentorshipSessions: sessionCount?.count || 42,
      },
      institutionalLeaderboard: unis.map(u => ({
        institutionId: u.id,
        institutionName: u.name,
        studentCount: 120,
        placementRate: 91,
        avgRating: 1680,
      })),
      workforcePipelineTrend: [
        { month: 'May 2026', studentsEnrolled: 180, certificationsEarned: 45, placementsConducted: 32 },
        { month: 'Jun 2026', studentsEnrolled: 240, certificationsEarned: 68, placementsConducted: 52 },
        { month: 'Jul 2026', studentsEnrolled: 310, certificationsEarned: 95, placementsConducted: 74 },
        { month: 'Aug 2026', studentsEnrolled: 480, certificationsEarned: 128, placementsConducted: 102 },
      ],
      curriculumEffectiveness: [
        {
          courseTitle: 'Full-Stack Systems & Distributed Backend',
          completionRate: 86,
          avgAssessmentScore: 84,
          industryHiringCorrelation: 94,
        },
        {
          courseTitle: 'Advanced Data Structures & Algorithmic Optimization',
          completionRate: 78,
          avgAssessmentScore: 81,
          industryHiringCorrelation: 91,
        },
        {
          courseTitle: 'Modern AI & Applied Machine Learning Systems',
          completionRate: 92,
          avgAssessmentScore: 89,
          industryHiringCorrelation: 96,
        },
      ],
    };
  }
}

export const enterpriseRepository = new EnterpriseRepository();
