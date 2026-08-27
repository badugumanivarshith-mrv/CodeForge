import React from 'react';
import { LearningPathItemDto } from '@codeforge/shared';
import {
  BookOpen,
  HelpCircle,
  Code2,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { useNavigate } from 'react-router-dom';

export interface LearningPathListProps {
  items: LearningPathItemDto[];
}

export const LearningPathList: React.FC<LearningPathListProps> = ({ items }) => {
  const navigate = useNavigate();

  const getActionIcon = (type: LearningPathItemDto['actionType']) => {
    switch (type) {
      case 'continue_lesson':
        return <BookOpen size={16} color="#818cf8" />;
      case 'take_quiz':
        return <HelpCircle size={16} color="#c084fc" />;
      case 'practice_problem':
        return <Code2 size={16} color="#34d399" />;
      case 'revisit_prerequisite':
        return <RotateCcw size={16} color="#f59e0b" />;
      case 'advance_topic':
        return <Sparkles size={16} color="#10b981" />;
      default:
        return <BookOpen size={16} color="#818cf8" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item, idx) => (
        <Card
          key={item.id}
          padding="sm"
          glow={!item.isCompleted && idx === 0}
          style={{
            background: item.isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-surface)',
            borderLeft: item.isCompleted
              ? '4px solid #10b981'
              : item.priority === 'urgent'
              ? '4px solid #ef4444'
              : item.priority === 'high'
              ? '4px solid var(--color-brand-primary)'
              : '4px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            opacity: item.isCompleted ? 0.75 : 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.isCompleted ? <CheckCircle2 size={18} color="#10b981" /> : getActionIcon(item.actionType)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  STEP {item.sequence} • {item.topicTitle}
                </span>
                {item.priority === 'urgent' && <Badge variant="danger" size="sm">Urgent</Badge>}
                {item.estimatedMinutes > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ~{item.estimatedMinutes} mins
                  </span>
                )}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                {item.targetTitle}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {item.reason}
              </div>
            </div>
          </div>

          <div>
            {item.isCompleted ? (
              <Badge variant="success" size="sm">Completed</Badge>
            ) : (
              <Button
                size="sm"
                variant={idx === 0 ? 'primary' : 'secondary'}
                rightIcon={<ArrowRight size={14} />}
                onClick={() => navigate(item.actionUrl)}
              >
                Start
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
