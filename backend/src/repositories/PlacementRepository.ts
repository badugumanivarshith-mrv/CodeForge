import { eq, and, desc, sql, inArray, ilike, or } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  companies,
  recruiters,
  jobPostings,
  jobApplications,
  applicationStageHistory,
  candidateShortlists,
  referrals,
  referralRequests,
  hiringChallenges,
  hiringInterviews,
  users,
  userProfiles,
  resumes,
  portfolioProjects,
  contests,
  contestParticipants,
  skillRatings,
} from '../database/schema';
import { IPlacementRepository } from './interfaces/IPlacementRepository';
import {
  CompanyDto,
  CreateCompanyDto,
  UpdateCompanyDto,
  RecruiterProfileDto,
  JobPostingDto,
  CreateJobPostingDto,
  UpdateJobPostingDto,
  JobFilterQueryDto,
  JobApplicationDto,
  CreateApplicationDto,
  UpdateApplicationStageDto,
  ApplicationStageHistoryDto,
  ReferralDto,
  CreateReferralDto,
  ReferralRequestDto,
  CreateReferralRequestDto,
  HiringChallengeDto,
  CreateHiringChallengeDto,
  HiringChallengeStandingDto,
  HiringInterviewDto,
  ScheduleInterviewDto,
  SubmitInterviewFeedbackDto,
  TalentAnalyticsDto,
  JobType,
  WorkplaceType,
  JobStatus,
  ApplicationStage,
  MatchCategory,
  ReferralStatus,
  HiringInterviewType,
  HiringInterviewStatus,
  OfferRecommendation,
} from '@codeforge/shared';

export class PlacementRepository implements IPlacementRepository {
  // ==========================================
  // Companies
  // ==========================================

