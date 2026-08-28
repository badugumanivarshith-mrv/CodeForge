import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  CreatorAnalyticsDto,
} from '@codeforge/shared';

export const CreatorDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<CreatorAnalyticsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [payoutAmount, setPayoutAmount] = useState<string>('50');
  const [requestingPayout, setRequestingPayout] = useState<boolean>(false);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadCreatorStats();
  }, []);

  const loadCreatorStats = async () => {
    try {
      setLoading(true);
      const data = await ecosystemApi.getCreatorAnalytics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load creator analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const cents = Math.round(parseFloat(payoutAmount) * 100);
    if (cents < 5000) return;

    try {
      setRequestingPayout(true);
      await ecosystemApi.requestPayout(cents, 'stripe_connect');
      setPayoutSuccess(true);
      setTimeout(() => setPayoutSuccess(false), 5000);
    } catch (err) {
      console.error('Payout request failed', err);
    } finally {
      setRequestingPayout(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                Creator Studio & Monetization Hub
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Track downloads, subscriptions, gross sales, 85% creator revenue share, and initiate payouts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/marketplace/builder"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow transition-all"
            >
              + Create New Agent
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Earnings</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">${stats.netEarningsUsd.toFixed(2)}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">85% creator revenue share</span>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Downloads</span>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{stats.totalDownloads}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Across agents & plugins</span>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Subscribers</span>
            <p className="text-3xl font-extrabold text-purple-400 mt-2">{stats.activeSubscribers}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Recurring monthly revenue</span>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Payout</span>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">${stats.pendingPayoutUsd.toFixed(2)}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Available for withdrawal</span>
          </div>
        </div>

        {/* Payout Request Section */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-200 text-sm">Request Creator Payout</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Withdraw available funds to your verified Stripe Connect account (Min. $50.00).
            </p>
          </div>

          {payoutSuccess ? (
            <div className="px-4 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-semibold">
              ✓ Payout of ${payoutAmount} requested successfully!
            </div>
          ) : (
            <form onSubmit={handleRequestPayout} className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500">$</span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-200 w-28 outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={requestingPayout}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow transition-colors"
              >
                {requestingPayout ? 'Processing...' : 'Withdraw Funds'}
              </button>
            </form>
          )}
        </div>

        {/* Breakdown & Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Agents */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 text-sm">Top Performing Marketplace Items</h3>
            <div className="divide-y divide-slate-800">
              {stats.topPerformingItems.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.type} • ★ {item.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">${item.revenueUsd.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400">{item.downloads} installs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue History */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 text-sm">Monthly Growth & Trajectory</h3>
            <div className="divide-y divide-slate-800">
              {stats.monthlyRevenueHistory.map((m, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">{m.month}</span>
                  <div className="flex items-center gap-6">
                    <span className="text-slate-400">{m.downloads} downloads</span>
                    <span className="font-bold text-emerald-400 font-mono">${m.amountUsd.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
