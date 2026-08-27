import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy, Sparkles, RefreshCw } from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { quizApi } from '../services/quizApi';
import { QuizDto, QuizSubmitResultDto } from '@codeforge/shared';

export const QuizPage: React.FC = () => {
  const { quizId, topicId } = useParams<{ quizId?: string; topicId?: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizDto | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizSubmitResultDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        if (topicId) {
          const data = await quizApi.getQuizByTopic(topicId);
          setQuiz(data);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, topicId]);

  if (isLoading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading checkpoint quiz...
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No Quiz Available</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          This topic currently does not have an active checkpoint quiz.
        </p>
        <Button variant="primary" onClick={() => navigate('/learn')}>
          Return to Curriculum
        </Button>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const selectedOptionId = selectedAnswers[currentQ.id];

  const handleSelectOption = (optionId: string) => {
    if (quizResult) return; // Locked after submission
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));

      const result = await quizApi.submitQuiz(quiz.id, { answers: answersPayload });
      setQuizResult(result);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setQuizResult(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      {/* Quiz Result View */}
      {quizResult ? (
        <div>
          {/* Result Banner Card */}
          <Card
            glow
            padding="lg"
            style={{
              textAlign: 'center',
              border: quizResult.isPassed ? '1px solid #10b981' : '1px solid #f43f5e',
              background: quizResult.isPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
              marginBottom: '32px',
            }}
          >
            <Trophy size={48} color={quizResult.isPassed ? '#10b981' : '#f43f5e'} style={{ margin: '0 auto 16px' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              {quizResult.isPassed ? 'Topic Checkpoint Cleared!' : 'Checkpoint Not Passed'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '16px' }}>
              You scored <strong style={{ color: '#ffffff' }}>{quizResult.scorePercentage}%</strong> ({quizResult.correctAnswersCount}/{quizResult.totalQuestions} questions correct). Passing score: {quiz.passingScorePercentage}%.
            </p>

            {quizResult.xpAwarded > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '14px', marginBottom: '20px' }}>
                <Sparkles size={16} /> +{quizResult.xpAwarded} XP Awarded to your Profile!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
              <Button variant="secondary" leftIcon={<RefreshCw size={16} />} onClick={handleRetake}>
                Retake Checkpoint
              </Button>
              <Button variant="primary" rightIcon={<ArrowRight size={16} />} onClick={() => navigate('/learn')}>
                Continue Curriculum Roadmap
              </Button>
            </div>
          </Card>

          {/* Question Explanations Review */}
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Detailed Answers & Explanations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quizResult.questionsReview?.map((rev, idx) => {
              const q = quiz.questions?.find(item => item.id === rev.questionId);
              return (
                <Card key={rev.questionId} padding="md">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    {rev.isCorrect ? (
                      <Badge variant="success" size="sm"><CheckCircle2 size={12} /> Correct</Badge>
                    ) : (
                      <Badge variant="danger" size="sm"><XCircle size={12} /> Incorrect</Badge>
                    )}
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Question {idx + 1}</span>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>{q?.questionMdx}</div>

                  {q?.codeSnippet && (
                    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', background: '#05070a', padding: '12px', borderRadius: '8px', color: '#38bdf8', marginBottom: '12px' }}>
                      {q.codeSnippet}
                    </pre>
                  )}

                  {rev.explanationMdx && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '10px 14px', borderRadius: '8px' }}>
                      💡 <strong>Explanation:</strong> {rev.explanationMdx}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Quiz Taking Flow */
        <div>
          {/* Progress Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Badge variant="purple" size="sm">Topic Checkpoint</Badge>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '4px', width: '100%', background: 'var(--bg-surface-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`, background: '#a855f7', transition: 'width 250ms ease' }} />
            </div>
          </div>

          {/* Question Card */}
          <Card padding="lg" style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.5, marginBottom: '16px' }}>
              {currentQ.questionMdx}
            </h2>

            {currentQ.codeSnippet && (
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', background: '#05070a', padding: '16px', borderRadius: '10px', color: '#38bdf8', marginBottom: '20px' }}>
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQ.options.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className="glass-card glow-card"
                    style={{
                      padding: '16px 20px',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      border: isSelected ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-glass-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{opt.optionText}</span>
                    {isSelected && <CheckCircle2 size={18} color="#818cf8" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                variant="primary"
                disabled={!selectedOptionId}
                isLoading={isSubmitting}
                rightIcon={<Trophy size={16} />}
                onClick={handleSubmitQuiz}
              >
                Submit & Grade Checkpoint
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={!selectedOptionId}
                rightIcon={<ArrowRight size={16} />}
                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
