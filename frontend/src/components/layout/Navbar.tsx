import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Moon, Sun, Flame, Zap, ShieldAlert, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button, Badge } from '../common';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Terminal size={20} />
          </div>
          <span>
            Code<span style={{ color: 'var(--color-brand-primary)' }}>Forge</span>
          </span>
        </Link>

        {/* Primary Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            to="/learn"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Curriculum
          </Link>
          <Link
            to="/arena"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Arena
          </Link>
          <Link
            to="/contests"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Contests
          </Link>
          <Link
            to="/forum"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Forum
          </Link>
          <Link
            to="/groups"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Study Groups
          </Link>
          <Link
            to="/career"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Career
          </Link>
          <Link
            to="/interviews"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Interviews
          </Link>
          <Link
            to="/talent"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Talent
          </Link>
          <Link
            to="/jobs"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-brand-primary, #6366f1)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-brand-primary, #6366f1)')}
          >
            Jobs & Hiring
          </Link>
          <Link
            to="/university"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#38bdf8',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#38bdf8')}
          >
            University
          </Link>
          <Link
            to="/organization"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#a78bfa',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a78bfa')}
          >
            Enterprise
          </Link>
          <Link
            to="/workforce-intelligence"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#34d399',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#34d399')}
          >
            Intelligence
          </Link>
          <Link
            to="/career-os"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#818cf8',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#818cf8';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            }}
          >
            ✦ Career OS
          </Link>
          <Link
            to="/ai-command-center"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.28)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#34d399';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
            }}
          >
            ⚡ AI Command Center
          </Link>
          <Link
            to="/marketplace"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.12)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.28)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#f59e0b';
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
            }}
          >
            🛒 Marketplace
          </Link>
          <Link
            to="/agent-cloud"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#ec4899',
              background: 'rgba(236, 72, 153, 0.12)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(236, 72, 153, 0.35)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(236, 72, 153, 0.28)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#ec4899';
              e.currentTarget.style.background = 'rgba(236, 72, 153, 0.12)';
            }}
          >
            🤖 AI Cloud & OS
          </Link>
          <Link
            to="/global-command-center"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.28)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
            }}
          >
            🌐 Global Ecosystem
          </Link>
          <Link
            to="/planetary-command-center"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#a855f7',
              background: 'rgba(168, 85, 247, 0.12)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.28)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#a855f7';
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)';
            }}
          >
            🪐 Planetary Civilization
          </Link>
          <Link
            to="/cognitive-os"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#818cf8',
              background: 'rgba(99, 102, 241, 0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#818cf8';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
            }}
          >
            🧠 Cognitive OS
          </Link>
          <Link
            to="/enterprise-civilization"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#06b6d4',
              background: 'rgba(6, 182, 212, 0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#06b6d4';
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)';
            }}
          >
            🏢 Enterprise Civilization
          </Link>
          <Link
            to="/startup-command-center"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#f43f5e',
              background: 'rgba(244, 63, 94, 0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#f43f5e';
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)';
            }}
          >
            🚀 Startup Builder
          </Link>
          <Link
            to="/feed"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Feed
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#f43f5e',
              }}
            >
              <ShieldAlert size={14} /> Admin Studio
            </Link>
          )}
        </nav>
      </div>


      {/* Right Controls & Auth Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Gamification Badges (If Authenticated) */}
        {isAuthenticated && (
          <>
            <Badge variant="warning" size="md">
              <Flame size={14} color="#f59e0b" /> 0 Days
            </Badge>
            <Badge variant="purple" size="md">
              <Zap size={14} color="#a855f7" /> 0 XP
            </Badge>
          </>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Auth CTA / Profile Menu */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={16} />
              </div>
              <span>{user?.username || 'Learner'}</span>
            </Link>
            <Link
              to="/settings"
              title="Settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Settings size={16} />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut size={16} />
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
