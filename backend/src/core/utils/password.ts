import argon2 from 'argon2';

export class PasswordUtils {
  /**
   * Hashes a plaintext password using Argon2id with OWASP-recommended parameters
   */
  public static async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  /**
   * Verifies a plaintext password against an Argon2id hash using constant-time comparison
   */
  public static async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Validates that a password satisfies CodeForge security complexity standards:
   * - At least 8 characters
   * - At least one lowercase letter
   * - At least one uppercase letter
   * - At least one number
   * - At least one special symbol
   */
  public static validateStrength(password: string): { isValid: boolean; message?: string } {
    if (!password || password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special symbol' };
    }
    return { isValid: true };
  }
}
