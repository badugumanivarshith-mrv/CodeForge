import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/repositories/UserRepository';

describe('Auth Integration Tests', () => {
  const authService = new AuthService();
  const userRepo = new UserRepository();
  const testId = Date.now();
  const testUser = {
    email: `integration_test_${testId}@codeforge.dev`,
    username: `tester_${testId}`.slice(0, 25),
    password: 'SecureP@ssword123!',
    displayName: 'Integration Tester',
  };

  test('1. Register a new user and initialize session + profile', async () => {
    const result = await authService.register(testUser);

    assert.ok(result.user.id);
    assert.strictEqual(result.user.email, testUser.email.toLowerCase());
    assert.strictEqual(result.user.username, testUser.username.toLowerCase());
    assert.strictEqual(result.profile.fullName, testUser.displayName);
    assert.strictEqual(result.preferences.theme, 'dark');
    assert.ok(result.accessToken.length > 20);
    assert.ok(result.refreshToken.length > 20);
  });

  test('2. Reject duplicate email registration', async () => {
    await assert.rejects(
      async () => {
        await authService.register({
          ...testUser,
          username: `diff_${testId}`.slice(0, 25),
        });
      },
      {
        name: 'ConflictError',
      },
    );
  });

  test('3. Reject duplicate username registration', async () => {
    await assert.rejects(
      async () => {
        await authService.register({
          ...testUser,
          email: `diff_${testId}@codeforge.dev`,
        });
      },
      {
        name: 'ConflictError',
      },
    );
  });

  test('4. Login with correct credentials', async () => {
    const loginResult = await authService.login({
      email: testUser.email,
      password: testUser.password,
    });

    assert.ok(loginResult.accessToken);
    assert.ok(loginResult.refreshToken);
    assert.strictEqual(loginResult.user.email, testUser.email.toLowerCase());
  });

  test('5. Reject login with incorrect password', async () => {
    await assert.rejects(
      async () => {
        await authService.login({
          email: testUser.email,
          password: 'WrongPassword123!',
        });
      },
      {
        name: 'UnauthorizedError',
      },
    );
  });

  test('6. Fetch current user via getMe()', async () => {
    const user = await userRepo.findByEmail(testUser.email);
    assert.ok(user);

    const me = await authService.getMe(user.id);
    assert.strictEqual(me.user.email, testUser.email.toLowerCase());
    assert.strictEqual(me.profile.fullName, testUser.displayName);
  });

  test('7. Refresh access token and rotate refresh token', async () => {
    const loginResult = await authService.login({
      email: testUser.email,
      password: testUser.password,
    });

    const refreshResult = await authService.refresh(loginResult.refreshToken);
    assert.ok(refreshResult.accessToken);
    assert.ok(refreshResult.refreshToken);
    assert.notStrictEqual(refreshResult.refreshToken, loginResult.refreshToken);
  });

  test('8. Change password and verify new password authentication', async () => {
    const user = await userRepo.findByEmail(testUser.email);
    assert.ok(user);

    const newPassword = 'NewSecurePassword123!';
    await authService.changePassword(user.id, testUser.password, newPassword);

    const newLogin = await authService.login({
      email: testUser.email,
      password: newPassword,
    });
    assert.ok(newLogin.accessToken);
  });
});
