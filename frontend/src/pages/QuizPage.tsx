import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../components/common';

export const QuizPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigate = useNavigate();

  const options = [
    'A block of code defined by 4 spaces of indentation',
    'A block delimited by curly braces { }',
    'A block ended by a semicolon ;',
    'A block enclosed in parentheses ( )',
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="purple" size="sm">Checkpoint Quiz</Badge>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Question 1 of 5</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
          Topic 1: How does Python define code blocks and scope?
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <div
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className="glass-card glow-card"
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-glass-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 500 }}>{opt}</span>
              {isSelected && <CheckCircle2 size={18} color="#818cf8" />}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button variant="secondary" onClick={() => navigate('/learn')}>
          Exit Quiz
        </Button>
        <Button
          variant="primary"
          disabled={selectedOption === null}
          rightIcon={<ArrowRight size={16} />}
          onClick={() => alert('Quiz answer recorded')}
        >
          Next Question
        </Button>
      </div>
    </div>
  );
};
