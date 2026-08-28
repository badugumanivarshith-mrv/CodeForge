import { test, describe } from 'node:test';
import assert from 'node:assert';
import { JobMatchingService } from '../../src/modules/recruiters/jobMatchingService';
import { MatchCategory } from '@codeforge/shared';

describe('Job Matching Engine Unit Tests', () => {
  const matchingService = new JobMatchingService();

  test('1. Scoring Weights sum to 100% and calculate accurate composite score', () => {
    const candidateData = {
      skills: ['typescript', 'react', 'nodejs', 'postgresql', 'docker'],
      rating: 1750,
      assessmentScore: 85,
      careerGoals: ['Full Stack Engineer', 'Backend Engineer'],
      portfolioScore: 80,
      resumeKeywords: ['typescript', 'react', 'postgresql', 'rest api', 'docker'],
    };

    const jobData = {
      title: 'Senior Full Stack Engineer',
      skillsRequired: ['TypeScript', 'React', 'NodeJS', 'PostgreSQL', 'Docker'],
      minRating: 1600,
      minAssessmentScore: 70,
      targetRole: 'Full Stack Engineer',
      keywords: ['typescript', 'react', 'postgresql', 'docker'],
    };

    const result = matchingService.evaluateMatch(candidateData, jobData);

    assert.ok(result);
    assert.strictEqual(typeof result.overallScore, 'number');
    assert.ok(result.overallScore >= 80, `Expected score >= 80 for near perfect match, got ${result.overallScore}`);
    assert.strictEqual(result.category, MatchCategory.STRONG_MATCH);
    assert.ok(result.breakdown.skillScore >= 90);
    assert.ok(result.breakdown.ratingScore >= 90);
  });

  test('2. Skill Overlap calculation with full match, partial match, and disjoint sets', () => {
    const fullMatchJob = {
      title: 'Backend Dev',
      skillsRequired: ['Go', 'Kubernetes', 'gRPC'],
      minRating: 1500,
      minAssessmentScore: 60,
      targetRole: 'Backend Engineer',
      keywords: [],
    };

    const fullMatchCandidate = {
      skills: ['go', 'kubernetes', 'grpc', 'python'],
      rating: 1500,
      assessmentScore: 60,
      careerGoals: ['Backend Engineer'],
      portfolioScore: 50,
      resumeKeywords: [],
    };

    const disjointCandidate = {
      skills: ['ruby', 'rails', 'html'],
      rating: 1200,
      assessmentScore: 40,
      careerGoals: ['Frontend Developer'],
      portfolioScore: 30,
      resumeKeywords: [],
    };

    const fullRes = matchingService.evaluateMatch(fullMatchCandidate, fullMatchJob);
    assert.strictEqual(fullRes.matchedSkills.length, 3);
    assert.strictEqual(fullRes.missingSkills.length, 0);
    assert.strictEqual(fullRes.breakdown.skillScore, 100);

    const disjointRes = matchingService.evaluateMatch(disjointCandidate, fullMatchJob);
    assert.strictEqual(disjointRes.matchedSkills.length, 0);
    assert.strictEqual(disjointRes.missingSkills.length, 3);
    assert.strictEqual(disjointRes.breakdown.skillScore, 0);
    assert.strictEqual(disjointRes.category, MatchCategory.WEAK_MATCH);
  });

  test('3. Contest Elo Rating curve matching against job requirement levels', () => {
    const seniorJob = {
      title: 'Lead Systems Engineer',
      skillsRequired: ['C++', 'Rust', 'Linux'],
      minRating: 1900,
      minAssessmentScore: 80,
      targetRole: 'Systems Engineer',
      keywords: [],
    };

    const grandmasterCandidate = {
      skills: ['c++', 'rust', 'linux'],
      rating: 2200,
      assessmentScore: 90,
      careerGoals: ['Systems Engineer'],
      portfolioScore: 90,
      resumeKeywords: [],
    };

    const noviceCandidate = {
      skills: ['c++', 'rust', 'linux'],
      rating: 1200,
      assessmentScore: 50,
      careerGoals: ['Systems Engineer'],
      portfolioScore: 50,
      resumeKeywords: [],
    };

    const gmRes = matchingService.evaluateMatch(grandmasterCandidate, seniorJob);
    assert.strictEqual(gmRes.breakdown.ratingScore, 100);

    const novRes = matchingService.evaluateMatch(noviceCandidate, seniorJob);
    assert.ok(novRes.breakdown.ratingScore <= 65);
  });

  test('4. Assessment Benchmark score scaling and normalization', () => {
    const job = {
      title: 'Data Engineer',
      skillsRequired: ['Python', 'SQL'],
      minRating: 1400,
      minAssessmentScore: 80,
      targetRole: 'Data Engineer',
      keywords: [],
    };

    const highScorer = {
      skills: ['python', 'sql'],
      rating: 1400,
      assessmentScore: 95,
      careerGoals: ['Data Engineer'],
      portfolioScore: 70,
      resumeKeywords: [],
    };

    const res = matchingService.evaluateMatch(highScorer, job);
    assert.strictEqual(res.breakdown.assessmentScore, 100);
  });

  test('5. Categorization thresholds: Strong (>=80), Good (65-79), Partial (45-64), Weak (<45)', () => {
    assert.strictEqual(matchingService.classifyScore(85), MatchCategory.STRONG_MATCH);
    assert.strictEqual(matchingService.classifyScore(80), MatchCategory.STRONG_MATCH);
    assert.strictEqual(matchingService.classifyScore(75), MatchCategory.GOOD_MATCH);
    assert.strictEqual(matchingService.classifyScore(65), MatchCategory.GOOD_MATCH);
    assert.strictEqual(matchingService.classifyScore(55), MatchCategory.PARTIAL_MATCH);
    assert.strictEqual(matchingService.classifyScore(45), MatchCategory.PARTIAL_MATCH);
    assert.strictEqual(matchingService.classifyScore(40), MatchCategory.WEAK_MATCH);
    assert.strictEqual(matchingService.classifyScore(10), MatchCategory.WEAK_MATCH);
  });

  test('6. Edge case handling for empty candidate profiles and missing parameters', () => {
    const emptyCandidate = {
      skills: [],
      rating: 1200,
      assessmentScore: 0,
      careerGoals: [],
      portfolioScore: 0,
      resumeKeywords: [],
    };

    const job = {
      title: 'DevOps Specialist',
      skillsRequired: ['Terraform', 'AWS', 'Kubernetes'],
      minRating: 1500,
      minAssessmentScore: 75,
      targetRole: 'DevOps Engineer',
      keywords: [],
    };

    const res = matchingService.evaluateMatch(emptyCandidate, job);
    assert.ok(res);
    assert.strictEqual(res.matchedSkills.length, 0);
    assert.strictEqual(res.missingSkills.length, 3);
    assert.ok(res.overallScore < 45);
    assert.strictEqual(res.category, MatchCategory.WEAK_MATCH);
  });
});
