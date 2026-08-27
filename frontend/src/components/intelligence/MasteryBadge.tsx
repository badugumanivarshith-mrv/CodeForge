import React from 'react';
import { ConceptualMasteryLevel } from '@codeforge/shared';
import { CheckCircle2, Flame, Award, BookOpen, Clock } from 'lucide-react';

export interface MasteryBadgeProps {
  state: ConceptualMasteryLevel;
  score?: number;
  showScore?: boolean;
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({
  state,
  score,
  showScore = true,
}) => {
  const configs: Record<
    ConceptualMasteryLevel,
    { label: string; bg: string; color: string; border: string; icon: React.ReactNode }
  > = {
    not_started: {
      label: 'Not Started',
      bg: 'rgba(148, 163, 184, 0.1)',
      color: '#94a3b8',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      icon: <Clock size={12} />,
    },
    learning: {
      label: 'Learning',
      bg: 'rgba(56, 189, 248, 0.1)',
      color: '#38bdf8',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      icon: <BookOpen size={12} />,
    },
    developing: {
      label: 'Developing',
      bg: 'rgba(168, 85, 247, 0.1)',
      color: '#c084fc',
      border: '1px solid rgba(168, 85, 247, 0.25)',
      icon: <Flame size={12} />,
    },
    proficient: {
      label: 'Proficient',
      bg: 'rgba(99, 102, 241, 0.15)',
      color: '#818cf8',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      icon: <Award size={12} />,
    },
    mastered: {
      label: 'Mastered',
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      icon: <CheckCircle2 size={12} />,
    },
  };

  const config = configs[state] || configs.not_started;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '6px',
        background: config.bg,
        color: config.color,
        border: config.border,
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      {config.icon}
      <span>{config.label}</span>
      {showScore && score !== undefined && score > 0 && (
        <span style={{ opacity: 0.85 }}>({score}%)</span>
      )}
    </div>
  );
};
