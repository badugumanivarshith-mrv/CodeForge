import { eq, and, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import { resumes } from '../database/schema';

import { IResumeRepository } from './interfaces/IResumeRepository';
import {
  ResumeDto,
  CreateResumeDto,
  UpdateResumeDto,
} from '@codeforge/shared';

export class ResumeRepository implements IResumeRepository {
  async createResume(userId: string, data: CreateResumeDto): Promise<ResumeDto> {
    const [inserted] = await db
      .insert(resumes)
      .values({
        userId,
        title: data.title,
        templateName: data.templateName || 'modern-ats',
        targetRole: data.targetRole,
        personalInfoJson: data.personalInfo || {},
        skillsJson: data.skills || [],
        experienceJson: data.experience || [],
        projectsJson: data.projects || [],
        educationJson: data.education || [],
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      title: inserted.title,
      templateName: inserted.templateName,
      targetRole: inserted.targetRole,
      personalInfo: (inserted.personalInfoJson as ResumeDto['personalInfo']) || { fullName: '', email: '' },
      skills: (inserted.skillsJson as string[]) || [],
      experience: (inserted.experienceJson as ResumeDto['experience']) || [],
      projects: (inserted.projectsJson as ResumeDto['projects']) || [],
      education: (inserted.educationJson as ResumeDto['education']) || [],
      atsScore: inserted.atsScore || undefined,
      atsFeedback: (inserted.atsFeedbackJson as ResumeDto['atsFeedback']) || undefined,
      isPublic: inserted.isPublic,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  }

  async getResumeById(id: string): Promise<ResumeDto | null> {
    const rows = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      templateName: r.templateName,
      targetRole: r.targetRole,
      personalInfo: (r.personalInfoJson as ResumeDto['personalInfo']) || { fullName: '', email: '' },
      skills: (r.skillsJson as string[]) || [],
      experience: (r.experienceJson as ResumeDto['experience']) || [],
      projects: (r.projectsJson as ResumeDto['projects']) || [],
      education: (r.educationJson as ResumeDto['education']) || [],
      atsScore: r.atsScore || undefined,
      atsFeedback: (r.atsFeedbackJson as ResumeDto['atsFeedback']) || undefined,
      isPublic: r.isPublic,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async getResumesByUserId(userId: string): Promise<ResumeDto[]> {
    const rows = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      title: r.title,
      templateName: r.templateName,
      targetRole: r.targetRole,
      personalInfo: (r.personalInfoJson as ResumeDto['personalInfo']) || { fullName: '', email: '' },
      skills: (r.skillsJson as string[]) || [],
      experience: (r.experienceJson as ResumeDto['experience']) || [],
      projects: (r.projectsJson as ResumeDto['projects']) || [],
      education: (r.educationJson as ResumeDto['education']) || [],
      atsScore: r.atsScore || undefined,
      atsFeedback: (r.atsFeedbackJson as ResumeDto['atsFeedback']) || undefined,
      isPublic: r.isPublic,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async updateResume(id: string, userId: string, data: UpdateResumeDto): Promise<ResumeDto | null> {
    const existing = await this.getResumeById(id);
    if (!existing || existing.userId !== userId) return null;

    const [updated] = await db
      .update(resumes)
      .set({
        title: data.title !== undefined ? data.title : existing.title,
        templateName: data.templateName !== undefined ? data.templateName : existing.templateName,
        targetRole: data.targetRole !== undefined ? data.targetRole : existing.targetRole,
        personalInfoJson: data.personalInfo !== undefined ? data.personalInfo : existing.personalInfo,
        skillsJson: data.skills !== undefined ? data.skills : existing.skills,
        experienceJson: data.experience !== undefined ? data.experience : existing.experience,
        projectsJson: data.projects !== undefined ? data.projects : existing.projects,
        educationJson: data.education !== undefined ? data.education : existing.education,
        isPublic: data.isPublic !== undefined ? data.isPublic : existing.isPublic,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      userId: updated.userId,
      title: updated.title,
      templateName: updated.templateName,
      targetRole: updated.targetRole,
      personalInfo: (updated.personalInfoJson as ResumeDto['personalInfo']) || { fullName: '', email: '' },
      skills: (updated.skillsJson as string[]) || [],
      experience: (updated.experienceJson as ResumeDto['experience']) || [],
      projects: (updated.projectsJson as ResumeDto['projects']) || [],
      education: (updated.educationJson as ResumeDto['education']) || [],
      atsScore: updated.atsScore || undefined,
      atsFeedback: (updated.atsFeedbackJson as ResumeDto['atsFeedback']) || undefined,
      isPublic: updated.isPublic,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteResume(id: string, userId: string): Promise<boolean> {
    const res = await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();

    return res.length > 0;
  }
}
