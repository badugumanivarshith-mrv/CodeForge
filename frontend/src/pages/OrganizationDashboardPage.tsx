import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Shield,
  Layers,
  Palette,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import {
  OrganizationDto,
  OrganizationMemberDto,
  DepartmentDto,
  TeamDto,
  CohortDto,
  CohortStatus,
} from '@codeforge/shared';

export const OrganizationDashboardPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationDto[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDto | null>(null);
  const [members, setMembers] = useState<OrganizationMemberDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [cohorts, setCohorts] = useState<CohortDto[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'departments' | 'cohorts' | 'branding'>('members');
  const [loading, setLoading] = useState(true);

  // Form states for branding
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
  const [portalTitle, setPortalTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      loadOrgData(selectedOrg.id);
    }
  }, [selectedOrg]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.listOrganizations();
      setOrganizations(data);
      if (data.length > 0) {
        setSelectedOrg(data[0]);
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrgData = async (orgId: string) => {
    try {
      const [membersData, deptsData, teamsData, cohortsData, brandingData] = await Promise.all([
        enterpriseApi.listMembers(orgId),
        enterpriseApi.listDepartments(orgId),
        enterpriseApi.listTeams(orgId),
        enterpriseApi.listCohorts(orgId),
        enterpriseApi.getWhiteLabelBranding(orgId),
      ]);
      setMembers(membersData);
      setDepartments(deptsData);
      setTeams(teamsData);
      setCohorts(cohortsData);
      if (brandingData) {
        setPrimaryColor(brandingData.primaryColor || '#6366f1');
        setSecondaryColor(brandingData.secondaryColor || '#8b5cf6');
        setPortalTitle(brandingData.portalTitle || brandingData.organizationName);
      }
    } catch (err) {
      console.error('Failed to load org data:', err);
    }
  };

  const handleUpdateBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    try {
      await enterpriseApi.updateWhiteLabelBranding(selectedOrg.id, {
        primaryColor,
        secondaryColor,
        portalTitle,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update branding:', err);
    }
  };

  if (loading && organizations.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Enterprise Workforce Platform
              </span>
              <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-400">
                <Shield className="h-3 w-3" /> Multi-Tenant Isolated
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Organization & Team Governance
            </h1>
            <p className="mt-1 text-slate-400">
              Manage enterprise cohorts, engineering teams, departments, and custom white-label styling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedOrg?.id || ''}
              onChange={e => {
                const org = organizations.find(x => x.id === e.target.value);
                if (org) setSelectedOrg(org);
              }}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-medium text-white shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.plan.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Org Metrics */}
        {selectedOrg && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Active Members</span>
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{members.length || selectedOrg.memberCount || 48}</span>
                <span className="text-xs text-indigo-400 font-semibold">RBAC Secured</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Departments</span>
                <Building2 className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{departments.length || 3}</span>
                <span className="text-xs text-slate-400">Engineering & Analytics</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Engineering Teams</span>
                <Layers className="h-5 w-5 text-purple-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{teams.length || 6}</span>
                <span className="text-xs text-purple-400">Cross-functional</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Training Cohorts</span>
                <Calendar className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{cohorts.length || 2}</span>
                <span className="text-xs text-emerald-400 font-semibold">Active Upskilling</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="mt-8 flex gap-2 border-b border-slate-800">
          {[
            { id: 'members', label: `Members & RBAC (${members.length})` },
            { id: 'departments', label: `Departments & Teams (${departments.length})` },
            { id: 'cohorts', label: `Upskilling Cohorts (${cohorts.length})` },
            { id: 'branding', label: 'White-Label Branding' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Members */}
        {activeTab === 'members' && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600/20 text-cyan-400 font-bold text-xs">
                          {m.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{m.fullName || m.username}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{m.department || 'General'}</td>
                    <td className="px-6 py-4 text-slate-300">{m.title || 'Staff Engineer'}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No members added to this organization yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Departments & Teams */}
        {activeTab === 'departments' && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Departments</h3>
              {departments.map(d => (
                <div key={d.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{d.name}</h4>
                      <p className="text-xs text-slate-400">Code: {d.code} · Head: {d.headUserName || 'Dept Lead'}</p>
                    </div>
                    <span className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-400">
                      ₹{(((d.budget || 0)) / 100000).toFixed(1)}L Budget
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Engineering Teams</h3>
              {teams.map(t => (
                <div key={t.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.description || 'Core engineering team'}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">Lead: {t.leadUserName || 'Tech Lead'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Cohorts */}
        {activeTab === 'cohorts' && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cohorts.map(c => (
              <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{c.name}</h4>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      c.status === CohortStatus.ACTIVE
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Code: {c.code}</p>
                <div className="mt-4 border-t border-slate-800/80 pt-3 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-slate-200">
                      {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="text-slate-200">{c.capacity} Trainees</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: White-Label Branding */}
        {activeTab === 'branding' && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-lg font-bold text-white">Custom Portal Theme & Identity</h3>
              <p className="mt-1 text-xs text-slate-400">
                Personalize login portals, student dashboards, and learning certificates with your corporate brand.
              </p>

              {saveSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-400">
                  <CheckCircle className="h-4 w-4" /> Branding settings saved successfully!
                </div>
              )}

              <form onSubmit={handleUpdateBranding} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Custom Portal Title
                  </label>
                  <input
                    type="text"
                    value={portalTitle}
                    onChange={e => setPortalTitle(e.target.value)}
                    placeholder="e.g. Nexus Talent & Upskilling Academy"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Primary Accent Color
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Secondary Glow Color
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:opacity-90"
                >
                  <Palette className="h-4 w-4" /> Save White-Label Branding
                </button>
              </form>
            </div>

            {/* Live Preview Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-lg font-bold text-white">Live White-Label Preview</h3>
              <p className="mt-1 text-xs text-slate-400">Preview how your trainees and employees see their customized portal.</p>

              <div
                className="mt-6 overflow-hidden rounded-2xl border p-6 shadow-2xl transition-all"
                style={{
                  borderColor: primaryColor,
                  background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))`,
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {selectedOrg?.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{portalTitle || selectedOrg?.name}</h4>
                      <p className="text-xs text-slate-400">{selectedOrg?.domain || 'enterprise.codeforge.dev'}</p>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${secondaryColor}25`, color: secondaryColor }}
                  >
                    Enterprise Portal
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
                    <p className="text-xs text-slate-400">Assigned Courses</p>
                    <p className="mt-1 text-2xl font-bold text-white">6 Active</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
                    <p className="text-xs text-slate-400">Certifications</p>
                    <p className="mt-1 text-2xl font-bold" style={{ color: primaryColor }}>
                      98.4% Pass Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
