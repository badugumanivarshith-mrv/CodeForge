import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronUp,
  ChevronDown,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { forumApi } from '../services/forumApi';
import {
  ForumPostDetailDto,
  ForumTargetType,
  ForumVoteType,
} from '@codeforge/shared';

export const ForumPostDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [post, setPost] = useState<ForumPostDetailDto | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const fetchPost = async () => {
    if (!idOrSlug) return;
    setIsLoading(true);
    try {
      const data = await forumApi.getPost(idOrSlug);
      setPost(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [idOrSlug]);

  const handleVote = async (targetType: ForumTargetType, targetId: string, voteType: ForumVoteType) => {
    try {
      await forumApi.vote({ targetType, targetId, voteType });
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!post) return;
    try {
      await forumApi.acceptAnswer(post.id, answerId);
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !answerContent.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      await forumApi.createAnswer(post.id, { contentMdx: answerContent });
      setAnswerContent('');
      fetchPost();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading question thread...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p>Question not found.</p>
        <Link to="/forum">
          <Button variant="secondary" size="sm" style={{ marginTop: '12px' }}>
            Back to Forum
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      {/* Back button */}
      <Link to="/forum" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Forum
      </Link>

      {/* Main Question Card */}
      <Card glow padding="lg" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Vote Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => handleVote(ForumTargetType.POST, post.id, ForumVoteType.UPVOTE)}
              style={{
                background: post.userVote === ForumVoteType.UPVOTE ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: 'none',
                color: post.userVote === ForumVoteType.UPVOTE ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <ChevronUp size={24} />
            </button>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{post.score}</span>
            <button
              onClick={() => handleVote(ForumTargetType.POST, post.id, ForumVoteType.DOWNVOTE)}
              style={{
                background: post.userVote === ForumVoteType.DOWNVOTE ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                border: 'none',
                color: post.userVote === ForumVoteType.DOWNVOTE ? '#ef4444' : 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Question Details */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>{post.title}</h1>
            <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
              {post.contentMdx}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {post.tags?.map(t => (
                  <Badge key={t.id} variant="default" size="sm">#{t.name}</Badge>
                ))}
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Asked by <Link to={`/u/${post.authorName}`} style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>{post.authorName}</Link> on {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Answers Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          {post.answers?.length || 0} Answer{post.answers?.length === 1 ? '' : 's'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {post.answers?.map(ans => (
            <Card
              key={ans.id}
              padding="lg"
              style={{
                border: ans.isAccepted ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                background: ans.isAccepted ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-surface-elevated)',
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Vote & Accept Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleVote(ForumTargetType.ANSWER, ans.id, ForumVoteType.UPVOTE)}
                    style={{
                      background: ans.userVote === ForumVoteType.UPVOTE ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      border: 'none',
                      color: ans.userVote === ForumVoteType.UPVOTE ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                    }}
                  >
                    <ChevronUp size={22} />
                  </button>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{ans.score}</span>
                  <button
                    onClick={() => handleVote(ForumTargetType.ANSWER, ans.id, ForumVoteType.DOWNVOTE)}
                    style={{
                      background: ans.userVote === ForumVoteType.DOWNVOTE ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                      border: 'none',
                      color: ans.userVote === ForumVoteType.DOWNVOTE ? '#ef4444' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                    }}
                  >
                    <ChevronDown size={22} />
                  </button>

                  {/* Accept Button */}
                  <button
                    onClick={() => handleAcceptAnswer(ans.id)}
                    title={ans.isAccepted ? 'Accepted Answer' : 'Mark as accepted solution'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: ans.isAccepted ? '#10b981' : 'var(--text-muted)',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    <CheckCircle size={24} />
                  </button>
                </div>

                {/* Answer Content */}
                <div style={{ flex: 1 }}>
                  {ans.isAccepted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                      <CheckCircle size={14} /> ACCEPTED SOLUTION
                    </div>
                  )}

                  <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
                    {ans.contentMdx}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    Answered by <Link to={`/u/${ans.authorName}`} style={{ color: 'var(--color-brand-primary)', fontWeight: 600, marginLeft: 4 }}>{ans.authorName}</Link> on {new Date(ans.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Answer Submission Form */}
      <Card padding="lg">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Your Answer</h3>
        <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <textarea
            required
            rows={6}
            value={answerContent}
            onChange={e => setAnswerContent(e.target.value)}
            placeholder="Write a clear, explanatory answer with code blocks, complexity analysis, and reasoning..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmittingAnswer || !answerContent.trim()}
            style={{ alignSelf: 'flex-start' }}
          >
            {isSubmittingAnswer ? 'Posting...' : 'Post Your Answer'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
