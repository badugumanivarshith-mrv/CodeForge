import React from 'react';
import { RecommendationDto } from '@codeforge/shared';
import { Sparkles, Flame, Target, BookOpen, HelpCircle, Code2, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { useNavigate } from 'react-router-dom';

export interface RecommendationWidgetProps {
  recommendations: RecommendationDto[];
}

export const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({
  recommendations,
}) => {
  const navigate = useNavigate();

  if (recommendations.length === 0) return null;

  const topRec = recommendations[0];

  const getIcon = (type: RecommendationDto['type']) => {
    switch (type) {
      case 'MAINTAIN_STREAK':
        return <Flame size={20} color="#f59e0b" />;
      case 'REVIEW_TOPIC':
      case 'REVISIT_PREREQUISITE':
        return <Target size={20} color="#ef4444" />;
      case 'TAKE_QUIZ':
        return <HelpCircle size={20} color="#c084fc" />;
      case 'PRACTICE_PROBLEM':
        return <Code2 size={20} color="#34d399" />;
      default:
        return <BookOpen size={20} color="#818cf8" />;
    }
  };

  return (
    <Card
      padding="lg"
      glow
      style={{
        borderLeft: '4px solid var(--color-brand-primary)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        marginBottom: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getIcon(topRec.type)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant={topRec.priority === 'urgent' ? 'danger' : 'brand'} size="sm">
                <Sparkles size={12} /> {topRec.badgeText || 'RECOMMENDED NEXT ACTION'}
              </Badge>
              {topRec.priority === 'urgent' && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171' }}>HIGH IMPACT</span>
              )}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px', color: '#ffffff' }}>
              {topRec.title}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '650px', lineHeight: 1.5 }}>
              {topRec.reason}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight size={16} />}
          onClick={() => navigate(topRec.ctaUrl)}
        >
          {topRec.ctaText}
        </Button>
      </div>
    </Card>
  );
};
