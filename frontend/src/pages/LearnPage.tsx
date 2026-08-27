import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  Code2,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { curriculumApi } from '../services/curriculumApi';
import {
  LanguageDto,
  TopicProgressSummaryDto,
  TopicDetailDto,
  LessonDetailDto,
} from '@codeforge/shared';
import { useAuth } from '../hooks/useAuth';

export const LearnPage: React.FC = () => {
  const { languageSlug } = useParams<{ languageSlug?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageSlug || 'python');
  const [topics, setTopics] = useState<TopicProgressSummaryDto[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Expanded topic accordion state
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [topicDetails, setTopicDetails] = useState<Record<string, TopicDetailDto>>({});
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);

  // Active Lesson Reader Modal state
  const [activeLesson, setActiveLesson] = useState<LessonDetailDto | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [isCompletingLesson, setIsCompletingLesson] = useState<boolean>(false);
  const [completionToast, setCompletionToast] = useState<string | null>(null);

  // Load active languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await curriculumApi.getLanguages();
        setLanguages(langs);
      } catch (err) {
        console.error('Failed to load languages:', err);
      }
    };
    fetchLanguages();
  }, []);

  // Load language roadmap when selectedLanguage changes
  useEffect(() => {
    const fetchRoadmap = async () => {
      setIsLoading(true);
      try {
        const roadmap = await curriculumApi.getLanguageRoadmap(selectedLanguage);
        setTopics(roadmap.topics);
        setOverallProgress(roadmap.overallProgressPercentage);
      } catch (err) {
        console.error('Failed to load language roadmap:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, [selectedLanguage]);

  const toggleTopicExpand = async (topic: TopicProgressSummaryDto) => {
    if (expandedTopicId === topic.id) {
      setExpandedTopicId(null);
      return;
    }

    setExpandedTopicId(topic.id);
    if (!topicDetails[topic.id]) {
      setLoadingTopicId(topic.id);
      try {
        const detail = await curriculumApi.getTopicDetail(selectedLanguage, topic.slug);
        setTopicDetails(prev => ({ ...prev, [topic.id]: detail }));
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setLoadingTopicId(null);
      }
    }
  };

  const openLessonModal = async (lessonId: string) => {
    setIsLoadingLesson(true);
    try {
      const detail = await curriculumApi.getLessonDetail(lessonId);
      setActiveLesson(detail);
    } catch (err) {
      console.error('Failed to load lesson detail:', err);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsCompletingLesson(true);
    try {
      const res = await curriculumApi.completeLesson(activeLesson.lesson.id);
      if (res.isFirstCompletion) {
        setCompletionToast(`🎉 Lesson Completed! +${res.xpAwarded} XP earned!`);
      } else {
        setCompletionToast('✓ Lesson reviewed.');
      }
      setActiveLesson(prev => (prev ? { ...prev, isCompleted: true } : null));

      // Refresh roadmap data in background
      const roadmap = await curriculumApi.getLanguageRoadmap(selectedLanguage);
      setTopics(roadmap.topics);
      setOverallProgress(roadmap.overallProgressPercentage);

      setTimeout(() => setCompletionToast(null), 4000);
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setIsCompletingLesson(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Toast Notification */}
      {completionToast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            padding: '14px 24px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={18} /> {completionToast}
        </div>
      )}

      {/* Header & Language Navigation Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>Curriculum Roadmap</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Master core computer science & software engineering competencies across 10 structured topics.
            </p>
          </div>

          {/* Overall Progress Meter */}
          <Card padding="sm" style={{ minWidth: '220px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>TRACK PROGRESS</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{overallProgress}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallProgress}%`, background: 'var(--color-brand-primary)', transition: 'width 300ms ease' }} />
            </div>
          </Card>
        </div>

        {/* Language Tabs */}
        {isLoadingLesson && (
          <div style={{ fontSize: '13px', color: '#818cf8', marginTop: '8px' }}>
            Loading lesson content...
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          {languages.map(lang => {
            const isSelected = selectedLanguage === lang.slug;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLanguage(lang.slug);
                  navigate(`/learn/${lang.slug}`);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: isSelected ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--color-brand-primary)' : 'var(--bg-surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.35)' : 'none',
                }}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics List */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading roadmap topics...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topics.map(topic => {
            const isExpanded = expandedTopicId === topic.id;
            const isUnlocked = topic.isUnlocked;
            const detail = topicDetails[topic.id];

            return (
              <Card
                key={topic.id}
                glow={isUnlocked}
                padding="md"
                style={{
                  borderLeft: isUnlocked ? '4px solid var(--color-brand-primary)' : '4px solid transparent',
                  opacity: isUnlocked ? 1 : 0.6,
                }}
              >
                {/* Topic Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isUnlocked ? 'pointer' : 'default' }} onClick={() => isUnlocked && toggleTopicExpand(topic)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: isUnlocked ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface-elevated)',
                        color: isUnlocked ? '#818cf8' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '16px',
                      }}
                    >
                      {topic.sequence}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{topic.title}</h3>
                        {topic.isCompleted ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 size={12} /> Completed
                          </Badge>
                        ) : isUnlocked ? (
                          <Badge variant="brand" size="sm">Available</Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            <Lock size={12} /> Locked
                          </Badge>
                        )}
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> ~{topic.estimatedHours}h
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BookOpen size={14} /> {topic.lessonsCompleted}/{topic.lessonsTotal} Lessons
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HelpCircle size={14} /> {topic.quizPassed ? 'Quiz Passed' : 'Quiz Checkpoint'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Code2 size={14} /> {topic.problemsTotal} Arena Problems
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isUnlocked ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        onClick={e => {
                          e.stopPropagation();
                          toggleTopicExpand(topic);
                        }}
                      >
                        {isExpanded ? 'Collapse' : 'Explore'}
                      </Button>
                    ) : (
                      <Lock size={20} color="var(--text-muted)" />
                    )}
                  </div>
                </div>

                {/* Expanded Topic Details Accordion */}
                {isExpanded && (
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                      {topic.description}
                    </p>

                    {loadingTopicId === topic.id ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading topic modules...</div>
                    ) : detail ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {/* Lessons Column */}
                        <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <BookOpen size={15} /> SEQUENCED LESSONS
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {detail.lessons.map(lsn => (
                              <div
                                key={lsn.id}
                                onClick={() => openLessonModal(lsn.id)}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: '8px',
                                  background: 'var(--bg-surface)',
                                  border: '1px solid var(--border-subtle)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all 150ms ease',
                                }}
                              >
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{lsn.title}</span>
                                {lsn.isCompleted ? (
                                  <CheckCircle2 size={16} color="#10b981" />
                                ) : (
                                  <ArrowRight size={14} color="var(--text-muted)" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quiz & Arena Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Checkpoint Quiz Card */}
                          {detail.quiz && (
                            <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#c084fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <HelpCircle size={15} /> TOPIC CHECKPOINT QUIZ
                              </div>
                              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{detail.quiz.title}</div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                {detail.quiz.questionCount} Questions • Server-side graded • 50+ XP reward
                              </p>
                              <Button
                                variant="primary"
                                size="sm"
                                rightIcon={<ArrowRight size={14} />}
                                onClick={() => navigate(`/quiz/topic/${topic.id}`)}
                              >
                                {detail.quiz.isPassed ? 'Retake Quiz' : 'Start Checkpoint Quiz'}
                              </Button>
                            </div>
                          )}

                          {/* Arena Problems */}
                          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Code2 size={15} /> CODING ARENA PROBLEMS
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {detail.problems.map(prob => (
                                <div
                                  key={prob.id}
                                  onClick={() => navigate(`/workspace/${prob.slug}`)}
                                  style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <div>
                                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: '8px' }}>{prob.title}</span>
                                    <Badge variant={prob.difficulty === 'easy' ? 'success' : prob.difficulty === 'medium' ? 'brand' : 'purple'} size="sm">
                                      {prob.difficulty}
                                    </Badge>
                                  </div>
                                  <ArrowRight size={14} color="var(--text-muted)" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Lesson Reader Drawer / Modal */}
      {activeLesson && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9000,
            padding: '24px',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              padding: '32px',
              position: 'relative',
              background: '#0d1117',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Badge variant="brand" size="sm">{activeLesson.topic.title}</Badge>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeLesson.lesson.readTimeMinutes} min read</span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{activeLesson.lesson.title}</h2>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Sections Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
              {activeLesson.sections.map(sec => (
                <div key={sec.id} style={{ lineHeight: 1.7, fontSize: '15px', color: 'var(--text-primary)' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#818cf8', marginBottom: '8px' }}>{sec.title}</h4>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{sec.contentMdx}</div>
                </div>
              ))}

              {/* Code Examples */}
              {activeLesson.examples.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>Interactive Code Example</h4>
                  {activeLesson.examples.map(ex => (
                    <Card key={ex.id} padding="sm" style={{ background: '#05070a', marginBottom: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>{ex.title}</div>
                      <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#38bdf8', padding: '8px', background: '#010409', borderRadius: '6px' }}>
                        {ex.codeTemplate}
                      </pre>
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Expected Output: <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{ex.expectedOutput}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <Button variant="secondary" onClick={() => setActiveLesson(null)}>
                Close
              </Button>
              <Button
                variant={activeLesson.isCompleted ? 'secondary' : 'primary'}
                leftIcon={<Zap size={16} />}
                isLoading={isCompletingLesson}
                onClick={handleCompleteLesson}
              >
                {activeLesson.isCompleted ? 'Completed ✓ (+20 XP)' : 'Mark Completed (+20 XP)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
