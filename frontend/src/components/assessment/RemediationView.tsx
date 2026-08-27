import React from 'react';
import { RemediationPlanDto } from '@codeforge/shared';
import { BookOpen, Code, Bot, Target, ArrowRight, AlertCircle } from 'lucide-react';

import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface RemediationViewProps {
  remediation: RemediationPlanDto;
}

export const RemediationView: React.FC<RemediationViewProps> = ({ remediation }) => {
  const navigate = useNavigate();

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen size={16} color="#3b82f6" />;
      case 'problem':
        return <Code size={16} color="#10b981" />;
      case 'mentor_concept':
        return <Bot size={16} color="#8b5cf6" />;
      default:
        return <Target size={16} color="#f59e0b" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      case 'medium':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Remediation Summary */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <AlertCircle size={18} color="#60a5fa" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600 }}>
            Personalized Remediation Plan
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
          {remediation.summary}
        </p>

        {remediation.weakConcepts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>Focus Areas:</span>
            {remediation.weakConcepts.map((c, i) => (
              <span
                key={i}
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actionable Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
          Recommended Next Steps ({remediation.actionItems.length})
        </h4>

        {remediation.actionItems.map((item, idx) => {
          const badge = getPriorityBadge(item.priority);

          return (
            <div
              key={item.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid #1e293b',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  {getActionIcon(item.type)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{item.description}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                rightIcon={<ArrowRight size={13} />}
                onClick={() => {
                  if (item.type === 'lesson') {
                    navigate('/roadmap');
                  } else {
                    navigate('/arena');
                  }
                }}
              >
                Start
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
