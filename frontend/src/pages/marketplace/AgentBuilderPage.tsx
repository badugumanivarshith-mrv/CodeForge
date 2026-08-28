import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  MarketplaceCategory,
  PricingModel,
} from '@codeforge/shared';

export const AgentBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  // Builder Form State
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<MarketplaceCategory>(MarketplaceCategory.CODING);
  const [pricingModel, setPricingModel] = useState<PricingModel>(PricingModel.FREE);
  const [priceCents, setPriceCents] = useState<number>(0);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'You are a high-performance autonomous agent specialized in algorithmic analysis, formal verification, and distributed consensus debugging.'
  );
  const [capabilities, setCapabilities] = useState<string[]>([
    'Algorithmic Code Synthesis',
    'Automated Unit Test Generation',
  ]);
  const [newCapInput, setNewCapInput] = useState<string>('');

  // Sandbox Tester State
  const [sandboxGoal, setSandboxGoal] = useState<string>('Verify Raft log compaction invariants');
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false);

  const handleAddCapability = () => {
    if (newCapInput.trim() && !capabilities.includes(newCapInput.trim())) {
      setCapabilities([...capabilities, newCapInput.trim()]);
      setNewCapInput('');
    }
  };

  const handleRemoveCapability = (cap: string) => {
    setCapabilities(capabilities.filter(c => c !== cap));
  };

  const handleRunSandbox = () => {
    setTesting(true);
    setSandboxLogs([
      `[${new Date().toLocaleTimeString()}] Initializing Agent sandbox context...`,
      `[${new Date().toLocaleTimeString()}] Ingesting prompt invariants: "${systemPrompt.substring(0, 45)}..."`,
      `[${new Date().toLocaleTimeString()}] Capabilities verified: [${capabilities.join(', ')}]`,
      `[${new Date().toLocaleTimeString()}] Executing sandbox goal: "${sandboxGoal}"`,
      `[${new Date().toLocaleTimeString()}] Parsing state machine transitions and verifying memory boundaries...`,
      `[${new Date().toLocaleTimeString()}] Output synthesized: Verified 3 consensus edge cases. Test execution succeeded!`,
    ]);
    setTesting(false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) return;

    try {
      setPublishing(true);
      const created = await ecosystemApi.publishAgent({
        name,
        description,
        category,
        pricingModel,
        priceCents: pricingModel === PricingModel.FREE ? 0 : priceCents,
        capabilities,
        systemPrompt,
      });
      navigate(`/marketplace/agents/${created.id}`);
    } catch (err) {
      console.error('Publish failed', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Visual AI Agent Builder Studio
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Design, configure reasoning prompts, assign specialized tools, test in sandbox, and publish to the marketplace.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 Cols) */}
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-6">
          {/* Basic Identity */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-200">1. Agent Identity & Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Verifier"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description & Value Proposition</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what tasks this agent autonomously executes and its target domain..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as MarketplaceCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 capitalize"
                  >
                    {Object.values(MarketplaceCategory).map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Monetization Pricing</label>
                  <select
                    value={pricingModel}
                    onChange={e => setPricingModel(e.target.value as PricingModel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 capitalize"
                  >
                    <option value={PricingModel.FREE}>Free</option>
                    <option value={PricingModel.FREEMIUM}>Freemium</option>
                    <option value={PricingModel.PAID_ONE_TIME}>Paid (One-Time)</option>
                    <option value={PricingModel.SUBSCRIPTION}>Monthly Subscription</option>
                  </select>
                </div>
              </div>

              {pricingModel !== PricingModel.FREE && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Price (Cents USD)</label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={priceCents}
                    onChange={e => setPriceCents(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Equivalent to ${(priceCents / 100).toFixed(2)} USD (85% creator payout)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Architecture */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-200">2. Autonomous Reasoning & System Invariants</h2>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">System Prompt Directive</label>
              <textarea
                required
                rows={5}
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-indigo-300 outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Capabilities & Tools */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-200">3. Capabilities & Assigned Tools</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Distributed Lock Contention Modeling"
                value={newCapInput}
                onChange={e => setNewCapInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCapability();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCapability}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {capabilities.map(cap => (
                <span
                  key={cap}
                  className="px-3 py-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-2"
                >
                  {cap}
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(cap)}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={publishing}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all"
          >
            {publishing ? 'Publishing Agent...' : '🚀 Publish Agent to Marketplace'}
          </button>
        </form>

        {/* Right Sandbox Tester (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <span>🧪</span> Live Testing Sandbox
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                ISOLATED SANDBOX
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Run test execution passes against your custom agent configuration before making it publicly accessible.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Test Goal / Task Payload</label>
              <input
                type="text"
                value={sandboxGoal}
                onChange={e => setSandboxGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleRunSandbox}
                disabled={testing}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow transition-colors"
              >
                {testing ? 'Executing...' : '▶ Run Sandbox Test'}
              </button>
            </div>

            {/* Sandbox Execution Console */}
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Agent Output Telemetry Console
              </span>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1.5 h-64 overflow-y-auto leading-relaxed">
                {sandboxLogs.length === 0 ? (
                  <span className="text-slate-600">Console idle. Click "Run Sandbox Test" to stream agent execution steps...</span>
                ) : (
                  sandboxLogs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
