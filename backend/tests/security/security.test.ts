import { test, describe } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../src/services/auth.service';
import { SessionRepository } from '../../src/repositories/SessionRepository';
import { JwtUtils } from '../../src/core/utils/jwt';
import { authGuard } from '../../src/middleware/authMiddleware';
import { requireRole } from '../../src/middleware/roleGuard';
import { UserRole } from '@codeforge/shared';
import { Request, Response, NextFunction } from 'express';
import { env } from '../../src/config/env';

// Helper to execute authGuard Express middleware as a Promise
function runAuthGuard(token?: string): Promise<{ user?: any; error?: any }> {
  return new Promise(resolve => {
    const req = {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
      cookies: {},
    } as unknown as Request;

    const res = {} as Response;

    const next: NextFunction = (err?: any) => {
      if (err) {
        resolve({ error: err });
      } else {
        resolve({ user: (req as any).user });
      }
    };

    authGuard(req, res, next).catch(err => resolve({ error: err }));
  });
}

describe('Security & Session Revocation Tests', () => {
  const authService = new AuthService();
  const sessionRepo = new SessionRepository();
  const testId = Date.now();
  let testUser: any;

  test('Setup: Create base test user', async () => {
    testUser = await authService.register({
      email: `revocation_test_${testId}@codeforge.dev`,
      username: `revoc_${testId}`.slice(0, 25),
      password: 'SecureP@ssword123!',
      displayName: 'Revocation Tester',
    });
    assert.ok(testUser.user.id);
  });

  test('TEST 1 & 9: login -> active access token passes authGuard (200 OK)', async () => {
    const loginRes = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    const guardResult = await runAuthGuard(loginRes.accessToken);
    assert.strictEqual(guardResult.error, undefined);
    assert.strictEqual(guardResult.user?.userId, testUser.user.id);
    assert.ok(guardResult.user?.sessionId);
  });

  test('TEST 2: login -> logout -> same access token is immediately rejected with 401 SESSION_REVOKED', async () => {
    const loginRes = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    // Verify token works before logout
    const beforeLogout = await runAuthGuard(loginRes.accessToken);
    assert.strictEqual(beforeLogout.error, undefined);

    // Logout
    const decoded = JwtUtils.verifyAccessToken(loginRes.accessToken);
    await authService.logout(decoded.sessionId, decoded.userId);

    // Verify same token is rejected with 401 after logout
    const afterLogout = await runAuthGuard(loginRes.accessToken);
    assert.ok(afterLogout.error);
    assert.strictEqual(afterLogout.error.statusCode, 401);
    assert.strictEqual(afterLogout.error.code, 'SESSION_REVOKED');
  });

  test('TEST 3: login -> logout -> same access token rejected on another protected resource', async () => {
    const loginRes = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    const decoded = JwtUtils.verifyAccessToken(loginRes.accessToken);
    await authService.logout(decoded.sessionId, decoded.userId);

    const guardResult = await runAuthGuard(loginRes.accessToken);
    assert.ok(guardResult.error);
    assert.strictEqual(guardResult.error.statusCode, 401);
  });

  test('TEST 4: login session A, login session B, logout-all -> both access tokens return 401', async () => {
    const sessionA = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    const sessionB = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    // Both work initially
    assert.strictEqual((await runAuthGuard(sessionA.accessToken)).error, undefined);
    assert.strictEqual((await runAuthGuard(sessionB.accessToken)).error, undefined);

    // Revoke all sessions
    await authService.logoutAll(testUser.user.id);

    // Both should now be rejected with 401
    const guardA = await runAuthGuard(sessionA.accessToken);
    assert.ok(guardA.error);
    assert.strictEqual(guardA.error.statusCode, 401);
    assert.strictEqual(guardA.error.code, 'SESSION_REVOKED');

    const guardB = await runAuthGuard(sessionB.accessToken);
    assert.ok(guardB.error);
    assert.strictEqual(guardB.error.statusCode, 401);
    assert.strictEqual(guardB.error.code, 'SESSION_REVOKED');
  });

  test('TEST 5: invalid or forged JWT -> 401 INVALID_TOKEN', async () => {
    const forgedToken = jwt.sign(
      { userId: testUser.user.id, role: UserRole.STUDENT, sessionId: 'fake' },
      'wrong-secret',
    );

    const guardResult = await runAuthGuard(forgedToken);
    assert.ok(guardResult.error);
    assert.strictEqual(guardResult.error.statusCode, 401);
    assert.strictEqual(guardResult.error.code, 'INVALID_TOKEN');
  });

  test('TEST 6: expired JWT -> 401 TOKEN_EXPIRED', async () => {
    const expiredToken = jwt.sign(
      {
        userId: testUser.user.id,
        email: testUser.user.email,
        role: UserRole.STUDENT,
        sessionId: 'dummy-session-id',
      },
      env.JWT_SECRET,
      { expiresIn: '-10s' },
    );

    const guardResult = await runAuthGuard(expiredToken);
    assert.ok(guardResult.error);
    assert.strictEqual(guardResult.error.statusCode, 401);
    assert.strictEqual(guardResult.error.code, 'TOKEN_EXPIRED');
  });

  test('TEST 7: valid signature JWT with nonexistent sessionId -> 401 SESSION_REVOKED', async () => {
    const orphanToken = JwtUtils.signAccessToken({
      userId: testUser.user.id,
      email: testUser.user.email,
      role: UserRole.STUDENT,
      sessionId: '00000000-0000-0000-0000-000000000000',
    });

    const guardResult = await runAuthGuard(orphanToken);
    assert.ok(guardResult.error);
    assert.strictEqual(guardResult.error.statusCode, 401);
    assert.strictEqual(guardResult.error.code, 'SESSION_REVOKED');
  });

  test('TEST 8: valid signature JWT with explicitly revoked session -> 401 SESSION_REVOKED', async () => {
    const loginRes = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    const decoded = JwtUtils.verifyAccessToken(loginRes.accessToken);
    await sessionRepo.deleteSession(decoded.sessionId);

    const guardResult = await runAuthGuard(loginRes.accessToken);
    assert.ok(guardResult.error);
    assert.strictEqual(guardResult.error.statusCode, 401);
    assert.strictEqual(guardResult.error.code, 'SESSION_REVOKED');
  });

  test('TEST 10: active refresh token rotates successfully', async () => {
    const loginRes = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    const rotated = await authService.refresh(loginRes.refreshToken);
    assert.ok(rotated.accessToken);
    assert.ok(rotated.refreshToken);
    assert.notStrictEqual(rotated.refreshToken, loginRes.refreshToken);

    // New access token works with active session
    const guardResult = await runAuthGuard(rotated.accessToken);
    assert.strictEqual(guardResult.error, undefined);
  });

  test('TEST 11: refresh token reuse detection revokes all user sessions', async () => {
    const loginRes = await authService.login({
      email: testUser.user.email,
      password: 'SecureP@ssword123!',
    });

    const initialRefreshToken = loginRes.refreshToken;

    // Normal rotation
    const rotated = await authService.refresh(initialRefreshToken);
    assert.ok(rotated.accessToken);

    // Replay attack with initialRefreshToken
    await assert.rejects(
      async () => {
        await authService.refresh(initialRefreshToken);
      },
      {
        name: 'UnauthorizedError',
      },
    );

    // Verify session was revoked and access token now returns 401
    const guardResult = await runAuthGuard(rotated.accessToken);
    assert.ok(guardResult.error);
    assert.strictEqual(guardResult.error.statusCode, 401);
  });

  test('TEST 12: Role Guard authorizes ADMIN and rejects STUDENT', () => {
    const guard = requireRole([UserRole.ADMIN]);

    const mockAdminReq = {
      user: {
        userId: 'admin-uuid',
        email: 'admin@codeforge.dev',
        role: UserRole.ADMIN,
        sessionId: 'sess-1',
      },
    } as unknown as Request;

    let adminAllowed = false;
    guard(mockAdminReq, {} as Response, () => {
      adminAllowed = true;
    });
    assert.strictEqual(adminAllowed, true);

    const mockStudentReq = {
      user: {
        userId: 'student-uuid',
        email: 'student@codeforge.dev',
        role: UserRole.STUDENT,
        sessionId: 'sess-2',
      },
    } as unknown as Request;

    assert.throws(
      () => {
        guard(mockStudentReq, {} as Response, () => {});
      },
      {
        name: 'ForbiddenError',
      },
    );
  });
});
