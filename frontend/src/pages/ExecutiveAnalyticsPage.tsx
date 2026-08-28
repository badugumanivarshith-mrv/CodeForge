import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building,
  GraduationCap,
  Users,
  Award,
  BarChart3,
  LineChart,
  CheckCircle,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import { ExecutiveAnalyticsDto } from '@codeforge/shared';

export const ExecutiveAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<ExecutiveAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.getExecutiveAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load executive analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const { kpis, institutionalLeaderboard, workforcePipelineTrend, curriculumEffectiveness } = analytics;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Executive Intelligence Suite
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
              <CheckCircle className="h-3 w-3" /> Real-time Telemetry
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Executive Analytics & Institutional Rollup
          </h1>
          <p className="mt-1 text-slate-400">
            Multi-university performance KPIs, talent pipeline conversions, and curriculum-industry hiring correlation.
          </p>
        </div>

        {/* 8-Card Executive KPI Matrix */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Partner Universities</span>
              <Building className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.totalInstitutions}</span>
              <span className="text-xs text-emerald-400 font-semibold">Tier-1 & Global</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Total Enrolled Trainees</span>
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.totalStudentsEnrolled}</span>
              <span className="text-xs text-cyan-400">+28% this quarter</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Placement Success Rate</span>
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.overallPlacementRate}%</span>
              <span className="text-xs text-emerald-400">Industry Top Decile</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Average Starting Package</span>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">₹{kpis.averageStartingSalaryLpa} LPA</span>
              <span className="text-xs text-purple-400">+14.2% YoY</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Enterprise Clients</span>
              <Building className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.totalOrganizations}</span>
              <span className="text-xs text-amber-400">Active Orgs</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Courses Completed</span>
              <GraduationCap className="h-5 w-5 text-teal-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.coursesCompleted}</span>
              <span className="text-xs text-teal-400">Micro-degrees</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Certifications Issued</span>
              <Award className="h-5 w-5 text-orange-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.certificationsIssued}</span>
              <span className="text-xs text-orange-400">Verified Badges</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Mentorship Sessions</span>
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpis.activeMentorshipSessions}</span>
              <span className="text-xs text-indigo-400">1:1 Advisories</span>
            </div>
          </div>
        </div>

        {/* Multi-University Leaderboard & Pipeline */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Institutional Benchmark Leaderboard */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" /> Institutional Placement Leaderboard
            </h2>
            <div className="mt-6 space-y-4">
              {institutionalLeaderboard.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{item.institutionName}</h4>
                        <p className="text-xs text-slate-400">{item.studentCount} Students Enrolled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">{item.placementRate}% Placement</p>
                      <p className="text-xs text-slate-400">Avg Rating: {item.avgRating}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Conversion Trend */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LineChart className="h-5 w-5 text-cyan-400" /> Workforce Pipeline Trend (May - Aug 2026)
            </h2>
            <div className="mt-6 space-y-4">
              {workforcePipelineTrend.map((trend, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{trend.month}</span>
                    <span className="text-xs text-cyan-400 font-bold">{trend.placementsConducted} Placed</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-slate-900 p-2">
                      <p className="text-slate-400">Enrolled</p>
                      <p className="font-bold text-white mt-0.5">{trend.studentsEnrolled}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2">
                      <p className="text-slate-400">Certified</p>
                      <p className="font-bold text-amber-400 mt-0.5">{trend.certificationsEarned}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2">
                      <p className="text-slate-400">Placed</p>
                      <p className="font-bold text-emerald-400 mt-0.5">{trend.placementsConducted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curriculum Effectiveness vs Industry Hiring */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-bold text-white">Curriculum Effectiveness vs Industry Hiring Correlation</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {curriculumEffectiveness.map((c, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h4 className="font-semibold text-white text-sm">{c.courseTitle}</h4>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Completion Rate:</span>
                    <span className="font-bold text-white">{c.completionRate}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Avg Assessment Score:</span>
                    <span className="font-bold text-white">{c.avgAssessmentScore}%</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold border-t border-slate-800 pt-2">
                    <span>Hiring Correlation:</span>
                    <span>{c.industryHiringCorrelation}% Match</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
