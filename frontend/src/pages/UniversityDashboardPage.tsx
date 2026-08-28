import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  Briefcase,
  Search,
  CheckCircle,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import {
  UniversityDto,
  UniversityAnalyticsDto,
  StudentProfileDto,
  PlacementRecordDto,
  BatchDto,
  StudentPlacementStatus,
} from '@codeforge/shared';

export const UniversityDashboardPage: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityDto[]>([]);
  const [selectedUni, setSelectedUni] = useState<UniversityDto | null>(null);
  const [analytics, setAnalytics] = useState<UniversityAnalyticsDto | null>(null);
  const [students, setStudents] = useState<StudentProfileDto[]>([]);
  const [placements, setPlacements] = useState<PlacementRecordDto[]>([]);
  const [batches, setBatches] = useState<BatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'placements' | 'batches'>('overview');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    if (selectedUni) {
      loadUniversityDetails(selectedUni.id);
    }
  }, [selectedUni]);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.listUniversities();
      setUniversities(data);
      if (data.length > 0) {
        setSelectedUni(data[0]);
      }
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUniversityDetails = async (uniId: string) => {
    try {
      const [analyticsData, studentsData, placementsData, batchesData] = await Promise.all([
        enterpriseApi.getUniversityAnalytics(uniId),
        enterpriseApi.listStudents(uniId),
        enterpriseApi.listPlacements(uniId),
        enterpriseApi.listBatches(uniId),
      ]);
      setAnalytics(analyticsData);
      setStudents(studentsData);
      setPlacements(placementsData);
      setBatches(batchesData);
    } catch (err) {
      console.error('Failed to load university details:', err);
    }
  };

  const filteredStudents = students.filter(
    s =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.studentRollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      (s.departmentName && s.departmentName.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading && universities.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      {/* Header & University Selector */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Enterprise University Platform
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                <CheckCircle className="h-3 w-3" /> Accredited
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              University Management & Analytics
            </h1>
            <p className="mt-1 text-slate-400">
              Institutional intelligence, placement tracking, batch performance, and student readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedUni?.id || ''}
              onChange={e => {
                const u = universities.find(x => x.id === e.target.value);
                if (u) setSelectedUni(u);
              }}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-medium text-white shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {universities.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top KPIs */}
        {analytics && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Total Enrolled Students</span>
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{analytics.totalStudents}</span>
                <span className="text-xs font-semibold text-emerald-400">+12% vs last term</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Placement Rate</span>
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{analytics.placementRatePercentage}%</span>
                <span className="text-xs font-medium text-slate-400">
                  ({analytics.placedStudents} / {analytics.totalStudents} placed)
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Average Package</span>
                <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">₹{analytics.averagePackageLpa} LPA</span>
                <span className="text-xs font-semibold text-indigo-400">Industry Top 5%</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Highest Package</span>
                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">₹{analytics.highestPackageLpa} LPA</span>
                <span className="text-xs text-purple-400">Class of 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-8 flex gap-2 border-b border-slate-800">
          {[
            { id: 'overview', label: 'Department Analytics & Hiring' },
            { id: 'students', label: `Student Roster (${students.length})` },
            { id: 'placements', label: `Placement Offers (${placements.length})` },
            { id: 'batches', label: `Graduation Batches (${batches.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && analytics && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Department Breakdown */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-white">Department Placement & Performance</h2>
              <div className="mt-6 space-y-4">
                {analytics.departmentPerformance.map((dept, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <h4 className="font-semibold text-white">{dept.departmentName}</h4>
                        <p className="text-xs text-slate-400">
                          {dept.studentCount} Students · Avg Rating {dept.averageRating} · Avg CGPA {dept.averageCgpa}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                          {dept.placedCount} Placed ({Math.round((dept.placedCount / dept.studentCount) * 100)}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                        style={{ width: `${Math.round((dept.placedCount / dept.studentCount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Hiring Partners */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-lg font-semibold text-white">Top Enterprise Recruiters</h2>
              <div className="mt-6 space-y-3">
                {analytics.topHiringPartners.map((partner, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold">
                        {partner.companyName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{partner.companyName}</p>
                        <p className="text-xs text-slate-400">{partner.hiredCount} Candidates Hired</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">₹{partner.avgPackageLpa} LPA</p>
                      <p className="text-[10px] text-slate-400 uppercase">Avg Compensation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Students */}
        {activeTab === 'students' && (
          <div className="mt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student username, roll number, or department..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="text-sm text-slate-400">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Department / Batch</th>
                    <th className="px-6 py-4">CGPA</th>
                    <th className="px-6 py-4">Semester</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.map(s => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-xs">
                            {s.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p>{s.fullName || s.username}</p>
                            <p className="text-xs text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{s.studentRollNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <p>{s.departmentName || 'Computer Science'}</p>
                        <p className="text-xs text-slate-400">{s.batchName || 'Class of 2026'}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-400">{s.cgpa.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-300">Sem {s.semester}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            s.placementStatus === StudentPlacementStatus.PLACED
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {s.placementStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No students found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Placements */}
        {activeTab === 'placements' && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {placements.map(p => (
              <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{p.companyName}</h4>
                      <p className="text-xs text-slate-400">{p.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    ₹{p.packageLpa} LPA
                  </span>
                </div>
                <div className="mt-4 border-t border-slate-800/80 pt-3 text-xs text-slate-400 flex justify-between items-center">
                  <span>Candidate: <strong className="text-slate-200">{p.studentName || 'Student'}</strong></span>
                  <span>{new Date(p.offerDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {placements.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                No placement records recorded for this university yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Batches */}
        {activeTab === 'batches' && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {batches.map(b => (
              <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-lg">{b.name}</h4>
                  <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                    Graduating {b.graduationYear}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{b.departmentName || 'Engineering & Computing'}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-sm">
                  <span className="text-slate-400">Batch Cohort Size</span>
                  <span className="font-semibold text-white">{b.totalStudents} Students</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
