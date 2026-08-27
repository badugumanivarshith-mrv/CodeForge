import React, { useState, useEffect } from 'react';
import { User, Award, Flame, Zap, Edit3, Github, Globe, BookOpen } from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, loadCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [githubUsername, setGithubUsername] = useState(profile?.githubUsername || '');
  const [goalInput, setGoalInput] = useState('');
  const [learningGoals, setLearningGoals] = useState<string[]>(profile?.learningGoals || []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setBio(profile.bio || '');
      setGithubUsername(profile.githubUsername || '');
      setLearningGoals(profile.learningGoals || []);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        fullName,
        bio,
        githubUsername,
        learningGoals,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Error handled in store
    } finally {
      setIsSaving(false);
    }
  };

  const addGoal = () => {
    if (goalInput.trim() && !learningGoals.includes(goalInput.trim())) {
      setLearningGoals([...learningGoals, goalInput.trim()]);
      setGoalInput('');
    }
  };

  const removeGoal = (goal: string) => {
    setLearningGoals(learningGoals.filter(g => g !== goal));
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Profile Banner */}
      <Card glow padding="lg" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={user?.username || 'Avatar'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={42} />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{profile?.fullName || user?.username || 'Learner'}</h1>
                <Badge variant="brand" size="sm">{user?.role || 'STUDENT'}</Badge>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                @{user?.username} • {user?.email}
              </p>
              {profile?.bio && (
                <p style={{ color: '#d1d5db', fontSize: '13px', maxWidth: '550px', marginBottom: '10px' }}>
                  {profile.bio}
                </p>
              )}
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
                  <Flame size={16} /> Streak Active
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c084fc', fontWeight: 600 }}>
                  <Zap size={16} /> {profile?.totalXp || 0} Total XP
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#818cf8', fontWeight: 600 }}>
                  <Award size={16} /> Level {profile?.currentLevel || 1}
                </span>
                {profile?.githubUsername && (
                  <a
                    href={`https://github.com/${profile.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#93c5fd', textDecoration: 'none' }}
                  >
                    <Github size={15} /> @{profile.githubUsername}
                  </a>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Edit3 size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {saveSuccess && (
          <div style={{ marginTop: '16px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '13px' }}>
            ✓ Profile updated successfully!
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Edit Profile Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>GitHub Username</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  placeholder="octocat"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
                placeholder="Share a bit about your engineering interests..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Learning Goals</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  placeholder="e.g. Master C++ Memory Management"
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
                <Button type="button" variant="secondary" size="sm" onClick={addGoal}>Add Goal</Button>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {learningGoals.map(goal => (
                  <span key={goal} style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {goal}
                    <button type="button" onClick={() => removeGoal(goal)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" isLoading={isSaving} style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
              Save Changes
            </Button>
          </form>
        )}
      </Card>

      {/* Learning Goals Display */}
      {profile?.learningGoals && profile.learningGoals.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#818cf8" /> Current Learning Goals
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {profile.learningGoals.map((goal, idx) => (
              <Card key={idx} padding="md" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={18} color="#6366f1" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{goal}</span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Competence Matrix */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Skill Competence Matrix</h2>
      <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '36px 20px' }}>
        <Award size={36} color="#818cf8" style={{ marginBottom: '10px' }} />
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Bayesian Knowledge Tracing Active
        </p>
        <p style={{ fontSize: '13px' }}>
          Solve problems and complete assignments to build your multi-dimensional skill graph across Tier-1 languages.
        </p>
      </Card>
    </div>
  );
};
