import React, { useState, useEffect } from 'react';
import {
  GlobalGraphDto,
  GlobalNetworkNodeDto,
  GlobalNetworkRecommendationDto,
  GlobalRankingDto,
  GlobalNodeType,
} from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const GlobalNetworkPage: React.FC = () => {
  const [graph, setGraph] = useState<GlobalGraphDto | null>(null);
  const [rankings, setRankings] = useState<GlobalRankingDto[]>([]);
  const [selectedNode, setSelectedNode] = useState<GlobalNetworkNodeDto | null>(null);
  const [recommendations, setRecommendations] = useState<GlobalNetworkRecommendationDto[]>([]);
  const [selectedType, setSelectedType] = useState<GlobalNodeType | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNetwork();
  }, [selectedType]);

  const loadNetwork = async () => {
    setLoading(true);
    try {
      let g = await globalEcosystemApi.getGlobalGraph();
      if (g.nodes.length === 0) {
        // Create initial default nodes
        const n1 = await globalEcosystemApi.registerNode({
          entityId: 'ent-codeforge-core',
          nodeType: GlobalNodeType.ORGANIZATION,
          label: 'CodeForge Global HQ',
          score: 99.2,
          metadata: { tier: 'Enterprise Root', region: 'Global' },
        });
        const n2 = await globalEcosystemApi.registerNode({
          entityId: 'ent-atlas-sentinel',
          nodeType: GlobalNodeType.AGENT,
          label: 'Atlas Autonomous Sentinel',
          score: 95.8,
          metadata: { role: 'Executive Orchestrator' },
        });
        const n3 = await globalEcosystemApi.registerNode({
          entityId: 'ent-stanford-lab',
          nodeType: GlobalNodeType.UNIVERSITY,
          label: 'Stanford AI Distributed Systems Lab',
          score: 94.0,
          metadata: { field: 'Consensus Reasoning' },
        });
        const n4 = await globalEcosystemApi.registerNode({
          entityId: 'ent-talent-alex',
          nodeType: GlobalNodeType.TALENT,
          label: 'Alex Chen (Principal Systems Architect)',
          score: 96.5,
          metadata: { tier: 'Luminary' },
        });
        await globalEcosystemApi.connectNodes({
          sourceNodeId: n1.id,
          targetNodeId: n2.id,
          edgeType: 'deploys' as any,
          weight: 1.0,
        });
        await globalEcosystemApi.connectNodes({
          sourceNodeId: n1.id,
          targetNodeId: n3.id,
          edgeType: 'collaborates_with' as any,
          weight: 0.9,
        });
        await globalEcosystemApi.connectNodes({
          sourceNodeId: n1.id,
          targetNodeId: n4.id,
          edgeType: 'employs' as any,
          weight: 0.95,
        });

        g = await globalEcosystemApi.getGlobalGraph();
      }
      setGraph(g);
      if (g.nodes.length > 0 && !selectedNode) {
        selectNode(g.nodes[0]);
      }
      const r = await globalEcosystemApi.getRankings(selectedType);
      setRankings(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectNode = async (node: GlobalNetworkNodeDto) => {
    setSelectedNode(node);
    try {
      const recs = await globalEcosystemApi.getRecommendations(node.id);
      setRecommendations(recs);
    } catch {
      setRecommendations([]);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Global AI Network Graph & Topology
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Cross-entity graph discovery, multi-hop relationship matrices, and global ecosystem rankings
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Network Graph Visualization & Node List */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
              Connected Network Entities ({graph?.nodes?.length || 0} nodes, {graph?.edges?.length || 0} edges)
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedType(undefined)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: !selectedType ? '#3b82f6' : '#1e293b',
                  color: !selectedType ? '#fff' : '#94a3b8',
                }}
              >
                ALL
              </button>
              {[GlobalNodeType.ORGANIZATION, GlobalNodeType.AGENT, GlobalNodeType.TALENT, GlobalNodeType.UNIVERSITY, GlobalNodeType.STARTUP].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedType === t ? '#3b82f6' : '#1e293b',
                    color: selectedType === t ? '#fff' : '#94a3b8',
                  }}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Node Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading graph topology...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {graph?.nodes?.map(node => (
                <div
                  key={node.id}
                  onClick={() => selectNode(node)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: selectedNode?.id === node.id ? '#1e293b' : '#0b1120',
                    border: selectedNode?.id === node.id ? '1px solid #38bdf8' : '1px solid #1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', fontWeight: 600 }}>
                      {node.nodeType}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>{node.score}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>{node.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {node.entityId}</div>
                </div>
              ))}
            </div>
          )}

          {/* Node Inspector & Recommendations */}
          {selectedNode && (
            <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: '#38bdf8' }}>
                Node Inspector: {selectedNode.label}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
                <div><strong>Type:</strong> <span style={{ color: '#94a3b8' }}>{selectedNode.nodeType}</span></div>
                <div><strong>Ecosystem Score:</strong> <span style={{ color: '#34d399' }}>{selectedNode.score}/100</span></div>
                <div><strong>Created:</strong> <span style={{ color: '#94a3b8' }}>{new Date(selectedNode.createdAt).toLocaleDateString()}</span></div>
              </div>

              <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 8px 0', color: '#e2e8f0' }}>
                Cross-Network Strategic Recommendations
              </h4>
              {recommendations.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748b' }}>No affinity recommendations found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recommendations.map((rec, i) => (
                    <div key={i} style={{ padding: '10px', background: '#131b2e', border: '1px solid #1e293b', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{rec.label} ({rec.nodeType})</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{rec.reason}</div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>{rec.relevanceScore}% Match</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Global Ecosystem Leaderboard */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            Global Ecosystem Leaderboard
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rankings.map(r => (
              <div key={r.rank} style={{ padding: '12px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: r.rank <= 3 ? '#3b82f6' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {r.rank}
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{r.label}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Top {r.percentile}% percentile</div>
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>{r.ecosystemScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
