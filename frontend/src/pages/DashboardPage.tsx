import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Award, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Welcome back, <span style={{ color: 'var(--color-brand-primary)' }}>{user?.username || 'Learner'}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track your progress, continue your curriculum track, and keep your daily streak alive.
        </p>
      </div>

      {/* Gamification Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>DAILY STREAK</span>
            <Flame size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>0 Days</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>1 Freeze Token available</div>
        </Card>

        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL XP</span>
            <Zap size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#c084fc' }}>0 XP</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>100 XP to Level 2</div>
        </Card>

        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>CURRENT LEVEL</span>
            <Award size={20} color="#6366f1" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#818cf8' }}>Level 1</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Novice Apprentice</div>
        </Card>
      </div>

      {/* Continue Learning CTA */}
      <Card padding="lg" glow style={{ borderLeft: '4px solid var(--color-brand-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <Badge variant="brand" size="sm" style={{ marginBottom: '8px' }}>
              RECOMMENDED NEXT STEP
            </Badge>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
              Python: Topic 1 — Syntax & Literals
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Explore foundational syntax, indentation rules, comments, and your first interactive exercises.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/learn/python')}
          >
            Start Lesson
          </Button>
        </div>
      </Card>
    </div>
  );
};
