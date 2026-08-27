import { test, describe } from 'node:test';
import assert from 'node:assert';
import { JwtUtils } from '../../src/core/utils/jwt';
import { UserRole } from '@codeforge/shared';

describe('JwtUtils Unit Tests', () => {
  test('should generate and verify valid access tokens', () => {
    const payload = {
      userId: '11111111-2222-3333-4444-555555555555',
      email: 'tester@codeforge.dev',
      role: UserRole.STUDENT,
      sessionId: '66666666-7777-8888-9999-000000000000',
    };

    const token = JwtUtils.signAccessToken(payload);
    assert.ok(typeof token === 'string' && token.length > 20);

    const verified = JwtUtils.verifyAccessToken(token);
    assert.strictEqual(verified.userId, payload.userId);
    assert.strictEqual(verified.email, payload.email);
    assert.strictEqual(verified.role, payload.role);
    assert.strictEqual(verified.sessionId, payload.sessionId);
  });

  test('should generate and verify valid refresh tokens', () => {
    const payload = {
      userId: '11111111-2222-3333-4444-555555555555',
      sessionId: '66666666-7777-8888-9999-000000000000',
    };

    const token = JwtUtils.signRefreshToken(payload);
    const verified = JwtUtils.verifyRefreshToken(token);

    assert.strictEqual(verified.userId, payload.userId);
    assert.strictEqual(verified.sessionId, payload.sessionId);
  });

  test('should generate SHA-256 hash of tokens consistently', () => {
    const token = 'sample-random-jwt-token-string';
    const hash1 = JwtUtils.hashToken(token);
    const hash2 = JwtUtils.hashToken(token);

    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64);
  });
});
