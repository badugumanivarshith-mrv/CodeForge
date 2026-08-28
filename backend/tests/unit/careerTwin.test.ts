import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CareerTwinService } from '../../src/modules/career-os/careerTwinService';
import { CareerEventType } from '@codeforge/shared';

describe('Career Digital Twin Unit Tests', () => {
  const mockRepo: any = {
    twins: new Map(),
    snapshots: new Map(),
    events: new Map(),
    async getTwinByUserId(userId: string) {
      return this.twins.get(userId) || null;
    },
    async createTwin(userId: string, data: any) {
      const twin = {
        id: `twin-${userId}`,
        userId,
        currentRole: data.currentRole || 'Software Engineer',
        currentLevel: data.currentLevel || 'L4 / Mid-Level',
        targetRole: data.targetRole || 'Senior Distributed Systems Engineer',
        targetLevel: data.targetLevel || 'L5 / Senior',
        yearsOfExperience: data.yearsOfExperience || 3,
        primarySkills: data.primarySkills || ['TypeScript', 'Node.js', 'PostgreSQL'],
        growthAreas: ['Distributed Systems', 'Rust', 'Raft Consensus'],
        topStrengths: ['High Commit Velocity', 'Typed Architecture'],
        healthScore: 78,
        learningVelocity: 82,
        careerMomentum: 75,
        marketCompetitiveness: 80,
        interviewReadiness: 70,
        salaryPositioning: 75,
        leadershipPotential: 68,
        currentSalaryUsd: 125000,
        targetSalaryUsd: 185000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.twins.set(userId, twin);
      return twin;
    },
    async updateTwin(userId: string, data: any) {
      const existing = this.twins.get(userId);
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
      this.twins.set(userId, updated);
      return updated;
    },
    async saveSnapshot(twinId: string, userId: string, score: number, metrics: any) {
      const snap = {
        id: `snap-${Date.now()}`,
        twinId,
        userId,
        healthScore: score,
        metrics,
        snapshotDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const list = this.snapshots.get(userId) || [];
      list.push(snap);
      this.snapshots.set(userId, list);
      return snap;
    },
    async getSnapshots(userId: string) {
      return this.snapshots.get(userId) || [];
    },
    async createEvent(twinId: string, userId: string, data: any) {
      const event = {
        id: `event-${Date.now()}`,
        twinId,
        userId,
        eventType: data.eventType,
        title: data.title,
        description: data.description,
        company: data.company,
        role: data.role,
        salaryUsd: data.salaryUsd,
        eventDate: data.eventDate || new Date().toISOString(),
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      const list = this.events.get(userId) || [];
      list.push(event);
      this.events.set(userId, list);
      return event;
    },
    async listEvents(userId: string) {
      return this.events.get(userId) || [];
    },
  };

  const twinService = new CareerTwinService(mockRepo);

  test('1. calculateHealthMetrics computes composite health score and 6 momentum vectors', () => {
    const metrics = twinService.calculateHealthMetrics(90, 85, 80, 75, 70, 65);

    assert.ok(metrics.healthScore >= 75 && metrics.healthScore <= 85);
    assert.strictEqual(metrics.learningVelocity, 90);
    assert.strictEqual(metrics.careerMomentum, 85);
    assert.strictEqual(metrics.marketCompetitiveness, 80);
  });

  test('2. calculateHealthMetrics clamps values within strict [10, 100] bounds', () => {
    const clampedHigh = twinService.calculateHealthMetrics(150, 200, 110, 105, 120, 130);
    assert.strictEqual(clampedHigh.learningVelocity, 100);
    assert.strictEqual(clampedHigh.careerMomentum, 100);
    assert.strictEqual(clampedHigh.healthScore, 100);

    const clampedLow = twinService.calculateHealthMetrics(-50, 0, 5, 2, -10, 8);
    assert.strictEqual(clampedLow.learningVelocity, 10);
    assert.strictEqual(clampedLow.careerMomentum, 10);
    assert.strictEqual(clampedLow.healthScore, 10);
  });

  test('3. getOrCreateTwin creates default living twin for new user', async () => {
    const twin = await twinService.getOrCreateTwin('user-twin-1', {
      currentRole: 'Backend Engineer',
      targetRole: 'Staff Distributed Systems Engineer',
    });

    assert.ok(twin);
    assert.strictEqual(twin.userId, 'user-twin-1');
    assert.strictEqual(twin.currentRole, 'Backend Engineer');
    assert.strictEqual(twin.targetRole, 'Staff Distributed Systems Engineer');
    assert.ok(twin.healthScore >= 10);
  });

  test('4. updateTwin recalculates health score and updates target skills', async () => {
    const updated = await twinService.updateTwin('user-twin-1', {
      targetRole: 'Principal Cloud Architect',
      learningVelocity: 95,
      careerMomentum: 90,
      primarySkills: ['Rust', 'Distributed Systems', 'WASM', 'PostgreSQL'],
    });

    assert.ok(updated);
    assert.strictEqual(updated.targetRole, 'Principal Cloud Architect');
    assert.ok(updated.primarySkills.includes('Rust'));
    assert.ok(updated.healthScore >= 75);
  });

  test('5. recordCareerEvent adds verified event and updates twin role/salary', async () => {
    const event = await twinService.recordCareerEvent('user-twin-1', {
      eventType: CareerEventType.PROMOTION,
      title: 'Promoted to Senior Backend Engineer',
      description: 'Led high-throughput Raft consensus distributed storage service',
      company: 'CodeForge Labs',
      role: 'Senior Backend Engineer',
      salaryUsd: 165000,
    });

    assert.ok(event);
    assert.strictEqual(event.eventType, CareerEventType.PROMOTION);
    assert.strictEqual(event.salaryUsd, 165000);

    const twin = await twinService.getOrCreateTwin('user-twin-1');
    assert.strictEqual(twin.currentRole, 'Senior Backend Engineer');
    assert.strictEqual(twin.currentSalaryUsd, 165000);
  });

  test('6. getSnapshots returns historical health score snapshots', async () => {
    const snapshots = await twinService.getSnapshots('user-twin-1');

    assert.ok(Array.isArray(snapshots));
    assert.ok(snapshots.length >= 1);
    assert.ok(snapshots[0].healthScore > 0);
  });
});
