import { test, describe } from 'node:test';
import assert from 'node:assert';
import { PasswordUtils } from '../../src/core/utils/password';

describe('PasswordUtils Unit Tests', () => {
  test('should hash a password using Argon2id and verify correctly', async () => {
    const rawPassword = 'SecretP@ssword123!';
    const hash = await PasswordUtils.hash(rawPassword);

    assert.ok(hash.startsWith('$argon2id$'), 'Hash should be Argon2id algorithm');
    assert.notStrictEqual(hash, rawPassword, 'Hash must not equal plain password');

    const isValid = await PasswordUtils.verify(hash, rawPassword);
    assert.strictEqual(isValid, true, 'Valid password verification should return true');

    const isWrong = await PasswordUtils.verify(hash, 'WrongPassword123!');
    assert.strictEqual(isWrong, false, 'Invalid password verification should return false');
  });

  test('should validate password complexity criteria', () => {
    // Too short
    assert.strictEqual(PasswordUtils.validateStrength('Ab1!').isValid, false);
    // Missing uppercase
    assert.strictEqual(PasswordUtils.validateStrength('lowercase1!').isValid, false);
    // Missing lowercase
    assert.strictEqual(PasswordUtils.validateStrength('UPPERCASE1!').isValid, false);
    // Missing number
    assert.strictEqual(PasswordUtils.validateStrength('NoNumberPass!').isValid, false);
    // Missing special character
    assert.strictEqual(PasswordUtils.validateStrength('NoSpecialChar12').isValid, false);
    // Strong valid password
    assert.strictEqual(PasswordUtils.validateStrength('ValidSecureP@ss123').isValid, true);
  });
});
