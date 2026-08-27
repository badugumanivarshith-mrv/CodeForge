import React, { useState } from 'react';
import { Settings, Shield, Sliders, Lock, LogOut } from 'lucide-react';
import { Card, Button } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/authApi';

export const SettingsPage: React.FC = () => {
  const { user, preferences, updatePreferences, logoutAll } = useAuth();

  // Preferences Form State
  const [theme, setTheme] = useState<'dark' | 'light'>(preferences?.theme || 'dark');
  const [editorFontSize, setEditorFontSize] = useState<number>(preferences?.editorFontSize || 14);
  const [editorKeybindings, setEditorKeybindings] = useState<'standard' | 'vim' | 'emacs'>(
    preferences?.editorKeybindings || 'standard',
  );
  const [emailNotifications, setEmailNotifications] = useState<boolean>(
    preferences?.emailNotifications ?? true,
  );
  const [aiHintLevel, setAiHintLevel] = useState<1 | 2 | 3>(preferences?.aiHintLevel || 1);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    try {
      await updatePreferences({
        theme,
        editorFontSize,
        editorKeybindings,
        emailNotifications,
        aiHintLevel,
      });
      setPrefSuccess(true);
      setTimeout(() => setPrefSuccess(false), 3000);
    } catch {
      // Handled in store
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsChangingPass(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <Settings size={28} color="#818cf8" />
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Account & System Settings</h1>
      </div>

      {/* Account Overview */}
      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Account Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Username</span>
            <span style={{ fontWeight: 600 }}>@{user?.username}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email Address</span>
            <span style={{ fontWeight: 600 }}>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Role</span>
            <span style={{ fontWeight: 600 }}>{user?.role}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Account Status</span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>Active</span>
          </div>
        </div>
      </Card>

      {/* Editor & Learning Preferences */}
      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sliders size={20} color="#6366f1" />
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Editor & Platform Preferences</h2>
        </div>

        {prefSuccess && (
          <div style={{ marginBottom: '16px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '13px' }}>
            ✓ Preferences updated successfully!
          </div>
        )}

        <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Theme</label>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value as 'dark' | 'light')}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
              >
                <option value="dark">Dark Theme (Default)</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Editor Font Size ({editorFontSize}px)</label>
              <input
                type="number"
                min={10}
                max={32}
                value={editorFontSize}
                onChange={e => setEditorFontSize(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Editor Keybindings</label>
              <select
                value={editorKeybindings}
                onChange={e => setEditorKeybindings(e.target.value as 'standard' | 'vim' | 'emacs')}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
              >
                <option value="standard">Standard (Monaco)</option>
                <option value="vim">Vim Mode</option>
                <option value="emacs">Emacs Mode</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>AI Socratic Hint Level</label>
              <select
                value={aiHintLevel}
                onChange={e => setAiHintLevel(Number(e.target.value) as 1 | 2 | 3)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
              >
                <option value={1}>Level 1 — Subtle Conceptual Clues</option>
                <option value={2}>Level 2 — Algorithmic Guidance</option>
                <option value={3}>Level 3 — Step-by-Step Breakdown</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              id="pref-email-notif"
              type="checkbox"
              checked={emailNotifications}
              onChange={e => setEmailNotifications(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <label htmlFor="pref-email-notif" style={{ fontSize: '13px', cursor: 'pointer' }}>
              Receive weekly progress reports and achievement alerts via email
            </label>
          </div>

          <Button type="submit" variant="primary" size="sm" isLoading={isSavingPrefs} style={{ alignSelf: 'flex-start' }}>
            Save Preferences
          </Button>
        </form>
      </Card>

      {/* Security & Password */}
      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Shield size={20} color="#ef4444" />
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Security & Password</h2>
        </div>

        {passwordError && (
          <div style={{ marginBottom: '16px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '13px' }}>
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div style={{ marginBottom: '16px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '13px' }}>
            ✓ Password changed successfully!
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '500px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>New Password (min. 8 characters)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
            />
          </div>

          <Button type="submit" variant="secondary" size="sm" isLoading={isChangingPass} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} /> Update Password
          </Button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Active Sessions</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Revoke all other active login sessions across your devices.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={logoutAll}
            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={14} /> Revoke All Active Sessions
          </Button>
        </div>
      </Card>
    </div>
  );
};
