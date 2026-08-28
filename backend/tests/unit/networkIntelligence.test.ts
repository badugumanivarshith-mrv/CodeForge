import { test, describe } from 'node:test';
import assert from 'node:assert';
import { NetworkIntelligenceService } from '../../src/modules/career-os/networkIntelligenceService';
import { NetworkRelationType } from '@codeforge/shared';

describe('Network Intelligence System Unit Tests', () => {
  const mockRepo: any = {
    connections: new Map(),
    async createNetworkConnection(userId: string, data: any) {
      const conn = {
        id: `conn-${Date.now()}-${Math.random()}`,
        userId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      const list = this.connections.get(userId) || [];
      list.push(conn);
      this.connections.set(userId, list);
      return conn;
    },
    async listNetworkConnections(userId: string) {
      return this.connections.get(userId) || [];
    },
    async deleteNetworkConnection(connectionId: string, userId: string) {
      const list = this.connections.get(userId) || [];
      const filtered = list.filter((c: any) => c.id !== connectionId);
      this.connections.set(userId, filtered);
      return filtered.length < list.length;
    },
  };

  const netService = new NetworkIntelligenceService(mockRepo);

  test('1. calculateNetworkStrength calculates network score based on connection count & strength', () => {
    const score = netService.calculateNetworkStrength([
      { id: '1', userId: 'u1', contactName: 'A', contactRole: 'R', contactCompany: 'C', strengthScore: 90, relationType: NetworkRelationType.MENTOR, createdAt: '' },
      { id: '2', userId: 'u1', contactName: 'B', contactRole: 'R', contactCompany: 'C', strengthScore: 80, relationType: NetworkRelationType.PEER_ENGINEER, createdAt: '' },
      { id: '3', userId: 'u1', contactName: 'C', contactRole: 'R', contactCompany: 'C', strengthScore: 75, relationType: NetworkRelationType.RECRUITER, createdAt: '' },
    ]);

    assert.ok(score >= 50 && score <= 100);
  });

  test('2. calculateNetworkStrength handles zero connections gracefully', () => {
    const score = netService.calculateNetworkStrength([]);
    assert.strictEqual(score, 20);
  });

  test('3. addConnection records a new professional contact into user graph', async () => {
    const conn = await netService.addConnection('user-net-1', {
      contactName: 'Alice Chen',
      contactRole: 'Staff Systems Architect',
      contactCompany: 'Stripe',
      relationType: NetworkRelationType.MENTOR,
      strengthScore: 88,
      notes: 'Bi-weekly system design sync',
    });

    assert.ok(conn);
    assert.strictEqual(conn.contactName, 'Alice Chen');
    assert.strictEqual(conn.relationType, NetworkRelationType.MENTOR);
  });

  test('4. listConnections returns connections for user', async () => {
    const list = await netService.listConnections('user-net-1');

    assert.ok(Array.isArray(list));
    assert.ok(list.length >= 1);
    assert.strictEqual(list[0].contactName, 'Alice Chen');
  });

  test('5. getNetworkIntelligence aggregates mentors, recruiters, and events', async () => {
    const intel = await netService.getNetworkIntelligence('user-net-1');

    assert.ok(intel);
    assert.ok(intel.networkStrengthScore > 0);
    assert.ok(intel.totalConnections >= 1);
    assert.ok(intel.mentorRecommendations.length >= 2);
    assert.ok(intel.recruiterRecommendations.length >= 2);
    assert.ok(intel.industryEvents.length >= 2);
    assert.ok(intel.recommendedCommunities.length >= 2);
  });

  test('6. deleteConnection removes connection by id', async () => {
    const list = await netService.listConnections('user-net-1');
    const connId = list[0].id;

    const deleted = await netService.deleteConnection(connId, 'user-net-1');
    assert.strictEqual(deleted, true);

    const remaining = await netService.listConnections('user-net-1');
    assert.strictEqual(remaining.length, list.length - 1);
  });
});
