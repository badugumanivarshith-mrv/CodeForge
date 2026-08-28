import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Send,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  FileCode,
  ExternalLink,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { problemApi } from '../services/problemApi';
import { judgeApi } from '../services/judgeApi';
import {
  ProblemDetailDto,
  LanguageId,
  JudgeVerdict,
  JudgeRunResultDto,
  SubmissionDetailDto,
  SubmissionAnalysisDto,
  SubmissionDto,
} from '@codeforge/shared';
import { MentorPanel } from '../components/mentor/MentorPanel';

export const ProblemWorkspacePage: React.FC = () => {
  const { problemSlug } = useParams<{ problemSlug?: string }>();
  const navigate = useNavigate();
  const activeSlug = problemSlug || 'two-sum-target';

  const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(LanguageId.PYTHON);
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'problem' | 'history'>('problem');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'custom' | 'output' | 'ai'>('testcases');
  const [customInput, setCustomInput] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showMentorDrawer, setShowMentorDrawer] = useState<boolean>(false);

  // Execution & Judge Results
  const [runResult, setRunResult] = useState<JudgeRunResultDto | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionDetailDto | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SubmissionAnalysisDto | null>(null);
  const [historySubmissions, setHistorySubmissions] = useState<SubmissionDto[]>([]);

  // Load problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemApi.getProblemDetail(activeSlug, selectedLanguage);
        setProblem(data);
        const starter = data.starterCode[selectedLanguage] || data.starterCode['python'] || '';
        setCode(starter);

        // Load submission history for this problem
        if (data.id) {
          const subs = await judgeApi.getMySubmissions(data.id);
          setHistorySubmissions(subs);
        }
      } catch (err) {
        console.error('Failed to load problem:', err);
      }
    };
    fetchProblem();
  }, [activeSlug]);

  const handleLanguageChange = (lang: LanguageId) => {
    setSelectedLanguage(lang);
    if (problem && problem.starterCode[lang]) {
      setCode(problem.starterCode[lang]);
    }
  };

  const handleResetCode = () => {
    if (problem && problem.starterCode[selectedLanguage]) {
      setCode(problem.starterCode[selectedLanguage]);
    }
  };

  const handleRunSampleCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setBottomTab('output');
    setSubmissionResult(null);

    try {
      const result = await judgeApi.runSample({
        problemId: problem.id,
        languageId: selectedLanguage,
        sourceCode: code,
        customInput: bottomTab === 'custom' ? customInput : undefined,
      });
      setRunResult(result);
    } catch (err: any) {
      console.error('Run code failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setBottomTab('output');
    setRunResult(null);
    setAnalysisResult(null);

    try {
      const result = await judgeApi.submitSolution({
        problemId: problem.id,
        languageId: selectedLanguage,
        sourceCode: code,
      });
      setSubmissionResult(result);

      // Refresh history
      const subs = await judgeApi.getMySubmissions(problem.id);
      setHistorySubmissions(subs);

      // If verdict is not accepted, automatically request AI failure analysis
      if (result.verdict !== JudgeVerdict.ACCEPTED) {
        handleAnalyzeFailure(result.id);
      }
    } catch (err: any) {
      console.error('Submit solution failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyzeFailure = async (subId?: string) => {
    const id = subId || submissionResult?.id;
    if (!id) return;
    setIsAnalyzing(true);

    try {
      const analysis = await judgeApi.getSubmissionAnalysis(id);
      setAnalysisResult(analysis);
    } catch (err) {
      console.error('Failed to analyze submission:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictBadge = (verdict?: JudgeVerdict | string) => {
    switch (verdict) {
      case JudgeVerdict.ACCEPTED:
        return <Badge variant="success"><CheckCircle2 size={13} style={{ marginRight: '4px' }} /> Accepted</Badge>;
      case JudgeVerdict.WRONG_ANSWER:
        return <Badge variant="danger"><XCircle size={13} style={{ marginRight: '4px' }} /> Wrong Answer</Badge>;
      case JudgeVerdict.TIME_LIMIT_EXCEEDED:
        return <Badge variant="warning"><Clock size={13} style={{ marginRight: '4px' }} /> Time Limit Exceeded</Badge>;
      case JudgeVerdict.RUNTIME_ERROR:
        return <Badge variant="danger"><AlertTriangle size={13} style={{ marginRight: '4px' }} /> Runtime Error</Badge>;
      case JudgeVerdict.COMPILATION_ERROR:
        return <Badge variant="warning"><FileCode size={13} style={{ marginRight: '4px' }} /> Compilation Error</Badge>;
      case JudgeVerdict.OUTPUT_LIMIT_EXCEEDED:
        return <Badge variant="warning"><AlertTriangle size={13} style={{ marginRight: '4px' }} /> Output Limit Exceeded</Badge>;
      default:
        return <Badge variant="default">{verdict || 'Queued'}</Badge>;
    }
  };

  if (!problem) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading problem workspace...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Left Panel: Problem Statement & History */}
      <div
        style={{
          width: showMentorDrawer ? '30%' : '38%',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          background: 'var(--bg-secondary)',
        }}
      >
        {/* Panel Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <button
            onClick={() => setActiveTab('problem')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'problem' ? 'var(--bg-secondary)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'problem' ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
              color: activeTab === 'problem' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'history' ? 'var(--bg-secondary)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'history' ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
              color: activeTab === 'history' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Submissions ({historySubmissions.length})
          </button>
        </div>

        {/* Panel Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTab === 'problem' ? (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{problem.title}</h1>
                  <Badge variant={problem.difficulty === 'easy' ? 'success' : problem.difficulty === 'medium' ? 'warning' : 'danger'}>
                    {problem.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>Time Limit: {problem.timeLimitMs}ms</span>
                  <span>Memory Limit: {problem.memoryLimitMb}MB</span>
                </div>
              </div>

              {/* Prompt */}
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {problem.promptMdx}
              </div>

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Examples
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {problem.examples.map((ex, i) => (
                      <Card key={i} style={{ padding: '12px 16px', background: 'var(--bg-surface)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                          Example {i + 1}:
                        </div>
                        <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Input: </span>
                          <span style={{ color: 'var(--text-primary)' }}>{ex.inputData}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Output: </span>
                          <span style={{ color: 'var(--color-accent-emerald)' }}>{ex.expectedOutput}</span>
                        </div>
                        {ex.explanationMdx && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                            {ex.explanationMdx}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Submissions History Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {historySubmissions.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                  No submissions yet for this challenge.
                </div>
              ) : (
                historySubmissions.map(sub => (
                  <Card
                    key={sub.id}
                    style={{
                      padding: '12px 16px',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/submissions/${sub.id}`)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {getVerdictBadge(sub.verdict || sub.status)}
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.languageId}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(sub.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div>{sub.executionTimeMs ? `${sub.executionTimeMs}ms` : '—'}</div>
                      <ExternalLink size={14} style={{ marginTop: '4px', opacity: 0.7 }} />
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Panel: Code Editor & Execution Console */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Editor Toolbar */}
        <div
          style={{
            height: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={selectedLanguage}
              onChange={e => handleLanguageChange(e.target.value as LanguageId)}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value={LanguageId.PYTHON}>Python 3.12</option>
              <option value={LanguageId.JAVASCRIPT}>JavaScript (Node.js 20)</option>
              <option value={LanguageId.TYPESCRIPT}>TypeScript 5.4</option>
              <option value={LanguageId.JAVA}>Java 21</option>
              <option value={LanguageId.CPP}>C++ 20 (GCC 13)</option>
              <option value={LanguageId.C}>C 17 (GCC 13)</option>
              <option value={LanguageId.GO}>Go 1.22</option>
              <option value={LanguageId.RUST}>Rust 1.78</option>
            </select>

            <Button variant="ghost" size="sm" onClick={handleResetCode} title="Reset to boilerplate">
              <RotateCcw size={14} style={{ marginRight: '4px' }} /> Reset
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRunSampleCode}
              disabled={isRunning || isSubmitting}
            >
              <Play size={14} style={{ marginRight: '6px' }} />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>

            <Button
              size="sm"
              onClick={handleSubmitSolution}
              disabled={isRunning || isSubmitting}
              style={{ background: 'var(--color-brand-primary)' }}
            >
              <Send size={14} style={{ marginRight: '6px' }} />
              {isSubmitting ? 'Judging...' : 'Submit'}
            </Button>

            <Button
              variant={showMentorDrawer ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowMentorDrawer(!showMentorDrawer)}
            >
              <Bot size={15} style={{ marginRight: '4px' }} />
              AI Mentor
            </Button>
          </div>
        </div>

        {/* Code Input Area */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--bg-primary)' }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* Bottom Drawer: Testcases, Console Output, AI Diagnostics */}
        <div
          style={{
            height: '240px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Bottom Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <button
              onClick={() => setBottomTab('testcases')}
              style={{
                padding: '8px 16px',
                background: bottomTab === 'testcases' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderBottom: bottomTab === 'testcases' ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
                color: bottomTab === 'testcases' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sample Tests
            </button>
            <button
              onClick={() => setBottomTab('custom')}
              style={{
                padding: '8px 16px',
                background: bottomTab === 'custom' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderBottom: bottomTab === 'custom' ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
                color: bottomTab === 'custom' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Custom Input
            </button>
            <button
              onClick={() => setBottomTab('output')}
              style={{
                padding: '8px 16px',
                background: bottomTab === 'output' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderBottom: bottomTab === 'output' ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
                color: bottomTab === 'output' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Verdict / Console Output
            </button>
            {analysisResult && (
              <button
                onClick={() => setBottomTab('ai')}
                style={{
                  padding: '8px 16px',
                  background: bottomTab === 'ai' ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  borderBottom: bottomTab === 'ai' ? '2px solid var(--color-accent-purple)' : '2px solid transparent',
                  color: 'var(--color-accent-purple)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={14} /> AI Failure Diagnosis
              </button>
            )}
          </div>

          {/* Bottom Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            {bottomTab === 'testcases' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {problem.sampleTestCases?.map((st, i) => (
                  <div key={i} style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>Input {i + 1}:</div>
                      <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '4px', color: 'var(--text-primary)' }}>
                        {st.inputData}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>Expected Output:</div>
                      <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '4px', color: 'var(--color-accent-emerald)' }}>
                        {st.expectedOutput}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bottomTab === 'custom' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '6px', fontSize: '12px' }}>
                  Provide custom stdin parameters for testing:
                </div>
                <textarea
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="Enter stdin input here..."
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>
            )}

            {bottomTab === 'output' && (
              <div>
                {/* Official Submission Output */}
                {submissionResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {getVerdictBadge(submissionResult.verdict)}
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                          Passed: {submissionResult.passedTestCases}/{submissionResult.totalTestCases} Tests
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                        <span>Runtime: {submissionResult.executionTimeMs}ms</span>
                        <span>Memory: {submissionResult.memoryUsedKb}KB</span>
                      </div>
                    </div>

                    {submissionResult.verdict !== JudgeVerdict.ACCEPTED && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAnalyzeFailure()}
                          disabled={isAnalyzing}
                        >
                          <Sparkles size={14} style={{ marginRight: '6px', color: 'var(--color-accent-purple)' }} />
                          {isAnalyzing ? 'Analyzing Root Cause...' : 'Diagnose Failure with AI'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Sample Run Output */}
                {runResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getVerdictBadge(runResult.verdict)}
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        Execution Time: {runResult.executionTimeMs}ms
                      </span>
                    </div>

                    {runResult.sampleResults.map((sr, idx) => (
                      <Card key={idx} style={{ padding: '8px 12px', background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Case #{sr.sequence}</span>
                          <span style={{ color: sr.isPassed ? 'var(--color-accent-emerald)' : 'var(--color-accent-rose)' }}>
                            {sr.isPassed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>Input: <span style={{ color: 'var(--text-primary)' }}>{sr.inputData}</span></div>
                          <div>Expected: <span style={{ color: 'var(--color-accent-emerald)' }}>{sr.expectedOutput}</span></div>
                          <div>Actual: <span style={{ color: 'var(--text-primary)' }}>{sr.actualOutput}</span></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {!submissionResult && !runResult && (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>
                    Click "Run Code" or "Submit" to view execution output and judge verdicts.
                  </div>
                )}
              </div>
            )}

            {bottomTab === 'ai' && analysisResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ color: 'var(--color-accent-purple)', fontWeight: 700, fontSize: '14px' }}>
                  {analysisResult.probableBugCategory}
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {analysisResult.likelyRootCause}
                </div>
                {analysisResult.complexityConcerns && (
                  <div style={{ color: 'var(--color-accent-amber)', fontSize: '12px' }}>
                    Complexity Analysis: {analysisResult.complexityConcerns.analysis}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Drawer: AI Coding Mentor */}
      {showMentorDrawer && (
        <div
          style={{
            width: '32%',
            borderLeft: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MentorPanel
            problemId={problem.id}
            currentCode={code}
            languageId={selectedLanguage}
            onApplyStarterCode={newCode => setCode(newCode)}
          />
        </div>
      )}
    </div>
  );
};
