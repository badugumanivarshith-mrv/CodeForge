import React, { useState } from 'react';
import { Play, Send, Sparkles } from 'lucide-react';
import { Button, Card, Badge } from '../components/common';

export const WorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'output' | 'ai'>('problem');
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState<string>(
    `# Write your solution below\ndef solution(nums, target):\n    # TODO: Implement algorithm\n    pass\n`,
  );

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setActiveTab('output');
    }, 800);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left Panel: Problem Statement */}
      <div
        style={{
          width: '38%',
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
            <Badge variant="brand" size="sm">Topic 1: Syntax</Badge>
            <Badge variant="success" size="sm">Easy</Badge>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>1. Two Pointer Sum Target</h2>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '12px' }}>
            Given an array of integers <code style={{ color: '#818cf8', background: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '4px' }}>nums</code> and an integer <code style={{ color: '#818cf8', background: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '4px' }}>target</code>, return indices of the two numbers such that they add up to target.
          </p>
          <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
        </div>

        <Card padding="sm">
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>SAMPLE 1</div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-primary)' }}>
            Input: nums = [2,7,11,15], target = 9{'\n'}
            Output: [0,1]
          </pre>
        </Card>

        {/* AI Tutor Assistant Callout */}
        <Card glow padding="sm" style={{ border: '1px solid rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
            <Sparkles size={14} /> Socratic AI Tutor
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Need guidance? Open the AI panel to get tiered hints, step-by-step logic nudges, or complexity checks.
          </p>
        </Card>
      </div>

      {/* Center/Right Panel: Code Editor & Console */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Editor Controls Bar */}
        <div
          className="glass-panel"
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant="purple" size="sm">Python 3.12</Badge>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>solution.py</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button size="sm" variant="secondary" leftIcon={<Play size={14} />} isLoading={isRunning} onClick={handleRun}>
              Run Code
            </Button>
            <Button size="sm" variant="primary" leftIcon={<Send size={14} />} onClick={handleRun}>
              Submit
            </Button>
          </div>
        </div>

        {/* Editor Area (Textarea Fallback / Monaco Ready) */}
        <div style={{ flex: 1, position: 'relative', background: '#070a10' }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              color: '#e2e8f0',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
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
            height: '200px',
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
                fontWeight: 600,
                background: activeTab === 'problem' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                color: activeTab === 'problem' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Test Cases (Sample 1)
            </button>
            <button
              onClick={() => setActiveTab('output')}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                background: activeTab === 'output' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                color: activeTab === 'output' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Console Output
            </button>
          </div>

          <div style={{ flex: 1, padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', overflowY: 'auto' }}>
            {activeTab === 'output' ? (
              <div style={{ color: '#10b981' }}>
                ✓ Sandbox execution completed in 42ms. Output verified against sample test cases.
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>
                Input: [2, 7, 11, 15], target = 9 {'\n'}Expected Output: [0, 1]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
