import React from 'react';
import { SocraticHintLevel, SocraticHintResultDto } from '@codeforge/shared';
import { Lightbulb, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { Card, Button, Badge } from '../common';

export interface HintProgressProps {
  currentLevel: SocraticHintLevel;
  hintResult?: SocraticHintResultDto | null;
  isLoading: boolean;
  onRequestNextLevel: () => void;
}

export const HintProgress: React.FC<HintProgressProps> = ({
  currentLevel,
  hintResult,
  isLoading,
  onRequestNextLevel,
}) => {
  const levels: Array<{ level: SocraticHintLevel; label: string; desc: string }> = [
    { level: 1, label: 'L1: Direction', desc: 'Conceptual mental model' },
    { level: 2, label: 'L2: Pattern', desc: 'Technique & data structure' },
    { level: 3, label: 'L3: Inspect', desc: 'Analyze learner code' },
    { level: 4, label: 'L4: Algorithm', desc: 'Pseudocode logic' },
    { level: 5, label: 'L5: Scaffold', desc: 'Structural blueprint' },
  ];

  return (
    <Card padding="md" glow style={{ background: 'var(--bg-surface)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="#f59e0b" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
            Progressive Socratic Hints
          </span>
        </div>
        <Badge variant="warning" size="sm">
          LEVEL {currentLevel} OF 5
        </Badge>
      </div>

      {/* 5-Step Level Indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {levels.map(lvl => {
          const isReached = lvl.level <= currentLevel;
          const isCurrent = lvl.level === currentLevel;

          return (
            <div
              key={lvl.level}
              style={{
                flex: 1,
                padding: '6px 4px',
                borderRadius: '6px',
                textAlign: 'center',
                background: isCurrent
                  ? 'rgba(245, 158, 11, 0.2)'
                  : isReached
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'var(--bg-surface-elevated)',
                border: isCurrent ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: isCurrent ? '#f59e0b' : isReached ? '#10b981' : 'var(--text-muted)' }}>
                {lvl.level === currentLevel ? `● L${lvl.level}` : isReached ? `✓ L${lvl.level}` : `L${lvl.level}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Hint Content */}
      {hintResult && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '14px',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b',
            marginBottom: '14px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', marginBottom: '6px' }}>
            {hintResult.title}
          </div>
          <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {hintResult.hint}
          </div>
          {hintResult.guidingQuestion && (
            <div
              style={{
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <HelpCircle size={14} />
              <span>{hintResult.guidingQuestion}</span>
            </div>
          )}
        </div>
      )}

      {/* Next Hint CTA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {currentLevel < 5 ? (
          <Button
            size="sm"
            variant="secondary"
            isLoading={isLoading}
            rightIcon={<ArrowRight size={14} />}
            onClick={onRequestNextLevel}
          >
            {hintResult ? 'Need Another Hint? (Advance Level)' : 'Get Level 1 Hint'}
          </Button>
        ) : (
          <Badge variant="success" size="sm">
            <CheckCircle2 size={12} /> All hint levels explored
          </Badge>
        )}
      </div>
    </Card>
  );
};
