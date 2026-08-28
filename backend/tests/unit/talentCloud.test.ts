import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TalentCloudService } from '../../src/modules/global-network/talentCloudService';
import { VerificationStatus, ReputationTier } from '@codeforge/shared';

describe('Phase 16: Global Talent Cloud Unit Tests', () => {
  const createMockRepo = () => {
    const profiles = new Map<string, any>();
    const skills = new Map<string, any[]>();

    return {
      profiles,
      skills,
      async createTalentProfile(userId: string, data: any) {
        const p = {
          id: `tp-${userId}`,
          userId,
          fullName: data.fullName || 'Test User',
          title: data.title || 'Developer',
          bio: data.bio || '',
          hourlyRateUsd: data.hourlyRateUsd || 100,
          reputationScore: data.reputationScore || 100,
          reputationTier: data.reputationTier || ReputationTier.PRACTITIONER,
          portfolioScore: data.portfolioScore || 80,
          location: data.location || 'Remote',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        profiles.set(userId, p);
        return p;
      },
      async getTalentProfileByUserId(userId: string) {
        return profiles.get(userId) || null;
      },
      async searchTalentProfiles(filter?: any) {
        return Array.from(profiles.values());
      },
      async listTalentProfiles() {
        return Array.from(profiles.values());
      },
      async listVerifiedSkills(talentProfileId: string) {
        return skills.get(talentProfileId) || [];
      },
      async updateReputation() {
        return {};
      },
      async addVerifiedSkill(talentProfileId: string, skillName: string, proficiencyLevel: string, score: number) {
        const sk = {
          id: `sk-${Date.now()}`,
          talentProfileId,
          skillName,
          proficiencyLevel,
          verificationStatus: VerificationStatus.VERIFIED,
          score,
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const list = skills.get(talentProfileId) || [];
        list.push(sk);
        skills.set(talentProfileId, list);
        return sk;
      },
      async createSkillVerificationRequest(talentProfileId: string, req: any) {
        return {
          id: 'svr-1',
          talentProfileId,
          skillName: req.skillName,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should create and retrieve a global talent profile', async () => {
    const repo = createMockRepo();
    const service = new TalentCloudService(repo);

    const profile = await service.createOrUpdateProfile('user-100', {
      fullName: 'Sarah Connor',
      title: 'Senior Autonomous Systems Engineer',
      hourlyRateUsd: 150,
      reputationScore: 500,
      reputationTier: ReputationTier.LUMINARY,
    });

    assert.strictEqual(profile.userId, 'user-100');
    assert.strictEqual(profile.fullName, 'Sarah Connor');
    assert.strictEqual(profile.reputationTier, ReputationTier.LUMINARY);

    const fetched = await service.getProfile('user-100');
    assert.ok(fetched);
    assert.strictEqual(fetched.fullName, 'Sarah Connor');
  });

  test('should verify a talent skill and issue verification badge', async () => {
    const repo = createMockRepo();
    const service = new TalentCloudService(repo);

    const profile = await service.createOrUpdateProfile('user-101', {
      fullName: 'David Bowie',
    });

    const verified = await service.verifySkill(profile.id, 'Distributed Multi-Agent Raft', 'expert', 96.5);
    assert.strictEqual(verified.skillName, 'Distributed Multi-Agent Raft');
    assert.strictEqual(verified.verificationStatus, VerificationStatus.VERIFIED);
    assert.strictEqual(verified.score, 96.5);
  });

  test('should match talent to open positions with semantic score calculation', async () => {
    const repo = createMockRepo();
    const service = new TalentCloudService(repo);

    const profile = await service.createOrUpdateProfile('user-102', {
      fullName: 'Alice Walker',
      title: 'Principal Distributed Architect',
      reputationTier: ReputationTier.LUMINARY,
      reputationScore: 600,
      portfolioScore: 99,
    });

    await service.verifySkill(profile.id, 'Distributed Systems', 'expert', 95);
    await service.verifySkill(profile.id, 'Raft Consensus', 'expert', 95);

    const matches = await service.matchTalentForRole({
      roleTitle: 'Principal Distributed Architect',
      requiredSkills: ['Distributed Systems', 'Raft Consensus'],
      budgetHourlyMaxUsd: 200,
    });

    assert.ok(matches.length > 0);
    assert.ok(matches[0].matchScore >= 80, 'Top match score should be >= 80');
    assert.strictEqual(matches[0].talent.fullName, 'Alice Walker');
  });
});
