import React from 'react';
import { WeaknessItemDto } from '@codeforge/shared';
import { AlertCircle, ArrowRight, ShieldAlert, Zap } from 'lucide-react';
import { Card, Badge, Button } from '../common';
import { useNavigate } from 'react-router-dom';

export interface WeaknessCardProps {
  weakness: WeaknessItemDto;
}

export const WeaknessCard: React.FC<WeaknessCardProps> = ({ weakness }) => {
  const navigate = useNavigate();

  const isHigh = weakness.priority === 'high';
  const isPrereq = weakness.category === 'prerequisite_gap';

  return (
    <Card
      padding="md"
      style={{
        background: isHigh ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)',
        borderLeft: isHigh ? '4px solid #ef4444' : '4px solid #f59e0b',
        borderTop: '1px solid var(--border-subtle)',
        borderRight: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isHigh ? <ShieldAlert size={16} color="#ef4444" /> : <AlertCircle size={16} color="#f59e0b" />}
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
            Topic {weakness.topicSequence}: {weakness.topicTitle}
          </span>
        </div>
        <Badge variant={isHigh ? 'danger' : 'warning'} size="sm">
          {weakness.priority.toUpperCase()} PRIORITY
        </Badge>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
        <strong>Evidence:</strong> {weakness.evidence}
      </p>

      <div
        style={{
          fontSize: '12px',
          color: '#cbd5e1',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Zap size={14} color="#f59e0b" />
        <span><strong>Remediation:</strong> {weakness.recommendedRemediation}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="sm"
          variant={isHigh ? 'danger' : 'secondary'}
          rightIcon={<ArrowRight size={14} />}
          onClick={() => navigate(isPrereq ? `/learn/${weakness.languageId}` : `/learn/${weakness.languageId}`)}
        >
          Remediate Now
        </Button>
      </div>
    </Card>
  );
};
