import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../services/assessmentApi';
import {
  AssessmentSessionDto,
  AssessmentSessionStatus,
  AssessmentQuestionType,
} from '@codeforge/shared';
import { AssessmentTimer } from '../components/assessment/AssessmentTimer';
import { AssessmentProgress } from '../components/assessment/AssessmentProgress';
import { AssessmentQuestionView } from '../components/assessment/AssessmentQuestionView';
import { Button } from '../components/common/Button';
import { ShieldCheck, Send } from 'lucide-react';

export const AssessmentWorkspacePage: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<AssessmentSessionDto | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSession = async () => {
      try {
        const data = await assessmentApi.getSession(id);
        if (
          data.status === AssessmentSessionStatus.COMPLETED ||
          data.status === AssessmentSessionStatus.EXPIRED
        ) {
          navigate(`/assessments/${id}/result`);
          return;
        }
        setSession(data);
        setSelectedOptionIds([]);
        setCodeAnswer('');
        setQuestionStartTime(Date.now());
      } catch (err: any) {
        console.error('Failed to fetch assessment session', err);
        setError(err?.response?.data?.message || 'Could not load assessment session');
      }
    };

    fetchSession();
  }, [id, navigate]);

  const handleOptionSelect = (optionId: string) => {
    if (!session?.currentQuestion) return;

    if (session.currentQuestion.questionType === AssessmentQuestionType.MULTIPLE_SELECT) {
      setSelectedOptionIds(prev =>
        prev.includes(optionId) ? prev.filter(item => item !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleTimerExpired = async () => {
    if (!id) return;
    try {
      await assessmentApi.completeSession(id);
      navigate(`/assessments/${id}/result`);
    } catch (err) {
      navigate(`/assessments/${id}/result`);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !session.currentQuestion || !id) return;

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    try {
      setSubmitting(true);
      setError(null);

      const updated = await assessmentApi.submitAnswer({
        sessionId: id,
        questionId: session.currentQuestion.id,
        selectedOptionIds,
        codeAnswer: codeAnswer || undefined,
        timeSpentSeconds,
      });

      if (
        updated.status === AssessmentSessionStatus.COMPLETED ||
        updated.status === AssessmentSessionStatus.EXPIRED ||
        !updated.currentQuestion
      ) {
        navigate(`/assessments/${id}/result`);
      } else {
        setSession(updated);
        setSelectedOptionIds([]);
        setCodeAnswer('');
        setQuestionStartTime(Date.now());
      }
    } catch (err: any) {
      console.error('Failed to submit answer', err);
      const errMsg = err?.response?.data?.message || 'Failed to submit response';
      setError(errMsg);
      if (errMsg.includes('expired')) {
        navigate(`/assessments/${id}/result`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !session) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#f87171', fontSize: '1.1rem' }}>{error}</p>
        <Button variant="outline" onClick={() => navigate('/assessments')}>
          Return to Assessments
        </Button>
      </div>
    );
  }

  if (!session || !session.currentQuestion) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', color: '#94a3b8' }}>
        <p>Loading assessment question...</p>
      </div>
    );
  }

  const isOptionSelected =
    selectedOptionIds.length > 0 || (codeAnswer && codeAnswer.trim().length > 0);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar: Progress, Difficulty, Timer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid #1e293b',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
              Adaptive Assessment Runtime
            </span>
          </div>

          <AssessmentTimer
            initialRemainingSeconds={session.remainingSeconds ?? 0}
            onExpire={handleTimerExpired}
          />

        </div>

        <AssessmentProgress
          currentIndex={session.currentQuestionIndex}
          totalQuestions={session.totalQuestions}
          currentDifficulty={session.currentDifficulty}
          totalScore={session.totalScore}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Main Question Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <AssessmentQuestionView
          question={session.currentQuestion}
          selectedOptionIds={selectedOptionIds}
          onSelectOption={handleOptionSelect}
          codeAnswer={codeAnswer}
          onChangeCode={setCodeAnswer}
        />

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            💡 Questions adapt dynamically based on your response consistency.
          </span>

          <Button
            variant="primary"
            size="md"
            rightIcon={<Send size={16} />}
            disabled={!isOptionSelected || submitting}
            onClick={handleSubmitAnswer}
          >
            {submitting
              ? 'Evaluating...'
              : session.currentQuestionIndex + 1 >= session.totalQuestions
              ? 'Submit & Finish'
              : 'Submit & Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};