  public async createCompany(dto: CreateCompanyDto): Promise<CompanyDto> {
    const slug = `${dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    const isVerified = dto.isVerified ?? false;
    const [row] = await db
      .insert(companies)
      .values({
        name: dto.name,
        slug,
        website: dto.website || null,
        logoUrl: dto.logoUrl || null,
        description: dto.description || null,
        industry: dto.industry || null,
        size: dto.size || null,
        location: dto.location || null,
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
      })
      .returning();

    return this.mapCompanyRow(row);
  }


  public async getCompanyById(id: string): Promise<CompanyDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
    return row ? this.mapCompanyRow(row) : null;
  }

  public async getCompanyBySlug(slug: string): Promise<CompanyDto | null> {
    if (!slug) return null;
    const [row] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
    return row ? this.mapCompanyRow(row) : null;
  }

  public async updateCompany(id: string, dto: UpdateCompanyDto): Promise<CompanyDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db
      .update(companies)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning();

    return row ? this.mapCompanyRow(row) : null;
  }

  public async listCompanies(search?: string, isVerified?: boolean): Promise<CompanyDto[]> {
    const conditions = [];
    if (search) {
      conditions.push(or(ilike(companies.name, `%${search}%`), ilike(companies.industry, `%${search}%`)));
    }
    if (isVerified !== undefined) {
      conditions.push(eq(companies.isVerified, isVerified));
    }

    const rows = await db
      .select()
      .from(companies)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(companies.isVerified), desc(companies.createdAt));

    return rows.map(r => this.mapCompanyRow(r));
  }

  // ==========================================
  // Recruiters
  // ==========================================

  public async createRecruiter(
    userId: string,
    companyId: string,
    title?: string,
    department?: string,
    linkedinUrl?: string,
    isPrimaryContact: boolean = false,
  ): Promise<RecruiterProfileDto> {
    const [row] = await db
      .insert(recruiters)
      .values({
        userId,
        companyId,
        title: title || 'Technical Recruiter',
        department: department || 'Talent Acquisition',
        linkedinUrl: linkedinUrl || null,
        isPrimary: isPrimaryContact,
      })
      .returning();

    const company = await this.getCompanyById(companyId);

    return {
      id: row.id,
      userId: row.userId,
      companyId: row.companyId,
      companyName: company?.name || '',
      companySlug: company?.slug || '',
      companyLogoUrl: company?.logoUrl || null,
      isCompanyVerified: company?.isVerified || false,
      title: row.title,
      department: row.department,
      linkedinUrl: row.linkedinUrl,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt.toISOString(),
    };
  }

  public async registerRecruiter(
    userId: string,
    companyId: string,
    dto: any,
  ): Promise<RecruiterProfileDto> {
    return await this.createRecruiter(
      userId,
      companyId,
      dto.title,
      dto.department,
      dto.linkedinUrl,
      dto.isPrimaryContact ?? false,
    );
  }

  public async getRecruiterByUserId(userId: string): Promise<RecruiterProfileDto | null> {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) return null;
    const [row] = await db.select().from(recruiters).where(eq(recruiters.userId, userId)).limit(1);
    if (!row) return null;

    const company = await this.getCompanyById(row.companyId);

    return {
      id: row.id,
      userId: row.userId,
      companyId: row.companyId,
      companyName: company?.name || '',
      companySlug: company?.slug || '',
      companyLogoUrl: company?.logoUrl || null,
      isCompanyVerified: company?.isVerified || false,
      title: row.title,
      department: row.department,
      linkedinUrl: row.linkedinUrl,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt.toISOString(),
    };
  }

  public async getRecruiterById(id: string): Promise<RecruiterProfileDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db.select().from(recruiters).where(eq(recruiters.id, id)).limit(1);
    if (!row) return null;


    const company = await this.getCompanyById(row.companyId);

    return {
      id: row.id,
      userId: row.userId,
      companyId: row.companyId,
      companyName: company?.name || '',
      companySlug: company?.slug || '',
      companyLogoUrl: company?.logoUrl || null,
      isCompanyVerified: company?.isVerified || false,
      title: row.title,
      department: row.department,
      linkedinUrl: row.linkedinUrl,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt.toISOString(),
    };
  }

  public async listRecruitersByCompany(companyId: string): Promise<RecruiterProfileDto[]> {
    const rows = await db.select().from(recruiters).where(eq(recruiters.companyId, companyId));
    const company = await this.getCompanyById(companyId);

    return rows.map(row => ({
      id: row.id,
      userId: row.userId,
      companyId: row.companyId,
      companyName: company?.name || '',
      companySlug: company?.slug || '',
      companyLogoUrl: company?.logoUrl || null,
      isCompanyVerified: company?.isVerified || false,
      title: row.title,
      department: row.department,
      linkedinUrl: row.linkedinUrl,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  // ==========================================
  // Job Postings
  // ==========================================

  public async createJobPosting(
    companyId: string,
    recruiterIdOrUserId: string,
    dto: CreateJobPostingDto,
  ): Promise<JobPostingDto> {
    let resolvedRecruiterId = recruiterIdOrUserId;
    const [recByUserId] = await db
      .select({ id: recruiters.id })
      .from(recruiters)
      .where(eq(recruiters.userId, recruiterIdOrUserId))
      .limit(1);
    if (recByUserId) {
      resolvedRecruiterId = recByUserId.id;
    }

    const slug = `${dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    const [row] = await db
      .insert(jobPostings)
      .values({
        companyId,
        recruiterId: resolvedRecruiterId,
        title: dto.title,
        slug,
        description: dto.description,
        requirements: dto.requirements,
        skillsRequired: dto.skillsRequired || [],
        minRatingRequired: dto.minRatingRequired || 1200,
        minAssessmentScore: dto.minAssessmentScore || 0,
        jobType: dto.jobType || JobType.FULL_TIME,
        workplaceType: dto.workplaceType || WorkplaceType.REMOTE,
        location: dto.location || 'Remote',
        minSalary: dto.minSalary || null,
        maxSalary: dto.maxSalary || null,
        currency: dto.currency || 'USD',
        experienceLevel: dto.experienceLevel || 'Mid-Level',
        status: JobStatus.ACTIVE,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      })
      .returning();

    const company = await this.getCompanyById(companyId);
    return this.mapJobPostingRow(row, company);
  }

  public async getJobPostingById(id: string): Promise<JobPostingDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1);
    if (!row) return null;
    const company = await this.getCompanyById(row.companyId);
    return this.mapJobPostingRow(row, company);
  }

  public async getJobPostingBySlug(slug: string): Promise<JobPostingDto | null> {
    if (!slug) return null;
    const [row] = await db.select().from(jobPostings).where(eq(jobPostings.slug, slug)).limit(1);
    if (!row) return null;
    const company = await this.getCompanyById(row.companyId);
    return this.mapJobPostingRow(row, company);
  }

  public async updateJobPosting(id: string, dto: UpdateJobPostingDto): Promise<JobPostingDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const updateData: any = { ...dto, updatedAt: new Date() };
    if (dto.expiresAt) updateData.expiresAt = new Date(dto.expiresAt);

    const [row] = await db
      .update(jobPostings)
      .set(updateData)
      .where(eq(jobPostings.id, id))
      .returning();

    if (!row) return null;
    const company = await this.getCompanyById(row.companyId);
    return this.mapJobPostingRow(row, company);
  }

  public async listJobPostings(
    filters?: JobFilterQueryDto,
  ): Promise<{ jobs: JobPostingDto[]; total: number }> {
    const conditions = [];

    if (filters?.companyId) {
      conditions.push(eq(jobPostings.companyId, filters.companyId));
    }
    if (filters?.jobType) {
      conditions.push(eq(jobPostings.jobType, filters.jobType));
    }
    if (filters?.workplaceType) {
      conditions.push(eq(jobPostings.workplaceType, filters.workplaceType));
    }
    if (filters?.status) {
      conditions.push(eq(jobPostings.status, filters.status));
    } else {
      conditions.push(eq(jobPostings.status, JobStatus.ACTIVE));
    }
    if (filters?.location) {
      conditions.push(ilike(jobPostings.location, `%${filters.location}%`));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(jobPostings.title, `%${filters.search}%`),
          ilike(jobPostings.description, `%${filters.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(jobPostings)
      .where(whereClause)
      .orderBy(desc(jobPostings.createdAt))
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);

    const [countResult] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(jobPostings)
      .where(whereClause);

    const jobs: JobPostingDto[] = [];
    for (const r of rows) {
      const company = await this.getCompanyById(r.companyId);
      jobs.push(this.mapJobPostingRow(r, company));
    }

    return {
      jobs,
      total: countResult?.count || jobs.length,
    };
  }

  // ==========================================
  // Job Applications
  // ==========================================

  public async createApplication(
    candidateId: string,
    dto: CreateApplicationDto,
    matchScore: number = 75,
    matchCategory: MatchCategory = MatchCategory.GOOD_MATCH,
  ): Promise<JobApplicationDto> {
    const [row] = await db
      .insert(jobApplications)
      .values({
        jobId: dto.jobId,
        candidateId,
        resumeId: dto.resumeId || null,
        portfolioId: dto.portfolioId || null,
        stage: ApplicationStage.APPLIED,
        matchScore,
        matchCategory,
        coverLetter: dto.coverLetter || null,
      })
      .returning();

    // Log initial stage history
    await db.insert(applicationStageHistory).values({
      applicationId: row.id,
      fromStage: null,
      toStage: ApplicationStage.APPLIED,
      notes: 'Application submitted by candidate.',
      changedByUserId: candidateId,
    });

    const fullApp = await this.getApplicationById(row.id);
    return fullApp!;
  }

  public async getApplicationById(id: string): Promise<JobApplicationDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db
      .select({
        app: jobApplications,
        job: jobPostings,
        company: companies,
        candidate: users,
        candidateProfile: userProfiles,
        rating: skillRatings.currentRating,
      })
      .from(jobApplications)
      .leftJoin(jobPostings, eq(jobApplications.jobId, jobPostings.id))
      .leftJoin(companies, eq(jobPostings.companyId, companies.id))
      .leftJoin(users, eq(jobApplications.candidateId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .leftJoin(skillRatings, eq(users.id, skillRatings.userId))
      .where(eq(jobApplications.id, id))
      .limit(1);

    if (!row || !row.job || !row.company || !row.candidate) return null;

    const timeline = await this.getApplicationTimeline(id);
    const interviews = await this.listInterviewsByApplication(id);

    return {
      id: row.app.id,
      jobId: row.app.jobId,
      jobTitle: row.job.title,
      companyId: row.company.id,
      companyName: row.company.name,
      companyLogoUrl: row.company.logoUrl,
      candidateId: row.candidate.id,
      candidateName: row.candidateProfile?.fullName || row.candidate.username,
      candidateUsername: row.candidate.username,
      candidateAvatarUrl: row.candidateProfile?.avatarUrl || null,
      candidateRating: row.rating || 1200,
      candidateEmail: row.candidate.email,
      resumeId: row.app.resumeId,
      portfolioId: row.app.portfolioId,
      stage: row.app.stage as ApplicationStage,
      matchScore: row.app.matchScore,
      matchCategory: row.app.matchCategory as MatchCategory,
      coverLetter: row.app.coverLetter,
      recruiterNotes: row.app.recruiterNotes,
      rejectionReason: row.app.rejectionReason,
      appliedAt: row.app.appliedAt.toISOString(),
      updatedAt: row.app.updatedAt.toISOString(),
      timeline,
      interviews,
    };
  }

  public async getApplicationByCandidateAndJob(candidateId: string, jobId: string): Promise<JobApplicationDto | null> {
    if (
      !candidateId ||
      !jobId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId) ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jobId)
    ) {
      return null;
    }
    const [row] = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(and(eq(jobApplications.candidateId, candidateId), eq(jobApplications.jobId, jobId)))
      .limit(1);

    return row ? this.getApplicationById(row.id) : null;
  }

  public async updateApplicationStage(
    applicationId: string,
    stage: ApplicationStage,
    changedByUserId: string,
    notes?: string,
    rejectionReason?: string,
  ): Promise<JobApplicationDto | null> {
    if (!applicationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationId)) {
      return null;
    }
    const current = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (!current[0]) return null;
    const fromStage = current[0].stage as ApplicationStage;

    const updateData: any = {
      stage,
      updatedAt: new Date(),
    };
    if (notes) updateData.recruiterNotes = notes;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    await db.update(jobApplications).set(updateData).where(eq(jobApplications.id, applicationId));

    await db.insert(applicationStageHistory).values({
      applicationId,
      fromStage,
      toStage: stage,
      notes: notes || `Moved to ${stage}`,
      changedByUserId,
    });

    return this.getApplicationById(applicationId);
  }

  public async listApplicationsByCandidate(candidateId: string): Promise<JobApplicationDto[]> {
    if (!candidateId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId)) {
      return [];
    }
    const rows = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(eq(jobApplications.candidateId, candidateId))
      .orderBy(desc(jobApplications.appliedAt));

    const apps = await Promise.all(rows.map(r => this.getApplicationById(r.id)));
    return apps.filter((a): a is JobApplicationDto => a !== null);
  }

  public async listApplicationsByJob(jobId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]> {
    if (!jobId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jobId)) {
      return [];
    }
    const conditions = [eq(jobApplications.jobId, jobId)];
    if (stage) conditions.push(eq(jobApplications.stage, stage));

    const rows = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(and(...conditions))
      .orderBy(desc(jobApplications.matchScore), desc(jobApplications.appliedAt));

    const apps = await Promise.all(rows.map(r => this.getApplicationById(r.id)));
    return apps.filter((a): a is JobApplicationDto => a !== null);
  }

  public async listApplicationsByCompany(companyId: string, stage?: ApplicationStage): Promise<JobApplicationDto[]> {
    if (!companyId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId)) {
      return [];
    }
    const companyJobs = await db
      .select({ id: jobPostings.id })
      .from(jobPostings)
      .where(eq(jobPostings.companyId, companyId));

    if (companyJobs.length === 0) return [];
    const jobIds = companyJobs.map(j => j.id);

    const conditions = [inArray(jobApplications.jobId, jobIds)];
    if (stage) conditions.push(eq(jobApplications.stage, stage));

    const rows = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(and(...conditions))
      .orderBy(desc(jobApplications.appliedAt));

    const apps = await Promise.all(rows.map(r => this.getApplicationById(r.id)));
    return apps.filter((a): a is JobApplicationDto => a !== null);
  }

  public async getApplicationTimeline(applicationId: string): Promise<ApplicationStageHistoryDto[]> {
    if (!applicationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationId)) {
      return [];
    }
    const rows = await db
      .select({
        history: applicationStageHistory,
        user: users,
      })
      .from(applicationStageHistory)
      .leftJoin(users, eq(applicationStageHistory.changedByUserId, users.id))
      .where(eq(applicationStageHistory.applicationId, applicationId))
      .orderBy(desc(applicationStageHistory.changedAt));

    return rows.map(r => ({
      id: r.history.id,
      applicationId: r.history.applicationId,
      fromStage: r.history.fromStage as ApplicationStage | null,
      toStage: r.history.toStage as ApplicationStage,
      notes: r.history.notes,
      changedByUserId: r.history.changedByUserId,
      changedByUsername: r.user?.username,
      changedAt: r.history.changedAt.toISOString(),
    }));
  }


  // ==========================================
  // Shortlists
  // ==========================================

  public async shortlistCandidate(
    companyId: string,
    recruiterIdOrUserId: string,
    candidateId: string,
    jobId?: string,
    notes?: string,
    tags?: string[],
  ): Promise<any> {
    let resolvedRecruiterId = recruiterIdOrUserId;
    const [recByUserId] = await db
      .select({ id: recruiters.id })
      .from(recruiters)
      .where(eq(recruiters.userId, recruiterIdOrUserId))
      .limit(1);
    if (recByUserId) {
      resolvedRecruiterId = recByUserId.id;
    }

    const [row] = await db
      .insert(candidateShortlists)
      .values({
        companyId,
        recruiterId: resolvedRecruiterId,
        candidateId,
        jobId: jobId || null,
        notes: notes || null,
        tags: tags || [],
      })
      .returning();
    return row;
  }

  public async listShortlistsByCompany(companyId: string): Promise<any[]> {
    return await db
      .select({
        shortlist: candidateShortlists,
        candidate: users,
        job: jobPostings,
      })
      .from(candidateShortlists)
      .leftJoin(users, eq(candidateShortlists.candidateId, users.id))
      .leftJoin(jobPostings, eq(candidateShortlists.jobId, jobPostings.id))
      .where(eq(candidateShortlists.companyId, companyId))
      .orderBy(desc(candidateShortlists.createdAt));
  }

  // ==========================================
  // Referrals
  // ==========================================

  public async createReferral(referrerId: string, dto: CreateReferralDto): Promise<ReferralDto> {
    const [candidate] = await db.select().from(users).where(eq(users.email, dto.candidateEmail)).limit(1);
    const candidateId = candidate?.id || referrerId;

    const [row] = await db
      .insert(referrals)
      .values({
        companyId: dto.companyId,
        referrerId,
        candidateId,
        jobId: dto.jobId || null,
        status: ReferralStatus.PENDING,
        notes: dto.notes || null,
        bonusAmount: 1000,
      })
      .returning();

    const [comp] = await db.select().from(companies).where(eq(companies.id, dto.companyId)).limit(1);
    const [referrer] = await db.select().from(users).where(eq(users.id, referrerId)).limit(1);
    const [job] = dto.jobId ? await db.select().from(jobPostings).where(eq(jobPostings.id, dto.jobId)).limit(1) : [null];

    return {
      id: row.id,
      companyId: row.companyId,
      companyName: comp?.name || 'Company',
      referrerId: row.referrerId,
      referrerName: referrer?.username || 'Employee',
      candidateId: row.candidateId,
      candidateName: dto.candidateName,
      candidateEmail: dto.candidateEmail,
      jobId: row.jobId,
      jobTitle: job?.title || null,
      status: row.status as ReferralStatus,
      notes: row.notes,
      bonusAmount: row.bonusAmount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async listReferralsByCompany(companyId: string): Promise<ReferralDto[]> {
    if (!companyId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId)) return [];
    const rows = await db
      .select({
        referral: referrals,
        company: companies,
        referrer: users,
        job: jobPostings,
      })
      .from(referrals)
      .leftJoin(companies, eq(referrals.companyId, companies.id))
      .leftJoin(users, eq(referrals.referrerId, users.id))
      .leftJoin(jobPostings, eq(referrals.jobId, jobPostings.id))
      .where(eq(referrals.companyId, companyId))
      .orderBy(desc(referrals.createdAt));

    return rows.map(r => ({
      id: r.referral.id,
      companyId: r.referral.companyId,
      companyName: r.company?.name || 'Company',
      referrerId: r.referral.referrerId,
      referrerName: r.referrer?.username || 'Employee',
      candidateId: r.referral.candidateId,
      candidateName: 'Candidate',
      candidateEmail: 'candidate@referral.dev',
      jobId: r.referral.jobId,
      jobTitle: r.job?.title || null,
      status: r.referral.status as ReferralStatus,
      notes: r.referral.notes,
      bonusAmount: r.referral.bonusAmount,
      createdAt: r.referral.createdAt.toISOString(),
      updatedAt: r.referral.updatedAt.toISOString(),
    }));
  }

  public async listReferralsByReferrer(referrerId: string): Promise<ReferralDto[]> {
    if (!referrerId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referrerId)) return [];
    const rows = await db
      .select({
        referral: referrals,
        company: companies,
        referrer: users,
        job: jobPostings,
      })
      .from(referrals)
      .leftJoin(companies, eq(referrals.companyId, companies.id))
      .leftJoin(users, eq(referrals.referrerId, users.id))
      .leftJoin(jobPostings, eq(referrals.jobId, jobPostings.id))
      .where(eq(referrals.referrerId, referrerId))
      .orderBy(desc(referrals.createdAt));

    return rows.map(r => ({
      id: r.referral.id,
      companyId: r.referral.companyId,
      companyName: r.company?.name || 'Company',
      referrerId: r.referral.referrerId,
      referrerName: r.referrer?.username || 'Employee',
      candidateId: r.referral.candidateId,
      candidateName: 'Candidate',
      candidateEmail: 'candidate@referral.dev',
      jobId: r.referral.jobId,
      jobTitle: r.job?.title || null,
      status: r.referral.status as ReferralStatus,
      notes: r.referral.notes,
      bonusAmount: r.referral.bonusAmount,
      createdAt: r.referral.createdAt.toISOString(),
      updatedAt: r.referral.updatedAt.toISOString(),
    }));
  }

  public async updateReferralStatus(referralId: string, status: ReferralStatus, notes?: string): Promise<ReferralDto | null> {
    if (!referralId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referralId)) return null;
    const updateData: any = { status, updatedAt: new Date() };
    if (notes) updateData.notes = notes;
    if (status === ReferralStatus.HIRED) updateData.bonusAmount = 2500;

    const [row] = await db.update(referrals).set(updateData).where(eq(referrals.id, referralId)).returning();
    if (!row) return null;

    const [comp] = await db.select().from(companies).where(eq(companies.id, row.companyId)).limit(1);
    const [referrer] = await db.select().from(users).where(eq(users.id, row.referrerId)).limit(1);

    return {
      id: row.id,
      companyId: row.companyId,
      companyName: comp?.name || 'Company',
      referrerId: row.referrerId,
      referrerName: referrer?.username || 'Employee',
      candidateId: row.candidateId,
      candidateName: 'Candidate',
      candidateEmail: 'candidate@referral.dev',
      jobId: row.jobId,
      jobTitle: null,
      status: row.status as ReferralStatus,
      notes: row.notes,
      bonusAmount: row.bonusAmount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async createReferralRequest(
    candidateId: string,
    dto: CreateReferralRequestDto,
    targetCompanyId: string,
  ): Promise<ReferralRequestDto> {
    const [row] = await db
      .insert(referralRequests)
      .values({
        candidateId,
        jobId: dto.jobId,
        targetCompanyId,
        message: dto.message || 'I would love a referral for this position.',
        status: ReferralStatus.PENDING,
      })
      .returning();

    const [candidate] = await db.select().from(users).where(eq(users.id, candidateId)).limit(1);
    const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, dto.jobId)).limit(1);
    const [comp] = await db.select().from(companies).where(eq(companies.id, targetCompanyId)).limit(1);

    return {
      id: row.id,
      candidateId: row.candidateId,
      candidateName: candidate?.username || 'Candidate',
      jobId: row.jobId,
      jobTitle: job?.title || 'Target Job',
      targetCompanyId: row.targetCompanyId,
      targetCompanyName: comp?.name || 'Target Company',
      message: row.message,
      status: row.status as ReferralStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async listReferralRequestsByCandidate(candidateId: string): Promise<ReferralRequestDto[]> {
    if (!candidateId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId)) return [];
    const rows = await db
      .select({
        request: referralRequests,
        candidate: users,
        job: jobPostings,
        company: companies,
      })
      .from(referralRequests)
      .leftJoin(users, eq(referralRequests.candidateId, users.id))
      .leftJoin(jobPostings, eq(referralRequests.jobId, jobPostings.id))
      .leftJoin(companies, eq(referralRequests.targetCompanyId, companies.id))
      .where(eq(referralRequests.candidateId, candidateId))
      .orderBy(desc(referralRequests.createdAt));

    return rows.map(r => ({
      id: r.request.id,
      candidateId: r.request.candidateId,
      candidateName: r.candidate?.username || 'Candidate',
      jobId: r.request.jobId,
      jobTitle: r.job?.title || 'Target Job',
      targetCompanyId: r.request.targetCompanyId,
      targetCompanyName: r.company?.name || 'Target Company',
      message: r.request.message,
      status: r.request.status as ReferralStatus,
      createdAt: r.request.createdAt.toISOString(),
      updatedAt: r.request.updatedAt.toISOString(),
    }));
  }

  public async listReferralRequestsByCompany(companyId: string): Promise<ReferralRequestDto[]> {
    if (!companyId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId)) return [];
    const rows = await db
      .select({
        request: referralRequests,
        candidate: users,
        job: jobPostings,
        company: companies,
      })
      .from(referralRequests)
      .leftJoin(users, eq(referralRequests.candidateId, users.id))
      .leftJoin(jobPostings, eq(referralRequests.jobId, jobPostings.id))
      .leftJoin(companies, eq(referralRequests.targetCompanyId, companies.id))
      .where(eq(referralRequests.targetCompanyId, companyId))
      .orderBy(desc(referralRequests.createdAt));

    return rows.map(r => ({
      id: r.request.id,
      candidateId: r.request.candidateId,
      candidateName: r.candidate?.username || 'Candidate',
      jobId: r.request.jobId,
      jobTitle: r.job?.title || 'Target Job',
      targetCompanyId: r.request.targetCompanyId,
      targetCompanyName: r.company?.name || 'Target Company',
      message: r.request.message,
      status: r.request.status as ReferralStatus,
      createdAt: r.request.createdAt.toISOString(),
      updatedAt: r.request.updatedAt.toISOString(),
    }));
  }

  public async updateReferralRequestStatus(requestId: string, status: ReferralStatus): Promise<ReferralRequestDto | null> {
    if (!requestId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) return null;
    const [row] = await db
      .update(referralRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(referralRequests.id, requestId))
      .returning();

    if (!row) return null;
    const [candidate] = await db.select().from(users).where(eq(users.id, row.candidateId)).limit(1);
    const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, row.jobId)).limit(1);
    const [comp] = await db.select().from(companies).where(eq(companies.id, row.targetCompanyId)).limit(1);

    return {
      id: row.id,
      candidateId: row.candidateId,
      candidateName: candidate?.username || 'Candidate',
      jobId: row.jobId,
      jobTitle: job?.title || 'Target Job',
      targetCompanyId: row.targetCompanyId,
      targetCompanyName: comp?.name || 'Target Company',
      message: row.message,
      status: row.status as ReferralStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  // ==========================================
  // Hiring Challenges
  // ==========================================

  public async createHiringChallenge(
    companyId: string,
    recruiterIdOrUserId: string,
    dto: CreateHiringChallengeDto,
  ): Promise<HiringChallengeDto> {
    let resolvedRecruiterId = recruiterIdOrUserId;
    let contestCreatorUserId = recruiterIdOrUserId;
    const [recByUserId] = await db
      .select({ id: recruiters.id, userId: recruiters.userId })
      .from(recruiters)
      .where(eq(recruiters.userId, recruiterIdOrUserId))
      .limit(1);
    if (recByUserId) {
      resolvedRecruiterId = recByUserId.id;
      contestCreatorUserId = recByUserId.userId;
    } else {
      const [recById] = await db
        .select({ id: recruiters.id, userId: recruiters.userId })
        .from(recruiters)
        .where(eq(recruiters.id, recruiterIdOrUserId))
        .limit(1);
      if (recById) {
        contestCreatorUserId = recById.userId;
      }
    }

    let contestId = dto.contestId;

    if (!contestId) {
      const slug = `hiring-${dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
      const [newContest] = await db
        .insert(contests)
        .values({
          title: dto.title,
          slug,
          descriptionMdx: dto.description,
          startAt: new Date(dto.startsAt),
          endAt: new Date(dto.endsAt),
          durationMinutes: 90,
          createdBy: contestCreatorUserId,
        })
        .returning();
      contestId = newContest.id;
    }

    const [row] = await db
      .insert(hiringChallenges)
      .values({
        companyId,
        recruiterId: resolvedRecruiterId,
        contestId,
        title: dto.title,
        description: dto.description,
        targetRole: dto.targetRole || 'Software Engineer',
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        minScoreThreshold: dto.minScoreThreshold || 100,
        autoShortlist: dto.autoShortlist ?? true,
      })
      .returning();

    const company = await this.getCompanyById(companyId);

    return {
      id: row.id,
      companyId: row.companyId,
      companyName: company?.name || 'Company',
      companyLogoUrl: company?.logoUrl || null,
      recruiterId: row.recruiterId,
      contestId: row.contestId,
      title: row.title,
      description: row.description,
      targetRole: row.targetRole,
      minScoreThreshold: row.minScoreThreshold,
      autoShortlist: row.autoShortlist,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      participantCount: 0,
      shortlistedCount: 0,
      createdAt: row.createdAt.toISOString(),
    };
  }

  public async getHiringChallengeById(id: string): Promise<HiringChallengeDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db.select().from(hiringChallenges).where(eq(hiringChallenges.id, id)).limit(1);
    if (!row) return null;
    const company = await this.getCompanyById(row.companyId);

    const participants = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(contestParticipants)
      .where(eq(contestParticipants.contestId, row.contestId));

    const shortlisted = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(contestParticipants)
      .where(
        and(
          eq(contestParticipants.contestId, row.contestId),
          sql`${contestParticipants.score} >= ${row.minScoreThreshold}`,
        ),
      );

    return {
      id: row.id,
      companyId: row.companyId,
      companyName: company?.name || 'Company',
      companyLogoUrl: company?.logoUrl || null,
      recruiterId: row.recruiterId,
      contestId: row.contestId,
      title: row.title,
      description: row.description,
      targetRole: row.targetRole,
      minScoreThreshold: row.minScoreThreshold,
      autoShortlist: row.autoShortlist,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt.toISOString(),
      participantCount: participants[0]?.count || 0,
      shortlistedCount: shortlisted[0]?.count || 0,
      createdAt: row.createdAt.toISOString(),
    };
  }

  public async listHiringChallenges(companyId?: string): Promise<HiringChallengeDto[]> {
    if (companyId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId)) return [];
    const conditions = [];
    if (companyId) conditions.push(eq(hiringChallenges.companyId, companyId));

    const rows = await db
      .select({
        challenge: hiringChallenges,
        company: companies,
      })
      .from(hiringChallenges)
      .leftJoin(companies, eq(hiringChallenges.companyId, companies.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(hiringChallenges.startsAt));

    return rows.map(r => ({
      id: r.challenge.id,
      companyId: r.challenge.companyId,
      companyName: r.company?.name || 'Company',
      companyLogoUrl: r.company?.logoUrl || null,
      recruiterId: r.challenge.recruiterId,
      contestId: r.challenge.contestId,
      title: r.challenge.title,
      description: r.challenge.description,
      targetRole: r.challenge.targetRole,
      minScoreThreshold: r.challenge.minScoreThreshold,
      autoShortlist: r.challenge.autoShortlist,
      startsAt: r.challenge.startsAt.toISOString(),
      endsAt: r.challenge.endsAt.toISOString(),
      participantCount: 0,
      shortlistedCount: 0,
      createdAt: r.challenge.createdAt.toISOString(),
    }));
  }

  public async getHiringChallengeStandings(challengeId: string): Promise<HiringChallengeStandingDto[]> {
    if (!challengeId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(challengeId)) return [];
    const challenge = await this.getHiringChallengeById(challengeId);
    if (!challenge) return [];

    const participants = await db
      .select({
        participant: contestParticipants,
        user: users,
        profile: userProfiles,
        rating: skillRatings.currentRating,
      })
      .from(contestParticipants)
      .leftJoin(users, eq(contestParticipants.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .leftJoin(skillRatings, eq(users.id, skillRatings.userId))
      .where(eq(contestParticipants.contestId, challenge.contestId))
      .orderBy(desc(contestParticipants.score), contestParticipants.penaltyTimeMinutes);

    return participants.map((p, idx) => ({
      rank: idx + 1,
      userId: p.participant.userId,
      username: p.user?.username || 'user',
      fullName: p.profile?.fullName || p.user?.username || 'Competitor',
      avatarUrl: p.profile?.avatarUrl || null,
      score: p.participant.score,
      penaltyTimeMinutes: p.participant.penaltyTimeMinutes,
      isShortlisted: p.participant.score >= challenge.minScoreThreshold,
      rating: p.rating || 1200,
      skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
    }));
  }

  // ==========================================
  // Hiring Interviews
  // ==========================================

  public async scheduleInterview(dto: ScheduleInterviewDto, interviewerId: string): Promise<HiringInterviewDto> {
    const [row] = await db
      .insert(hiringInterviews)
      .values({
        applicationId: dto.applicationId,
        interviewerId,
        interviewType: dto.interviewType,
        scheduledAt: new Date(dto.scheduledAt),
        durationMinutes: dto.durationMinutes || 45,
        meetingUrl: dto.meetingUrl || `https://meet.codeforge.dev/room-${Date.now().toString(36)}`,
        status: HiringInterviewStatus.SCHEDULED,
      })
      .returning();

    const full = await this.getInterviewById(row.id);
    return full!;
  }

  public async getInterviewById(id: string): Promise<HiringInterviewDto | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    const [row] = await db
      .select({
        interview: hiringInterviews,
        application: jobApplications,
        job: jobPostings,
      })
      .from(hiringInterviews)
      .leftJoin(jobApplications, eq(hiringInterviews.applicationId, jobApplications.id))
      .leftJoin(jobPostings, eq(jobApplications.jobId, jobPostings.id))
      .where(eq(hiringInterviews.id, id))
      .limit(1);

    if (!row || !row.application || !row.job) return null;

    const [candidate] = await db.select().from(users).where(eq(users.id, row.application.candidateId)).limit(1);
    const [candidateProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, row.application.candidateId)).limit(1);
    const [interviewer] = await db.select().from(users).where(eq(users.id, row.interview.interviewerId)).limit(1);
    const [interviewerProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, row.interview.interviewerId)).limit(1);

    return {
      id: row.interview.id,
      applicationId: row.interview.applicationId,
      candidateId: row.application.candidateId,
      candidateName: candidateProfile?.fullName || candidate?.username || 'Candidate',
      jobId: row.job.id,
      jobTitle: row.job.title,
      companyId: row.job.companyId,
      interviewerId: row.interview.interviewerId,
      interviewerName: interviewerProfile?.fullName || interviewer?.username || 'Lead Engineer',
      interviewType: row.interview.interviewType as HiringInterviewType,
      scheduledAt: row.interview.scheduledAt.toISOString(),
      durationMinutes: row.interview.durationMinutes,
      meetingUrl: row.interview.meetingUrl,
      status: row.interview.status as HiringInterviewStatus,
      feedbackNotes: row.interview.feedbackNotes,
      technicalScore: row.interview.technicalScore,
      communicationScore: row.interview.communicationScore,
      problemSolvingScore: row.interview.problemSolvingScore,
      recommendation: row.interview.recommendation as OfferRecommendation | null,
      completedAt: row.interview.completedAt ? row.interview.completedAt.toISOString() : null,
      createdAt: row.interview.createdAt.toISOString(),
    };
  }

  public async listInterviewsByApplication(applicationId: string): Promise<HiringInterviewDto[]> {
    if (!applicationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationId)) return [];
    const rows = await db
      .select({ id: hiringInterviews.id })
      .from(hiringInterviews)
      .where(eq(hiringInterviews.applicationId, applicationId))
      .orderBy(desc(hiringInterviews.scheduledAt));

    const interviews = await Promise.all(rows.map(r => this.getInterviewById(r.id)));
    return interviews.filter((i): i is HiringInterviewDto => i !== null);
  }

  public async listInterviewsByInterviewer(interviewerId: string): Promise<HiringInterviewDto[]> {
    if (!interviewerId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(interviewerId)) return [];
    const rows = await db
      .select({ id: hiringInterviews.id })
      .from(hiringInterviews)
      .where(eq(hiringInterviews.interviewerId, interviewerId))
      .orderBy(desc(hiringInterviews.scheduledAt));

    const interviews = await Promise.all(rows.map(r => this.getInterviewById(r.id)));
    return interviews.filter((i): i is HiringInterviewDto => i !== null);
  }

  public async listInterviewsByCompany(companyId: string): Promise<HiringInterviewDto[]> {
    if (!companyId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId)) return [];
    const companyJobs = await db.select({ id: jobPostings.id }).from(jobPostings).where(eq(jobPostings.companyId, companyId));
    if (companyJobs.length === 0) return [];
    const jobIds = companyJobs.map(j => j.id);

    const rows = await db
      .select({ id: hiringInterviews.id })
      .from(hiringInterviews)
      .leftJoin(jobApplications, eq(hiringInterviews.applicationId, jobApplications.id))
      .where(inArray(jobApplications.jobId, jobIds))
      .orderBy(desc(hiringInterviews.scheduledAt));

    const interviews = await Promise.all(rows.map(r => this.getInterviewById(r.id)));
    return interviews.filter((i): i is HiringInterviewDto => i !== null);
  }

  public async submitInterviewFeedback(
    interviewId: string,
    dto: SubmitInterviewFeedbackDto,
  ): Promise<HiringInterviewDto | null> {
    if (!interviewId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(interviewId)) return null;
    const [row] = await db
      .update(hiringInterviews)
      .set({
        status: HiringInterviewStatus.COMPLETED,
        feedbackNotes: dto.feedbackNotes,
        technicalScore: dto.technicalScore,
        communicationScore: dto.communicationScore,
        problemSolvingScore: dto.problemSolvingScore,
        recommendation: dto.recommendation,
        completedAt: new Date(),
      })
      .where(eq(hiringInterviews.id, interviewId))
      .returning();

    return row ? this.getInterviewById(row.id) : null;
  }

  // ==========================================
  // Talent Analytics
  // ==========================================

  public async getCompanyTalentAnalytics(companyId: string): Promise<TalentAnalyticsDto> {
    const allJobs = await db.select().from(jobPostings).where(eq(jobPostings.companyId, companyId));
    const activeJobs = allJobs.filter(j => j.status === JobStatus.ACTIVE).length;

    const allApps = await this.listApplicationsByCompany(companyId);
    const totalApplicants = allApps.length;
    const shortlistedCandidates = allApps.filter(
      a => a.stage !== ApplicationStage.APPLIED && a.stage !== ApplicationStage.REJECTED,
    ).length;

    const interviews = await this.listInterviewsByCompany(companyId);
    const interviewsConducted = interviews.filter(i => i.status === HiringInterviewStatus.COMPLETED).length;

    const offersExtended = allApps.filter(a => a.stage === ApplicationStage.OFFER || a.stage === ApplicationStage.HIRED).length;
    const hiresMade = allApps.filter(a => a.stage === ApplicationStage.HIRED).length;

    const stageCounts: Record<ApplicationStage, number> = {
      [ApplicationStage.APPLIED]: 0,
      [ApplicationStage.SCREENING]: 0,
      [ApplicationStage.INTERVIEW]: 0,
      [ApplicationStage.TECHNICAL_ROUND]: 0,
      [ApplicationStage.HR_ROUND]: 0,
      [ApplicationStage.OFFER]: 0,
      [ApplicationStage.REJECTED]: 0,
      [ApplicationStage.HIRED]: 0,
    };

    for (const a of allApps) {
      if (stageCounts[a.stage] !== undefined) {
        stageCounts[a.stage]++;
      }
    }

    const funnel = Object.values(ApplicationStage).map(stage => ({
      stage,
      count: stageCounts[stage] || 0,
      conversionRate: totalApplicants > 0 ? Number((((stageCounts[stage] || 0) / totalApplicants) * 100).toFixed(1)) : 0,
    }));

    // Aggregate skill heatmap
    const skillMap: Record<string, { candidateCount: number; sumScore: number; demandCount: number }> = {};
    for (const j of allJobs) {
      for (const skill of j.skillsRequired || []) {
        if (!skillMap[skill]) {
          skillMap[skill] = { candidateCount: 0, sumScore: 0, demandCount: 0 };
        }
        skillMap[skill].demandCount++;
      }
    }

    for (const a of allApps) {
      for (const [skill, val] of Object.entries(skillMap)) {
        val.candidateCount++;
        val.sumScore += a.matchScore;
      }
    }

    const skillHeatmap = Object.entries(skillMap).map(([skill, val]) => ({
      skill,
      candidateCount: val.candidateCount,
      averageScore: val.candidateCount > 0 ? Math.round(val.sumScore / val.candidateCount) : 75,
      demandCount: val.demandCount,
    }));

    return {
      companyId,
      totalJobPostings: allJobs.length,
      activeJobs,
      totalApplicants,
      shortlistedCandidates,
      interviewsConducted,
      offersExtended,
      hiresMade,
      funnel,
      skillHeatmap: skillHeatmap.length > 0 ? skillHeatmap : [
        { skill: 'TypeScript', candidateCount: 12, averageScore: 84, demandCount: 3 },
        { skill: 'PostgreSQL', candidateCount: 9, averageScore: 78, demandCount: 2 },
        { skill: 'Python', candidateCount: 15, averageScore: 88, demandCount: 4 },
        { skill: 'System Design', candidateCount: 7, averageScore: 72, demandCount: 2 },
      ],
      topPerformingCollegesOrTags: [
        { name: 'Algorithmic Masters', hireCount: 3 },
        { name: 'Full-Stack Polyglot', hireCount: 2 },
      ],
      timeToHireDays: 14,
    };
  }

  // ==========================================
  // Helper Mappings
  // ==========================================

  private mapCompanyRow(row: any): CompanyDto {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      website: row.website,
      logoUrl: row.logoUrl,
      description: row.description,
      industry: row.industry,
      size: row.size,
      location: row.location,
      isVerified: row.isVerified,
      verifiedAt: row.verifiedAt ? row.verifiedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapJobPostingRow(row: any, company: CompanyDto | null): JobPostingDto {
    return {
      id: row.id,
      companyId: row.companyId,
      companyName: company?.name || 'Company',
      companySlug: company?.slug || '',
      companyLogoUrl: company?.logoUrl || null,
      isCompanyVerified: company?.isVerified || false,
      recruiterId: row.recruiterId,
      title: row.title,
      slug: row.slug,
      description: row.description,
      requirements: row.requirements,
      skillsRequired: row.skillsRequired || [],
      minRatingRequired: row.minRatingRequired,
      minAssessmentScore: row.minAssessmentScore,
      jobType: row.jobType as JobType,
      workplaceType: row.workplaceType as WorkplaceType,
      location: row.location,
      minSalary: row.minSalary,
      maxSalary: row.maxSalary,
      currency: row.currency,
      experienceLevel: row.experienceLevel,
      status: row.status as JobStatus,
      expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
