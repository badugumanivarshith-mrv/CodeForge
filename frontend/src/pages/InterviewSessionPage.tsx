import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { interviewApi } from '../services/interviewApi';
import {
  InterviewFeedbackDto,
  InterviewExchangeDto,
  InterviewStatus,
} from '@codeforge/shared';

export const InterviewSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [feedbackReport, setFeedbackReport] = useState<InterviewFeedbackDto | null>(null);
  const [currentExchange, setCurrentExchange] = useState<InterviewExchangeDto | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const fetchSession = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const data = await interviewApi.getFeedback(sessionId);
      setFeedbackReport(data);

      if (data.session.status === InterviewStatus.IN_PROGRESS) {
        // Find latest unanswered question
        const unanswered = data.exchanges.find(e => !e.userAnswerText);
        if (unanswered) {
          setCurrentExchange(unanswered);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !currentExchange || !userAnswer.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      const res = await interviewApi.answerQuestion(sessionId, {
        exchangeId: currentExchange.id,
        answerText: userAnswer,
      });

      setUserAnswer('');
      if (res.isComplete) {
        fetchSession();
      } else if (res.nextQuestion) {
        setCurrentExchange(res.nextQuestion);
        fetchSession();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading AI interview session...
      </div>
    );
  }

  if (!feedbackReport) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p>Interview session not found.</p>
        <Link to="/interviews">
          <Button variant="secondary" size="sm" style={{ marginTop: '12px' }}>
            Back to Interview Hub
          </Button>
        </Link>
      </div>
    );
  }

  const isCompleted = feedbackReport.session.status === InterviewStatus.COMPLETED;

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Back button */}
      <Link to="/interviews" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Mock Interview Hub
      </Link>

      {/* Header Banner */}
      <Card glow padding="lg" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{feedbackReport.session.roleTitle}</h1>
              <Badge variant={isCompleted ? 'success' : 'brand'} size="sm">
                {feedbackReport.session.interviewType.toUpperCase()}
              </Badge>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Level: {feedbackReport.session.difficulty} • Status: {feedbackReport.session.status}
            </p>
          </div>

          {isCompleted && feedbackReport.session.overallScore !== undefined && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#10b981' }}>
                  {feedbackReport.session.overallScore}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Overall Score</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* COMPLETED FEEDBACK REPORT */}
      {isCompleted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Multi-Dimensional Scores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <Card padding="md" glow style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>TECHNICAL DEPTH</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1' }}>{feedbackReport.session.technicalScore}%</div>
            </Card>
            <Card padding="md" glow style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>COMMUNICATION / STAR</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7' }}>{feedbackReport.session.communicationScore}%</div>
            </Card>
            <Card padding="md" glow style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>CONFIDENCE & STRUCTURE</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{feedbackReport.session.confidenceScore}%</div>
            </Card>
          </div>

          {/* AI Comprehensive Evaluation Summary */}
          <Card padding="lg">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>AI Comprehensive Evaluation</h3>
            <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {feedbackReport.feedbackSummaryMdx}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Key Strengths Demonstrated:</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {feedbackReport.strengths.map((s, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>Improvement Recommendations:</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {feedbackReport.improvementSuggestions.map((s, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Exchange History */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Question & Response History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {feedbackReport.exchanges.map((ex, idx) => (
                <Card key={ex.id} padding="lg">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Badge variant="brand" size="sm">Q{idx + 1}</Badge>
                    <strong style={{ fontSize: '15px' }}>{ex.questionText}</strong>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', margin: '10px 0', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Your Answer:</div>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                      {ex.userAnswerText || 'No answer recorded'}
                    </p>
                  </div>

                  {ex.evaluationFeedback && (
                    <div style={{ fontSize: '13px', color: '#6366f1', background: 'rgba(99, 102, 241, 0.05)', padding: '10px 12px', borderRadius: '6px' }}>
                      <strong>AI Evaluation:</strong> {ex.evaluationFeedback}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LIVE INTERVIEW QUESTION IN PROGRESS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentExchange && (
            <Card glow padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Brain size={20} color="var(--color-brand-primary)" />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                  Question {currentExchange.questionOrder} of {feedbackReport.session.totalQuestions}
                </h3>
              </div>

              <p style={{ fontSize: '16px', color: '#fff', lineHeight: 1.5, marginBottom: '24px' }}>
                {currentExchange.questionText}
              </p>

              <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <textarea
                  rows={6}
                  required
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your response clearly. For technical questions, explain trade-offs and complexity. For behavioral, use Situation-Task-Action-Result structure..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Word count: {userAnswer.trim().split(/\s+/).filter(Boolean).length}
                  </span>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmittingAnswer || !userAnswer.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={15} /> {isSubmittingAnswer ? 'Evaluating Response...' : 'Submit Answer'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Previous answered exchanges */}
          {feedbackReport.exchanges.filter(e => e.userAnswerText).length > 0 && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Previous Answers in this Session</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feedbackReport.exchanges.filter(e => e.userAnswerText).map(ex => (
                  <Card key={ex.id} padding="md">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <CheckCircle2 size={14} color="#10b981" />
                      <strong style={{ fontSize: '14px' }}>{ex.questionText}</strong>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      {ex.userAnswerText}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
