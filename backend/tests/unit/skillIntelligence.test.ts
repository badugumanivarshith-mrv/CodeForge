import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SkillIntelligenceService } from '../../src/modules/career-os/skillIntelligenceService';
import { SkillDemandCategory } from '@codeforge/shared';

describe('Skill Intelligence Engine Unit Tests', () => {
  const skillService = new SkillIntelligenceService();

  test('1. forecastSkillDemand returns multi-horizon engineering skill projections', () => {
    const forecasts = skillService.forecastSkillDemand();

    assert.ok(Array.isArray(forecasts));
    assert.ok(forecasts.length >= 6);

    const growingSkills = forecasts.filter(f => f.demandCategory === SkillDemandCategory.EXPLODING || f.demandCategory === SkillDemandCategory.GROWING);
    for (const f of growingSkills) {
      assert.ok(f.forecast6Months > 0);
      assert.ok(f.forecast1Year >= f.forecast6Months);
      assert.ok(f.forecast3Years >= f.forecast1Year);
      assert.ok(f.forecast5Years >= f.forecast3Years);
    }
  });

  test('2. forecastSkillDemand categorizes EXPLODING skills with high growth rate', () => {
    const forecasts = skillService.forecastSkillDemand();
    const exploding = forecasts.filter(f => f.demandCategory === SkillDemandCategory.EXPLODING);

    assert.ok(exploding.length >= 2);
    for (const e of exploding) {
      assert.ok(e.growthRatePercentage >= 80);
      assert.strictEqual(e.isEmerging, true);
    }
  });

  test('3. forecastSkillDemand filters correctly by query parameter', () => {
    const rustForecasts = skillService.forecastSkillDemand('Rust');

    assert.ok(rustForecasts.length >= 1);
    assert.ok(rustForecasts.every(f => f.skill.toLowerCase().includes('rust')));
  });

  test('4. getMarketSkillIntelligence aggregates in-demand, exploding, and declining skills', () => {
    const intel = skillService.getMarketSkillIntelligence();

    assert.ok(intel);
    assert.ok(intel.topInDemandSkills.length >= 3);
    assert.ok(intel.explodingSkills.length >= 2);
    assert.ok(intel.decliningSkills.length >= 1);
  });

  test('5. getMarketSkillIntelligence includes emerging technologies with adoption velocity', () => {
    const intel = skillService.getMarketSkillIntelligence();

    assert.ok(intel.emergingTechnologies.length >= 3);
    const wasm = intel.emergingTechnologies.find(t => t.tech.toLowerCase().includes('wasm'));
    assert.ok(wasm);
    assert.ok(wasm.adoptionVelocity.includes('YoY'));
  });

  test('6. getMarketSkillIntelligence returns recommended learning focus', () => {
    const intel = skillService.getMarketSkillIntelligence();

    assert.ok(Array.isArray(intel.recommendedLearningFocus));
    assert.ok(intel.recommendedLearningFocus.length >= 3);
    assert.ok(intel.recommendedLearningFocus.some(f => f.includes('Rust') || f.includes('Agentic')));
  });
});
