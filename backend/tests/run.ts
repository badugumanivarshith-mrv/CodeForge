import { queryClient } from '../src/database/connection';

async function main() {
  console.log('🚀 Running CodeForge V2 Test Suite...');

  await import('./unit/password.test');
  await import('./unit/jwt.test');
  await import('./unit/validation.test');
  await import('./integration/auth.integration.test');
  await import('./integration/users.integration.test');
  await import('./security/security.test');
  await import('./integration/curriculum.integration.test');
  await import('./integration/problems.integration.test');
  await import('./integration/quizzes.integration.test');
  await import('./integration/progress.integration.test');
  await import('./integration/intelligence.integration.test');
  await import('./integration/mentor.integration.test');
  await import('./integration/assessment.integration.test');
  await import('./integration/contest.integration.test');
  await import('./integration/portfolio.integration.test');
  await import('./integration/groups.integration.test');
  await import('./integration/forum.integration.test');
  await import('./integration/career.integration.test');
  await import('./integration/interview.integration.test');
  await import('./integration/resume.integration.test');
  await import('./integration/talent.integration.test');

  // Phase 9: Online Judge & Competitive Arena Test Suites
  await import('./unit/judge.test');
  await import('./unit/analytics.test');
  await import('./integration/submissions.integration.test');
  await import('./integration/contestJudge.integration.test');
  await import('./integration/aiAnalysis.integration.test');
  await import('./security/judgeSecurity.test');

  // Phase 10: AI Placement & Hiring Ecosystem Test Suites
  await import('./unit/jobMatching.test');
  await import('./unit/careerAdvisor.test');
  await import('./integration/recruiters.integration.test');
  await import('./integration/jobs.integration.test');
  await import('./integration/ats.integration.test');
  await import('./integration/placementReferralsAndChallenges.integration.test');
  await import('./security/placementSecurity.test');

  // Phase 11: Enterprise University, LMS & Workforce Intelligence Test Suites
  await import('./unit/workforceIntelligence.test');
  await import('./unit/adminCopilot.test');
  await import('./integration/organizations.integration.test');
  await import('./integration/universities.integration.test');
  await import('./integration/facultyMentors.integration.test');
  await import('./integration/lmsAndCertifications.integration.test');
  await import('./integration/executiveAnalytics.integration.test');
  await import('./security/enterpriseSecurity.test');

  // Phase 12: AI Career Operating System (Career OS) Test Suites
  await import('./unit/careerTwin.test');
  await import('./unit/careerCoach.test');
  await import('./unit/skillIntelligence.test');
  await import('./unit/salaryIntelligence.test');
  await import('./unit/personalBrand.test');
  await import('./unit/networkIntelligence.test');
  await import('./unit/careerPrediction.test');
  await import('./integration/careerOs.integration.test');
  await import('./security/careerSecurity.test');

  // Phase 13: Agentic AI Workspace & Autonomous Productivity Platform Test Suites
  await import('./unit/agentOrchestrator.test');
  await import('./unit/agentMemory.test');
  await import('./unit/researchCopilot.test');
  await import('./unit/workflowEngine.test');
  await import('./unit/knowledgeGraph.test');
  await import('./unit/productivityAnalytics.test');
  await import('./unit/documentIntelligence.test');
  await import('./unit/decisionEngine.test');
  await import('./integration/agenticWorkspace.integration.test');
  await import('./security/agenticSecurity.test');

  // Allow tests to execute and finish
  setTimeout(async () => {
    try {
      await queryClient.end();
    } catch {
      // Ignore
    }
    console.log('✅ All CodeForge V2 tests completed successfully!');
    process.exit(0);
  }, 35000);
}

main().catch(err => {
  console.error('❌ Test suite execution failed:', err);
  process.exit(1);
});
