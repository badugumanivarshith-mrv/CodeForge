import React from 'react';
import { Target, Zap, Award } from 'lucide-react';

interface AssessmentProgressProps {
  currentIndex: number;
  totalQuestions: number;
  currentDifficulty: string;
  totalScore: number;
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentIndex,
  totalQuestions,
  currentDifficulty,
  totalScore,
}) => {
  const percentage = Math.min(100, Math.round(((currentIndex + 1) / Math.max(1, totalQuestions)) * 100));

  const getDiffColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80' };
      case 'difficult':
      case 'hard':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' };
      default:
        return { bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.3)', text: '#facc15' };
    }
  };

  const diffStyle = getDiffColor(currentDifficulty);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <Target size={14} color="#60a5fa" />
            <span>Question <strong style={{ color: '#f8fafc' }}>{Math.min(totalQuestions, currentIndex + 1)}</strong> of {totalQuestions}</span>
          </div>

          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: diffStyle.bg,
              border: `1px solid ${diffStyle.border}`,
              color: diffStyle.text,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Zap size={11} /> {currentDifficulty}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>
          <Award size={15} />
          <span>{totalScore} pts</span>
        </div>
      </div>

      {/* Visual Step Progress Bar */}
      <div style={{ height: '6px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
            transition: 'width 0.3s ease',
            borderRadius: '999px',
          }}
        />
      </div>
    </div>
  );
};
