import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Plus,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { forumApi } from '../services/forumApi';
import {
  ForumPostDto,
  ForumTagDto,
} from '@codeforge/shared';

export const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPostDto[]>([]);
  const [tags, setTags] = useState<ForumTagDto[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);

  // Ask Question form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await forumApi.listPosts({
        tag: selectedTag || undefined,
        query: searchQuery || undefined,
      });
      setPosts(res.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    forumApi
      .getTags()
      .then(t => setTags(t))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      await forumApi.createPost({
        title: newTitle,
        contentMdx: newContent,
        tagIds: selectedTagIds,
      });
      setShowAskModal(false);
      setNewTitle('');
      setNewContent('');
      setSelectedTagIds([]);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTagSelection = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>Developer Q&A Forum</h1>
            <Badge variant="brand" size="sm">Community Knowledge</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Ask questions, share algorithmic solutions, debug code, and earn developer reputation.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAskModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Ask Question
        </Button>
      </div>

      {/* Search and Tag Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '280px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword, error message, or algorithm..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '14px',
            }}
          />
          <Button type="submit" variant="secondary" size="md">
            <Search size={16} />
          </Button>
        </form>
      </div>

      {/* Tags Row */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button
            onClick={() => setSelectedTag(null)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: selectedTag === null ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
              background: selectedTag === null ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
              color: selectedTag === null ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Topics
          </button>
          {tags.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.slug)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: selectedTag === t.slug ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                background: selectedTag === t.slug ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                color: selectedTag === t.slug ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              #{t.name}
            </button>
          ))}
        </div>
      )}

      {/* Questions List */}
      {isLoading ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading community questions...
        </div>
      ) : posts.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <MessageSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>No questions found in this category.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Be the first to ask a question and help fellow developers!</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {posts.map(post => (
            <Card key={post.id} glow padding="md" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {/* Score & Answers Counters */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: post.score > 0 ? '#10b981' : post.score < 0 ? '#ef4444' : 'var(--text-secondary)' }}>
                    {post.score}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>votes</div>
                </div>

                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: post.acceptedAnswerId ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                    background: post.acceptedAnswerId ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: post.acceptedAnswerId ? '#10b981' : 'var(--text-secondary)' }}>
                    {post.answersCount}
                  </div>
                  <div style={{ fontSize: '9px', color: post.acceptedAnswerId ? '#10b981' : 'var(--text-muted)' }}>answers</div>
                </div>
              </div>

              {/* Question Content */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>
                  <Link to={`/forum/${post.slug || post.id}`} style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.contentMdx}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {post.tags?.map(t => (
                      <Badge key={t.id} variant="default" size="sm">#{t.name}</Badge>
                    ))}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Asked by <Link to={`/u/${post.authorName}`} style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>{post.authorName}</Link> • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Ask Question */}
      {showAskModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
        >
          <Card padding="lg" style={{ width: '100%', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Ask a Question</h3>
            <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. How to optimize Dijkstra's algorithm for dense graphs in C++?"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Body (Markdown supported) *</label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Explain what problem you're solving, what you tried, and provide reproducible code snippets..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Select Tags</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {tags.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTagSelection(t.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: selectedTagIds.includes(t.id) ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                        background: selectedTagIds.includes(t.id) ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        color: selectedTagIds.includes(t.id) ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      #{t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <Button type="button" variant="ghost" size="md" onClick={() => setShowAskModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Publish Question
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
