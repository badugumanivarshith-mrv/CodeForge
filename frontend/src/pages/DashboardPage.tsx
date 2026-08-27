import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Zap,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Brain,
  Target,
  ShieldAlert,
} from 'lucide-react';
import { Card, Badge } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { progressApi } from '../services/progressApi';
import { intelligenceApi } from '../services/intelligenceApi';
import {
  ProgressDashboardDto,
  LearnerIntelligenceProfileDto,
  RecommendationDto,
  LearningPathItemDto,
  WeaknessItemDto,
  TopicMasteryDetailDto,
} from '@codeforge/shared';
import { RecommendationWidget } from '../components/intelligence/RecommendationWidget';
import { LearningPathList } from '../components/intelligence/LearningPathList';
import { WeaknessCard } from '../components/intelligence/WeaknessCard';
import { MasteryBadge } from '../components/intelligence/MasteryBadge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<ProgressDashboardDto | null>(null);
  const [profile, setProfile] = useState<LearnerIntelligenceProfileDto | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationDto[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPathItemDto[]>([]);
  const [weaknesses, setWeaknesses] = useState<WeaknessItemDto[]>([]);
  const [masteries, setMasteries] = useState<TopicMasteryDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashData, profData, recsData, pathData, weakData, mastData] = await Promise.all([
          progressApi.getDashboard().catch(() => null),
          intelligenceApi.getProfile().catch(() => null),
          intelligenceApi.getRecommendations().catch(() => []),
          intelligenceApi.getLearningPath().catch(() => []),
          intelligenceApi.getWeaknesses().catch(() => []),
          intelligenceApi.getMastery().catch(() => []),
        ]);

        if (dashData) setDashboard(dashData);
        if (profData) setProfile(profData);
        setRecommendations(recsData);
        setLearningPath(pathData);
        setWeaknesses(weakData);
        setMasteries(mastData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading personalized intelligence & dashboard...
      </div>
    );
  }

  const totalXp = dashboard?.gamification.totalXp || profile?.totalXp || 0;
  const currentLevel = dashboard?.gamification.currentLevel || 1;
  const currentStreak = dashboard?.gamification.currentStreak || profile?.currentStreakDays || 0;
  const freezeTokens = dashboard?.gamification.freezeTokensAvailable ?? 1;
  const progressPct = dashboard?.gamification.levelProgressPercentage || 0;
  const nextLevelXp = dashboard?.gamification.nextLevelXp || 100;

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
              Welcome back, <span style={{ color: 'var(--color-brand-primary)' }}>{user?.username || 'Learner'}</span>!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Adaptive intelligence engine is monitoring your performance across topics and learning velocity.
            </p>
          </div>

          {profile && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Badge variant="brand" size="md">
                <Brain size={14} /> Skill: {profile.overallSkillLevel.toUpperCase()}
              </Badge>
              <Badge variant="purple" size="md">
                <TrendingUp size={14} /> Confidence: {profile.confidenceLevel}%
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Gamification & Intelligence Summary Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
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

        {/* Current Level Progression Card */}
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

        {/* Overall Mastery Score Card */}
        <Card padding="md" glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>OVERALL MASTERY</span>
            <Target size={22} color="#10b981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>
            {profile?.overallMasteryScore ?? 0}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {profile?.learningVelocity ?? 0} learning actions this week
          </div>
        </Card>
      </div>

      {/* Primary Smart Recommendation Widget */}
      {recommendations.length > 0 && (
        <RecommendationWidget recommendations={recommendations} />
      )}

      {/* Main Grid: Learning Path (Left 60%) + Weaknesses & Mastery (Right 40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '36px' }}>
        {/* Left Column: Personalized Learning Path */}
        <div style={{ flex: 1.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={20} color="#818cf8" /> Personalized Learning Path
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Adaptive Next Steps</span>
          </div>

          {learningPath.length > 0 ? (
            <LearningPathList items={learningPath.slice(0, 5)} />
          ) : (
            <Card padding="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No pending path steps. Continue exploring curriculum tracks!
            </Card>
          )}
        </div>

        {/* Right Column: Weaknesses & Topic Mastery Overview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Weakness Detection Panel */}
          {weaknesses.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
                  <ShieldAlert size={18} /> Focus & Remediation Areas
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{weaknesses.length} Gap(s)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {weaknesses.slice(0, 2).map(w => (
                  <WeaknessCard key={w.id} weakness={w} />
                ))}
              </div>
            </div>
          )}

          {/* Topic Mastery Distribution */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="#10b981" /> Topic Mastery Breakdown
              </h3>
              <button
                onClick={() => navigate('/learn')}
                style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                View Roadmap →
              </button>
            </div>

            <Card padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {masteries.slice(0, 6).map(m => (
                <div
                  key={m.topicId}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    T{m.topicSequence}: {m.topicTitle}
                  </span>
                  <MasteryBadge state={m.conceptualState} score={m.masteryScore} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {/* Phase 7 Adaptive Assessment & Contest Quick Launch Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <Card padding="md" glow style={{ border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.2) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>
                Skill Benchmark
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0' }}>
                Adaptive Assessment
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Calibrate your rating and unlock verified skill credentials.
              </p>
            </div>
            <Award size={24} color="#60a5fa" />
          </div>
          <button
            onClick={() => navigate('/assessments')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Take Assessment →
          </button>
        </Card>

        <Card padding="md" glow style={{ border: '1px solid rgba(245, 158, 11, 0.3)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(120, 53, 15, 0.2) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                Competitive Arena
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0' }}>
                Weekly Contests & Ranks
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Compete against global coders in timed ICPC-style rounds.
              </p>
            </div>
            <Flame size={24} color="#f59e0b" />
          </div>
          <button
            onClick={() => navigate('/contests')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#d97706',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            View Contests →
          </button>
        </Card>

        {/* Career & Portfolio Hub Card */}
        <Card
          padding="lg"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.05))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                Career Intelligence
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0' }}>
                Readiness & Portfolios
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Track career skill gaps, mock interviews, ATS resumes & public portfolio.
              </p>
            </div>
            <Award size={24} color="#10b981" />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/career')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: '#059669',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Career Roadmaps →
            </button>
            <button
              onClick={() => navigate('/portfolio')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              My Portfolio
            </button>
            <button
              onClick={() => navigate('/interviews')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Mock Interview
            </button>
          </div>
        </Card>
      </div>


      {/* Recently Completed Lessons */}
      {dashboard?.recentCompletedLessons && dashboard.recentCompletedLessons.length > 0 && (

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#818cf8" /> Recently Completed Lessons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dashboard.recentCompletedLessons.map(lsn => (
              <Card key={lsn.id} padding="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{lsn.title}</span>
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
