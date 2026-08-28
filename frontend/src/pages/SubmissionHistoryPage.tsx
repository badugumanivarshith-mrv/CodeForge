import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ArrowRight,
  ExternalLink,
  FileCode,
  AlertTriangle,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/common';
import { judgeApi } from '../services/judgeApi';
import {
  SubmissionDto,
  JudgeVerdict,
  SubmissionStatus,
  LanguageId,
  PerformanceAnalyticsDto,
} from '@codeforge/shared';

export const SubmissionHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceAnalyticsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [subs, userAnalytics] = await Promise.allSettled([
          judgeApi.listSubmissions({ limit: 100 }),
          judgeApi.getPerformanceAnalytics(),
        ]);

        if (subs.status === 'fulfilled') setSubmissions(subs.value.submissions);
        if (userAnalytics.status === 'fulfilled') setAnalytics(userAnalytics.value);
      } catch (err) {
        console.error('Failed to load submission history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    const v = sub.verdict || sub.status;
    const matchesVerdict = selectedVerdict === 'all' || v.toLowerCase() === selectedVerdict.toLowerCase();
    const matchesLang = selectedLanguage === 'all' || sub.languageId === selectedLanguage;
    const matchesSearch =
      !searchQuery ||
      (sub.problemTitle && sub.problemTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sub.id.includes(searchQuery);

    return matchesVerdict && matchesLang && matchesSearch;
  });

  const getVerdictBadge = (verdict?: JudgeVerdict | SubmissionStatus | string) => {
    const v = (verdict || '').toUpperCase();
    if (v === 'ACCEPTED') {
      return <Badge variant="success"><CheckCircle2 size={13} style={{ marginRight: '4px' }} /> Accepted</Badge>;
    } else if (v === 'WRONG_ANSWER') {
      return <Badge variant="danger"><XCircle size={13} style={{ marginRight: '4px' }} /> Wrong Answer</Badge>;
    } else if (v === 'TIME_LIMIT_EXCEEDED') {
      return <Badge variant="warning"><Clock size={13} style={{ marginRight: '4px' }} /> Time Limit Exceeded</Badge>;
    } else if (v === 'RUNTIME_ERROR') {
      return <Badge variant="danger"><AlertTriangle size={13} style={{ marginRight: '4px' }} /> Runtime Error</Badge>;
    } else if (v === 'COMPILATION_ERROR') {
      return <Badge variant="warning"><FileCode size={13} style={{ marginRight: '4px' }} /> Compilation Error</Badge>;
    }
    return <Badge variant="default">{verdict || 'Queued'}</Badge>;
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header & Performance Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <History size={24} color="var(--color-brand-primary)" />
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Submission History & Analytics
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Track and analyze your live execution outcomes, runtime benchmarks, and AI diagnostics.
          </p>
        </div>

        <Button onClick={() => navigate('/arena')}>
          Enter Arena <ArrowRight size={14} style={{ marginLeft: '6px' }} />
        </Button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Card style={{ padding: '20px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Submissions</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {analytics?.totalSubmissions ?? submissions.length}
          </div>
        </Card>

        <Card style={{ padding: '20px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Accepted Solves</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-accent-emerald)' }}>
            {analytics?.acceptedSubmissions ?? 0}
          </div>
        </Card>

        <Card style={{ padding: '20px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Acceptance Rate</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
            {analytics?.acceptanceRate ? `${analytics.acceptanceRate}%` : '—'}
          </div>
        </Card>

        <Card style={{ padding: '20px', background: 'var(--bg-glass-card)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Average Runtime</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {analytics?.averageRuntimeMs ? `${analytics.averageRuntimeMs}ms` : '—'}
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search problem title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Verdict Filter */}
          <select
            value={selectedVerdict}
            onChange={e => setSelectedVerdict(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Verdicts</option>
            <option value="accepted">Accepted (AC)</option>
            <option value="wrong_answer">Wrong Answer (WA)</option>
            <option value="time_limit_exceeded">Time Limit Exceeded (TLE)</option>
            <option value="runtime_error">Runtime Error (RTE)</option>
            <option value="compilation_error">Compilation Error (CE)</option>
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Languages</option>
            <option value={LanguageId.PYTHON}>Python</option>
            <option value={LanguageId.JAVASCRIPT}>JavaScript</option>
            <option value={LanguageId.TYPESCRIPT}>TypeScript</option>
            <option value={LanguageId.JAVA}>Java</option>
            <option value={LanguageId.CPP}>C++</option>
            <option value={LanguageId.C}>C</option>
            <option value={LanguageId.GO}>Go</option>
            <option value={LanguageId.RUST}>Rust</option>
          </select>
        </div>

        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing {filteredSubmissions.length} of {submissions.length} submissions
        </span>
      </div>

      {/* Submissions Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading submissions history...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No submissions found matching the criteria.
        </Card>
      ) : (
        <Card style={{ padding: '0', background: 'var(--bg-surface)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 20px' }}>PROBLEM</th>
                <th style={{ padding: '14px 20px' }}>VERDICT</th>
                <th style={{ padding: '14px 20px' }}>LANGUAGE</th>
                <th style={{ padding: '14px 20px' }}>RUNTIME</th>
                <th style={{ padding: '14px 20px' }}>MEMORY</th>
                <th style={{ padding: '14px 20px' }}>SUBMITTED AT</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map(sub => (
                <tr
                  key={sub.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onClick={() => navigate(`/submissions/${sub.id}`)}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sub.problemTitle || 'Challenge Problem'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {getVerdictBadge(sub.verdict || sub.status)}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {sub.languageId}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {sub.executionTimeMs !== null && sub.executionTimeMs !== undefined ? `${sub.executionTimeMs}ms` : '—'}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {sub.memoryUsedKb !== null && sub.memoryUsedKb !== undefined ? `${sub.memoryUsedKb}KB` : '—'}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); navigate(`/submissions/${sub.id}`); }}>
                      Inspect <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
