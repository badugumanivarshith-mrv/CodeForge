import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { DigitalEmployeeDto, DigitalEmployeeRole } from '@codeforge/shared';

export const DigitalWorkforcePage: React.FC = () => {
  const [employees, setEmployees] = useState<DigitalEmployeeDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<DigitalEmployeeRole | 'ALL'>('ALL');
  const [selectedEmp, setSelectedEmp] = useState<DigitalEmployeeDto | null>(null);
  const [performance, setPerformance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);

  // Modal / Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<DigitalEmployeeRole>(DigitalEmployeeRole.AI_ENGINEER);
  const [specialization, setSpecialization] = useState('');
  const [seniority, setSeniority] = useState('Senior Autonomous Agent');

  useEffect(() => {
    loadEmployees();
  }, [selectedRole]);

  async function loadEmployees() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listEmployees({
        role: selectedRole === 'ALL' ? undefined : selectedRole,
      });
      setEmployees(list);
      if (list.length > 0) {
        selectEmployee(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function selectEmployee(emp: DigitalEmployeeDto) {
    setSelectedEmp(emp);
    try {
      const perf = await enterpriseCivilizationApi.getEmployeePerformance(emp.id);
      setPerformance(perf);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleProvision(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setProvisioning(true);
    try {
      await enterpriseCivilizationApi.createEmployee({
        name,
        role,
        seniorityTier: seniority,
        primarySpecialization: specialization || 'Autonomous Software Engineering',
      });
      setName('');
      setSpecialization('');
      await loadEmployees();
    } catch (err) {
      console.error('Failed to provision employee', err);
    } finally {
      setProvisioning(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-teal-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
              Digital Employee System
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Autonomous Workforce Management • Multi-Role AI Specialists • Continuous Performance & Skill Upgrading
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap gap-2">
          {['ALL', ...Object.values(DigitalEmployeeRole)].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === r
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Provisioning & Roster */}
        <div className="space-y-6">
          {/* Provision Form */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-teal-300 mb-4">Provision Digital Employee</h2>
            <form onSubmit={handleProvision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Agent Call-Sign / Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nexus-Architect-Alpha"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Specialist Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as DigitalEmployeeRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                >
                  {Object.values(DigitalEmployeeRole).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Primary Specialization
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Distributed Consensus & ZK Provers"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Seniority Tier
                </label>
                <input
                  type="text"
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={provisioning}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-teal-600/30"
              >
                {provisioning ? 'Provisioning Specialist...' : 'Deploy Specialist ➔'}
              </button>
            </form>
          </div>

          {/* Employee Roster */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-slate-200 mb-4">Active Specialists ({employees.length})</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading workforce...</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => selectEmployee(emp)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedEmp?.id === emp.id
                        ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-slate-100">{emp.name}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-mono border border-teal-800/40">
                        {emp.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{emp.primarySpecialization}</div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                      <span>Status: {emp.status}</span>
                      <span className="text-teal-400 font-mono">Velocity: {emp.velocityScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Columns: Selected Employee Dossier & Performance Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEmp ? (
            <>
              {/* Employee Dossier */}
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-teal-300">{selectedEmp.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Role: <span className="text-teal-400 font-mono">{selectedEmp.role}</span> • Seniority: {selectedEmp.seniorityTier}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-xs font-mono">
                    STATUS: {selectedEmp.status}
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specialization</div>
                  <div className="text-sm font-semibold text-slate-200 mt-1">{selectedEmp.primarySpecialization}</div>
                </div>

                {/* Capabilities Badges */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Autonomous Capabilities</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmp.capabilities?.map((cap, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono"
                      >
                        ⚡ {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Execution Velocity</div>
                    <div className="text-2xl font-black text-teal-400 mt-1">{selectedEmp.velocityScore}%</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Accuracy Score</div>
                    <div className="text-2xl font-black text-cyan-400 mt-1">{selectedEmp.accuracyScore}%</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Tasks Completed</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">{selectedEmp.completedTasksCount}</div>
                  </div>
                </div>
              </div>

              {/* Performance Evaluation Dossier */}
              {performance && (
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-slate-200">Continuous Performance Analysis</h3>
                    <span className="px-3 py-1 rounded bg-teal-950 text-teal-400 border border-teal-800/40 text-xs font-mono">
                      Rating: {performance.performanceRating}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Recommended Upskilling Pathways
                    </div>
                    <div className="space-y-2">
                      {performance.recommendedSkillUpskill?.map((skill: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                        >
                          <span className="text-xs text-slate-300 font-mono">🚀 {skill}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/30">
                            AUTO-ENROLLED
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
              Select or deploy an AI specialist to view their telemetry and dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
