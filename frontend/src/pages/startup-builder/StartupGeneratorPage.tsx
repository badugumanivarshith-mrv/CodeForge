import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { StartupDto, StartupIdeaDto, StartupCategory, StartupStage } from '@codeforge/shared';

export const StartupGeneratorPage: React.FC = () => {
  const [ideas, setIdeas] = useState<StartupIdeaDto[]>([]);
  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<StartupCategory>(StartupCategory.AI_DEVTOOLS);
  const [keywords, setKeywords] = useState('autonomous multi-agent, formal AST verification, sub-10ms latency');
  const [targetAudience, setTargetAudience] = useState('Enterprise Engineering Teams');
  const [generating, setGenerating] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<any | null>(null);

  // New Startup Form
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [ideasList, startupsList] = await Promise.all([
        startupBuilderApi.listIdeas(),
        startupBuilderApi.listStartups(),
      ]);
      setIdeas(ideasList);
      setStartups(startupsList);
    } catch (err) {
      console.error('Failed to load startup ideas and startups', err);
    }
  }

  async function handleGenerateIdea(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    try {
      const keywordList = keywords.split(',').map((s) => s.trim()).filter(Boolean);
      const newIdea = await startupBuilderApi.generateIdea({
        category: selectedCategory,
        domainKeywords: keywordList,
        targetAudience,
      });
      setIdeas([newIdea, ...ideas]);
      // Prefill creation form
      setName(newIdea.title);
      setProblemStatement(newIdea.problemStatement);
      setSolutionDescription(newIdea.proposedSolution);
    } catch (err) {
      console.error('Failed to generate startup idea', err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleCreateStartup(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setCreating(true);
    try {
      const newStartup = await startupBuilderApi.createStartup({
        name,
        tagline: tagline || 'Autonomous AI venture created on CodeForge',
        category: selectedCategory,
        stage: StartupStage.IDEATION,
        problemStatement,
        solutionDescription,
        targetMarket: targetAudience,
      });
      setStartups([newStartup, ...startups]);
      setName('');
      setTagline('');
      setProblemStatement('');
      setSolutionDescription('');
    } catch (err) {
      console.error('Failed to create startup', err);
    } finally {
      setCreating(false);
    }
  }

  async function handleViewBlueprint(id: string) {
    try {
      const bp = await startupBuilderApi.getStartupBlueprint(id);
      setSelectedBlueprint(bp);
    } catch (err) {
      console.error('Failed to load blueprint', err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-indigo-900/40 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💡</span>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Autonomous Startup Generator & Blueprint Studio
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Synthesize high-conviction venture opportunities, generate complete Business Model Canvases, and initialize autonomous startups
        </p>
      </div>

      {/* Grid: AI Generator & Startup Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form 1: AI Idea Synthesis */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xl">✨</span>
            <h2 className="font-bold text-slate-200 text-base">AI Opportunity & Problem Discovery</h2>
          </div>
          <form onSubmit={handleGenerateIdea} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Venture Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as StartupCategory)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {Object.values(StartupCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Domain Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              {generating ? 'Synthesizing Opportunity...' : '✨ Generate AI Venture Idea'}
            </button>
          </form>
        </div>

        {/* Form 2: Launch Autonomous Startup */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xl">🚀</span>
            <h2 className="font-bold text-slate-200 text-base">Launch Autonomous Startup Entity</h2>
          </div>
          <form onSubmit={handleCreateStartup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Startup Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AgentForge Studio"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Autonomous AI engineer swarms for formal verification"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Problem Statement
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={2}
                placeholder="Core customer pain point..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Solution Description
              </label>
              <textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                rows={2}
                placeholder="Autonomous solution capability..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              {creating ? 'Initializing Entity...' : '🚀 Launch Startup Entity'}
            </button>
          </form>
        </div>
      </div>

      {/* Blueprint Detail Modal / Drawer if selected */}
      {selectedBlueprint && (
        <div className="p-6 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-6">
          <div className="flex justify-between items-center border-b border-indigo-500/30 pb-4">
            <div>
              <h2 className="text-xl font-black text-indigo-200">{selectedBlueprint.startup.name} — Blueprint Canvas</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedBlueprint.startup.tagline}</p>
            </div>
            <button
              onClick={() => setSelectedBlueprint(null)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Close Canvas ✕
            </button>
          </div>

          {/* Business Model Canvas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-bold text-indigo-400 uppercase mb-2">Key Partners</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {selectedBlueprint.businessModelCanvas.keyPartners.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-bold text-purple-400 uppercase mb-2">Value Propositions</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {selectedBlueprint.businessModelCanvas.valuePropositions.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-bold text-pink-400 uppercase mb-2">Customer Segments</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {selectedBlueprint.businessModelCanvas.customerSegments.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase mb-2">Cost Structure</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {selectedBlueprint.businessModelCanvas.costStructure.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-bold text-emerald-400 uppercase mb-2">Revenue Streams</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {selectedBlueprint.businessModelCanvas.revenueStreams.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Generated Ideas Feed & Active Startups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ideas Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">AI Synthesized Opportunities ({ideas.length})</h2>
          <div className="space-y-3">
            {ideas.map((idea) => (
              <div key={idea.id} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-200">{idea.title}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    Viability: {idea.viabilityScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">{idea.problemStatement}</p>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <span className="font-semibold text-purple-400">Solution: </span>
                  {idea.proposedSolution}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>Market: {idea.marketSizeEstimate}</span>
                  <span>•</span>
                  <span>Moat: {idea.differentiationMoat.slice(0, 45)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Startups List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Active Startups & Blueprints ({startups.length})</h2>
          <div className="space-y-3">
            {startups.map((s) => (
              <div key={s.id} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-200">{s.name}</h3>
                    <p className="text-xs text-slate-400">{s.tagline}</p>
                  </div>
                  <button
                    onClick={() => handleViewBlueprint(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                  >
                    View Blueprint ➔
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">Stage</div>
                    <div className="font-bold text-slate-200">{s.stage}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">Valuation</div>
                    <div className="font-bold text-emerald-400">${(s.valuationUsd / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">Viability</div>
                    <div className="font-bold text-indigo-400">{s.viabilityScore}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
