import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Award, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { progressApi } from '../services/progressApi';
import { ProgressDashboardDto } from '@codeforge/shared';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<ProgressDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await progressApi.getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading dashboard metrics...
      </div>
    );
  }

  const totalXp = dashboard?.gamification.totalXp || 0;
  const currentLevel = dashboard?.gamification.currentLevel || 1;
  const currentStreak = dashboard?.gamification.currentStreak || 0;
  const freezeTokens = dashboard?.gamification.freezeTokensAvailable ?? 1;
  const progressPct = dashboard?.gamification.levelProgressPercentage || 0;
  const nextLevelXp = dashboard?.gamification.nextLevelXp || 100;
  const recommendedTopic = dashboard?.recommendedTopic;

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {/* Daily Streak Card */}
        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>DAILY STREAK</span>
            <Flame size={22} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>{currentStreak} Days</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {freezeTokens} Freeze Token{freezeTokens === 1 ? '' : 's'} available
          </div>
        </Card>

        {/* Total XP Card */}
        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL XP</span>
            <Zap size={22} color="#a855f7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#c084fc' }}>{totalXp} XP</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Next level at {nextLevelXp} XP ({progressPct}%)
          </div>
        </Card>

        {/* Level Progression Card */}
        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>CURRENT LEVEL</span>
            <Award size={22} color="#6366f1" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#818cf8' }}>Level {currentLevel}</div>
          <div style={{ marginTop: '8px', height: '6px', width: '100%', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--color-brand-primary)' }} />
          </div>
        </Card>
      </div>

      {/* Recommended Next Step CTA */}
      {recommendedTopic && (
        <Card padding="lg" glow style={{ borderLeft: '4px solid var(--color-brand-primary)', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <Badge variant="brand" size="sm" style={{ marginBottom: '8px' }}>
                RECOMMENDED NEXT TOPIC
              </Badge>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
                Topic {recommendedTopic.sequence}: {recommendedTopic.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '650px' }}>
                {recommendedTopic.description}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => navigate(`/learn/${dashboard?.activeLanguage?.slug || 'python'}`)}
            >
              Continue Learning
            </Button>
          </div>
        </Card>
      )}

      {/* Recently Completed Lessons */}
      {dashboard?.recentCompletedLessons && dashboard.recentCompletedLessons.length > 0 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#818cf8" /> Recently Completed Lessons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dashboard.recentCompletedLessons.map(lsn => (
              <Card key={lsn.id} padding="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{lsn.title}</span>
                </div>
                <Badge variant="success" size="sm">Completed</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
