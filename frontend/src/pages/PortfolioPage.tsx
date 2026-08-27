import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ExternalLink,
  Github,
  Plus,
  Trash2,
  Lock,
  Globe,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { portfolioApi } from '../services/portfolioApi';
import {
  PortfolioDto,
  CreatePortfolioProjectDto,
  PortfolioHeatmapItemDto,
  PortfolioProjectDto,
  PortfolioSkillItemDto,
} from '@codeforge/shared';

export const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Form states
  const [headline, setHeadline] = useState('');
  const [aboutMdx, setAboutMdx] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // New Project Form state
  const [newProject, setNewProject] = useState<CreatePortfolioProjectDto>({
    title: '',
    description: '',
    repositoryUrl: '',
    demoUrl: '',
    technologies: [],
    isFeatured: true,
  });
  const [techInput, setTechInput] = useState('');

  const fetchPortfolio = () => {
    setIsLoading(true);
    portfolioApi
      .getMyPortfolio()
      .then(data => {
        setPortfolio(data);
        setHeadline(data.settings.headline || '');
        setAboutMdx(data.settings.aboutMdx || '');
        setIsPublic(data.settings.isPublic);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const updated = await portfolioApi.updateSettings({
        headline,
        aboutMdx,
        isPublic,
      });
      if (portfolio) {
        setPortfolio({ ...portfolio, settings: updated });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;

    try {
      await portfolioApi.createProject(newProject);
      setShowAddProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        repositoryUrl: '',
        demoUrl: '',
        technologies: [],
        isFeatured: true,
      });
      fetchPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Delete this project from your portfolio?')) return;
    try {
      await portfolioApi.deleteProject(projectId);
      fetchPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your verified developer portfolio...
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p>Could not load portfolio data.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>Developer Portfolio</h1>
            <Badge variant={isPublic ? 'success' : 'warning'} size="sm">
              {isPublic ? <><Globe size={12} style={{ display: 'inline', marginRight: 4 }} /> Public</> : <><Lock size={12} style={{ display: 'inline', marginRight: 4 }} /> Private</>}
            </Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Showcase your verified CodeForge coding milestones, Elo ranking, projects, and learning heatmap.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to={`/u/${portfolio.user.username}`} target="_blank">
            <Button variant="secondary" size="md" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ExternalLink size={16} /> View Public Profile
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddProjectModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Project
          </Button>
        </div>
      </div>

      {/* Grid: Profile Overview & Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Verified Stats Card */}
        <Card glow padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 800,
              }}
            >
              {portfolio.user.fullName?.[0] || portfolio.user.username[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{portfolio.user.fullName || portfolio.user.username}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>@{portfolio.user.username}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#6366f1', fontWeight: 800, fontSize: '18px' }}>{portfolio.rating.currentRating}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Skill Rating</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: '18px' }}>{portfolio.rating.rankTier}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rank Tier</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '18px' }}>{portfolio.contests.participatedCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Contests</div>
            </div>
          </div>

          {/* Activity Heatmap (Last 30 days) */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              30-Day Activity Heatmap
            </h4>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              {portfolio.heatmap.map((day: PortfolioHeatmapItemDto) => {
                const intensity = day.count === 0 ? 'rgba(255,255,255,0.05)' : day.count < 3 ? '#3b82f6' : day.count < 6 ? '#6366f1' : '#10b981';
                return (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} activities`}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      backgroundColor: intensity,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </Card>

        {/* Portfolio Settings Form */}
        <Card padding="lg">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Portfolio Customization</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Distributed Systems & Full-Stack Engineer"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                About Me (Markdown / MDX)
              </label>
              <textarea
                rows={4}
                value={aboutMdx}
                onChange={e => setAboutMdx(e.target.value)}
                placeholder="Write a brief overview of your technical background, passions, and areas of expertise..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="isPublicCheck"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                style={{ cursor: 'pointer', width: 16, height: 16 }}
              />
              <label htmlFor="isPublicCheck" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Make Portfolio Public & Discoverable in Talent Search
              </label>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              style={{ alignSelf: 'flex-start', marginTop: '8px' }}
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Featured Projects Showcase */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Featured Projects ({portfolio.projects.length})</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowAddProjectModal(true)}>
            <Plus size={14} style={{ marginRight: 4 }} /> Add Project
          </Button>
        </div>

        {portfolio.projects.length === 0 ? (
          <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Briefcase size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No projects published yet</p>
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>
              Add personal builds, open-source repositories, or CodeForge capstones to showcase your skills to recruiters.
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowAddProjectModal(true)}>
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {portfolio.projects.map((proj: PortfolioProjectDto) => (
              <Card key={proj.id} padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{proj.title}</h3>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      title="Delete Project"
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {proj.description}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {proj.technologies.map((tech: string) => (
                      <Badge key={tech} variant="brand" size="sm">{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  {proj.repositoryUrl && (
                    <a href={proj.repositoryUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-brand-primary)' }}>
                      <Github size={14} /> Code
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#10b981' }}>
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Verified Skills & Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Verified Skills */}
        <Card padding="lg">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" /> Verified Technical Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {portfolio.skills.map((s: PortfolioSkillItemDto) => (
              <div key={s.skillName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{s.skillName}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.score}% Mastery</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${s.score}%`,
                      background: 'linear-gradient(90deg, #6366f1, #10b981)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Unlocked Badges */}
        <Card padding="lg">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#f59e0b" /> Achievement Badges ({portfolio.achievements.length})
          </h3>
          {portfolio.achievements.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Complete lessons and contests to unlock platform achievements.</p>
          ) : (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {portfolio.achievements.map((ach: { id: string; title: string; badgeIcon: string; unlockedAt: string }) => (
                <div
                  key={ach.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{ach.badgeIcon || '🏆'}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{ach.title}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modal: Add Project */}
      {showAddProjectModal && (
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
          <Card padding="lg" style={{ width: '100%', maxWidth: '540px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Add Portfolio Project</h3>
            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Distributed Key-Value Store"
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Explain architecture, purpose, and key technical challenges solved..."
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>GitHub Repo URL</label>
                  <input
                    type="url"
                    value={newProject.repositoryUrl}
                    onChange={e => setNewProject({ ...newProject, repositoryUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Live Demo URL</label>
                  <input
                    type="url"
                    value={newProject.demoUrl}
                    onChange={e => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={e => {
                    setTechInput(e.target.value);
                    setNewProject({
                      ...newProject,
                      technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    });
                  }}
                  placeholder="TypeScript, React, PostgreSQL, Docker"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <Button type="button" variant="ghost" size="md" onClick={() => setShowAddProjectModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Publish Project
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
