import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { OrganizationCivilizationDto, OrganizationCivilizationType } from '@codeforge/shared';

export const OrganizationEnginePage: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationCivilizationDto[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationCivilizationDto | null>(null);
  const [workforcePlan, setWorkforcePlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<OrganizationCivilizationType>(OrganizationCivilizationType.ENTERPRISE);
  const [mission, setMission] = useState('');
  const [region, setRegion] = useState('Global-Mesh-North-America');

  useEffect(() => {
    loadOrgs();
  }, []);

  async function loadOrgs() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listOrganizations();
      setOrganizations(list);
      if (list.length > 0) {
        selectOrganization(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function selectOrganization(org: OrganizationCivilizationDto) {
    setSelectedOrg(org);
    try {
      const plan = await enterpriseCivilizationApi.getWorkforcePlan(org.id);
      setWorkforcePlan(plan);
    } catch (err) {
      console.error('Failed to load plan', err);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await enterpriseCivilizationApi.createOrganization({
        name,
        organizationType: orgType,
        missionStatement: mission || 'Autonomous scalable enterprise execution',
        headquartersRegion: region,
      });
      setName('');
      setMission('');
      await loadOrgs();
    } catch (err) {
      console.error('Failed to create organization', err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              AI Organization Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Autonomous Organization Architecture • Department Topologies • Hierarchical Team Coordination
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Organization Creator & List */}
        <div className="space-y-6">
          {/* Creator Box */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-cyan-300 mb-4">Spawn New Autonomous Enterprise</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Enterprise Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Sovereign Dynamics"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Organization Type
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as OrganizationCivilizationType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value={OrganizationCivilizationType.ENTERPRISE}>Autonomous Enterprise</option>
                  <option value={OrganizationCivilizationType.STARTUP}>Autonomous Startup</option>
                  <option value={OrganizationCivilizationType.RESEARCH_LAB}>Autonomous Research Lab</option>
                  <option value={OrganizationCivilizationType.VENTURE_STUDIO}>Autonomous Venture Studio</option>
                  <option value={OrganizationCivilizationType.DAO}>Decentralized Autonomous Org (DAO)</option>
                  <option value={OrganizationCivilizationType.CIVILIZATION_NODE}>Civilization Node</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Mission Statement
                </label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="e.g. Autonomous planetary computing and enterprise intelligence scale-up."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Headquarters Region
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-cyan-600/30"
              >
                {creating ? 'Synthesizing Organization...' : 'Spawn Organization ➔'}
              </button>
            </form>
          </div>

          {/* Org List */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-slate-200 mb-4">Your Active Enterprises</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading organizations...</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => selectOrganization(org)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedOrg?.id === org.id
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-slate-100">{org.name}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                        {org.organizationType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{org.missionStatement}</div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                      <span>{org.totalDepartmentsCount} Departments</span>
                      <span>{org.totalWorkforceHeadcount} Specialists</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Columns: Selected Org Topology & Workforce Planning */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrg ? (
            <>
              {/* Org Details Card */}
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-300">{selectedOrg.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      HQ: {selectedOrg.headquartersRegion} • Status:{' '}
                      <span className="text-emerald-400 font-mono">{selectedOrg.autonomousOperatingStatus}</span>
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-sm">
                    Efficiency Score: {selectedOrg.organizationalEfficiencyScore}%
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                  {selectedOrg.missionStatement}
                </p>

                {/* Sub-KPIs */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Total Departments</div>
                    <div className="text-2xl font-black text-cyan-400 mt-1">{selectedOrg.totalDepartmentsCount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Digital Employees</div>
                    <div className="text-2xl font-black text-teal-400 mt-1">{selectedOrg.totalWorkforceHeadcount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Optimization Level</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">Tier-1 Sovereign</div>
                  </div>
                </div>
              </div>

              {/* Workforce Capacity & Planning Card */}
              {workforcePlan && (
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-slate-200">Autonomous Workforce Capacity Plan</h3>
                    <span className="text-xs font-mono text-cyan-400">
                      Utilization: {workforcePlan.utilizationRate}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Current Headcount</div>
                      <div className="text-2xl font-bold text-cyan-300 mt-1">{workforcePlan.currentHeadcount} Agents</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Optimal Target Capacity</div>
                      <div className="text-2xl font-bold text-emerald-300 mt-1">{workforcePlan.optimalHeadcount} Agents</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Recommended Autonomous Hires
                    </div>
                    <div className="space-y-2">
                      {workforcePlan.recommendedHires?.map((hire: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-sm text-cyan-300">{hire.role}</span>
                            <span className="text-xs text-slate-400 ml-2 font-mono">+{hire.count} headcount</span>
                            <div className="text-xs text-slate-500 mt-0.5">{hire.rationale}</div>
                          </div>
                          <span className="px-2 py-1 rounded bg-amber-950/80 text-amber-300 text-xs font-mono border border-amber-800/40">
                            {hire.urgency}
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
              Select or spawn an autonomous enterprise to view its architectural topology.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
