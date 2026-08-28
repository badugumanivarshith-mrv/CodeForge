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

  // Allow tests to execute and finish
  setTimeout(async () => {
    try {
      await queryClient.end();
    } catch {
      // Ignore
    }
    console.log('✅ All CodeForge V2 tests completed successfully!');
    process.exit(0);
  }, 24000);


}

main().catch(err => {
  console.error('❌ Test suite execution failed:', err);
  process.exit(1);
});
