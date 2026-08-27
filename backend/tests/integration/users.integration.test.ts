import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user.service';
import { LanguageId } from '@codeforge/shared';

describe('Users & Profiles Integration Tests', () => {
  const authService = new AuthService();
  const userService = new UserService();
  const testId = Date.now();
  const testUsername = `prof_test_${testId}`.slice(0, 25);
  let userId: string;

  test('Setup: Create test user for profile tests', async () => {
    const res = await authService.register({
      email: `prof_test_${testId}@codeforge.dev`,
      username: testUsername,
      password: 'Password123!',
      displayName: 'Profile Tester',
    });
    userId = res.user.id;
    assert.ok(userId);
  });

  test('1. Get and update my profile', async () => {
    const profile = await userService.getMyProfile(userId);
    assert.strictEqual(profile.fullName, 'Profile Tester');

    const updated = await userService.updateMyProfile(userId, {
      bio: 'Staff Engineer learning Rust & C++',
      githubUsername: 'codeforge-tester',
      preferredLanguageId: LanguageId.TYPESCRIPT,
      learningGoals: ['Master TypeScript generics', 'Distributed Systems'],
    });

    assert.strictEqual(updated.bio, 'Staff Engineer learning Rust & C++');
    assert.strictEqual(updated.githubUsername, 'codeforge-tester');
    assert.strictEqual(updated.preferredLanguageId, LanguageId.TYPESCRIPT);
    assert.strictEqual(updated.learningGoals?.length, 2);
  });

  test('2. Get public profile by username', async () => {
    const publicProfile = await userService.getPublicProfile(testUsername);
    assert.strictEqual(publicProfile.username, testUsername);
    assert.strictEqual(publicProfile.githubUsername, 'codeforge-tester');
    assert.strictEqual(publicProfile.learningGoals.length, 2);
    assert.strictEqual(publicProfile.currentLevel, 1);
  });

  test('3. Get and update preferences', async () => {
    const prefs = await userService.getMyPreferences(userId);
    assert.strictEqual(prefs.theme, 'dark');

    const updatedPrefs = await userService.updateMyPreferences(userId, {
      editorFontSize: 16,
      editorKeybindings: 'vim',
      aiHintLevel: 2,
    });

    assert.strictEqual(updatedPrefs.editorFontSize, 16);
    assert.strictEqual(updatedPrefs.editorKeybindings, 'vim');
    assert.strictEqual(updatedPrefs.aiHintLevel, 2);
  });
});
