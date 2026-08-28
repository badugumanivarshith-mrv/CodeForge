import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CareerCoachService } from '../../src/modules/career-os/careerCoachService';
import { CareerRiskAlertLevel, CoachingFrequency } from '@codeforge/shared';

describe('Career Coach Unit Tests', () => {
  const mockRepo: any = {
    reports: new Map(),
    async saveCoachingReport(twinId: string, userId: string, data: any) {
      const report = {
        id: `report-${Date.now()}`,
        twinId,
        userId,
        ...data,
        generatedAt: new Date().toISOString(),
      };
      const list = this.reports.get(userId) || [];
      list.unshift(report);
      this.reports.set(userId, list);
      return report;
    },
    async getLatestCoachingReport(userId: string) {
      const list = this.reports.get(userId) || [];
      return list[0] || null;
    },
    async listCoachingReports(userId: string) {
      return this.reports.get(userId) || [];
    },
  };

  const mockTwinService: any = {
    async getOrCreateTwin(userId: string) {
      return {
        id: `twin-${userId}`,
        userId,
        currentRole: 'Software Engineer',
        currentLevel: 'L4 / Mid-Level',
        targetRole: 'Senior Distributed Systems Engineer',
        targetLevel: 'L5 / Senior',
        yearsOfExperience: 3,
        primarySkills: ['TypeScript', 'Node.js', 'PostgreSQL'],
        growthAreas: ['Distributed Systems', 'Rust', 'Raft Consensus'],
        topStrengths: ['High Commit Velocity', 'Typed Architecture'],
        healthScore: 78,
        learningVelocity: 82,
        careerMomentum: 75,
        marketCompetitiveness: 80,
        interviewReadiness: 38, // Lower to test risk alert
        salaryPositioning: 75,
        leadershipPotential: 68,
        currentSalaryUsd: 125000,
        targetSalaryUsd: 185000,
      };
    },
  };

  const coachService = new CareerCoachService(mockRepo, mockTwinService);

  test('1. calculateBurnoutRisk detects elevated burnout risk for intense workloads', () => {
    const highRisk = coachService.calculateBurnoutRisk(45, 95, 70);
    assert.ok(highRisk >= 75, `Expected high burnout score, got ${highRisk}`);

    const lowRisk = coachService.calculateBurnoutRisk(15, 70, 10);
    assert.ok(lowRisk <= 25, `Expected low burnout score, got ${lowRisk}`);
  });

  test('2. detectCareerRisks flags CRITICAL alert when interview readiness is lagging', () => {
    const alerts = coachService.detectCareerRisks(45, 35, ['TypeScript'], 20);

    assert.ok(Array.isArray(alerts));
    const interviewAlert = alerts.find(a => a.category === 'INTERVIEW_READINESS');
    assert.ok(interviewAlert);
    assert.strictEqual(interviewAlert.level, CareerRiskAlertLevel.CRITICAL);
    assert.ok(interviewAlert.suggestedAction.length > 0);
  });

  test('3. generatePromotionPlan provides demonstrable proof points and estimated horizon', () => {
    const plan = coachService.generatePromotionPlan('Staff Backend Architect', 70);

    assert.ok(plan);
    assert.strictEqual(plan.targetRole, 'Staff Backend Architect');
    assert.ok(plan.currentReadinessScore > 0);
    assert.ok(plan.estimatedHorizonMonths >= 3 && plan.estimatedHorizonMonths <= 12);
    assert.ok(plan.leadershipProofPoints.length >= 3);
    assert.ok(plan.keyCompetencyGaps.length >= 2);
  });

  test('4. generateJobSwitchPlan calculates market demand and salary uplift range', () => {
    const plan = coachService.generateJobSwitchPlan('Senior Distributed Systems Engineer', 85, 125000);

    assert.ok(plan);
    assert.strictEqual(plan.targetRole, 'Senior Distributed Systems Engineer');
    assert.strictEqual(plan.marketDemandScore, 92);
    assert.ok(plan.targetSalaryRange.median > 125000);
    assert.ok(plan.targetCompanies.length >= 3);
  });

  test('5. generateCoachingReport synthesizes full report with prioritized action items', async () => {
    const report = await coachService.generateCoachingReport('user-coach-1', CoachingFrequency.WEEKLY);

    assert.ok(report);
    assert.strictEqual(report.userId, 'user-coach-1');
    assert.strictEqual(report.frequency, CoachingFrequency.WEEKLY);
    assert.ok(report.actionItems.length >= 3);
    assert.ok(report.strengths.length >= 2);
    assert.ok(report.riskAlerts.length >= 1);
  });

  test('6. getLatestReport retrieves latest coaching synthesis for user', async () => {
    const latest = await coachService.getLatestReport('user-coach-1');

    assert.ok(latest);
    assert.strictEqual(latest.userId, 'user-coach-1');
    assert.strictEqual(latest.frequency, CoachingFrequency.WEEKLY);
  });
});
