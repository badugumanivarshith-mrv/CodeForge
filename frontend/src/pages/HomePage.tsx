import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code2, Bot, Trophy, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { TIER_1_LANGUAGES } from '@codeforge/shared';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <Badge variant="brand" size="md" style={{ marginBottom: '20px' }}>
          <Sparkles size={14} /> AI-Powered Coding Mastery 2.0
        </Badge>
        <h1
          style={{
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          From First Line to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Engineering Mastery
          </span>
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6,
          }}
        >
          CodeForge combines Socratic AI tutoring, isolated polyglot execution, and deep skill graphs to take you from fundamentals to interview-ready software engineer.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />} onClick={() => navigate('/learn')}>
            Explore Curriculum
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/workspace')}>
            Try Interactive Workspace
          </Button>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '80px',
        }}
      >
        <Card glow padding="lg">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
              marginBottom: '20px',
            }}
          >
            <Code2 size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>Structured 10-Topic Paths</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Every Tier-1 language features 10 structured topics with lessons, interactive examples, checkpoint quizzes, coding problems, and real-world assignments.
          </p>
        </Card>

        <Card glow padding="lg">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
              marginBottom: '20px',
            }}
          >
            <Bot size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>Socratic AI Guidance</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Our AI tutor doesn&apos;t just give you code. It provides multi-tiered hints, points out runtime pitfalls, reviews time complexity, and adapts to your mistakes.
          </p>
        </Card>

        <Card glow padding="lg">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              marginBottom: '20px',
            }}
          >
            <Trophy size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>Skill Graph & Mastery</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Track your real competence with Bayesian Knowledge Tracing. Earn XP, maintain daily streaks, and climb league leaderboards.
          </p>
        </Card>
      </div>

      {/* Tier 1 Languages Grid */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Supported Tier-1 Languages</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Zero-setup execution sandboxes ready for high-performance practice.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
          }}
        >
          {TIER_1_LANGUAGES.map(lang => (
            <Card
              key={lang.id}
              glow
              padding="md"
              style={{
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => navigate(`/learn/${lang.id}`)}
            >
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{lang.name}</div>
              <Badge variant="brand" size="sm">
                .{lang.extension}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
