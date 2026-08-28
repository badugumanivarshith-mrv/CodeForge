import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  MarketplaceAgentDto,
  AgentReviewDto,
  PricingModel,
} from '@codeforge/shared';

export const AgentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<MarketplaceAgentDto | null>(null);
  const [reviews, setReviews] = useState<AgentReviewDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [installed, setInstalled] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(false);

  // Review Form state
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      loadAgentDetails(id);
    }
  }, [id]);

  const loadAgentDetails = async (agentId: string) => {
    try {
      setLoading(true);
      const [agentData, reviewsData] = await Promise.all([
        ecosystemApi.getAgentById(agentId),
        ecosystemApi.listReviews(agentId),
      ]);
      setAgent(agentData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Failed to load agent details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!agent) return;
    try {
      await ecosystemApi.downloadAgent(agent.id);
      setInstalled(true);
      setAgent(prev => prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null);
    } catch (err) {
      console.error('Install failed', err);
    }
  };

  const handlePurchase = async () => {
    if (!agent) return;
    try {
      await ecosystemApi.purchaseAgent(agent.id, agent.priceCents);
      setPurchased(true);
      setInstalled(true);
    } catch (err) {
      console.error('Purchase failed', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !reviewText.trim()) return;
    try {
      setSubmittingReview(true);
      const newReview = await ecosystemApi.submitReview({
        agentId: agent.id,
        rating,
        reviewText,
      });
      setReviews([newReview, ...reviews]);
      setReviewText('');
    } catch (err) {
      console.error('Submit review failed', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-10 text-center">
        <h2 className="text-2xl font-bold">Agent Not Found</h2>
        <Link to="/marketplace" className="mt-4 inline-block text-indigo-400 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/marketplace" className="hover:text-slate-200">
            Marketplace
          </Link>
          <span>/</span>
          <span className="capitalize">{agent.category}</span>
          <span>/</span>
          <span className="text-slate-200 font-medium">{agent.name}</span>
        </div>

        {/* Hero Card */}
        <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-semibold uppercase">
                  {agent.category}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded text-xs font-mono">
                  {agent.verificationStatus}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">{agent.name}</h1>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{agent.description}</p>
              <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  ★ {agent.ratingAverage.toFixed(1)} ({agent.ratingCount} reviews)
                </span>
                <span>📥 {agent.downloadCount} installations</span>
                <span>📅 Updated: {new Date(agent.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Price & Action Box */}
            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl w-full md:w-72 text-center space-y-4 shadow-xl">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Price</span>
                <span className="text-3xl font-extrabold text-white">
                  {agent.pricingModel === PricingModel.FREE
                    ? 'Free'
                    : `$${(agent.priceCents / 100).toFixed(2)}`}
                </span>
              </div>

              {agent.pricingModel === PricingModel.FREE ? (
                <button
                  onClick={handleInstall}
                  disabled={installed}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                    installed
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {installed ? '✓ Added to Command Center' : 'Install Agent'}
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchased}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                    purchased
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white'
                  }`}
                >
                  {purchased ? '✓ Purchased & Installed' : `Buy Now for $${(agent.priceCents / 100).toFixed(2)}`}
                </button>
              )}

              <p className="text-[11px] text-slate-500">
                Instantly accessible in your Personal AI Command Center.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Core Capabilities */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>⚡</span> Core Agent Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agent.capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-medium text-slate-200">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Prompt & Reasoning Architecture */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>🧠</span> Autonomous System Prompt & Invariants
              </h2>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 leading-relaxed whitespace-pre-wrap">
                {agent.systemPrompt}
              </div>
            </div>

            {/* Customer Reviews & Form */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-6">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>💬</span> Verified User Reviews ({reviews.length})
              </h2>

              {/* Review Submission Box */}
              <form onSubmit={handleSubmitReview} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Rate this agent:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-lg ${star <= rating ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Share your experience using this agent in production or career workflows..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={submittingReview || !reviewText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No reviews yet. Be the first to leave feedback!</p>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-200">
                          {r.username || 'Verified Engineer'}
                        </span>
                        <span className="text-amber-400">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-xs text-slate-300">{r.reviewText}</p>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <h3 className="font-bold text-slate-200 text-sm">Agent Specifications</h3>
              <div className="space-y-3 divide-y divide-slate-800">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Pricing Model</span>
                  <span className="font-semibold text-slate-200 capitalize">{agent.pricingModel}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold text-slate-200 capitalize">{agent.category}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Enterprise Ready</span>
                  <span className="font-semibold text-emerald-400">Yes (SOC2 Verified)</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Memory Scope</span>
                  <span className="font-semibold text-indigo-400">Multi-Horizon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
