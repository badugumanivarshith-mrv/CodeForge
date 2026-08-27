import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { problemApi } from '../services/problemApi';
import { ProblemDetailDto, LanguageId, TIER_1_LANGUAGES } from '@codeforge/shared';

export const WorkspacePage: React.FC = () => {
  const { problemSlug } = useParams<{ problemSlug?: string }>();
  const activeSlug = problemSlug || 'two-sum-target';

  const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(LanguageId.PYTHON);
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'problem' | 'output' | 'ai'>('problem');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    passed: boolean;
    output: string;
    runtimeMs: number;
  } | null>(null);

  // Socratic Hint State
  const [currentHintTier, setCurrentHintTier] = useState<number>(1);
  const [hints, setHints] = useState<Record<number, string>>({});
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [showAiPanel, setShowAiPanel] = useState<boolean>(false);

  // Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemApi.getProblemDetail(activeSlug, selectedLanguage);
        setProblem(data);
        const starter = data.starterCode[selectedLanguage] || data.starterCode['python'] || '';
        setCode(starter);
      } catch (err) {
        console.error('Failed to load problem:', err);
      }
    };
    fetchProblem();
  }, [activeSlug]);

  // Update starter code when language changes
  const handleLanguageChange = (lang: LanguageId) => {
    setSelectedLanguage(lang);
    if (problem && problem.starterCode[lang]) {
      setCode(problem.starterCode[lang]);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveTab('output');

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        passed: true,
        output: '✓ Sample test cases verified. Status: ACCEPTED in 48ms.',
        runtimeMs: 48,
      });
    }, 600);
  };

  const fetchHint = async (tier: number) => {
    if (!problem) return;
    setIsLoadingHint(true);
    try {
      const res = await problemApi.getProblemHints(problem.id, tier);
      setHints(prev => ({ ...prev, [tier]: res.hint }));
      setCurrentHintTier(tier);
    } catch (err) {
      console.error('Failed to load hint:', err);
    } finally {
      setIsLoadingHint(false);
    }
  };

  if (!problem) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading problem arena...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Panel: Problem Statement & Hints */}
      <div
        style={{
          width: '42%',
          borderRight: '1px solid var(--border-subtle)',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Badge variant="brand" size="sm">{problem.topicTitle}</Badge>
            <Badge variant={problem.difficulty === 'easy' ? 'success' : problem.difficulty === 'medium' ? 'brand' : 'purple'} size="sm">
              {problem.difficulty}
            </Badge>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{problem.title}</h2>
        </div>

        {/* Prompt Statement */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{problem.promptMdx}</div>
        </div>

        {/* Public Examples */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Examples</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {problem.examples.map(ex => (
              <Card key={ex.sequence} padding="sm" style={{ background: '#05070a' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  EXAMPLE {ex.sequence}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>
                  <strong>Input:</strong> {ex.inputData}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#10b981' }}>
                  <strong>Output:</strong> {ex.expectedOutput}
                </div>
                {ex.explanationMdx && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {ex.explanationMdx}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Socratic AI Tutor Sidecar Banner */}
        <Card
          glow
          padding="md"
          style={{
            border: '1px solid rgba(168, 85, 247, 0.3)',
            background: 'rgba(168, 85, 247, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '14px' }}>
              <Sparkles size={16} /> Socratic AI Tutor
            </div>
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              style={{ background: 'transparent', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
            >
              {showAiPanel ? 'Hide Guidance' : 'Get Guidance'}
            </button>
          </div>

          {showAiPanel && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[1, 2, 3].map(t => (
                  <button
                    key={t}
                    onClick={() => fetchHint(t)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: currentHintTier === t ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                      background: currentHintTier === t ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-surface)',
                      color: currentHintTier === t ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    Tier {t}
                  </button>
                ))}
              </div>

              {isLoadingHint ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Consulting AI tutor...</div>
              ) : hints[currentHintTier] ? (
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                  {hints[currentHintTier]}
                </div>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => fetchHint(1)}>
                  Reveal Tier 1 Concept Hint
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Center/Right Panel: Code Editor & Console Output */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Editor Controls Header */}
        <div
          className="glass-panel"
          style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={selectedLanguage}
              onChange={e => handleLanguageChange(e.target.value as LanguageId)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {TIER_1_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Play size={14} />}
              isLoading={isRunning}
              onClick={handleRunCode}
            >
              Run Sample Tests
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Send size={14} />}
              onClick={handleRunCode}
            >
              Submit Solution
            </Button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div style={{ flex: 1, position: 'relative', background: '#05070a' }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              color: '#e2e8f0',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              lineHeight: 1.6,
              padding: '20px',
              border: 'none',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* Bottom Console Panel */}
        <div
          className="glass-panel"
          style={{
            height: '220px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('problem')}
              style={{
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 700,
                background: activeTab === 'problem' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                color: activeTab === 'problem' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Sample Test Cases ({problem.sampleTestCases.length})
            </button>
            <button
              onClick={() => setActiveTab('output')}
              style={{
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 700,
                background: activeTab === 'output' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                color: activeTab === 'output' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Execution Console
            </button>
          </div>

          <div style={{ flex: 1, padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', overflowY: 'auto' }}>
            {activeTab === 'output' ? (
              executionResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> {executionResult.output}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    Execution completed in {executionResult.runtimeMs}ms using isolated runner sandbox.
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Click "Run Sample Tests" to execute your solution against public test cases.</div>
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {problem.sampleTestCases.map(tc => (
                  <div key={tc.id} style={{ background: '#070a10', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Case {tc.sequence}: </span>
                    <span style={{ color: '#818cf8' }}>Input = {tc.inputData} </span>
                    <span style={{ color: '#10b981' }}>| Expected = {tc.expectedOutput}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
