import React, { useState, useEffect } from 'react';
import { ResearchPublicationDto } from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const ResearchNetworkPage: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPublicationDto[]>([]);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [domain, setDomain] = useState('Distributed Multi-Agent Consensus');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      let data = await globalEcosystemApi.listPapers();
      if (data.length === 0) {
        // Publish default papers
        await globalEcosystemApi.publishPaper({
          title: 'Asynchronous DAG Pipeline Quorums in Multi-Agent Ecosystems',
          abstract: 'We present a deterministic proof for Byzantine fault-tolerant step resolution in distributed workflow engines.',
          domain: 'Distributed Multi-Agent Consensus',
          peerReviewScore: 94.8,
          citationsCount: 18,
          downloadCount: 142,
        });
        await globalEcosystemApi.publishPaper({
          title: 'Decentralized Vector Memory Fabric 2.0: Continuous Context Synthesis',
          abstract: 'An evaluation of semantic importance weighting and decayed episodic memory retention across multi-tenant clusters.',
          domain: 'AI Memory & Knowledge Systems',
          peerReviewScore: 91.2,
          citationsCount: 12,
          downloadCount: 98,
        });
        data = await globalEcosystemApi.listPapers();
      }
      setPapers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !abstract) return;
    setPublishing(true);
    try {
      await globalEcosystemApi.publishPaper({ title, abstract, domain });
      setTitle('');
      setAbstract('');
      await loadPapers();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Global Research Network & Citation Graph
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Academic collaboration network, peer-reviewed publications, and emerging innovation signals
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Published Papers List */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            Peer-Reviewed Research Publications ({papers.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {papers.map(p => (
              <div key={p.id} style={{ padding: '18px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#e2e8f0' }}>{p.title}</h3>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontWeight: 600 }}>
                    Score: {p.peerReviewScore}/100
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '8px' }}>Domain: {p.domain}</div>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px 0' }}>{p.abstract}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                  <span>📊 {p.citationsCount} Citations</span>
                  <span>📥 {p.downloadCount} Downloads</span>
                  <span>📅 Published: {new Date(p.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Paper Form */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            Publish New Research
          </h2>
          <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Paper Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus in Multi-Agent Graphs"
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Research Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Abstract</label>
              <textarea
                value={abstract}
                onChange={e => setAbstract(e.target.value)}
                rows={4}
                placeholder="Summarize methodology and key experimental outcomes..."
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px', resize: 'vertical' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={publishing}
              style={{ padding: '10px', background: '#a855f7', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              {publishing ? 'Publishing...' : 'Publish to Global Network'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
