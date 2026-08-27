import { queryClient } from '../backend/src/database/connection';

async function verify() {
  const [langs] = await queryClient`SELECT count(*)::int FROM languages`;
  const [lvls] = await queryClient`SELECT count(*)::int FROM levels`;
  const [achs] = await queryClient`SELECT count(*)::int FROM achievements`;
  const [userTables] = await queryClient`SELECT count(*)::int FROM users`;

  console.log('Database Verification Results:');
  console.log(`- Languages count: ${langs.count} (Expected: 6)`);
  console.log(`- Levels count: ${lvls.count} (Expected: 50)`);
  console.log(`- Achievements count: ${achs.count} (Expected: 12)`);
  console.log(`- Users count: ${userTables.count}`);

  if (langs.count === 6 && lvls.count === 50 && achs.count === 12) {
    console.log('✅ ALL SEED DATA VERIFIED AND INTACT');
  } else {
    console.error('❌ SEED DATA MISMATCH');
    process.exit(1);
  }

  await queryClient.end();
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
