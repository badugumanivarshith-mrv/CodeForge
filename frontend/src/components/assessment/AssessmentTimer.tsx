import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface AssessmentTimerProps {
  initialRemainingSeconds: number;
  onExpire?: () => void;
}

export const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  initialRemainingSeconds,
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialRemainingSeconds);

  useEffect(() => {
    setSecondsLeft(initialRemainingSeconds);
  }, [initialRemainingSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 300 && secondsLeft > 0;
  const isExpired = secondsLeft === 0;

  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '8px',
        background: isExpired
          ? 'rgba(239, 68, 68, 0.15)'
          : isUrgent
          ? 'rgba(245, 158, 11, 0.15)'
          : 'rgba(59, 130, 246, 0.1)',
        border: `1px solid ${
          isExpired
            ? 'rgba(239, 68, 68, 0.4)'
            : isUrgent
            ? 'rgba(245, 158, 11, 0.4)'
            : 'rgba(59, 130, 246, 0.25)'
        }`,
        color: isExpired ? '#f87171' : isUrgent ? '#fbbf24' : '#60a5fa',
        fontWeight: 600,
        fontSize: '0.9rem',
        fontFamily: 'monospace',
      }}
    >
      {isUrgent ? <AlertTriangle size={16} className="animate-pulse" /> : <Clock size={16} />}
      <span>{isExpired ? 'EXPIRED' : formatted}</span>
    </div>
  );
};
