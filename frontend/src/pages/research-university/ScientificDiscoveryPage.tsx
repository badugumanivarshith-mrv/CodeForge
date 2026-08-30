import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { HypothesisDto, DiscoveryDto, ResearchProgramDto, AcademicDepartment, HypothesisStatus, DiscoverySignificance } from '@codeforge/shared';

export const ScientificDiscoveryPage: React.FC = () => {
  const [programs, setPrograms] = useState<ResearchProgramDto[]>([]);
  const [hypotheses, setHypotheses] = useState<HypothesisDto[]>([]);
  const [discoveries, setDiscoveries] = useState<DiscoveryDto[]>([]);

  // Selected state
  const [activeProgId, setActiveProgId] = useState<string | 'ALL'>('ALL');

  // Form states
  const [statement, setStatement] = useState('');
  const [rationale, setRationale] = useState('');
  const [programId, setProgramId] = useState('');
  const [department, setDepartment] = useState<AcademicDepartment>(AcademicDepartment.ARTIFICIAL_INTELLIGENCE);

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    loadHypothesesAndDiscoveries();
  }, [activeProgId]);

  async function loadBaseData() {
    try {
      const progs = await researchUniversityApi.listPrograms();
      setPrograms(progs);
      if (progs.length > 0) setProgramId(progs[0].id);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadHypothesesAndDiscoveries() {
    try {
      const filterId = activeProgId === 'ALL' ? undefined : activeProgId;
      const hyps = await researchUniversityApi.listHypotheses(filterId);
      const discs = await researchUniversityApi.listDiscoveries(filterId);
      setHypotheses(hyps);
      setDiscoveries(discs);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleFormulateHypothesis(e: React.FormEvent) {
    e.preventDefault();
    if (!statement || !rationale || !programId) return;
    try {
      await researchUniversityApi.formulateHypothesis({
        programId,
        statement,
        rationale,
        department,
      });
      setStatement('');
      setRationale('');
      loadHypothesesAndDiscoveries();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfirmDiscovery(hyp: HypothesisDto) {
    try {
      await researchUniversityApi.confirmDiscovery({
        hypothesisId: hyp.id,
        programId: hyp.programId,
        title: `Empirical Proof: ${hyp.statement.slice(0, 40)}...`,
        summary: `Empirical verification successfully validates "${hyp.statement}" under controlled digital laboratory simulation conditions.`,
        significance: DiscoverySignificance.BREAKTHROUGH,
      });
      loadHypothesesAndDiscoveries();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
          Scientific Discovery & Hypothesis Engine
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Formulate candidate theories, optimize test plan parameters, and confirm empirical breakthroughs.
        </p>
      </div>

      {/* Program filter selector */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveProgId('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeProgId === 'ALL'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            All Programs
          </button>
          {programs.map((prog) => (
            <button
              key={prog.id}
              onClick={() => setActiveProgId(prog.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeProgId === prog.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {prog.name.slice(0, 20)}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Hypotheses and Discoveries lists */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hypotheses */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200">Formulated Hypotheses</h2>
            <div className="space-y-4">
              {hypotheses.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm italic">No hypotheses formulated yet.</div>
              ) : (
                hypotheses.map((hyp) => (
                  <div key={hyp.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{hyp.department.replace('_', ' ')}</span>
                        <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                          hyp.status === HypothesisStatus.VALIDATED
                            ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                            : hyp.status === HypothesisStatus.TESTING
                            ? 'bg-amber-950/80 border border-amber-500/30 text-amber-400'
                            : 'bg-slate-900 border border-slate-800 text-slate-500'
                        }`}>
                          {hyp.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-slate-200 mt-2">"{hyp.statement}"</h3>
                      <p className="text-xs text-slate-400 mt-2 italic">Rationale: {hyp.rationale}</p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-950 font-mono">
                      <span>Novelty Score: {hyp.noveltyScore}%</span>
                      <span>Feasibility Score: {hyp.feasibilityScore}%</span>
                      {hyp.status === HypothesisStatus.FORMULATED && (
                        <button
                          onClick={() => handleConfirmDiscovery(hyp)}
                          className="px-2.5 py-1 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-sans font-bold hover:bg-indigo-600 hover:text-white transition-all text-[9px]"
                        >
                          Confirm Discovery ➔
                        </button>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Discoveries breakthroughs */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200">Confirmed Breakthrough Discoveries</h2>
            <div className="space-y-4">
              {discoveries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm italic">No discoveries logged. Validate hypotheses to compile discoveries.</div>
              ) : (
                discoveries.map((disc) => (
                  <div key={disc.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-purple-500/20 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-sm text-slate-100">{disc.title}</h3>
                        <p className="text-xs text-slate-400 mt-2">{disc.summary}</p>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 uppercase tracking-wider shrink-0">
                        {disc.significance}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-950">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">Empirical Evidence Grid</span>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {disc.empiricalEvidence.map((ev, idx) => (
                          <li key={idx} className="flex gap-2 items-center">
                            <span className="text-purple-400">✓</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Right: Formulation Form */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h3 className="font-bold text-slate-200">Formulate Scientific Theory</h3>
          <form onSubmit={handleFormulateHypothesis} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Parent Program</label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Academic Domain</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as AcademicDepartment)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              >
                {Object.values(AcademicDepartment).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Hypothesis statement</label>
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={3}
                placeholder="Formulate scientific claim..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Epistemic Rationale</label>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                rows={3}
                placeholder="Axiomatic justification or logical mechanism..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-white transition-all text-sm"
            >
              Synthesize Theory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
