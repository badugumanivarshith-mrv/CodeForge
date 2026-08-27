import { test, describe } from 'node:test';
import assert from 'node:assert';
import { registerSchema, loginSchema } from '../../src/validations/auth.validation';
import { updateProfileSchema, updatePreferencesSchema } from '../../src/validations/user.validation';

describe('Validation Schemas Unit Tests', () => {
  test('registerSchema should validate valid input and reject invalid input', () => {
    const valid = registerSchema.safeParse({
      body: {
        email: 'developer@example.com',
        username: 'code_warrior',
        password: 'Password123!',
        displayName: 'Code Warrior',
      },
    });
    assert.strictEqual(valid.success, true);

    const invalidEmail = registerSchema.safeParse({
      body: {
        email: 'not-an-email',
        username: 'valid_user',
        password: 'Password123!',
      },
    });
    assert.strictEqual(invalidEmail.success, false);

    const invalidUsername = registerSchema.safeParse({
      body: {
        email: 'valid@example.com',
        username: 'u$',
        password: 'Password123!',
      },
    });
    assert.strictEqual(invalidUsername.success, false);
  });

  test('loginSchema should validate required credentials', () => {
    const valid = loginSchema.safeParse({
      body: {
        email: 'user@example.com',
        password: 'Password123!',
      },
    });
    assert.strictEqual(valid.success, true);

    const missingPass = loginSchema.safeParse({
      body: {
        email: 'user@example.com',
        password: '',
      },
    });
    assert.strictEqual(missingPass.success, false);
  });

  test('updatePreferencesSchema should validate editor and theme options', () => {
    const valid = updatePreferencesSchema.safeParse({
      body: {
        theme: 'dark',
        editorFontSize: 16,
        editorKeybindings: 'vim',
        aiHintLevel: 2,
      },
    });
    assert.strictEqual(valid.success, true);

    const invalidFont = updatePreferencesSchema.safeParse({
      body: {
        editorFontSize: 50,
      },
    });
    assert.strictEqual(invalidFont.success, false);
  });
});
