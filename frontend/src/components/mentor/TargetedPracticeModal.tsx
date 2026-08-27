import React from 'react';
import { TargetedPracticeDto } from '@codeforge/shared';
import { Sparkles, X, Target, Code2 } from 'lucide-react';
import { Card, Button, Badge } from '../common';

export interface TargetedPracticeModalProps {
  practice: TargetedPracticeDto | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyStarterCode: (code: string) => void;
}

export const TargetedPracticeModal: React.FC<TargetedPracticeModalProps> = ({
  practice,
  isOpen,
  onClose,
  onApplyStarterCode,
}) => {
  if (!isOpen || !practice) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <Card
        padding="lg"
        glow
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="brand" size="sm">
            <Sparkles size={12} /> AI-GENERATED TARGETED PRACTICE
          </Badge>
          <Badge variant="warning" size="sm">
            {practice.difficulty.toUpperCase()}
          </Badge>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
          {practice.title}
        </h2>

        <div style={{ fontSize: '13px', color: '#818cf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={14} />
          <span>Targeting Weakness: {practice.targetSkillOrWeakness}</span>
        </div>

        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#e2e8f0',
            lineHeight: 1.6,
            marginBottom: '16px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {practice.descriptionMdx}
        </div>

        {practice.examples.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              EXAMPLES
            </h4>
            {practice.examples.map((ex, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                }}
              >
                <div><strong>Input:</strong> {ex.input}</div>
                <div><strong>Output:</strong> {ex.output}</div>
                {ex.explanation && <div style={{ color: 'var(--text-secondary)' }}><em>{ex.explanation}</em></div>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button variant="secondary" size="md" onClick={onClose}>
            Dismiss
          </Button>
          <Button
            variant="primary"
            size="md"
            rightIcon={<Code2 size={16} />}
            onClick={() => {
              const starter = practice.starterCode['python'] || Object.values(practice.starterCode)[0] || '';
              onApplyStarterCode(starter);
              onClose();
            }}
          >
            Load into Workspace
          </Button>
        </div>
      </Card>
    </div>
  );
};
