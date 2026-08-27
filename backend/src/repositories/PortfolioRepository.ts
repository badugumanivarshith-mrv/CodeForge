import { eq, and } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  portfolioProjects,
  portfolioSettings,
} from '../database/schema';

import {
  IPortfolioRepository,
} from './interfaces/IPortfolioRepository';
import {
  PortfolioProjectDto,
  PortfolioSettingsDto,
  CreatePortfolioProjectDto,
  UpdatePortfolioProjectDto,
  UpdatePortfolioSettingsDto,
} from '@codeforge/shared';

export class PortfolioRepository implements IPortfolioRepository {
  async getSettingsByUserId(userId: string): Promise<PortfolioSettingsDto | null> {
    const rows = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.userId, userId))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      userId: row.userId,
      headline: row.headline || undefined,
      aboutMdx: row.aboutMdx || undefined,
      isPublic: row.isPublic,
      themePreference: row.themePreference,
      customSlug: row.customSlug || undefined,
      featuredSkillIds: (row.featuredSkillIdsJson as string[]) || [],
      socialLinks: (row.socialLinksJson as Record<string, string>) || {},
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async getSettingsBySlug(slug: string): Promise<PortfolioSettingsDto | null> {
    const rows = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.customSlug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      userId: row.userId,
      headline: row.headline || undefined,
      aboutMdx: row.aboutMdx || undefined,
      isPublic: row.isPublic,
      themePreference: row.themePreference,
      customSlug: row.customSlug || undefined,
      featuredSkillIds: (row.featuredSkillIdsJson as string[]) || [],
      socialLinks: (row.socialLinksJson as Record<string, string>) || {},
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async upsertSettings(userId: string, data: UpdatePortfolioSettingsDto): Promise<PortfolioSettingsDto> {
    const existing = await this.getSettingsByUserId(userId);
    if (!existing) {
      const [inserted] = await db
        .insert(portfolioSettings)
        .values({
          userId,
          headline: data.headline,
          aboutMdx: data.aboutMdx,
          isPublic: data.isPublic !== undefined ? data.isPublic : true,
          themePreference: data.themePreference || 'modern-dark',
          customSlug: data.customSlug,
          featuredSkillIdsJson: data.featuredSkillIds || [],
          socialLinksJson: data.socialLinks || {},
          updatedAt: new Date(),
        })
        .returning();

      return {
        userId: inserted.userId,
        headline: inserted.headline || undefined,
        aboutMdx: inserted.aboutMdx || undefined,
        isPublic: inserted.isPublic,
        themePreference: inserted.themePreference,
        customSlug: inserted.customSlug || undefined,
        featuredSkillIds: (inserted.featuredSkillIdsJson as string[]) || [],
        socialLinks: (inserted.socialLinksJson as Record<string, string>) || {},
        updatedAt: inserted.updatedAt.toISOString(),
      };
    }

    const [updated] = await db
      .update(portfolioSettings)
      .set({
        headline: data.headline !== undefined ? data.headline : existing.headline,
        aboutMdx: data.aboutMdx !== undefined ? data.aboutMdx : existing.aboutMdx,
        isPublic: data.isPublic !== undefined ? data.isPublic : existing.isPublic,
        themePreference: data.themePreference !== undefined ? data.themePreference : existing.themePreference,
        customSlug: data.customSlug !== undefined ? data.customSlug : existing.customSlug,
        featuredSkillIdsJson: data.featuredSkillIds !== undefined ? data.featuredSkillIds : existing.featuredSkillIds,
        socialLinksJson: data.socialLinks !== undefined ? data.socialLinks : existing.socialLinks,
        updatedAt: new Date(),
      })
      .where(eq(portfolioSettings.userId, userId))
      .returning();

    return {
      userId: updated.userId,
      headline: updated.headline || undefined,
      aboutMdx: updated.aboutMdx || undefined,
      isPublic: updated.isPublic,
      themePreference: updated.themePreference,
      customSlug: updated.customSlug || undefined,
      featuredSkillIds: (updated.featuredSkillIdsJson as string[]) || [],
      socialLinks: (updated.socialLinksJson as Record<string, string>) || {},
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async getProjectsByUserId(userId: string): Promise<PortfolioProjectDto[]> {
    const rows = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.userId, userId))
      .orderBy(portfolioProjects.createdAt);

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      title: r.title,
      description: r.description,
      repositoryUrl: r.repositoryUrl || undefined,
      demoUrl: r.demoUrl || undefined,
      technologies: (r.technologiesJson as string[]) || [],
      isFeatured: r.isFeatured,
      starsCount: r.starsCount,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async getProjectById(id: string): Promise<PortfolioProjectDto | null> {
    const rows = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      description: r.description,
      repositoryUrl: r.repositoryUrl || undefined,
      demoUrl: r.demoUrl || undefined,
      technologies: (r.technologiesJson as string[]) || [],
      isFeatured: r.isFeatured,
      starsCount: r.starsCount,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async createProject(userId: string, data: CreatePortfolioProjectDto): Promise<PortfolioProjectDto> {
    const description = data.description || (data as any).descriptionMdx || '';
    const repoUrl = data.repositoryUrl || (data as any).projectUrl || null;
    const isFeatured = data.isFeatured ?? (data as any).featured ?? false;

    const [inserted] = await db
      .insert(portfolioProjects)
      .values({
        userId,
        title: data.title,
        description,
        repositoryUrl: repoUrl,
        demoUrl: data.demoUrl,
        technologiesJson: data.technologies || [],
        isFeatured,
        starsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      title: inserted.title,
      description: inserted.description,
      repositoryUrl: inserted.repositoryUrl || undefined,
      demoUrl: inserted.demoUrl || undefined,
      technologies: (inserted.technologiesJson as string[]) || [],
      isFeatured: inserted.isFeatured,
      starsCount: inserted.starsCount,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  }

  async updateProject(
    id: string,
    userId: string,
    data: UpdatePortfolioProjectDto,
  ): Promise<PortfolioProjectDto | null> {
    const project = await this.getProjectById(id);
    if (!project || project.userId !== userId) return null;

    const newDesc = data.description !== undefined ? data.description : (data as any).descriptionMdx !== undefined ? (data as any).descriptionMdx : project.description;
    const newRepo = data.repositoryUrl !== undefined ? data.repositoryUrl : (data as any).projectUrl !== undefined ? (data as any).projectUrl : project.repositoryUrl;
    const newFeatured = data.isFeatured !== undefined ? data.isFeatured : (data as any).featured !== undefined ? (data as any).featured : project.isFeatured;

    const [updated] = await db
      .update(portfolioProjects)
      .set({
        title: data.title !== undefined ? data.title : project.title,
        description: newDesc,
        repositoryUrl: newRepo,
        demoUrl: data.demoUrl !== undefined ? data.demoUrl : project.demoUrl,
        technologiesJson: data.technologies !== undefined ? data.technologies : project.technologies,
        isFeatured: newFeatured,
        updatedAt: new Date(),
      })
      .where(and(eq(portfolioProjects.id, id), eq(portfolioProjects.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      userId: updated.userId,
      title: updated.title,
      description: updated.description,
      repositoryUrl: updated.repositoryUrl || undefined,
      demoUrl: updated.demoUrl || undefined,
      technologies: (updated.technologiesJson as string[]) || [],
      isFeatured: updated.isFeatured,
      starsCount: updated.starsCount,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }


  async deleteProject(id: string, userId: string): Promise<boolean> {
    const res = await db
      .delete(portfolioProjects)
      .where(and(eq(portfolioProjects.id, id), eq(portfolioProjects.userId, userId)))
      .returning();

    return res.length > 0;
  }
}
