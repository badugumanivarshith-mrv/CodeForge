import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { LaboratoryDto, ExperimentDto, AcademicDepartment, LabType } from '@codeforge/shared';

export const DigitalLaboratoriesPage: React.FC = () => {
  const [labs, setLabs] = useState<LaboratoryDto[]>([]);
  const [experiments, setExperiments] = useState<ExperimentDto[]>([]);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);

  // Simulation execution state
  const [title, setTitle] = useState('');
  const [datasetRef, setDatasetRef] = useState('');
  const [loadingSim, setLoadingSim] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Provision new laboratory state
  const [name, setName] = useState('');
  const [labType, setLabType] = useState<LabType>(LabType.AI_RESEARCH_LAB);
  const [dept, setDept] = useState<AcademicDepartment>(AcademicDepartment.ARTIFICIAL_INTELLIGENCE);
  const [compute, setCompute] = useState(10000);

  useEffect(() => {
    loadLaboratories();
  }, []);

  useEffect(() => {
    if (activeLabId) {
      loadExperiments(activeLabId);
    }
  }, [activeLabId]);

  async function loadLaboratories() {
    try {
      const data = await researchUniversityApi.listLaboratories();
      setLabs(data);
      if (data.length > 0 && !activeLabId) {
        setActiveLabId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadExperiments(id: string) {
    try {
      const data = await researchUniversityApi.listExperiments(id);
      setExperiments(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleProvisionLab(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    try {
      await researchUniversityApi.provisionLaboratory({
        name,
        labType,
        department: dept,
        computeCapacityTeraflops: compute,
      });
      setName('');
      loadLaboratories();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRunSimulation(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !datasetRef || !activeLabId) return;
    setLoadingSim(true);
    setSimLogs([
      '[INIT] Initializing compute nodes...',
      '[LOAD] Mount virtual dataset references...',
      '[EXEC] Calculating continuous tensor renormalization coefficients...',
    ]);

    try {
      // Simulate real-time logs
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSimLogs((prev) => [...prev, '[COMPUTE] Running Hamiltonian projection operator loops...']);

      await new Promise((resolve) => setTimeout(resolve, 800));
      setSimLogs((prev) => [...prev, '[COMPUTE] Truncating non-entangled subspace nodes...']);

      const exp = await researchUniversityApi.runExperiment({
        labId: activeLabId,
        hypothesisId: 'hyp-neuro-symbolic-01',
        title,
        datasetRef,
        parameters: { stepSize: 0.001, iterations: 1000000 },
      });

      setSimLogs((prev) => [
        ...prev,
        `[SUCCESS] Simulation completed in ${exp.executionDurationMs}ms`,
        `[METRICS] Reproducibility index: ${exp.reproducibilityScore}%`,
        '[DONE] Output tensor arrays finalized.',
      ]);

      setTitle('');
      setDatasetRef('');
      loadExperiments(activeLabId);
    } catch (err) {
      console.error(err);
      setSimLogs((prev) => [...prev, '[ERROR] Simulation execution failed.']);
    } finally {
      setLoadingSim(false);
    }
  }

  const activeLab = labs.find((l) => l.id === activeLabId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
          Digital Laboratories & Virtual HPC Clusters
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Orchestrate continuous numerical simulations, monitor compute nodes utilization, and run automated sweep parameters.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Labs list */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Laboratory Clusters</h2>
          <div className="space-y-3">
            {labs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => setActiveLabId(lab.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeLabId === lab.id
                    ? 'bg-slate-900 border-indigo-500/50'
                    : 'bg-slate-900/40 border-slate-950 hover:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{lab.name}</h3>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-3">
                  <span>{lab.computeCapacityTeraflops.toLocaleString()} TFLOPS</span>
                  <span>{lab.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Provision Form */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-3">
            <h3 className="font-semibold text-xs text-slate-200">Provision Virtual Lab</h3>
            <form onSubmit={handleProvisionLab} className="space-y-3 text-[10px] text-slate-400 font-semibold">
              <div className="space-y-1">
                <label className="uppercase">Lab Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Quantum Lattice Cluster"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="uppercase">Type</label>
                  <select
                    value={labType}
                    onChange={(e) => setLabType(e.target.value as LabType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 outline-none focus:border-indigo-500 text-xs"
                  >
                    {Object.values(LabType).map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Dept</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value as AcademicDepartment)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 outline-none focus:border-indigo-500 text-xs"
                  >
                    {Object.values(AcademicDepartment).map((d) => (
                      <option key={d} value={d}>
                        {d.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Compute</label>
                  <input
                    type="number"
                    value={compute}
                    onChange={(e) => setCompute(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all mt-1"
              >
                Provision Cluster
              </button>
            </form>
          </div>
        </div>

        {/* Center/Right: Execution and Experiment Telemetry */}
        <div className="lg:col-span-3 space-y-6">
          {activeLab ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Telemetry info & simulation runner */}
              <div className="lg:col-span-2 space-y-6">
                {/* Lab Telemetry Info */}
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                        {activeLab.labType.replace('_', ' ')}
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-100 mt-1">{activeLab.name}</h2>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-slate-500">Director Agent</span>
                      <span className="text-xs font-mono font-bold text-slate-300">{activeLab.directorAgent}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-slate-800 mt-6 pt-4 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Total Compute</span>
                      <span className="text-sm font-extrabold text-indigo-400 mt-0.5 block">
                        {activeLab.computeCapacityTeraflops.toLocaleString()} TFLOPS
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Active Runs</span>
                      <span className="text-sm font-extrabold text-purple-400 mt-0.5 block">
                        {activeLab.activeSimulationsCount} Simulations
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Datasets Mounted</span>
                      <span className="text-sm font-extrabold text-amber-400 mt-0.5 block">
                        {activeLab.datasetsMountedCount} Datasets
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulation runner form */}
                <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 space-y-4">
                  <h3 className="font-bold text-slate-200">Execute High-Throughput Simulation Sweep</h3>
                  <form onSubmit={handleRunSimulation} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold uppercase">Simulation Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Lattice Renormalization Sweep"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold uppercase">Mount Dataset Ref</label>
                      <input
                        type="text"
                        value={datasetRef}
                        onChange={(e) => setDatasetRef(e.target.value)}
                        placeholder="e.g., benchmark-lattices-v3"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={loadingSim}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all disabled:opacity-50"
                      >
                        {loadingSim ? 'Computing Trace...' : 'Run Simulation Sweep ➔'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Simulation Output Logs Console */}
                {simLogs.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-[10px] space-y-1 h-44 overflow-y-auto shadow-inner text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase mb-2 border-b border-slate-900 pb-1">Simulation Stream Logs</span>
                    {simLogs.map((log, idx) => (
                      <div key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400' : log.includes('[ERROR]') ? 'text-red-400' : ''}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar: Recent Completed Experiments list */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-4 h-fit">
                <h3 className="font-bold text-xs text-slate-200">Completed Experiment Traces</h3>
                <div className="space-y-3">
                  {experiments.map((exp) => (
                    <div key={exp.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-xs text-slate-200 line-clamp-1">{exp.title}</h4>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2 pt-1.5 border-t border-slate-900">
                        <span>Score: {exp.reproducibilityScore}%</span>
                        <span>{exp.executionDurationMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500">No operational virtual laboratories available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
