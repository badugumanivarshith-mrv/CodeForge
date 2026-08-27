import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Code2, Trophy, User, Sparkles, FolderKanban } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/learn', label: 'Curriculum', icon: BookOpen },
    { to: '/workspace', label: 'Workspace', icon: Code2 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'My Mastery', icon: Sparkles },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '240px',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: '64px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '8px',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 12px 8px 12px' }}>
        Navigation
      </div>
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              background: isActive ? 'var(--color-brand-primary)' : 'transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};
