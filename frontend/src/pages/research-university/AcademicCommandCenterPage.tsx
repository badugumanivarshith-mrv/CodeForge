import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCommandCenterOverviewDto } from '@codeforge/shared';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { ResearchImpactChart } from './widgets/ResearchImpactChart';
import { LabComputeUtilizationWidget } from './widgets/LabComputeUtilizationWidget';
import { DiscoveryBreakthroughRadar } from './widgets/DiscoveryBreakthroughRadar';

export const AcademicCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<AcademicCommandCenterOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await researchUniversityApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load Academic Command Center overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Academic Command Center & Research Intelligence OS...</div>;
  }

  const defaultOverview = overview || {
    universityName: 'CodeForge Autonomous Research University & Academy of Sciences',
    motto: 'Veritas per Superintelligentiam • Discovery Through Autonomous Reason',
    totalResearchProgramsCount: 0,
    activeDigitalLabsCount: 0,
    peerReviewedPapersCount: 0,
    totalCitationsCount: 0,
    cumulativeGrantFundingUsd: 0,
    globalKnowledgeNodesCount: 0,
    averageReproducibilityIndex: 0,
    topPrograms: [],
    recentDiscoveries: [],
    recentPublications: [],
    activeLabs: [],
    openGrants: []
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Academic Command Center
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {defaultOverview.universityName} • <span className="italic text-slate-500">{defaultOverview.motto}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-sm">
            Avg Reproducibility: {defaultOverview.averageReproducibilityIndex}%
          </div>
          <Link
            to="/research-programs"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            Propose Program ➔
          </Link>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Research Programs', path: '/research-programs', icon: '🧬' },
          { label: 'Hypothesis Synthesizer', path: '/scientific-discovery', icon: '💡' },
          { label: 'Digital Laboratories', path: '/digital-labs', icon: '🖥️' },
          { label: 'Publications Engine', path: '/publications-engine', icon: '📚' },
          { label: 'Peer Review Network', path: '/peer-review-network', icon: '⚖️' },
          { label: 'Grant Marketplace', path: '/grant-marketplace', icon: '🪙' },
          { label: 'Knowledge Graph Civilization', path: '/knowledge-graph', icon: '🌐' },
          { label: 'Global Collaboration', path: '/global-collaboration', icon: '🤝' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Research Programs</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            {defaultOverview.totalResearchProgramsCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across 8 Academic Disciplines</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-purple-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Digital Labs</div>
          <div className="text-3xl font-black text-purple-400 mt-2">
            {defaultOverview.activeDigitalLabsCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">High-Throughput HPC Clusters</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-amber-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Peer-Reviewed Papers</div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {defaultOverview.peerReviewedPapersCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">{defaultOverview.totalCitationsCount} Cumulative Citations</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Secured Funding</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            ${(defaultOverview.cumulativeGrantFundingUsd / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">Sourced from Global Grant Pools</div>
        </div>
      </div>

      {/* Main Charts / Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-slate-200">University Research Activity & Citations Trajectory</h2>
          <ResearchImpactChart />
        </div>

        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Discovery Novelty & Reproducibility Matrix</h2>
          <DiscoveryBreakthroughRadar discoveries={defaultOverview.recentDiscoveries} />
        </div>
      </div>

      {/* Labs & Active Research Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lab Compute Utilization */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200">Digital Lab Utilization Telemetry</h2>
            <Link to="/digital-labs" className="text-xs text-indigo-400 hover:text-indigo-300">View All Labs ➔</Link>
          </div>
          <div className="space-y-4">
            {defaultOverview.activeLabs.map((lab) => (
              <LabComputeUtilizationWidget key={lab.id} lab={lab} />
            ))}
          </div>
        </div>

        {/* Recent Discoveries & Breakthroughs */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200">Recent Breakthrough Discoveries</h2>
            <Link to="/scientific-discovery" className="text-xs text-indigo-400 hover:text-indigo-300">Hypothesis Board ➔</Link>
          </div>
          <div className="space-y-3">
            {defaultOverview.recentDiscoveries.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No discoveries logged. Run simulations to confirm discoveries.</div>
            ) : (
              defaultOverview.recentDiscoveries.map((disc) => (
                <div key={disc.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-purple-500/20 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-sm text-slate-100">{disc.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 uppercase tracking-wider font-mono">
                      {disc.significance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{disc.summary}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
                    <span>Novelty: {disc.noveltyScore}%</span>
                    <span>Reproducibility: {disc.reproducibilityIndex}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Publications & Open Grants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Publications */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200">Recent Publications & Pre-prints</h2>
            <Link to="/publications-engine" className="text-xs text-indigo-400 hover:text-indigo-300">Library Catalog ➔</Link>
          </div>
          <div className="space-y-3">
            {defaultOverview.recentPublications.map((pub) => (
              <div key={pub.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-100 line-clamp-1">{pub.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pub.abstract}</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-3 border-t border-slate-900 pt-2 font-mono">
                  <span>Authors: {pub.authors.slice(0, 2).join(', ')}</span>
                  <span>Citations: {pub.citationCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funding Opportunities */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200">Funding Opportunities Marketplace</h2>
            <Link to="/grant-marketplace" className="text-xs text-indigo-400 hover:text-indigo-300">Grant Intelligence ➔</Link>
          </div>
          <div className="space-y-3">
            {defaultOverview.openGrants.map((grant) => (
              <div key={grant.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-emerald-500/20 transition-all flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-slate-100">{grant.grantTitle}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                      Award Limit: ${(grant.maximumAwardUsd / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-850">
                      Deadline: {new Date(grant.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 italic uppercase tracking-wider">{grant.fundingAgency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
