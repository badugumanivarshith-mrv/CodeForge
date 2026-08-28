import { eq, desc, and } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  careerTwins,
  careerSnapshots,
  careerEvents,
  careerMilestones,
  careerOsGoals,
  careerCoachingReports,
  personalBrandProfiles,
  networkConnections,
  careerPredictions,
} from '../database/schema';
import { ICareerOsRepository } from './interfaces/ICareerOsRepository';
import {
  CareerTwinDto,
  CreateCareerTwinDto,
  UpdateCareerTwinDto,
  CareerSnapshotDto,
  CareerEventDto,
  CreateCareerEventDto,
  CareerMilestoneDto,
  CareerOsGoalDto,
  CreateCareerOsGoalDto,
  UpdateCareerOsGoalDto,
  CareerCoachingReportDto,
  PersonalBrandProfileDto,
  NetworkConnectionDto,
  CareerPredictionDto,
  CareerGoalStatus,
  ForecastHorizon,
} from '@codeforge/shared';

export class CareerOsRepository implements ICareerOsRepository {
  // 1. Digital Twin
  async getTwinByUserId(userId: string): Promise<CareerTwinDto | null> {
    const records = await db.select().from(careerTwins).where(eq(careerTwins.userId, userId)).limit(1);
    if (!records.length) return null;
    return this.mapTwin(records[0]);
  }

  async createTwin(userId: string, data: CreateCareerTwinDto): Promise<CareerTwinDto> {
    const [inserted] = await db.insert(careerTwins).values({
      userId,
      currentRole: data.currentRole || 'Software Engineer',
      targetRole: data.targetRole || 'Senior Software Engineer',
      currentLevel: data.currentLevel || 'L4 / Mid-Level',
      targetLevel: data.targetLevel || 'L5 / Senior',
      currentSalaryUsd: data.currentSalaryUsd || 120000,
      targetSalaryUsd: data.targetSalaryUsd || 185000,
      yearsOfExperience: String(data.yearsOfExperience || 3.0),
      primarySkills: data.primarySkills || ['TypeScript', 'Node.js', 'PostgreSQL', 'Go', 'System Design'],
    }).returning();

    return this.mapTwin(inserted);
  }

  async updateTwin(userId: string, data: UpdateCareerTwinDto): Promise<CareerTwinDto> {
    const valuesToUpdate: Record<string, any> = { updatedAt: new Date() };
    if (data.currentRole !== undefined) valuesToUpdate.currentRole = data.currentRole;
    if (data.targetRole !== undefined) valuesToUpdate.targetRole = data.targetRole;
    if (data.currentLevel !== undefined) valuesToUpdate.currentLevel = data.currentLevel;
    if (data.targetLevel !== undefined) valuesToUpdate.targetLevel = data.targetLevel;
    if (data.currentSalaryUsd !== undefined) valuesToUpdate.currentSalaryUsd = data.currentSalaryUsd;
    if (data.targetSalaryUsd !== undefined) valuesToUpdate.targetSalaryUsd = data.targetSalaryUsd;
    if (data.yearsOfExperience !== undefined) valuesToUpdate.yearsOfExperience = String(data.yearsOfExperience);
    if (data.primarySkills !== undefined) valuesToUpdate.primarySkills = data.primarySkills;
    if (data.topStrengths !== undefined) valuesToUpdate.topStrengths = data.topStrengths;
    if (data.growthAreas !== undefined) valuesToUpdate.growthAreas = data.growthAreas;
    if (data.metadata !== undefined) valuesToUpdate.metadata = data.metadata;

    const [updated] = await db.update(careerTwins)
      .set(valuesToUpdate)
      .where(eq(careerTwins.userId, userId))
      .returning();

    if (!updated) return null as any;
    return this.mapTwin(updated);
  }

