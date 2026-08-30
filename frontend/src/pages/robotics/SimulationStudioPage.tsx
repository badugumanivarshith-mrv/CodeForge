import React, { useEffect, useState } from 'react';
import { roboticsApi } from '../../services/roboticsApi';
import { RobotMissionDto, SimulationRunDto } from '@codeforge/shared';

export const SimulationStudioPage: React.FC = () => {
  const [missions, setMissions] = useState<RobotMissionDto[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState('');
  const [simulationName, setSimulationName] = useState('');
  const [runs, setRuns] = useState<SimulationRunDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    roboticsApi.getOverview().then((data) => {
      setMissions(data.recentMissions);
      if (data.recentMissions.length > 0) {
        setSelectedMissionId(data.recentMissions[0].id);
      }
      setRuns(data.recentSimulations);
      setLoading(false);
    });
  }, []);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationName.trim() || !selectedMissionId) return;

    setSimulating(true);
    try {
      const run = await roboticsApi.runSimulation({
        missionId: selectedMissionId,
        simulationName,
      });
      setRuns([run, ...runs]);
      setSimulationName('');
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-400 font-mono">
        <div className="text-xl animate-pulse">Initializing Speculative Physics Sandbox...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulate Physics form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-455 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Simulation Studio
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Launch speculative kinematic path simulation runs to audit spatial collisions warnings before real-world dispatch.
            </p>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Simulation Title</label>
              <input
                type="text"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                placeholder="e.g. UAV Flight spec dialect check"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Target Mission Path</label>
              <select
                value={selectedMissionId}
                onChange={(e) => setSelectedMissionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              >
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.missionName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={simulating}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-rose-500/25 active:scale-[0.98] mt-4"
            >
              {simulating ? 'Auditing kinematics path...' : 'Run Path Simulation'}
            </button>
          </form>
        </div>

        {/* Real-time simulations log output */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Simulation Audits Log</h2>

          {runs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
              <span>No simulation runs executed.</span>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {runs.map((r) => (
                <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono text-slate-500">ID: {r.id.slice(-6)}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                        r.isSuccessful
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                      }`}
                    >
                      {r.isSuccessful ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-300">{r.simulationName}</p>
                  <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-mono">
                    <div>Collisions: {r.collisionWarningsCount}</div>
                    <div>Duration: {r.executionDurationSeconds}s</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
