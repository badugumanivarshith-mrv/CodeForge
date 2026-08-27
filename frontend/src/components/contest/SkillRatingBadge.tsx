import React from 'react';
import { SkillRatingDto } from '@codeforge/shared';
import { Trophy, ShieldCheck } from 'lucide-react';


interface SkillRatingBadgeProps {
  rating: SkillRatingDto;
  compact?: boolean;
}

export const SkillRatingBadge: React.FC<SkillRatingBadgeProps> = ({ rating, compact = false }) => {
  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'grandmaster':
        return { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', border: '#f87171' };
      case 'master':
        return { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24' };
      case 'adept':
        return { color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#a78bfa' };
      case 'apprentice':
        return { color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#60a5fa' };
      default:
        return { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', border: '#34d399' };
    }
  };

  const style = getTierColor(rating.rankTier);

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: `1px solid ${style.border}44`,
        }}
      >
        <Trophy size={14} color={style.color} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
          {rating.currentRating}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: style.color }}>
          {rating.rankTier}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        borderRadius: '12px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(3, 7, 18, 0.9) 100%)',
        border: `1px solid ${style.border}33`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color={style.color} />
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Coding Skill Rating
          </span>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: `${style.color}22`,
            color: style.color,
            border: `1px solid ${style.border}55`,
          }}
        >
          {rating.rankTier}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          {rating.currentRating}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Peak: <strong style={{ color: '#cbd5e1' }}>{rating.peakRating}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
        <span>Percentile: <strong style={{ color: '#38bdf8' }}>Top {(100 - rating.percentile).toFixed(1)}%</strong></span>
        <span>Assessments: <strong style={{ color: '#f8fafc' }}>{rating.assessmentsCount}</strong></span>
      </div>
    </div>
  );
};
