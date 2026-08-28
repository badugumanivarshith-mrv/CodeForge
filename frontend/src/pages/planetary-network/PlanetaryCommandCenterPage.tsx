import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { PlanetaryCommandCenterOverviewDto, PlanetaryClusterNodeDto } from '@codeforge/shared';

export const PlanetaryCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<PlanetaryCommandCenterOverviewDto | null>(null);
  const [clusters, setClusters] = useState<PlanetaryClusterNodeDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, clData] = await Promise.all([
          planetaryIntelligenceApi.getCommandCenterOverview(),
          planetaryIntelligenceApi.listClusters(),
        ]);
        setOverview(ovData);
        setClusters(clData);
      } catch (err) {
        console.error('Failed to load planetary command center data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
        Synchronizing with Planetary Intelligence Mesh...
      </div>
    );
  }

  const metrics = overview?.civilizationMetrics;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🪐</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Planetary Intelligence Command Center
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Global Digital Civilization Telemetry, Federation Mesh & Strategic Foresight HUD
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            ● GLOBAL MESH OPERATIONAL
          </span>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Health: <strong className="text-white">{metrics?.civilizationHealthScore ?? 98.5}/100</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-slate-400 text-sm font-medium">Civilization Health</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">
            {metrics?.civilizationHealthScore ?? 98.4}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Tier: {metrics?.healthTier?.toUpperCase()}</div>
          <div className="absolute top-4 right-4 text-2xl opacity-40">🏛️</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-slate-400 text-sm font-medium">Active Planetary Twins</div>
          <div className="text-3xl font-bold text-indigo-400 mt-2">
            {overview?.activePlanetaryTwinsCount ?? 6}
          </div>
          <div className="text-xs text-slate-400 mt-1">Economy, Workforce, Science, Education</div>
          <div className="absolute top-4 right-4 text-2xl opacity-40">🌐</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-slate-400 text-sm font-medium">Agent Federations</div>
          <div className="text-3xl font-bold text-purple-400 mt-2">
            {overview?.activeFederationsCount ?? 14}
          </div>
          <div className="text-xs text-slate-400 mt-1">Cross-organization cooperative meshes</div>
          <div className="absolute top-4 right-4 text-2xl opacity-40">🤖</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="text-slate-400 text-sm font-medium">Research Federations</div>
          <div className="text-3xl font-bold text-cyan-400 mt-2">
            {overview?.activeResearchCollaborationsCount ?? 28}
          </div>
          <div className="text-xs text-slate-400 mt-1">Active verified academic breakthroughs</div>
          <div className="absolute top-4 right-4 text-2xl opacity-40">🔬</div>
        </div>
      </div>

      {/* Multi-Region Intelligence Clusters */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <span>⚡</span>
          <span>Multi-Region Planetary Clusters</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusters.map((c) => (
            <div key={c.id} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{c.clusterName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {c.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">Region: {c.region}</div>
              <div className="flex justify-between text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <span>Agents: {c.activeAgentsCount}</span>
                <span>Workforce: {c.workforceCount}</span>
                <span>Latency: {c.syncLatencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Civilization Opportunities & Systemic Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <span>🚀</span>
            <span>Global Innovation Opportunities</span>
          </h3>
          <div className="space-y-3">
            {overview?.topOpportunities?.map((opp) => (
              <div key={opp.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-indigo-300">{opp.title}</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                    Impact: +{opp.projectedGdpImpactScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{opp.description}</p>
                <div className="mt-2 text-xs text-slate-500">
                  Domain: {opp.domain} • Feasibility: {opp.feasibilityScore}% • Horizon: {opp.readinessTimeMonths} mo
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <span>🛡️</span>
            <span>Systemic Risk Intelligence</span>
          </h3>
          <div className="space-y-3">
            {overview?.systemicRisks?.map((risk) => (
              <div key={risk.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-amber-300">{risk.riskName}</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    Severity: {risk.severity?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Mitigation: {risk.mitigationStrategy}</p>
                <div className="mt-2 text-xs text-slate-500">
                  Probability: {(risk.probability * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
