import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/common';
import { useAuthStore } from '../store/authStore';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, isLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      setLocalError('Username must be 3-30 characters (letters, numbers, hyphens, underscores).');
      return;
    }

    try {
      await register({
        email,
        username,
        displayName: displayName || username,
        password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed.');
    }
  };

  const displayError = localError || authError;

  return (
    <Card glow padding="lg">
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>
        Create Your Account
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
        Join CodeForge and master software engineering through guided practice.
      </p>

      {displayError && (
        <div
          role="alert"
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '13px',
          }}
        >
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label htmlFor="reg-username" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase())}
            placeholder="johndoe"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: '#ffffff',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label htmlFor="reg-display-name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Full Name / Display Name (Optional)
          </label>
          <input
            id="reg-display-name"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="John Doe"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: '#ffffff',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label htmlFor="reg-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Email Address
          </label>
          <input
            id="reg-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="developer@example.com"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: '#ffffff',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label htmlFor="reg-password" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: '#ffffff',
              outline: 'none',
            }}
          />
          {password.length > 0 && (
            <div style={{ marginTop: '6px', display: 'flex', gap: '4px', height: '4px' }}>
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    borderRadius: '2px',
                    background:
                      step <= passwordScore
                        ? passwordScore < 3
                          ? '#ef4444'
                          : passwordScore < 5
                          ? '#f59e0b'
                          : '#10b981'
                        : 'var(--border-subtle)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reg-confirm-password" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Confirm Password
          </label>
          <input
            id="reg-confirm-password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: '#ffffff',
              outline: 'none',
            }}
          />
        </div>

        <Button
          id="btn-register-submit"
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          style={{ marginTop: '8px' }}
        >
          Create Account
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-brand-light)', fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </Card>
  );
};
