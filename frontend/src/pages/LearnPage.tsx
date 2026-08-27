import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Lock, Code2, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { TIER_1_LANGUAGES, CORE_TOPIC_NAMES } from '@codeforge/shared';

export const LearnPage: React.FC = () => {
  const { languageSlug } = useParams<{ languageSlug?: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageSlug || 'python');
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header & Language Tabs */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Curriculum Roadmap</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Select a language to navigate its 10 core topics, lessons, quizzes, coding problems, and assignments.
        </p>

        {/* Language Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TIER_1_LANGUAGES.map(lang => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLanguage(lang.id);
                  navigate(`/learn/${lang.id}`);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--color-brand-primary)' : 'var(--bg-surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 10-Topic Roadmap Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {CORE_TOPIC_NAMES.map((topicName, idx) => {
          const sequence = idx + 1;
          const isUnlocked = sequence === 1; // Topic 1 unlocked by default for demo

          return (
            <Card
              key={sequence}
              glow={isUnlocked}
              padding="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: isUnlocked ? 1 : 0.65,
                borderLeft: isUnlocked ? '4px solid var(--color-brand-primary)' : '4px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isUnlocked ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface-elevated)',
                    color: isUnlocked ? '#818cf8' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                  }}
                >
                  {sequence}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{topicName}</h3>
                    {isUnlocked ? (
                      <Badge variant="success" size="sm">Available</Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        <Lock size={12} /> Locked
                      </Badge>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={14} /> Lessons
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HelpCircle size={14} /> Quiz
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Code2 size={14} /> 5 Problems
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={14} /> 1-2 Assignments
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {isUnlocked ? (
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                    onClick={() => navigate(`/workspace`)}
                  >
                    Open Topic
                  </Button>
                ) : (
                  <Lock size={18} color="var(--text-muted)" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
