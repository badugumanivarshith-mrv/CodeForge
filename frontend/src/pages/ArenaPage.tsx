import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { problemApi } from '../services/problemApi';
import { contestApi } from '../services/contestApi';
import { judgeApi } from '../services/judgeApi';
import {
  ProblemSummaryDto,
  ProblemDifficulty,
  ContestDto,
  LanguageRuntimeDto,
  PerformanceAnalyticsDto,
} from '@codeforge/shared';

export const ArenaPage: React.FC = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<ProblemSummaryDto[]>([]);
  const [contests, setContests] = useState<ContestDto[]>([]);
  const [runtimes, setRuntimes] = useState<LanguageRuntimeDto[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceAnalyticsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    const fetchArenaData = async () => {
      setIsLoading(true);
      try {
        const [probs, activeContests, runtimesList, userAnalytics] = await Promise.allSettled([
          problemApi.listProblems(),
          contestApi.listContests(),
          judgeApi.getLanguageRuntimes(),
          judgeApi.getPerformanceAnalytics(),
        ]);

        if (probs.status === 'fulfilled') setProblems(probs.value);
        if (activeContests.status === 'fulfilled') setContests(activeContests.value);
        if (runtimesList.status === 'fulfilled') setRuntimes(runtimesList.value);
        if (userAnalytics.status === 'fulfilled') setAnalytics(userAnalytics.value);
      } catch (err) {
        console.error('Failed to load arena data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArenaData();
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyBadgeColor = (diff: ProblemDifficulty | string): 'success' | 'warning' | 'danger' | 'brand' => {
    switch (diff) {
      case ProblemDifficulty.EASY:
        return 'success';
      case ProblemDifficulty.MEDIUM:
        return 'warning';
      case ProblemDifficulty.DIFFICULT:
        return 'danger';
      default:
        return 'brand';
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-highlight)',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Badge variant="purple">
              <Swords size={14} style={{ marginRight: '6px' }} />
              Competitive Coding Arena V2
            </Badge>
            <Badge variant="success">
              <Activity size={14} style={{ marginRight: '6px' }} />
              Live Online Judge Active
            </Badge>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
            Prove Your Algorithmic Mastery
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
            Battle through industry-grade algorithmic challenges with sub-millisecond execution, isolated multi-language sandboxes, live ICPC contest rankings, and AI-powered root-cause debugging.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Card style={{ padding: '16px 20px', minWidth: '140px', textAlign: 'center', background: 'var(--bg-glass-card)' }}>
            <div style={{ color: 'var(--color-brand-primary)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
              <CheckCircle2 size={22} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {analytics?.solvedByDifficulty.total ?? 0}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Problems Solved</div>
          </Card>

          <Card style={{ padding: '16px 20px', minWidth: '140px', textAlign: 'center', background: 'var(--bg-glass-card)' }}>
            <div style={{ color: 'var(--color-accent-emerald)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
              <Zap size={22} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {analytics?.acceptanceRate ? `${analytics.acceptanceRate}%` : '—'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Acceptance Rate</div>
          </Card>

          <Card style={{ padding: '16px 20px', minWidth: '140px', textAlign: 'center', background: 'var(--bg-glass-card)' }}>
            <div style={{ color: 'var(--color-accent-amber)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
              <Trophy size={22} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {contests.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Contests</div>
          </Card>
        </div>
      </div>

      {/* Featured Contests Banner */}
      {contests.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="var(--color-accent-amber)" />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Featured Contests</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/contests')}>
              View All Contests <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {contests.slice(0, 2).map(c => (
              <Card
                key={c.id}
                style={{
                  padding: '20px',
                  background: 'var(--bg-glass-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {c.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <Clock size={14} /> {c.durationMinutes} Minutes • ICPC Rules
                    </div>
                  </div>
                  <Badge variant="purple">{c.status.toUpperCase()}</Badge>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {c.participantCount || 0} Registered Participants
                  </span>
                  <Button size="sm" onClick={() => navigate(`/contests/${c.id}`)}>
                    Enter Arena
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Language Sandboxes Bar */}
      <Card style={{ padding: '16px 20px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--color-brand-primary)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Polyglot Judge Runtimes:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {runtimes.map(r => (
              <Badge key={r.id} variant="default" style={{ fontSize: '12px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent-emerald)', display: 'inline-block', marginRight: '6px' }} />
                {r.displayName}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Problemset Search & Filter Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Algorithmic Problem Set</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Select a problem to enter the live workspace</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search problem title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Difficulties</option>
              <option value={ProblemDifficulty.EASY}>Easy</option>
              <option value={ProblemDifficulty.MEDIUM}>Medium</option>
              <option value={ProblemDifficulty.DIFFICULT}>Hard</option>
            </select>

            <Button variant="secondary" size="sm" onClick={() => navigate('/submissions')}>
              Submission History
            </Button>
          </div>
        </div>

        {/* Problems List */}
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading challenge arena...
          </div>
        ) : filteredProblems.length === 0 ? (
          <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No algorithmic challenges matched your filters.
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredProblems.map((problem, index) => (
              <Card
                key={problem.id}
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/problems/${problem.slug}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', minWidth: '24px' }}>
                    #{index + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {problem.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Badge variant={getDifficultyBadgeColor(problem.difficulty)}>
                        {problem.difficulty.toUpperCase()}
                      </Badge>
                      {problem.topicTitle && (
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          • {problem.topicTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); navigate(`/problems/${problem.slug}`); }}>
                    Solve Challenge <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
