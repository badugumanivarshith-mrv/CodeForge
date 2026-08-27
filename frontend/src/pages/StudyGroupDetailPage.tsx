import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Target,
  Trophy,
  Plus,
  ArrowLeft,
  Clock,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { groupApi } from '../services/groupApi';
import {
  StudyGroupDto,
  StudyGroupMemberDto,
  StudyGroupDiscussionDto,
  StudyGroupGoalDto,
  StudyGroupRole,
} from '@codeforge/shared';

export const StudyGroupDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [group, setGroup] = useState<StudyGroupDto | null>(null);
  const [members, setMembers] = useState<StudyGroupMemberDto[]>([]);
  const [discussions, setDiscussions] = useState<StudyGroupDiscussionDto[]>([]);
  const [goals, setGoals] = useState<StudyGroupGoalDto[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    { userId: string; username: string; totalXp: number; solvedCount: number; rank: number }[]
  >([]);

  const [activeTab, setActiveTab] = useState<'discussions' | 'goals' | 'leaderboard' | 'members'>('discussions');
  const [isLoading, setIsLoading] = useState(true);

  // New discussion & goal form state
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');

  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');

  const fetchGroupData = async () => {
    if (!idOrSlug) return;
    setIsLoading(true);
    try {
      const g = await groupApi.getGroup(idOrSlug);
      setGroup(g);

      const [m, d, gl, lb] = await Promise.all([
        groupApi.getMembers(g.id),
        groupApi.getDiscussions(g.id),
        groupApi.getGoals(g.id),
        groupApi.getLeaderboard(g.id),
      ]);

      setMembers(m);
      setDiscussions(d);
      setGoals(gl);
      setLeaderboard(lb);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [idOrSlug]);

  const handleJoin = async () => {
    if (!group) return;
    try {
      await groupApi.joinGroup(group.id);
      fetchGroupData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async () => {
    if (!group || !window.confirm('Are you sure you want to leave this study group?')) return;
    try {
      await groupApi.leaveGroup(group.id);
      fetchGroupData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group || !newDiscussionTitle || !newDiscussionContent) return;
    try {
      await groupApi.createDiscussion(group.id, {
        title: newDiscussionTitle,
        contentMdx: newDiscussionContent,
      });
      setNewDiscussionTitle('');
      setNewDiscussionContent('');
      setShowNewDiscussion(false);
      const d = await groupApi.getDiscussions(group.id);
      setDiscussions(d);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group || !newGoalTitle) return;
    try {
      await groupApi.createGoal(group.id, {
        title: newGoalTitle,
        description: newGoalDescription,
        targetDate: newGoalTargetDate || undefined,
      });
      setNewGoalTitle('');
      setNewGoalDescription('');
      setNewGoalTargetDate('');
      setShowNewGoal(false);
      const gl = await groupApi.getGoals(group.id);
      setGoals(gl);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading study group cohort...
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p>Study group not found.</p>
        <Link to="/groups">
          <Button variant="secondary" size="sm" style={{ marginTop: '12px' }}>
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Back button */}
      <Link to="/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to All Study Groups
      </Link>

      {/* Header Banner */}
      <Card glow padding="lg" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{group.name}</h1>
              {group.userRole && (
                <Badge variant="brand" size="sm">
                  {group.userRole.toUpperCase()}
                </Badge>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '700px', lineHeight: 1.5 }}>
              {group.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {group.userRole ? (
              group.userRole !== StudyGroupRole.OWNER && (
                <Button variant="danger" size="sm" onClick={handleLeave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserMinus size={14} /> Leave Group
                </Button>
              )
            ) : (
              <Button variant="primary" size="md" onClick={handleJoin} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus size={16} /> Join Study Group
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('discussions')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'discussions' ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MessageSquare size={16} /> Discussions ({discussions.length})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'goals' ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Target size={16} /> Study Goals ({goals.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'leaderboard' ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trophy size={16} /> Group Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('members')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'members' ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={16} /> Members ({members.length})
          </button>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'discussions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Group Discussions</h2>
            <Button variant="primary" size="sm" onClick={() => setShowNewDiscussion(true)}>
              <Plus size={14} style={{ marginRight: 4 }} /> Start Discussion
            </Button>
          </div>

          {showNewDiscussion && (
            <Card padding="md" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Start a Discussion</h3>
              <form onSubmit={handleCreateDiscussion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  required
                  placeholder="Discussion Topic / Question..."
                  value={newDiscussionTitle}
                  onChange={e => setNewDiscussionTitle(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Share details, problem links, or code concepts..."
                  value={newDiscussionContent}
                  onChange={e => setNewDiscussionContent(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewDiscussion(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Post Discussion
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {discussions.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No discussions yet. Start the conversation!</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {discussions.map(d => (
                <Card key={d.id} padding="md">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{d.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {d.contentMdx}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Posted by <strong style={{ color: 'var(--text-primary)' }}>{d.authorName}</strong> on {new Date(d.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'goals' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Active Cohort Goals</h2>
            {(group.userRole === StudyGroupRole.OWNER || group.userRole === StudyGroupRole.ADMIN) && (
              <Button variant="primary" size="sm" onClick={() => setShowNewGoal(true)}>
                <Plus size={14} style={{ marginRight: 4 }} /> Add Goal
              </Button>
            )}
          </div>

          {showNewGoal && (
            <Card padding="md" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Set Cohort Milestone</h3>
              <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Dynamic Programming module & solve 10 Hard problems"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                <textarea
                  rows={2}
                  placeholder="Goal description / milestones..."
                  value={newGoalDescription}
                  onChange={e => setNewGoalDescription(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
                <input
                  type="date"
                  value={newGoalTargetDate}
                  onChange={e => setNewGoalTargetDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    width: '200px',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewGoal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Goal
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {goals.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No goals set yet for this cohort.</p>
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {goals.map(g => (
                <Card key={g.id} padding="md">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{g.title}</h3>
                    <Badge variant={g.isCompleted ? 'success' : 'brand'} size="sm">
                      {g.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  {g.targetDate && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Target: {new Date(g.targetDate).toLocaleDateString()}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card padding="lg">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Cohort XP & Problem Solved Rankings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.map(u => (
              <div
                key={u.userId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, width: '24px', color: u.rank === 1 ? '#f59e0b' : u.rank === 2 ? '#94a3b8' : u.rank === 3 ? '#b45309' : 'var(--text-secondary)' }}>
                    #{u.rank}
                  </span>
                  <Link to={`/u/${u.username}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {u.username}
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{u.solvedCount} Solved</span>
                  <span style={{ color: '#6366f1', fontWeight: 700 }}>{u.totalXp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'members' && (
        <Card padding="lg">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Cohort Roster ({members.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {members.map(m => (
              <div
                key={m.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  {m.username[0]?.toUpperCase()}
                </div>
                <div>
                  <Link to={`/u/${m.username}`} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                    {m.fullName || m.username}
                  </Link>
                  <Badge variant={m.role === 'owner' ? 'brand' : m.role === 'admin' ? 'purple' : 'default'} size="sm">
                    {m.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
