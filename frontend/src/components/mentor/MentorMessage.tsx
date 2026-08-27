import React from 'react';
import { MentorMessageDto } from '@codeforge/shared';
import { Bot, User, Code2 } from 'lucide-react';

export interface MentorMessageProps {
  message: MentorMessageDto;
}

export const MentorMessage: React.FC<MentorMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
        — {message.content} —
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        marginBottom: '14px',
        flexDirection: isAssistant ? 'row' : 'row-reverse',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: isAssistant ? 'rgba(99, 102, 241, 0.2)' : 'rgba(168, 85, 247, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isAssistant ? <Bot size={16} color="#818cf8" /> : <User size={16} color="#c084fc" />}
      </div>

      <div
        style={{
          maxWidth: '85%',
          background: isAssistant ? 'var(--bg-surface)' : 'rgba(99, 102, 241, 0.12)',
          border: isAssistant ? '1px solid var(--border-subtle)' : '1px solid rgba(99, 102, 241, 0.3)',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#e2e8f0',
          lineHeight: 1.5,
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>

        {message.codeContext && (
          <div
            style={{
              marginTop: '8px',
              padding: '6px 8px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Code2 size={12} />
            <span>Code Context attached ({message.codeContext.length} chars)</span>
          </div>
        )}
      </div>
    </div>
  );
};
