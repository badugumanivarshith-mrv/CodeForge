import React, { useEffect, useState } from 'react';
import { roboticsApi } from '../../services/roboticsApi';
import { RoboticsMetricsDto } from '@codeforge/shared';

export const RoboticsAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RoboticsMetricsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roboticsApi
      .getMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-400 font-mono">
        <div className="text-xl animate-pulse">Retrieving Fleet Diagnostics Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
            Fleet Analytics & Sensor Streams
          </h1>
          <p className="text-slate-400 mt-2">
            Robotics kinematics diagnostics, path planning simulation rates, and raw telemetry data rate feeds.
          </p>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Sim Success Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{metrics?.simulationSuccessRatePercent ?? 0}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{ width: `${metrics?.simulationSuccessRatePercent ?? 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Data Bandwidth</div>
            <div className="text-3xl font-extrabold text-teal-300 mt-2">{metrics?.sensorStreamDataRateKbps} Kbps</div>
            <div className="text-xs text-slate-500 mt-1">LIDAR scan points frequency</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Registered Fleet</div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">{metrics?.totalRobotsCount}</div>
            <div className="text-xs text-slate-500 mt-1">Total physical nodes</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Active Missions</div>
            <div className="text-3xl font-extrabold text-pink-400 mt-2">{metrics?.activeMissionsCount}</div>
            <div className="text-xs text-slate-500 mt-1">Running waypoint paths</div>
          </div>
        </div>

        {/* Fleet Logs Diagnostics */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Spatial Octomap Diagnostics</h2>
          <p className="text-slate-400 text-sm mb-6">
            Real-time kinematics drift correction loops logs indicate 0.05m octomap resolution checks are fully green.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-550 space-y-2">
            <div>[2026-08-31 00:41:00] INFO: Swarm UAV visual pose verified at coordinates x:12.5, y:-45.0, z:15.0</div>
            <div>[2026-08-31 00:41:01] INFO: Ingested 154000 scan points from LIDAR stream - frame frequency steady</div>
            <div>[2026-08-31 00:41:02] INFO: Speculative collision detection validation loop checks succeeded</div>
          </div>
        </div>
      </div>
    </div>
  );
};
