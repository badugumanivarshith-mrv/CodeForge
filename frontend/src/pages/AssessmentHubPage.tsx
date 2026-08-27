import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi } from '../services/assessmentApi';
import { contestApi } from '../services/contestApi';
import {
  AssessmentType,
  ProblemDifficulty,
  SkillRatingDto,
  AssessmentResultDto,
} from '@codeforge/shared';
import {
  Award,
  Target,
  BrainCircuit,
  Code,
  ArrowRight,
  History,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { SkillRatingBadge } from '../components/contest/SkillRatingBadge';

export const AssessmentHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<SkillRatingDto | null>(null);
  const [history, setHistory] = useState<AssessmentResultDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startingType, setStartingType] = useState<AssessmentType | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingData, historyData] = await Promise.all([
          contestApi.getMyRating().catch(() => null),
          assessmentApi.getMyHistory().catch(() => []),
        ]);
        setRating(ratingData);
        setHistory(historyData);
      } catch (err) {
        console.error('Failed to load assessment hub data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', color: '#94a3b8' }}>
        Loading assessment hub...
      </div>
    );
  }

  const handleStartAssessment = async (type: AssessmentType) => {
    try {
      setStartingType(type);
      const session = await assessmentApi.createSession({
        assessmentType: type,
        initialDifficulty: ProblemDifficulty.MEDIUM,
      });
      navigate(`/assessments/${session.id}`);
    } catch (err) {
      console.error('Failed to start assessment', err);
      alert('Could not start assessment. Please try again.');
    } finally {
      setStartingType(null);
    }
  };

  const assessmentCards = [
    {
      type: AssessmentType.DIAGNOSTIC,
      title: 'Diagnostic Assessment',
      desc: 'Rapid 10-question evaluation to identify baseline programming fundamentals and skill rating.',
      duration: '20 mins',
      difficulty: 'Adaptive',
      icon: <BrainCircuit size={24} color="#3b82f6" />,
      tag: 'Recommended First Step',
    },
    {
      type: AssessmentType.TOPIC_MASTERY,
      title: 'Topic Mastery Check',
      desc: 'Comprehensive deep dive into specific data structures and algorithmic complexity.',
      duration: '25 mins',
      difficulty: 'Medium to Difficult',
      icon: <Target size={24} color="#8b5cf6" />,
      tag: 'Curriculum Linked',
    },
    {
      type: AssessmentType.CODING_CHALLENGE,
      title: 'Timed Coding Challenge',
      desc: 'Hands-on programming problem set testing algorithmic efficiency and test coverage.',
      duration: '45 mins',
      difficulty: 'Difficult',
      icon: <Code size={24} color="#10b981" />,
      tag: 'Competitive',
    },
    {
      type: AssessmentType.MOCK_INTERVIEW,
      title: 'Mock Technical Interview',
      desc: 'Simulated high-stakes assessment covering system edge cases and code reviews.',
      duration: '35 mins',
      difficulty: 'Industry Standard',
      icon: <Zap size={24} color="#f59e0b" />,
      tag: 'Career Ready',
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={22} color="#3b82f6" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#60a5fa', letterSpacing: '0.05em' }}>
              Adaptive Assessment Engine
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px 0' }}>
            Skill Assessments & Readiness
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '650px', margin: 0, lineHeight: 1.6 }}>
            Prove your coding mastery through server-authoritative, timed adaptive evaluations. Calibrate your skill rating and receive targeted remediation plans.
          </p>
        </div>

        {rating && (
          <div style={{ minWidth: '280px' }}>
            <SkillRatingBadge rating={rating} />
          </div>
        )}
      </div>

      {/* Assessment Tracks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {assessmentCards.map(card => (
          <div
            key={card.type}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)' }}>
                  {card.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  {card.tag}
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                  {card.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {card.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                <span>⏱ {card.duration}</span>
                <span>⚡ {card.difficulty}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Button
                variant="primary"
                style={{ width: '100%' }}
                rightIcon={<ArrowRight size={16} />}
                disabled={startingType !== null}
                onClick={() => handleStartAssessment(card.type)}
              >

                {startingType === card.type ? 'Initializing...' : 'Begin Assessment'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Assessment History Section */}
      {history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="#94a3b8" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
              Recent Assessment Performance
            </h3>
          </div>

          <div style={{ border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.5)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0b0f17', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Score</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Accuracy</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Rating Change</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={h.sessionId || i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f8fafc', textTransform: 'capitalize' }}>
                      {h.assessmentType.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#fbbf24' }}>
                      {h.score}/{h.maxScore} ({Math.round(h.percentage)}%)
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: '#38bdf8' }}>
                      {Math.round(h.accuracy)}%
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: h.skillRatingDelta >= 0 ? '#4ade80' : '#f87171' }}>
                      {h.skillRatingDelta >= 0 ? `+${h.skillRatingDelta}` : h.skillRatingDelta}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/assessments/${h.sessionId}/result`)}
                      >
                        View Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
