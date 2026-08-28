import { test, describe } from 'node:test';
import assert from 'node:assert';
import { PersonalBrandService } from '../../src/modules/career-os/personalBrandService';

describe('Personal Brand Builder Unit Tests', () => {
  const mockRepo: any = {
    profiles: new Map(),
    async getPersonalBrandProfile(userId: string) {
      return this.profiles.get(userId) || null;
    },
    async upsertPersonalBrandProfile(userId: string, data: any) {
      const profile = { userId, ...data, updatedAt: new Date().toISOString() };
      this.profiles.set(userId, profile);
      return profile;
    },
  };

  const brandService = new PersonalBrandService(mockRepo);

  test('1. calculateBrandScore computes composite score and assigns brand tier', () => {
    const authorityScore = brandService.calculateBrandScore(90, 85, 90, 85, 90);
    assert.strictEqual(authorityScore.brandTier, 'AUTHORITY');
    assert.ok(authorityScore.brandScore >= 85);

    const strongScore = brandService.calculateBrandScore(75, 75, 75, 75, 75);
    assert.strictEqual(strongScore.brandTier, 'STRONG');
    assert.ok(strongScore.brandScore >= 70 && strongScore.brandScore < 85);

    const devScore = brandService.calculateBrandScore(55, 55, 55, 55, 55);
    assert.strictEqual(devScore.brandTier, 'DEVELOPING');
  });

  test('2. generateContentPlans creates platform-specific content initiatives', () => {
    const plans = brandService.generateContentPlans(['Rust', 'Distributed Systems']);

    assert.ok(Array.isArray(plans));
    assert.ok(plans.length >= 3);

    const blogPlan = plans.find(p => p.platform === 'BLOG');
    assert.ok(blogPlan);
    assert.ok(blogPlan.recommendedKeywords.length >= 2);
    assert.ok(blogPlan.estimatedReachScore > 0);
  });

  test('3. getPersonalBrandProfile initializes default profile for user', async () => {
    const profile = await brandService.getPersonalBrandProfile('user-brand-1');

    assert.ok(profile);
    assert.strictEqual(profile.userId, 'user-brand-1');
    assert.ok(profile.brandScore.brandScore > 0);
    assert.ok(profile.contentPlans.length >= 3);
    assert.ok(profile.speakingOpportunities.length >= 2);
    assert.ok(profile.openSourceRecommendations.length >= 2);
  });

  test('4. getPersonalBrandProfile returns existing profile on subsequent call', async () => {
    const profile = await brandService.getPersonalBrandProfile('user-brand-1');
    assert.ok(profile);
    assert.strictEqual(profile.userId, 'user-brand-1');
  });

  test('5. updateBrandProfile updates custom brand profile elements', async () => {
    const updated = await brandService.updateBrandProfile('user-brand-1', {
      recommendations: ['Publish weekly on Substack', 'Contribute 2 PRs to tokio-rs'],
    });

    assert.ok(updated);
    assert.deepStrictEqual(updated.recommendations, ['Publish weekly on Substack', 'Contribute 2 PRs to tokio-rs']);
  });

  test('6. calculateBrandScore clamps outlier inputs safely within [10, 100]', () => {
    const clamped = brandService.calculateBrandScore(120, -20, 200, 0, 150);
    assert.ok(clamped.brandScore >= 10 && clamped.brandScore <= 100);
    assert.strictEqual(clamped.githubScore, 100);
    assert.strictEqual(clamped.portfolioScore, 10);
  });
});
