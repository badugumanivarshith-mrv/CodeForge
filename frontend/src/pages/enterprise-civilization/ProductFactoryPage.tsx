import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { ProductPortfolioDto } from '@codeforge/shared';

export const ProductFactoryPage: React.FC = () => {
  const [products, setProducts] = useState<ProductPortfolioDto[]>([]);
  const [selectedProd, setSelectedProd] = useState<ProductPortfolioDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [diff, setDiff] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listProducts();
      setProducts(list);
      if (list.length > 0) {
        setSelectedProd(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await enterpriseCivilizationApi.createProduct({
        productName: name,
        targetPersona: persona || 'Global Engineering & Product Teams',
        coreDifferentiator: diff || 'Autonomous AI Execution Pipeline & Multi-Agent Swarms',
      });
      setName('');
      setPersona('');
      setDiff('');
      await loadProducts();
    } catch (err) {
      console.error('Failed to create product', err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Autonomous Product Factory
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Automated Product Discovery • Roadmap Synthesis • Telemetry Health Scoring & Lifecycle Advancement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Discovery Form & Products List */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-purple-300 mb-4">Discover Product Opportunity</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CodeForge Cognitive Compiler"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Target Persona
                </label>
                <input
                  type="text"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder="e.g. Distributed Systems Architects"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Core Differentiator
                </label>
                <textarea
                  value={diff}
                  onChange={(e) => setDiff(e.target.value)}
                  placeholder="e.g. 100x compilation speedup using dialectic AST proofs."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-purple-600/30"
              >
                {creating ? 'Synthesizing Opportunity...' : 'Discover & Launch ➔'}
              </button>
            </form>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-slate-200 mb-4">Product Portfolios ({products.length})</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading products...</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProd(prod)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedProd?.id === prod.id
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-slate-100">{prod.productName}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono border border-purple-800/40">
                        {prod.lifecycleStage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{prod.coreDifferentiator}</div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                      <span>MAU: {prod.monthlyActiveUsersEstimate.toLocaleString()}</span>
                      <span className="text-purple-400 font-mono">Health: {prod.productHealthScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center & Right: Selected Product Details & Features Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProd ? (
            <>
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-300">{selectedProd.productName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Persona: <span className="text-purple-300 font-semibold">{selectedProd.targetPersona}</span>
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800/50 text-xs font-mono">
                    STAGE: {selectedProd.lifecycleStage}
                  </div>
                </div>

                <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                  {selectedProd.coreDifferentiator}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Monthly Active Users</div>
                    <div className="text-2xl font-black text-purple-400 mt-1">
                      {selectedProd.monthlyActiveUsersEstimate.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Product Health Score</div>
                    <div className="text-2xl font-black text-pink-400 mt-1">{selectedProd.productHealthScore}%</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Roadmap Velocity</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">100% On-Track</div>
                  </div>
                </div>
              </div>

              {/* Automated Features Roadmap */}
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                <h3 className="font-bold text-base text-slate-200">Autonomous Features Roadmap</h3>
                <div className="space-y-3">
                  {selectedProd.featuresRoadmap?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-200">{item.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Target: {item.releaseTarget}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 font-mono text-xs border border-purple-800/40">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
              Select or discover a product to view telemetry and roadmap specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
