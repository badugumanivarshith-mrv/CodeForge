import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain,
  Code2,
  Layers,
  Users,
  Compass,
  Play,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { interviewApi } from '../services/interviewApi';
import {
  InterviewSessionDto,
  InterviewType,
  ProblemDifficulty,
} from '@codeforge/shared';

export const InterviewHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSessionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  // New Interview Form state
  const [selectedType, setSelectedType] = useState<InterviewType>(InterviewType.TECHNICAL);
  const [roleTitle, setRoleTitle] = useState('Senior Backend Engineer');
  const [difficulty, setDifficulty] = useState<ProblemDifficulty>(ProblemDifficulty.MEDIUM);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await interviewApi.getMySessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    try {
      const res = await interviewApi.startInterview({
        interviewType: selectedType,
        roleTitle,
        difficulty,
      });
      navigate(`/interviews/${res.session.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStarting(false);
    }
  };

  const getTrackIcon = (type: InterviewType) => {
    switch (type) {
      case InterviewType.TECHNICAL:
        return <Brain size={24} color="#6366f1" />;
      case InterviewType.CODING:
        return <Code2 size={24} color="#10b981" />;
      case InterviewType.SYSTEM_DESIGN:
        return <Layers size={24} color="#f59e0b" />;
      case InterviewType.BEHAVIORAL:
        return <Users size={24} color="#a855f7" />;
      case InterviewType.MIXED:
        return <Compass size={24} color="#ec4899" />;
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            AI Mock Interview Simulator & Coach
          </h1>
          <Badge variant="brand" size="sm">Real-time Socratic AI</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Simulate realistic FAANG-style technical, coding, behavioral, and system design interviews with instant multi-criteria grading.
        </p>
      </div>

      {/* Start Interview Setup & Track Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '36px' }}>
        {/* Track Options */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Select Interview Track</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { type: InterviewType.TECHNICAL, title: 'Technical Theory', desc: 'CS fundamentals, memory, concurrency & OS' },
              { type: InterviewType.CODING, title: 'Live Coding / DSA', desc: 'Algorithms, data structures & complexity' },
              { type: InterviewType.SYSTEM_DESIGN, title: 'System Design', desc: 'Distributed architectures, caching & scaling' },
              { type: InterviewType.BEHAVIORAL, title: 'STAR Behavioral', desc: 'Leadership principles, conflict & impact' },
              { type: InterviewType.MIXED, title: 'Comprehensive Mock', desc: 'Full round simulation across all domains' },
            ].map(track => (
              <Card
                key={track.type}
                glow={selectedType === track.type}
                padding="md"
                style={{
                  cursor: 'pointer',
                  border: selectedType === track.type ? '2px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                  background: selectedType === track.type ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface-elevated)',
                }}
                onClick={() => setSelectedType(track.type)}
              >
                <div style={{ marginBottom: '10px' }}>{getTrackIcon(track.type)}</div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{track.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{track.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuration & Launch Card */}
        <Card glow padding="lg">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Session Parameters</h3>
          <form onSubmit={handleStartInterview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Target Role</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={e => setRoleTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Difficulty Level</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as ProblemDifficulty)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value={ProblemDifficulty.EASY}>Entry / Junior (Easy)</option>
                <option value={ProblemDifficulty.MEDIUM}>Mid-Level (Medium)</option>
                <option value={ProblemDifficulty.HARD}>Senior / Staff (Hard)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isStarting}
              style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Play size={16} /> {isStarting ? 'Starting AI Session...' : 'Start AI Interview'}
            </Button>
          </form>
        </Card>
      </div>

      {/* Past Mock Interview History */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Past Interview Sessions ({sessions.length})</h3>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
        ) : sessions.length === 0 ? (
          <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No previous interviews completed. Start your first session above!</p>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {sessions.map(s => (
              <Card key={s.id} padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{s.roleTitle}</h4>
                    <Badge variant={s.status === 'completed' ? 'success' : 'warning'} size="sm">
                      {s.status}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Track: {s.interviewType.toUpperCase()} • Level: {s.difficulty}
                  </p>

                  {s.overallScore !== undefined && (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', fontSize: '12px' }}>
                      <span>Score: <strong style={{ color: '#10b981' }}>{s.overallScore}%</strong></span>
                      <span>Tech: <strong>{s.technicalScore}%</strong></span>
                      <span>Comm: <strong>{s.communicationScore}%</strong></span>
                    </div>
                  )}
                </div>

                <Link to={`/interviews/${s.id}`}>
                  <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                    {s.status === 'completed' ? 'View Feedback Report' : 'Resume Interview'}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
