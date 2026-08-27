import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../services/assessmentApi';
import {
  AssessmentResultDto,
  AssessmentAnalyticsDto,
  RemediationPlanDto,
} from '@codeforge/shared';
import { RemediationView } from '../components/assessment/RemediationView';
import { Button } from '../components/common/Button';
import { Award } from 'lucide-react';


export const AssessmentResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<AssessmentResultDto | null>(null);
  const [analytics, setAnalytics] = useState<AssessmentAnalyticsDto | null>(null);
  const [remediation, setRemediation] = useState<RemediationPlanDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        const [resData, analyticsData, remData] = await Promise.all([
          assessmentApi.getResult(id),
          assessmentApi.getAnalytics(id).catch(() => null),
          assessmentApi.getRemediation(id).catch(() => null),
        ]);

        setResult(resData);
        setAnalytics(analyticsData);
        setRemediation(remData);
      } catch (err: any) {
        console.error('Failed to load assessment results', err);
        setError('Could not load assessment results');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', color: '#94a3b8' }}>
        <p>Loading assessment evaluation report...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#f87171', fontSize: '1.1rem' }}>{error || 'Result not found'}</p>
        <Button variant="outline" onClick={() => navigate('/assessments')}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Award size={20} color="#fbbf24" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
              Assessment Evaluation Report
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: 0, textTransform: 'capitalize' }}>
            {result.assessmentType.replace('_', ' ')} Complete
          </h1>
        </div>

        <Button variant="outline" onClick={() => navigate('/assessments')}>
          Back to Hub
        </Button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Score Card */}
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Overall Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
              {result.score}/{result.maxScore}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 600 }}>
              ({Math.round(result.percentage)}%)
            </span>
          </div>
        </div>

        {/* Accuracy Card */}
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Accuracy
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>
              {Math.round(result.accuracy)}%
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {result.attemptsCount} questions
            </span>
          </div>
        </div>

        {/* Skill Rating Delta Card */}
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Skill Rating
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
              {result.skillRatingAfter}
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: result.skillRatingDelta >= 0 ? '#4ade80' : '#f87171',
              }}
            >
              {result.skillRatingDelta >= 0 ? `+${result.skillRatingDelta}` : result.skillRatingDelta}
            </span>
          </div>
        </div>

        {/* Time Spent Card */}
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Time Spent
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
              {Math.round(result.timeSpentSeconds / 60)}m
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {result.timeSpentSeconds % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Strengths */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Difficulty Mastery Breakdown */}
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', fontWeight: 600 }}>
              Difficulty Calibration Performance
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(analytics.difficultyBreakdown).map(([diff, stats]: any) => {
                const diffPct = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

                return (
                  <div key={diff} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ textTransform: 'capitalize', color: '#cbd5e1' }}>{diff}</span>
                      <span style={{ color: '#94a3b8' }}>
                        {stats.correct}/{stats.attempted} ({diffPct}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${diffPct}%`,
                          background: diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#eab308' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', fontWeight: 600 }}>
              Competency Insights
            </h3>

            {analytics.strengths.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>Verified Strengths:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analytics.strengths.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analytics.weaknesses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>Growth Opportunities:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analytics.weaknesses.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      ⚠ {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remediation Action Plan */}
      {remediation && <RemediationView remediation={remediation} />}
    </div>
  );
};
