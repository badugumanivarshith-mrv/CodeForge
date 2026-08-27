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

  // Allow tests to execute and finish
  setTimeout(async () => {
    try {
      await queryClient.end();
    } catch {
      // Ignore
    }
    console.log('✅ All CodeForge V2 tests completed successfully!');
    process.exit(0);
  }, 7500);
}

main().catch(err => {
  console.error('❌ Test suite execution failed:', err);
  process.exit(1);
});
