import React from 'react';
import { CodeReviewResultDto } from '@codeforge/shared';
import { CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Sparkles, Lightbulb } from 'lucide-react';
import { Card, Badge } from '../common';

export interface CodeReviewPanelProps {
  review: CodeReviewResultDto;
}

export const CodeReviewPanel: React.FC<CodeReviewPanelProps> = ({ review }) => {
  const isCorrect = review.correctness.status === 'correct';
  const isPartial = review.correctness.status === 'partially_correct';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Overall Summary & Correctness Card */}
      <Card
        padding="md"
        style={{
          borderLeft: isCorrect ? '4px solid #10b981' : isPartial ? '4px solid #f59e0b' : '4px solid #ef4444',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isCorrect ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#f59e0b" />}
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
              Algorithm Assessment
            </span>
          </div>
          <Badge variant={isCorrect ? 'success' : isPartial ? 'warning' : 'danger'} size="sm">
            {review.correctness.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
          {review.summary}
        </p>

        <div style={{ fontSize: '12px', color: '#cbd5e1', background: 'rgba(0, 0, 0, 0.25)', padding: '8px 12px', borderRadius: '6px' }}>
          <strong>Details:</strong> {review.correctness.explanation}
        </div>
      </Card>

      {/* Complexity Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Card padding="sm" style={{ background: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Cpu size={14} color="#818cf8" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TIME COMPLEXITY</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#818cf8' }}>
            {review.complexity.time}
          </div>
        </Card>

        <Card padding="sm" style={{ background: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Cpu size={14} color="#a855f7" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>SPACE COMPLEXITY</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#c084fc' }}>
            {review.complexity.space}
          </div>
        </Card>
      </div>

      {/* Detected Bugs */}
      {review.bugs.length > 0 && (
        <Card padding="md" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldAlert size={16} color="#ef4444" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>
              Detected Issues & Bugs ({review.bugs.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {review.bugs.map((b, idx) => (
              <div key={idx} style={{ fontSize: '12px', color: '#fca5a5', lineHeight: 1.4 }}>
                • <strong>{b.severity.toUpperCase()}:</strong> {b.description}
                {b.fixSuggestion && <div style={{ color: '#e2e8f0', marginTop: '2px', paddingLeft: '10px' }}>Fix: {b.fixSuggestion}</div>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Suggestions & Learning Points */}
      {review.learningPoints.length > 0 && (
        <Card padding="md" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Lightbulb size={16} color="#818cf8" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8' }}>
              Key Learning Takeaways
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {review.learningPoints.map((lp, idx) => (
              <div key={idx} style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <Sparkles size={12} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{lp}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
