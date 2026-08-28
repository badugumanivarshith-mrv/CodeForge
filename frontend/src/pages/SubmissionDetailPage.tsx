import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  FileCode,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { judgeApi } from '../services/judgeApi';
import {
  SubmissionDetailDto,
  SubmissionAnalysisDto,
  JudgeVerdict,
  SubmissionStatus,
} from '@codeforge/shared';

export const SubmissionDetailPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<SubmissionDetailDto | null>(null);
  const [analysis, setAnalysis] = useState<SubmissionAnalysisDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!submissionId) return;
      setIsLoading(true);
      try {
        const data = await judgeApi.getSubmission(submissionId);
        setSubmission(data);

        // If not accepted, fetch AI failure diagnostics
        if (data.verdict !== JudgeVerdict.ACCEPTED) {
          try {
            const analysisData = await judgeApi.getSubmissionAnalysis(submissionId);
            setAnalysis(analysisData);
          } catch {
            // Ignore if AI analysis fails
          }
        }
      } catch (err) {
        console.error('Failed to load submission:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [submissionId]);

  const handleCopyCode = () => {
    if (submission?.sourceCode) {
      navigator.clipboard.writeText(submission.sourceCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleTriggerAnalysis = async () => {
    if (!submissionId) return;
    setIsAnalyzing(true);
    try {
      const data = await judgeApi.getSubmissionAnalysis(submissionId);
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictBanner = (verdict?: JudgeVerdict | SubmissionStatus | string) => {
    const v = (verdict || '').toUpperCase();
    if (v === 'ACCEPTED') {
      return (
        <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-accent-emerald)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CheckCircle2 size={36} color="var(--color-accent-emerald)" />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-accent-emerald)', marginBottom: '4px' }}>
              Accepted (AC)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              All test cases passed within allocated time and memory constraints.
            </p>
          </div>
        </div>
      );
    } else if (v === 'WRONG_ANSWER') {
      return (
        <div style={{ padding: '24px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--color-accent-rose)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <XCircle size={36} color="var(--color-accent-rose)" />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-accent-rose)', marginBottom: '4px' }}>
              Wrong Answer (WA)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              The program terminated successfully but produced an incorrect output for one or more test cases.
            </p>
          </div>
        </div>
      );
    } else if (v === 'TIME_LIMIT_EXCEEDED') {
      return (
        <div style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--color-accent-amber)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Clock size={36} color="var(--color-accent-amber)" />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-accent-amber)', marginBottom: '4px' }}>
              Time Limit Exceeded (TLE)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Execution exceeded the maximum time limit. Algorithmic complexity optimization is recommended.
            </p>
          </div>
        </div>
      );
    } else if (v === 'RUNTIME_ERROR') {
      return (
        <div style={{ padding: '24px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--color-accent-rose)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={36} color="var(--color-accent-rose)" />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-accent-rose)', marginBottom: '4px' }}>
              Runtime Error (RTE)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              The application crashed due to an unhandled exception or illegal memory access.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <FileCode size={36} color="var(--color-accent-amber)" />
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {verdict || 'Evaluation Complete'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Judged by CodeForge V2 Sandbox Engine.
          </p>
        </div>
      </div>
    );
  };

  if (isLoading || !submission) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading submission report...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Back Button & Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/submissions')} style={{ marginBottom: '12px' }}>
          <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Back to Submissions
        </Button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {submission.problemTitle}
            </h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Submission ID: <code style={{ color: 'var(--text-secondary)' }}>{submission.id}</code></span>
              <span>•</span>
              <span>Author: <strong style={{ color: 'var(--text-primary)' }}>{submission.username}</strong></span>
              <span>•</span>
              <span>{new Date(submission.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <Button onClick={() => navigate(`/problems/${submission.problemSlug}`)}>
            Solve in Arena
          </Button>
        </div>
      </div>

      {/* Outcome Banner */}
      {getVerdictBanner(submission.verdict || submission.status)}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Card style={{ padding: '16px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Language</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {submission.languageId}
          </div>
        </Card>

        <Card style={{ padding: '16px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Execution Time</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {submission.executionTimeMs !== null && submission.executionTimeMs !== undefined ? `${submission.executionTimeMs} ms` : '—'}
          </div>
        </Card>

        <Card style={{ padding: '16px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Memory Used</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {submission.memoryUsedKb !== null && submission.memoryUsedKb !== undefined ? `${submission.memoryUsedKb} KB` : '—'}
          </div>
        </Card>

        <Card style={{ padding: '16px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Test Cases Passed</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {submission.passedTestCases} / {submission.totalTestCases}
          </div>
        </Card>
      </div>

      {/* AI Failure Diagnostics Card (if available or non-accepted) */}
      {submission.verdict !== JudgeVerdict.ACCEPTED && (
        <Card style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid var(--border-highlight)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--color-accent-purple)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                AI Root Cause & Complexity Analysis
              </h2>
            </div>
            {!analysis && (
              <Button size="sm" variant="secondary" onClick={handleTriggerAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
              </Button>
            )}
          </div>

          {analysis ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-accent-purple)', marginBottom: '4px' }}>
                  Probable Bug Category: {analysis.probableBugCategory}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                  {analysis.likelyRootCause}
                </p>
              </div>

              {analysis.missedEdgeCases && analysis.missedEdgeCases.length > 0 && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Potential Unhandled Edge Cases:
                  </div>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {analysis.missedEdgeCases.map((ec, i) => (
                      <li key={i}>{ec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.complexityConcerns && (
                <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-accent-amber)', marginBottom: '4px' }}>
                    Complexity Assessment:
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {analysis.complexityConcerns.analysis}
                  </p>
                </div>
              )}

              {analysis.recommendedLearningTopics && analysis.recommendedLearningTopics.length > 0 && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Recommended Learning Modules:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {analysis.recommendedLearningTopics.map((top, i) => (
                      <Badge key={i} variant="purple">
                        {top.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Click "Generate Analysis" to receive an instant root-cause diagnostic breakdown of this failure.
            </p>
          )}
        </Card>
      )}

      {/* Test Case Breakdown */}
      {submission.testResults && submission.testResults.length > 0 && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Test Cases Evaluation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {submission.testResults.map((tc, idx) => (
              <Card key={idx} style={{ padding: '14px 18px', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Test Case #{tc.sequence || idx + 1} {tc.isSample ? '(Sample)' : '(Hidden)'}
                    </span>
                    {tc.status === 'ACCEPTED' || tc.status === 'accepted' ? (
                      <Badge variant="success">PASS</Badge>
                    ) : (
                      <Badge variant="danger">FAIL</Badge>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {tc.executionTimeMs}ms • {tc.memoryKb}KB
                  </div>
                </div>

                {tc.isSample ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '4px' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Input:</div>
                      <div style={{ color: 'var(--text-primary)' }}>{tc.inputData}</div>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '4px' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Expected Output:</div>
                      <div style={{ color: 'var(--color-accent-emerald)' }}>{tc.expectedOutput}</div>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '4px' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Actual Output:</div>
                      <div style={{ color: 'var(--text-primary)' }}>{tc.actualOutput}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    🔒 Hidden competitive testcase. Inputs and outputs are masked for evaluation integrity.
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Source Code Viewer */}
      <Card style={{ padding: '0', background: 'var(--bg-surface)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <FileCode size={16} color="var(--color-brand-primary)" />
            Submitted Code ({submission.languageId})
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
            {isCopied ? <Check size={14} style={{ marginRight: '4px' }} /> : <Copy size={14} style={{ marginRight: '4px' }} />}
            {isCopied ? 'Copied' : 'Copy Code'}
          </Button>
        </div>

        <pre
          style={{
            margin: '0',
            padding: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            background: 'var(--bg-primary)',
            overflowX: 'auto',
          }}
        >
          {submission.sourceCode}
        </pre>
      </Card>
    </div>
  );
};
