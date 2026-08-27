import React from 'react';
import { AssessmentQuestionDto, AssessmentQuestionType } from '@codeforge/shared';
import { Code, HelpCircle, CheckSquare, Square } from 'lucide-react';


interface AssessmentQuestionViewProps {
  question: AssessmentQuestionDto;
  selectedOptionIds: string[];
  onSelectOption: (optionId: string) => void;
  codeAnswer: string;
  onChangeCode: (code: string) => void;
}

export const AssessmentQuestionView: React.FC<AssessmentQuestionViewProps> = ({
  question,
  selectedOptionIds,
  onSelectOption,
  codeAnswer,
  onChangeCode,
}) => {
  const isMultipleSelect = question.questionType === AssessmentQuestionType.MULTIPLE_SELECT;
  const isCodingProblem = question.questionType === AssessmentQuestionType.CODING_PROBLEM;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Question Header & Prompt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
          <HelpCircle size={14} color="#3b82f6" />
          <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{question.topicName || 'General Topic'}</span>
          <span>•</span>
          <span>{question.points} Points</span>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
          {question.promptMdx}
        </h2>
      </div>

      {/* Code Snippet Box if available */}
      {question.codeSnippet && (
        <div
          style={{
            background: '#030712',
            border: '1px solid #1f2937',
            borderRadius: '10px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#e2e8f0',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {question.codeSnippet}
        </div>
      )}

      {/* Option Selection for MCQ / Select / Output / Debugging */}
      {!isCodingProblem && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {question.options.map(opt => {
            const isSelected = selectedOptionIds.includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${isSelected ? '#3b82f6' : 'rgba(51, 65, 85, 0.6)'}`,
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  transition: 'all 0.15s ease',
                  fontSize: '0.95rem',
                }}
              >
                <div style={{ color: isSelected ? '#60a5fa' : '#64748b' }}>
                  {isMultipleSelect ? (
                    isSelected ? <CheckSquare size={18} /> : <Square size={18} />
                  ) : (
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#3b82f6' : '#64748b'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                      )}
                    </div>
                  )}
                </div>

                <span style={{ flex: 1, lineHeight: 1.4 }}>{opt.optionText}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Code Editor for Coding Challenge questions */}
      {isCodingProblem && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem' }}>
            <Code size={13} color="#8b5cf6" />
            <span>Implement your solution in the code editor below:</span>
          </div>

          <textarea
            value={codeAnswer}
            onChange={e => onChangeCode(e.target.value)}
            spellCheck={false}
            placeholder="Write your solution code here..."
            style={{
              width: '100%',
              minHeight: '260px',
              padding: '16px',
              borderRadius: '10px',
              background: '#030712',
              border: '1px solid #1f2937',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};
