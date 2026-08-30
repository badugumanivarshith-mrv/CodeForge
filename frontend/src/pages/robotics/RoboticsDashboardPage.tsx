import React, { useEffect, useState } from 'react';
import { roboticsApi } from '../../services/roboticsApi';
import { RoboticsOverviewDto } from '@codeforge/shared';

export const RoboticsDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<RoboticsOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roboticsApi
      .getOverview()
      .then((data) => {
        setOverview(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-400 font-mono">
        <div className="text-xl animate-pulse">Initializing Robotics Mesh Telemetry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
              Robotics & Physical AI Control
            </h1>
            <p className="text-slate-400 mt-2">
              Autonomous robotic registry, physical telemetry feeds, spatial waypoint missions, and hardware health analytics.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm font-mono text-orange-450">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
            Sensors Stream Live
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-orange-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Total Registry</div>
            <div className="text-3xl font-extrabold text-orange-400 mt-2">{overview?.metrics.totalRobotsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Robots registered</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-rose-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Online</div>
            <div className="text-3xl font-extrabold text-rose-450 mt-2">{overview?.metrics.onlineRobotsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Live active nodes</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Active Missions</div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">{overview?.metrics.activeMissionsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Waypoint paths running</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-purple-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Completed</div>
            <div className="text-3xl font-extrabold text-purple-300 mt-2">{overview?.metrics.completedMissionsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Successful missions</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-pink-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Simulation Rate</div>
            <div className="text-3xl font-extrabold text-pink-400 mt-2">{overview?.metrics.simulationSuccessRatePercent ?? 0}%</div>
            <div className="text-xs text-slate-500 mt-1">Path validation check</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-teal-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Data Rate</div>
            <div className="text-3xl font-extrabold text-teal-400 mt-2">{overview?.metrics.sensorStreamDataRateKbps ?? 0} Kbps</div>
            <div className="text-xs text-slate-500 mt-1">Sensor streams bandwidth</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Nodes List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold tracking-tight text-white mb-6">Robotics Fleet</h2>
              <div className="space-y-4">
                {overview?.robots.map((r) => (
                  <div
                    key={r.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 hover:bg-slate-900 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-white">{r.robotName}</h3>
                        <div className="text-xs text-orange-400 font-mono mt-1">{r.robotType}</div>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          r.status === 'online'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : r.status === 'charging'
                            ? 'bg-amber-500/10 text-amber-405 border border-amber-500/20 animate-pulse'
                            : 'bg-slate-550 text-slate-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-5 border-t border-slate-800 pt-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">Battery Level</span>
                        <div
                          className={`font-bold ${r.batteryLevelPercent < 50 ? 'text-rose-450' : 'text-emerald-400'}`}
                        >
                          {r.batteryLevelPercent}%
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Current Coordinates</span>
                        <div className="font-bold text-slate-350">
                          X: {r.currentCoordinates.x.toFixed(1)}, Y: {r.currentCoordinates.y.toFixed(1)}, Z:{' '}
                          {r.currentCoordinates.z.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Missions Column */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Recent Missions</h2>
              {overview?.recentMissions.length === 0 ? (
                <div className="text-slate-500 text-sm font-mono py-4 text-center">No missions planned.</div>
              ) : (
                <div className="space-y-4">
                  {overview?.recentMissions.map((m) => (
                    <div key={m.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-300 font-mono">ID: {m.id.slice(-6)}</h4>
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                            m.status === 'executing'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : m.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{m.missionName}</p>
                      <div className="text-[10px] text-slate-500 font-mono pt-1">
                        Waypoints count: {m.waypointsList.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
