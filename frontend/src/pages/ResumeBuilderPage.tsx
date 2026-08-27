import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { resumeApi } from '../services/resumeApi';
import { ResumeDto } from '@codeforge/shared';

export const ResumeBuilderPage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeDto[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Resume form state
  const [newTitle, setNewTitle] = useState('');
  const [targetRole, setTargetRole] = useState('Fullstack Software Engineer');
  const [templateName, setTemplateName] = useState('executive-dark');
  const [importCodeforgeData, setImportCodeforgeData] = useState(true);

  // ATS Optimization form state
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    atsScore: number;
    atsFeedback: string;
    matchedKeywords: string[];
    missingKeywords: string[];
  } | null>(null);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const list = await resumeApi.getMyResumes();
      setResumes(list);
      if (list.length > 0 && !selectedResume) {
        setSelectedResume(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const created = await resumeApi.createResume({
        title: newTitle,
        targetRole,
        templateName,
        importCodeforgeData,
      });
      setShowCreateModal(false);
      setNewTitle('');
      setSelectedResume(created);
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await resumeApi.deleteResume(id);
      if (selectedResume?.id === id) {
        setSelectedResume(null);
      }
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeAts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume || !jobDescription.trim()) return;

    setIsAnalyzingAts(true);
    try {
      const res = await resumeApi.analyzeAts(selectedResume.id, jobDescription);
      setAtsResult(res);
      // Update selected resume with new ATS score
      setSelectedResume({
        ...selectedResume,
        atsScore: res.atsScore,
        atsFeedback: {
          score: res.atsScore,
          strengths: ['Relevant core technical skills'],
          missingKeywords: res.missingKeywords,
          formattingSuggestions: [res.atsFeedback],
        },
      });
      fetchResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingAts(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading AI ATS Resume Generator...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              AI Resume Generator & ATS Optimizer
            </h1>
            <Badge variant="brand" size="sm">ATS Scanner</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Generate ATS-compliant engineering resumes directly populated with your verified CodeForge skills, ratings, and projects.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <FileText size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No resumes created yet</h3>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>
            Generate your first ATS-optimized resume populated with your verified CodeForge achievements!
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            Build Resume with CodeForge Import
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Left: Resume Selector Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Your Resumes ({resumes.length})</h3>
            {resumes.map(r => (
              <Card
                key={r.id}
                glow={selectedResume?.id === r.id}
                padding="md"
                style={{
                  cursor: 'pointer',
                  border: selectedResume?.id === r.id ? '2px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
                }}
                onClick={() => {
                  setSelectedResume(r);
                  setAtsResult(null);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{r.title}</h4>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteResume(r.id);
                    }}
                    title="Delete Resume"
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {r.targetRole || 'Software Engineer'} • Template: {r.templateName}
                </p>
                {r.atsScore !== undefined && (
                  <Badge variant={r.atsScore >= 75 ? 'success' : 'warning'} size="sm">
                    ATS Score: {r.atsScore}%
                  </Badge>
                )}
              </Card>
            ))}
          </div>

          {/* Right: Selected Resume Preview & ATS Analyzer */}
          {selectedResume && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* ATS Scanner Card */}
              <Card glow padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="#a855f7" /> ATS Match Analyzer
                  </h3>
                  {selectedResume.atsScore !== undefined && (
                    <span style={{ fontSize: '24px', fontWeight: 900, color: selectedResume.atsScore >= 75 ? '#10b981' : '#f59e0b' }}>
                      {selectedResume.atsScore}% Match
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Paste a target Job Description to test your resume against ATS keyword scanners and identify missing skills.
                </p>

                <form onSubmit={handleAnalyzeAts} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste job requirements, responsibilities, and qualifications..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                    }}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isAnalyzingAts || !jobDescription.trim()}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {isAnalyzingAts ? 'Scanning Keywords...' : 'Analyze ATS Score'}
                  </Button>
                </form>

                {atsResult && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Keyword Match Results:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', marginBottom: '6px' }}>
                          ✓ Matched Keywords ({atsResult.matchedKeywords.length})
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {atsResult.matchedKeywords.map(k => (
                            <Badge key={k} variant="success" size="sm">{k}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', marginBottom: '6px' }}>
                          ⚠ Missing Keywords ({atsResult.missingKeywords.length})
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {atsResult.missingKeywords.map(k => (
                            <Badge key={k} variant="danger" size="sm">{k}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {atsResult.atsFeedback && (
                      <div style={{ fontSize: '13px', color: '#6366f1', background: 'rgba(99, 102, 241, 0.05)', padding: '10px 12px', borderRadius: '6px' }}>
                        {atsResult.atsFeedback}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Resume Document Preview */}
              <Card padding="lg" style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                    {selectedResume.personalInfo?.fullName || 'Developer Name'}
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--color-brand-primary)', fontWeight: 600, marginBottom: '6px' }}>
                    {selectedResume.targetRole || 'Software Engineer'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {selectedResume.personalInfo?.email} • {selectedResume.personalInfo?.github}
                  </p>
                </div>

                {/* Skills */}
                {selectedResume.skills && selectedResume.skills.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Verified Technical Skills
                    </h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {selectedResume.skills.map((s: string) => (
                        <Badge key={s} variant="default" size="sm">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {selectedResume.projects && selectedResume.projects.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '10px' }}>
                      Key Engineering Projects
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedResume.projects.map((p: any, idx: number) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '14px', color: '#fff' }}>{p.name || p.title}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--color-brand-primary)' }}>{p.technologies?.join(', ')}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
                            {p.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Resume */}
      {showCreateModal && (
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
          <Card padding="lg" style={{ width: '100%', maxWidth: '520px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Create ATS Engineering Resume</h3>
            <form onSubmit={handleCreateResume} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Resume Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Backend / Distributed Systems Resume"
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Staff Fullstack Engineer"
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Template Style</label>
                <select
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="executive-dark">Executive Tech (Dark Modern)</option>
                  <option value="minimal-clean">Minimalist ATS Classic</option>
                  <option value="vanguard-engineer">Vanguard Systems Engineer</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="importCodeforge"
                  checked={importCodeforgeData}
                  onChange={e => setImportCodeforgeData(e.target.checked)}
                  style={{ cursor: 'pointer', width: 16, height: 16 }}
                />
                <label htmlFor="importCodeforge" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Auto-Import CodeForge Verified Skills, Ratings & Projects
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <Button type="button" variant="ghost" size="md" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Generate Resume
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