  async saveSnapshot(twinId: string, userId: string, healthScore: number, metrics: Record<string, number>): Promise<CareerSnapshotDto> {
    const [snapshot] = await db.insert(careerSnapshots).values({
      twinId,
      userId,
      healthScore: String(healthScore),
      metrics,
    }).returning();

    return {
      id: snapshot.id,
      twinId: snapshot.twinId,
      userId: snapshot.userId,
      healthScore: Number(snapshot.healthScore),
      metrics: snapshot.metrics as any,
      snapshotDate: snapshot.snapshotDate.toISOString(),
      createdAt: snapshot.createdAt.toISOString(),
    };
  }

  async getSnapshots(userId: string, limit = 12): Promise<CareerSnapshotDto[]> {
    const records = await db.select().from(careerSnapshots)
      .where(eq(careerSnapshots.userId, userId))
      .orderBy(desc(careerSnapshots.snapshotDate))
      .limit(limit);

    return records.map(r => ({
      id: r.id,
      twinId: r.twinId,
      userId: r.userId,
      healthScore: Number(r.healthScore),
      metrics: r.metrics as any,
      snapshotDate: r.snapshotDate.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));
  }

  // 2. Events & Milestones
  async createEvent(twinId: string, userId: string, data: CreateCareerEventDto): Promise<CareerEventDto> {
    const [inserted] = await db.insert(careerEvents).values({
      twinId,
      userId,
      eventType: data.eventType,
      title: data.title,
      description: data.description,
      company: data.company,
      role: data.role,
      salaryUsd: data.salaryUsd,
      eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
      metadata: data.metadata || {},
    }).returning();

    return {
      id: inserted.id,
      twinId: inserted.twinId,
      userId: inserted.userId,
      eventType: inserted.eventType as any,
      title: inserted.title,
      description: inserted.description,
      company: inserted.company,
      role: inserted.role,
      salaryUsd: inserted.salaryUsd,
      eventDate: inserted.eventDate.toISOString(),
      isVerified: inserted.isVerified,
      metadata: inserted.metadata as any,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listEvents(userId: string): Promise<CareerEventDto[]> {
    const records = await db.select().from(careerEvents)
      .where(eq(careerEvents.userId, userId))
      .orderBy(desc(careerEvents.eventDate));

    return records.map(r => ({
      id: r.id,
      twinId: r.twinId,
      userId: r.userId,
      eventType: r.eventType as any,
      title: r.title,
      description: r.description,
      company: r.company,
      role: r.role,
      salaryUsd: r.salaryUsd,
      eventDate: r.eventDate.toISOString(),
      isVerified: r.isVerified,
      metadata: r.metadata as any,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createMilestone(twinId: string, userId: string, title: string, description: string, category = 'TECHNICAL', targetDate?: string): Promise<CareerMilestoneDto> {
    const [inserted] = await db.insert(careerMilestones).values({
      twinId,
      userId,
      title,
      description,
      category,
      targetDate: targetDate ? new Date(targetDate) : undefined,
    }).returning();

    return {
      id: inserted.id,
      twinId: inserted.twinId,
      userId: inserted.userId,
      title: inserted.title,
      description: inserted.description,
      category: inserted.category,
      isAchieved: inserted.isAchieved,
      targetDate: inserted.targetDate ? inserted.targetDate.toISOString() : null,
      achievedDate: inserted.achievedDate ? inserted.achievedDate.toISOString() : null,
      xpEarned: inserted.xpEarned,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listMilestones(userId: string): Promise<CareerMilestoneDto[]> {
    const records = await db.select().from(careerMilestones)
      .where(eq(careerMilestones.userId, userId))
      .orderBy(desc(careerMilestones.createdAt));

    return records.map(r => ({
      id: r.id,
      twinId: r.twinId,
      userId: r.userId,
      title: r.title,
      description: r.description,
      category: r.category,
      isAchieved: r.isAchieved,
      targetDate: r.targetDate ? r.targetDate.toISOString() : null,
      achievedDate: r.achievedDate ? r.achievedDate.toISOString() : null,
      xpEarned: r.xpEarned,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async achieveMilestone(milestoneId: string, userId: string): Promise<CareerMilestoneDto | null> {
    const [updated] = await db.update(careerMilestones)
      .set({ isAchieved: true, achievedDate: new Date() })
      .where(and(eq(careerMilestones.id, milestoneId), eq(careerMilestones.userId, userId)))
      .returning();

    if (!updated) return null;
    return {
      id: updated.id,
      twinId: updated.twinId,
      userId: updated.userId,
      title: updated.title,
      description: updated.description,
      category: updated.category,
      isAchieved: updated.isAchieved,
      targetDate: updated.targetDate ? updated.targetDate.toISOString() : null,
      achievedDate: updated.achievedDate ? updated.achievedDate.toISOString() : null,
      xpEarned: updated.xpEarned,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  // 3. Goals & Roadmap
  async createGoal(twinId: string, userId: string, data: CreateCareerOsGoalDto): Promise<CareerOsGoalDto> {
    const [inserted] = await db.insert(careerOsGoals).values({
      twinId,
      userId,
      type: data.type,
      title: data.title,
      description: data.description,
      targetRole: data.targetRole,
      targetSalaryUsd: data.targetSalaryUsd,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      milestones: data.milestones || [],
    }).returning();

    return this.mapGoal(inserted);
  }

  async listGoals(userId: string): Promise<CareerOsGoalDto[]> {
    const records = await db.select().from(careerOsGoals)
      .where(eq(careerOsGoals.userId, userId))
      .orderBy(desc(careerOsGoals.createdAt));

    return records.map(r => this.mapGoal(r));
  }

  async updateGoal(goalId: string, userId: string, data: UpdateCareerOsGoalDto): Promise<CareerOsGoalDto | null> {
    const valuesToUpdate: Record<string, any> = { updatedAt: new Date() };
    if (data.title !== undefined) valuesToUpdate.title = data.title;
    if (data.description !== undefined) valuesToUpdate.description = data.description;
    if (data.targetRole !== undefined) valuesToUpdate.targetRole = data.targetRole;
    if (data.targetSalaryUsd !== undefined) valuesToUpdate.targetSalaryUsd = data.targetSalaryUsd;
    if (data.progressPercentage !== undefined) valuesToUpdate.progressPercentage = String(data.progressPercentage);
    if (data.status !== undefined) valuesToUpdate.status = data.status;
    if (data.targetDate !== undefined) valuesToUpdate.targetDate = data.targetDate ? new Date(data.targetDate) : null;
    if (data.achievedDate !== undefined) valuesToUpdate.achievedDate = data.achievedDate ? new Date(data.achievedDate) : null;
    if (data.milestones !== undefined) valuesToUpdate.milestones = data.milestones;
    if (data.riskFactors !== undefined) valuesToUpdate.riskFactors = data.riskFactors;

    const [updated] = await db.update(careerOsGoals)
      .set(valuesToUpdate)
      .where(and(eq(careerOsGoals.id, goalId), eq(careerOsGoals.userId, userId)))
      .returning();

    if (!updated) return null;
    return this.mapGoal(updated);
  }

  async deleteGoal(goalId: string, userId: string): Promise<boolean> {
    const result = await db.delete(careerOsGoals)
      .where(and(eq(careerOsGoals.id, goalId), eq(careerOsGoals.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 4. Coaching Reports
  async saveCoachingReport(twinId: string, userId: string, data: Omit<CareerCoachingReportDto, 'id' | 'twinId' | 'userId' | 'generatedAt'>): Promise<CareerCoachingReportDto> {
    const [inserted] = await db.insert(careerCoachingReports).values({
      twinId,
      userId,
      frequency: data.frequency,
      summary: data.summary,
      healthMetrics: data.healthMetrics as any,
      strengths: data.strengths,
      riskAlerts: data.riskAlerts,
      actionItems: data.actionItems,
      promotionReadiness: String(data.promotionReadiness),
      burnoutRiskScore: String(data.burnoutRiskScore),
      promotionPlan: data.promotionPlan,
      jobSwitchPlan: data.jobSwitchPlan,
    }).returning();

    return {
      id: inserted.id,
      twinId: inserted.twinId,
      userId: inserted.userId,
      frequency: inserted.frequency as any,
      summary: inserted.summary,
      healthMetrics: inserted.healthMetrics as any,
      strengths: inserted.strengths,
      riskAlerts: inserted.riskAlerts as any,
      actionItems: inserted.actionItems as any,
      promotionReadiness: Number(inserted.promotionReadiness),
      burnoutRiskScore: Number(inserted.burnoutRiskScore),
      promotionPlan: inserted.promotionPlan as any,
      jobSwitchPlan: inserted.jobSwitchPlan as any,
      generatedAt: inserted.generatedAt.toISOString(),
    };
  }

  async getLatestCoachingReport(userId: string): Promise<CareerCoachingReportDto | null> {
    const records = await db.select().from(careerCoachingReports)
      .where(eq(careerCoachingReports.userId, userId))
      .orderBy(desc(careerCoachingReports.generatedAt))
      .limit(1);

    if (!records.length) return null;
    const r = records[0];
    return {
      id: r.id,
      twinId: r.twinId,
      userId: r.userId,
      frequency: r.frequency as any,
      summary: r.summary,
      healthMetrics: r.healthMetrics as any,
      strengths: r.strengths,
      riskAlerts: r.riskAlerts as any,
      actionItems: r.actionItems as any,
      promotionReadiness: Number(r.promotionReadiness),
      burnoutRiskScore: Number(r.burnoutRiskScore),
      promotionPlan: r.promotionPlan as any,
      jobSwitchPlan: r.jobSwitchPlan as any,
      generatedAt: r.generatedAt.toISOString(),
    };
  }

  async listCoachingReports(userId: string): Promise<CareerCoachingReportDto[]> {
    const records = await db.select().from(careerCoachingReports)
      .where(eq(careerCoachingReports.userId, userId))
      .orderBy(desc(careerCoachingReports.generatedAt));

    return records.map(r => ({
      id: r.id,
      twinId: r.twinId,
      userId: r.userId,
      frequency: r.frequency as any,
      summary: r.summary,
      healthMetrics: r.healthMetrics as any,
      strengths: r.strengths,
      riskAlerts: r.riskAlerts as any,
      actionItems: r.actionItems as any,
      promotionReadiness: Number(r.promotionReadiness),
      burnoutRiskScore: Number(r.burnoutRiskScore),
      promotionPlan: r.promotionPlan as any,
      jobSwitchPlan: r.jobSwitchPlan as any,
      generatedAt: r.generatedAt.toISOString(),
    }));
  }

  // 5. Personal Brand
  async getPersonalBrandProfile(userId: string): Promise<PersonalBrandProfileDto | null> {
    const records = await db.select().from(personalBrandProfiles).where(eq(personalBrandProfiles.userId, userId)).limit(1);
    if (!records.length) return null;
    const r = records[0];
    return {
      userId: r.userId,
      brandScore: {
        brandScore: Number(r.brandScore),
        githubScore: Number(r.githubScore),
        portfolioScore: Number(r.portfolioScore),
        linkedinScore: Number(r.linkedinScore),
        contentScore: Number(r.contentScore),
        ossScore: Number(r.ossScore),
        brandTier: r.brandTier as any,
      },
      recommendations: r.recommendations,
      contentPlans: r.contentPlans,
      speakingOpportunities: r.speakingOpportunities,
      openSourceRecommendations: r.openSourceRecommendations,
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async upsertPersonalBrandProfile(userId: string, profile: Partial<PersonalBrandProfileDto>): Promise<PersonalBrandProfileDto> {
    const values = {
      userId,
      brandScore: profile.brandScore?.brandScore !== undefined ? String(profile.brandScore.brandScore) : '68.00',
      githubScore: profile.brandScore?.githubScore !== undefined ? String(profile.brandScore.githubScore) : '72.00',
      portfolioScore: profile.brandScore?.portfolioScore !== undefined ? String(profile.brandScore.portfolioScore) : '65.00',
      linkedinScore: profile.brandScore?.linkedinScore !== undefined ? String(profile.brandScore.linkedinScore) : '70.00',
      contentScore: profile.brandScore?.contentScore !== undefined ? String(profile.brandScore.contentScore) : '55.00',
      ossScore: profile.brandScore?.ossScore !== undefined ? String(profile.brandScore.ossScore) : '60.00',
      brandTier: profile.brandScore?.brandTier || 'STRONG',
      recommendations: profile.recommendations || [],
      contentPlans: profile.contentPlans || [],
      speakingOpportunities: profile.speakingOpportunities || [],
      openSourceRecommendations: profile.openSourceRecommendations || [],
      updatedAt: new Date(),
    };

    const [upserted] = await db.insert(personalBrandProfiles)
      .values(values)
      .onConflictDoUpdate({
        target: personalBrandProfiles.userId,
        set: values,
      })
      .returning();

    return {
      userId: upserted.userId,
      brandScore: {
        brandScore: Number(upserted.brandScore),
        githubScore: Number(upserted.githubScore),
        portfolioScore: Number(upserted.portfolioScore),
        linkedinScore: Number(upserted.linkedinScore),
        contentScore: Number(upserted.contentScore),
        ossScore: Number(upserted.ossScore),
        brandTier: upserted.brandTier as any,
      },
      recommendations: upserted.recommendations,
      contentPlans: upserted.contentPlans,
      speakingOpportunities: upserted.speakingOpportunities,
      openSourceRecommendations: upserted.openSourceRecommendations,
      updatedAt: upserted.updatedAt.toISOString(),
    };
  }

  // 6. Network Connections
  async createNetworkConnection(userId: string, data: Omit<NetworkConnectionDto, 'id' | 'userId' | 'createdAt'>): Promise<NetworkConnectionDto> {
    const [inserted] = await db.insert(networkConnections).values({
      userId,
      connectedUserId: data.connectedUserId || undefined,
      contactName: data.contactName,
      contactRole: data.contactRole,
      contactCompany: data.contactCompany,
      relationType: data.relationType,
      strengthScore: String(data.strengthScore || 75.00),
      notes: data.notes || null,
      lastInteractionAt: data.lastInteractionAt ? new Date(data.lastInteractionAt) : new Date(),
    }).returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      connectedUserId: inserted.connectedUserId,
      contactName: inserted.contactName,
      contactRole: inserted.contactRole,
      contactCompany: inserted.contactCompany,
      relationType: inserted.relationType as any,
      strengthScore: Number(inserted.strengthScore),
      notes: inserted.notes,
      lastInteractionAt: inserted.lastInteractionAt ? inserted.lastInteractionAt.toISOString() : null,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listNetworkConnections(userId: string): Promise<NetworkConnectionDto[]> {
    const records = await db.select().from(networkConnections)
      .where(eq(networkConnections.userId, userId))
      .orderBy(desc(networkConnections.strengthScore));

    return records.map(r => ({
      id: r.id,
      userId: r.userId,
      connectedUserId: r.connectedUserId,
      contactName: r.contactName,
      contactRole: r.contactRole,
      contactCompany: r.contactCompany,
      relationType: r.relationType as any,
      strengthScore: Number(r.strengthScore),
      notes: r.notes,
      lastInteractionAt: r.lastInteractionAt ? r.lastInteractionAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async deleteNetworkConnection(connectionId: string, userId: string): Promise<boolean> {
    const result = await db.delete(networkConnections)
      .where(and(eq(networkConnections.id, connectionId), eq(networkConnections.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 7. Predictions
  async savePredictions(twinId: string, userId: string, predictions: CareerPredictionDto[]): Promise<CareerPredictionDto[]> {
    // Delete older predictions for this user and insert fresh batch
    await db.delete(careerPredictions).where(eq(careerPredictions.userId, userId));

    const rows = predictions.map(p => ({
      twinId,
      userId,
      horizon: p.horizon,
      promotionProbability: String(p.promotionProbability),
      salaryGrowthProbability: String(p.salaryGrowthProbability),
      jobSwitchProbability: String(p.jobSwitchProbability),
      leadershipReadiness: String(p.leadershipReadiness),
      skillRelevanceScore: String(p.skillRelevanceScore),
      careerRiskScore: String(p.careerRiskScore),
      confidenceScore: String(p.confidenceScore),
      predictedRoles: p.predictedRoles,
      growthDrivers: p.growthDrivers,
      riskFactors: p.riskFactors,
    }));

    const inserted = await db.insert(careerPredictions).values(rows).returning();

    return inserted.map(r => ({
      horizon: r.horizon as ForecastHorizon,
      promotionProbability: Number(r.promotionProbability),
      salaryGrowthProbability: Number(r.salaryGrowthProbability),
      jobSwitchProbability: Number(r.jobSwitchProbability),
      leadershipReadiness: Number(r.leadershipReadiness),
      skillRelevanceScore: Number(r.skillRelevanceScore),
      careerRiskScore: Number(r.careerRiskScore),
      confidenceScore: Number(r.confidenceScore),
      predictedRoles: r.predictedRoles,
      growthDrivers: r.growthDrivers,
      riskFactors: r.riskFactors,
    }));
  }

  async getLatestPredictions(userId: string): Promise<CareerPredictionDto[]> {
    const records = await db.select().from(careerPredictions)
      .where(eq(careerPredictions.userId, userId))
      .orderBy(careerPredictions.horizon);

    return records.map(r => ({
      horizon: r.horizon as ForecastHorizon,
      promotionProbability: Number(r.promotionProbability),
      salaryGrowthProbability: Number(r.salaryGrowthProbability),
      jobSwitchProbability: Number(r.jobSwitchProbability),
      leadershipReadiness: Number(r.leadershipReadiness),
      skillRelevanceScore: Number(r.skillRelevanceScore),
      careerRiskScore: Number(r.careerRiskScore),
      confidenceScore: Number(r.confidenceScore),
      predictedRoles: r.predictedRoles,
      growthDrivers: r.growthDrivers,
      riskFactors: r.riskFactors,
    }));
  }

  // Helpers
  private mapTwin(record: any): CareerTwinDto {
    return {
      id: record.id,
      userId: record.userId,
      healthScore: Number(record.healthScore),
      learningVelocity: Number(record.learningVelocity),
      careerMomentum: Number(record.careerMomentum),
      marketCompetitiveness: Number(record.marketCompetitiveness),
      interviewReadiness: Number(record.interviewReadiness),
      salaryPositioning: Number(record.salaryPositioning),
      leadershipPotential: Number(record.leadershipPotential),
      currentRole: record.currentRole,
      targetRole: record.targetRole,
      currentLevel: record.currentLevel,
      targetLevel: record.targetLevel,
      currentSalaryUsd: record.currentSalaryUsd,
      targetSalaryUsd: record.targetSalaryUsd,
      yearsOfExperience: Number(record.yearsOfExperience),
      primarySkills: record.primarySkills || [],
      topStrengths: record.topStrengths || [],
      growthAreas: record.growthAreas || [],
      metadata: record.metadata || {},
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private mapGoal(record: any): CareerOsGoalDto {
    return {
      id: record.id,
      twinId: record.twinId,
      userId: record.userId,
      type: record.type,
      title: record.title,
      description: record.description,
      targetRole: record.targetRole,
      targetSalaryUsd: record.targetSalaryUsd,
      progressPercentage: Number(record.progressPercentage),
      status: record.status as CareerGoalStatus,
      targetDate: record.targetDate ? record.targetDate.toISOString() : null,
      achievedDate: record.achievedDate ? record.achievedDate.toISOString() : null,
      milestones: record.milestones || [],
      riskFactors: record.riskFactors || [],
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}

export const careerOsRepository = new CareerOsRepository();
