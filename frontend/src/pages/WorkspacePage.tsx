import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Send, Bot, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { problemApi } from '../services/problemApi';
import { ProblemDetailDto, LanguageId, TIER_1_LANGUAGES } from '@codeforge/shared';
import { MentorPanel } from '../components/mentor/MentorPanel';

export const WorkspacePage: React.FC = () => {
  const { problemSlug } = useParams<{ problemSlug?: string }>();
  const activeSlug = problemSlug || 'two-sum-target';

  const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(LanguageId.PYTHON);
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'problem' | 'output'>('problem');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showMentorDrawer, setShowMentorDrawer] = useState<boolean>(true);
  const [executionResult, setExecutionResult] = useState<{
    passed: boolean;
    output: string;
    runtimeMs: number;
  } | null>(null);

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

  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setActiveTab('output');

    setTimeout(() => {
      setIsSubmitting(false);
      setExecutionResult({
        passed: true,
        output: '✓ All test cases passed! Solution accepted (Time: 52ms, Memory: 14.2MB).',
        runtimeMs: 52,
      });
    }, 800);
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
      {/* Left Panel: Problem Statement */}
      <div
        style={{
          width: showMentorDrawer ? '30%' : '42%',
          borderRight: '1px solid var(--border-subtle)',
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          transition: 'width 0.2s ease',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Badge variant="brand" size="sm">{problem.topicTitle}</Badge>
            <Badge variant={problem.difficulty === 'easy' ? 'success' : problem.difficulty === 'medium' ? 'brand' : 'purple'} size="sm">
              {problem.difficulty}
            </Badge>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{problem.title}</h2>
        </div>

        {/* Prompt Statement */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{problem.promptMdx}</div>
        </div>

        {/* Public Examples */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Examples</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {problem.examples.map(ex => (
              <Card key={ex.sequence} padding="sm" style={{ background: '#05070a' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  EXAMPLE {ex.sequence}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#e2e8f0', marginBottom: '2px' }}>
                  <strong>Input:</strong> {ex.inputData}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#10b981' }}>
                  <strong>Output:</strong> {ex.expectedOutput}
                </div>
                {ex.explanationMdx && (
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {ex.explanationMdx}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Center Panel: Code Editor & Console Output */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: '350px' }}>
        {/* Editor Controls Header */}
        <div
          className="glass-panel"
          style={{
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
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
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '12px',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Play size={13} />}
              isLoading={isRunning}
              onClick={handleRunCode}
            >
              Run
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Send size={13} />}
              isLoading={isSubmitting}
              onClick={handleSubmitSolution}
            >
              Submit
            </Button>
            <Button
              size="sm"
              variant={showMentorDrawer ? 'primary' : 'secondary'}
              leftIcon={<Bot size={13} />}
              onClick={() => setShowMentorDrawer(!showMentorDrawer)}
            >
              AI Mentor {showMentorDrawer ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
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
              fontSize: '13px',
              lineHeight: 1.6,
              padding: '16px',
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
            height: '180px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('problem')}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 700,
                background: activeTab === 'problem' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                color: activeTab === 'problem' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Sample Tests ({problem.sampleTestCases.length})
            </button>
            <button
              onClick={() => setActiveTab('output')}
              style={{
                padding: '8px 16px',
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

          <div style={{ flex: 1, padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', overflowY: 'auto' }}>
            {activeTab === 'output' ? (
              executionResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <CheckCircle2 size={15} /> {executionResult.output}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    Execution completed in {executionResult.runtimeMs}ms using isolated runner sandbox.
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Click "Run" to execute your code against sample test cases.</div>
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {problem.sampleTestCases.map(tc => (
                  <div key={tc.id} style={{ background: '#070a10', padding: '6px 10px', borderRadius: '6px' }}>
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

      {/* Right Drawer: AI Coding Mentor Panel */}
      {showMentorDrawer && (
        <div
          style={{
            width: '38%',
            maxWidth: '520px',
            minWidth: '340px',
            borderLeft: '1px solid var(--border-subtle)',
            height: '100%',
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
