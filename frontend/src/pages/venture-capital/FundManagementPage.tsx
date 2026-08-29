import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { FundDto } from '@codeforge/shared';
import { FundPerformanceWidget } from './widgets/FundPerformanceWidget';

export const FundManagementPage: React.FC = () => {
  const [funds, setFunds] = useState<FundDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFunds() {
      try {
        const data = await ventureCapitalApi.listFunds();
        setFunds(data);
      } catch (err) {
        console.error('Failed to load funds', err);
      } finally {
        setLoading(false);
      }
    }
    loadFunds();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Fund Management Engine...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
              Venture Fund Management System
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Capital calls, deployment velocity, reserve planning, and LP distributions</p>
        </div>

        <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md">
          + Launch New Fund Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FundPerformanceWidget funds={funds} />

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">LP Capital Deployment Schedule</h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span>Capital Call #3 (Q3 2026)</span>
              <span className="font-mono text-emerald-400">$15,000,000 (100% Filled)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span>Capital Call #4 (Q1 2027 Projected)</span>
              <span className="font-mono text-indigo-400">$20,000,000 (Scheduled)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <span>LP Distribution #1 (Harvest Q4 2026)</span>
              <span className="font-mono text-amber-400">$12,000,000 (Secondary Block)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
