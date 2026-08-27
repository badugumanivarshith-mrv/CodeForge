import { queryClient } from '../src/database/connection';

async function run() {
  await import('./unit/password.test');
  await import('./unit/jwt.test');
  await import('./unit/validation.test');
  await import('./integration/auth.integration.test');
  await import('./integration/users.integration.test');
  await import('./security/security.test');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
