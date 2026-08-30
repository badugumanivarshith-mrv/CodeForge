import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { GrantDto, ResearchProgramDto, AcademicDepartment, GrantType, GrantStatus } from '@codeforge/shared';

export const ResearchFundingPage: React.FC = () => {
  const [grants, setGrants] = useState<GrantDto[]>([]);
  const [programs, setPrograms] = useState<ResearchProgramDto[]>([]);
  const [selectedDept, setSelectedDept] = useState<AcademicDepartment | 'ALL'>('ALL');

  // Register grant pool state
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState('');
  const [grantType, setGrantType] = useState<GrantType>(GrantType.GOVERNMENT_GRANT);
  const [poolSize, setPoolSize] = useState(5000000);
  const [maxAward, setMaxAward] = useState(1000000);

  useEffect(() => {
    loadGrants();
    loadPrograms();
  }, [selectedDept]);

  async function loadGrants() {
    try {
      const deptFilter = selectedDept === 'ALL' ? undefined : selectedDept;
      const data = await researchUniversityApi.listGrants(deptFilter);
      setGrants(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadPrograms() {
    try {
      const data = await researchUniversityApi.listPrograms();
      setPrograms(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRegisterGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !agency) return;
    try {
      await researchUniversityApi.registerGrant({
        grantTitle: title,
        grantType,
        fundingAgency: agency,
        totalPoolUsd: poolSize,
        maximumAwardUsd: maxAward,
        eligibilityCriteria: ['Demonstrated reproducible index > 95%'],
        matchingDepartments: [AcademicDepartment.ARTIFICIAL_INTELLIGENCE],
      });
      setTitle('');
      setAgency('');
      setShowRegisterForm(false);
      loadGrants();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleApplyForGrant(grantId: string, programId: string) {
    try {
      await researchUniversityApi.applyForGrant(grantId, programId);
      loadGrants();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAwardGrant(grantId: string, awardAmountUsd: number) {
    try {
      await researchUniversityApi.awardGrant(grantId, awardAmountUsd);
      loadGrants();
      loadPrograms(); // Reload program budgets
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
            Research Funding & Grant Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Discover competitive global grant pools, verify eligibility thresholds, and award funds to autonomous programs.
          </p>
        </div>
        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="px-4 py-2 rounded-lg bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-sm font-semibold transition-all"
        >
          {showRegisterForm ? 'Close Pool Workspace' : '+ Register Funding Agency'}
        </button>
      </div>

      {/* Filter by Department */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-900 pb-4">
        <button
          onClick={() => setSelectedDept('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedDept === 'ALL'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          ALL MATCHING DEPARTMENTS
        </button>
        {Object.values(AcademicDepartment).map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all uppercase ${
              selectedDept === dept
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {dept.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Show register form */}
      {showRegisterForm && (
        <form onSubmit={handleRegisterGrant} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-200">Register Global Funding Agency Pool</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Grant Pool Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Quantum Computing Frontier Pool"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Funding Agency</label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="e.g., Planetary Science Council"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Grant Type</label>
              <select
                value={grantType}
                onChange={(e) => setGrantType(e.target.value as GrantType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              >
                {Object.values(GrantType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Total Pool Size ($ USD)</label>
              <input
                type="number"
                value={poolSize}
                onChange={(e) => setPoolSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Max Award Size ($ USD)</label>
              <input
                type="number"
                value={maxAward}
                onChange={(e) => setMaxAward(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-white transition-all text-sm"
          >
            Register Pool
          </button>
        </form>
      )}

      {/* Main Grid: Grants marketplace list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grants.map((grant) => (
          <div key={grant.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-emerald-500/20 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{grant.grantType.replace('_', ' ')}</span>
                <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                  grant.status === GrantStatus.AWARDED
                    ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                    : grant.status === GrantStatus.APPLIED
                    ? 'bg-amber-950 border border-amber-500/30 text-amber-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}>
                  {grant.status}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100">{grant.grantTitle}</h3>
              <p className="text-xs text-slate-400">Funding Agency: <span className="font-semibold">{grant.fundingAgency}</span></p>
            </div>

            {/* Match departments */}
            <div className="flex flex-wrap gap-1">
              {grant.matchingDepartments.map((d) => (
                <span key={d} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 uppercase">
                  {d.replace('_', ' ')}
                </span>
              ))}
            </div>

            {/* Budget specifications */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-950 pt-3 text-[10px] font-mono text-slate-500">
              <div>
                <span>Total Grant Pool</span>
                <span className="block text-slate-300 font-bold mt-0.5">${grant.totalPoolUsd.toLocaleString()}</span>
              </div>
              <div>
                <span>Maximum Award</span>
                <span className="block text-slate-300 font-bold mt-0.5">${grant.maximumAwardUsd.toLocaleString()}</span>
              </div>
            </div>

            {/* Application controllers */}
            {grant.status === GrantStatus.OPEN && programs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-950">
                <label className="text-[9px] text-slate-400 font-bold block uppercase">Select Program to Apply</label>
                <div className="flex gap-1.5">
                  <select
                    id={`apply-prog-select-${grant.id}`}
                    className="bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none w-full"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name.slice(0, 25)}...
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById(`apply-prog-select-${grant.id}`) as HTMLSelectElement;
                      if (sel) handleApplyForGrant(grant.id, sel.value);
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-bold text-[9px] text-white transition-all shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {grant.status === GrantStatus.APPLIED && (
              <div className="pt-2 border-t border-slate-950 flex gap-2">
                <button
                  onClick={() => handleAwardGrant(grant.id, grant.maximumAwardUsd)}
                  className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-[10px] text-white transition-all text-center"
                >
                  Disburse Award ➔
                </button>
              </div>
            )}

            {grant.status === GrantStatus.AWARDED && grant.awardedAmountUsd && (
              <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/30 text-[10px] font-mono text-emerald-400 flex justify-between">
                <span>Awarded Amount:</span>
                <span className="font-bold">${grant.awardedAmountUsd.toLocaleString()}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
