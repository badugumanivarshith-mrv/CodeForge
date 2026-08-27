import React, { useState, useEffect, useRef } from 'react';
import {
  SocraticHintLevel,
  SocraticHintResultDto,
  CodeReviewResultDto,
  ConceptExplanationDto,
  TargetedPracticeDto,
  MentorMessageDto,
  LanguageId,
} from '@codeforge/shared';
import {
  Bot,
  Send,
  Lightbulb,
  Code2,
  BookOpen,
  Target,
} from 'lucide-react';
import { Card, Button } from '../common';
import { mentorApi } from '../../services/mentorApi';
import { HintProgress } from './HintProgress';
import { CodeReviewPanel } from './CodeReviewPanel';
import { MentorMessage } from './MentorMessage';
import { TargetedPracticeModal } from './TargetedPracticeModal';

export interface MentorPanelProps {
  problemId?: string;
  currentCode: string;
  languageId: LanguageId;
  onApplyStarterCode?: (code: string) => void;
}

export const MentorPanel: React.FC<MentorPanelProps> = ({
  problemId,
  currentCode,
  languageId,
  onApplyStarterCode,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'review' | 'concept'>('chat');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MentorMessageDto[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Socratic Hint State
  const [currentHintLevel, setCurrentHintLevel] = useState<SocraticHintLevel>(1);
  const [hintResult, setHintResult] = useState<SocraticHintResultDto | null>(null);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);

  // Code Review State
  const [codeReview, setCodeReview] = useState<CodeReviewResultDto | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);

  // Concept Explanation State
  const [conceptQuery, setConceptQuery] = useState<string>('');
  const [conceptExplanation, setConceptExplanation] = useState<ConceptExplanationDto | null>(null);
  const [isConceptLoading, setIsConceptLoading] = useState<boolean>(false);

  // Targeted Practice State
  const [practiceModalOpen, setPracticeModalOpen] = useState<boolean>(false);
  const [generatedPractice, setGeneratedPractice] = useState<TargetedPracticeDto | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Mentor Session
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await mentorApi.createSession({
          interactionType: 'socratic_hint',
          contextType: 'problem',
          contextId: problemId || 'general-workspace',
          initialCodeContext: currentCode,
        });
        setSessionId(session.id);
        setMessages([
          {
            id: 'welcome',
            sessionId: session.id,
            role: 'assistant',
            content: `Hello! I'm your AI Coding Mentor. I can give you progressive Socratic hints, review your algorithms, explain tricky concepts, or generate targeted practice challenges. How can I guide you today?`,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error('Failed to init mentor session:', err);
      }
    };
    initSession();
  }, [problemId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await mentorApi.sendMessage({
        sessionId,
        content: userText,
        codeContext: currentCode,
        currentLanguage: languageId,
      });

      setMessages(prev => [...prev, res.userMessage, res.assistantMessage]);
    } catch (err) {
      console.error('Failed to send message to mentor:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = async (level?: SocraticHintLevel) => {
    if (!problemId) return;
    const targetLevel = level || currentHintLevel;
    setIsHintLoading(true);
    setActiveTab('chat');

    try {
      const res = await mentorApi.requestHint({
        problemId,
        currentCode,
        languageId,
        requestedLevel: targetLevel,
        sessionId: sessionId || undefined,
      });

      setHintResult(res);
      setCurrentHintLevel(targetLevel);

      // Add hint response into chat stream
      setMessages(prev => [
        ...prev,
        {
          id: `hint_${Date.now()}`,
          sessionId: sessionId || '',
          role: 'assistant',
          content: `💡 **${res.title}**\n\n${res.hint}\n\n*${res.guidingQuestion}*`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('Failed to request hint:', err);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleRequestCodeReview = async () => {
    setIsReviewLoading(true);
    setActiveTab('review');

    try {
      const review = await mentorApi.requestCodeReview({
        problemId,
        code: currentCode,
        languageId,
      });
      setCodeReview(review);
    } catch (err) {
      console.error('Failed to review code:', err);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!conceptQuery.trim()) return;
    setIsConceptLoading(true);

    try {
      const expl = await mentorApi.explainConcept({
        concept: conceptQuery.trim(),
        languageId,
      });
      setConceptExplanation(expl);
    } catch (err) {
      console.error('Failed to explain concept:', err);
    } finally {
      setIsConceptLoading(false);
    }
  };

  const handleGeneratePractice = async () => {
    setIsLoading(true);
    try {
      const practice = await mentorApi.generatePractice({
        preferredLanguage: languageId,
      });
      setGeneratedPractice(practice);
      setPracticeModalOpen(true);
    } catch (err) {
      console.error('Failed to generate practice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface-elevated)' }}>
      {/* Header & Quick Action Chips */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color="#818cf8" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>AI Coding Mentor</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'chat' ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === 'chat' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Chat & Hints
            </button>
            <button
              onClick={() => setActiveTab('review')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'review' ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === 'review' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Code Review
            </button>
            <button
              onClick={() => setActiveTab('concept')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'concept' ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === 'concept' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Concept Teacher
            </button>
          </div>
        </div>

        {/* Quick Action Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Lightbulb size={13} color="#f59e0b" />}
            isLoading={isHintLoading}
            onClick={() => handleRequestHint(currentHintLevel < 5 ? ((currentHintLevel + 1) as SocraticHintLevel) : 1)}
          >
            Level {currentHintLevel} Hint
          </Button>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Code2 size={13} color="#818cf8" />}
            isLoading={isReviewLoading}
            onClick={handleRequestCodeReview}
          >
            Review My Code
          </Button>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Target size={13} color="#34d399" />}
            onClick={handleGeneratePractice}
          >
            Targeted Practice
          </Button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'chat' && (
          <div>
            {/* Progressive Socratic Hint Tracker */}
            <HintProgress
              currentLevel={currentHintLevel}
              hintResult={hintResult}
              isLoading={isHintLoading}
              onRequestNextLevel={() =>
                handleRequestHint(
                  currentHintLevel < 5 ? ((currentHintLevel + 1) as SocraticHintLevel) : 5,
                )
              }
            />

            {/* Conversation Messages */}
            <div style={{ marginTop: '16px' }}>
              {messages.map(msg => (
                <MentorMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div>
            {isReviewLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Analyzing code structure, complexity, and correctness...
              </div>
            ) : codeReview ? (
              <CodeReviewPanel review={codeReview} />
            ) : (
              <Card padding="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Click "Review My Code" above to get an instant AI evaluation of your solution.
              </Card>
            )}
          </div>
        )}

        {activeTab === 'concept' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="E.g. Binary Search, Hash Maps, Recursion..."
                value={conceptQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConceptQuery(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleExplainConcept()}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Button
                variant="primary"
                size="md"
                isLoading={isConceptLoading}
                onClick={handleExplainConcept}
              >
                Explain
              </Button>
            </div>

            {conceptExplanation && (
              <Card padding="md" glow style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <BookOpen size={18} color="#818cf8" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                    {conceptExplanation.concept}
                  </h3>
                </div>

                <div style={{ fontSize: '13px', color: '#93c5fd', fontStyle: 'italic', marginBottom: '12px' }}>
                  "{conceptExplanation.analogy}"
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    CORE PRINCIPLES
                  </h4>
                  {conceptExplanation.corePrinciples.map((p, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>
                      • {p}
                    </div>
                  ))}
                </div>

                {conceptExplanation.codeExamples.map((ex, idx) => (
                  <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>{ex.title}</div>
                    <pre style={{ fontSize: '12px', color: '#a7f3d0', fontFamily: 'monospace', margin: 0 }}>{ex.code}</pre>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer Chat Input (visible in Chat tab) */}
      {activeTab === 'chat' && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            type="text"
            placeholder="Ask mentor a question about your code or algorithm..."
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <Button
            variant="primary"
            size="md"
            isLoading={isLoading}
            rightIcon={<Send size={15} />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      )}

      {/* Targeted Practice Modal */}
      <TargetedPracticeModal
        practice={generatedPractice}
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        onApplyStarterCode={code => onApplyStarterCode && onApplyStarterCode(code)}
      />
    </div>
  );
};
