import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AdminCopilotService } from '../../src/modules/intelligence/adminCopilotService';
import { RiskLevel, RecommendationCategory } from '@codeforge/shared';

describe('AI Admin Copilot Unit Tests', () => {
  const copilotService = new AdminCopilotService();

  test('1. classifyStudentRisk flags CRITICAL risk for CGPA < 5.5 and high backlogs', () => {
    const risk = copilotService.classifyStudentRisk({
      studentId: 'stud-1',
      studentName: 'Alex Doe',
      rollNumber: 'CS-2026-001',
      universityName: 'MIT',
      departmentName: 'Computer Science',
      cgpa: 5.2,
      backlogCount: 3,
      platformActivityScore: 25,
    });

    assert.ok(risk);
    assert.strictEqual(risk.riskLevel, RiskLevel.CRITICAL);
    assert.ok(risk.riskFactors.length >= 2);
    assert.ok(risk.recommendedAction.includes('Immediate faculty mentor intervention'));
  });

  test('2. classifyStudentRisk flags HIGH risk for CGPA < 7.0 or low activity', () => {
    const risk = copilotService.classifyStudentRisk({
      studentId: 'stud-2',
      studentName: 'Sam Rivera',
      rollNumber: 'CS-2026-002',
      universityName: 'Stanford',
      departmentName: 'Computer Science',
      cgpa: 6.8,
      backlogCount: 1,
      platformActivityScore: 40,
    });

    assert.ok(risk);
    assert.strictEqual(risk.riskLevel, RiskLevel.HIGH);
    assert.ok(risk.riskFactors.some(f => f.includes('placement cutoffs')));
  });

  test('3. classifyStudentRisk assigns LOW risk to high-performing students', () => {
    const risk = copilotService.classifyStudentRisk({
      studentId: 'stud-3',
      studentName: 'Elena Rostova',
      rollNumber: 'CS-2026-003',
      universityName: 'IIT Bombay',
      departmentName: 'Computer Science',
      cgpa: 9.4,
      backlogCount: 0,
      platformActivityScore: 92,
    });

    assert.ok(risk);
    assert.strictEqual(risk.riskLevel, RiskLevel.LOW);
    assert.strictEqual(risk.riskFactors.length, 0);
  });

  test('4. generatePrescriptiveRecommendations outputs categorized interventions with impact scores', () => {
    const recs = copilotService.generatePrescriptiveRecommendations();

    assert.ok(Array.isArray(recs));
    assert.ok(recs.length >= 4);

    for (const rec of recs) {
      assert.ok(rec.id);
      assert.ok(rec.title);
      assert.ok(rec.description);
      assert.ok(rec.impactScore >= 1 && rec.impactScore <= 10);
      assert.ok(['HIGH', 'MEDIUM', 'LOW'].includes(rec.urgency));
    }

    const curriculumRec = recs.find(r => r.category === RecommendationCategory.CURRICULUM);
    assert.ok(curriculumRec);
  });

  test('5. getPlacementForecasts generates cohort-level placement rates and recruiter targets', () => {
    const forecasts = copilotService.getPlacementForecasts();

    assert.ok(Array.isArray(forecasts));
    assert.ok(forecasts.length >= 2);

    for (const fc of forecasts) {
      assert.ok(fc.cohortName);
      assert.ok(fc.expectedPlacementRate >= 70 && fc.expectedPlacementRate <= 100);
      assert.ok(Array.isArray(fc.projectedTopRecruiters));
      assert.ok(fc.projectedTopRecruiters.length >= 2);
    }
  });

  test('6. getCurriculumGaps analyzes labor demand vs syllabus mismatch', () => {
    const gaps = copilotService.getCurriculumGaps();

    assert.ok(Array.isArray(gaps));
    assert.ok(gaps.length >= 3);

    for (const gap of gaps) {
      assert.ok(gap.topic);
      assert.ok(gap.industryDemandGap);
      assert.ok(gap.actionableProposal);
    }
  });
});
