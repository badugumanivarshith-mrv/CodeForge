import React, { useEffect, useState } from 'react';
import { roboticsApi } from '../../services/roboticsApi';
import { RobotDto, RobotMissionDto } from '@codeforge/shared';

export const MissionControlPage: React.FC = () => {
  const [robots, setRobots] = useState<RobotDto[]>([]);
  const [selectedRobotId, setSelectedRobotId] = useState('');
  const [missionName, setMissionName] = useState('');
  const [wpX, setWpX] = useState('15.0');
  const [wpY, setWpY] = useState('-50.0');
  const [wpZ, setWpZ] = useState('10.0');
  const [wpAction, setWpAction] = useState('Collect visual frame');
  const [waypoints, setWaypoints] = useState<Array<{ x: number; y: number; z: number; actionDescription?: string }>>([]);
  const [missions, setMissions] = useState<RobotMissionDto[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    roboticsApi.listRobots().then((data) => {
      setRobots(data);
      if (data.length > 0) {
        setSelectedRobotId(data[0].id);
      }
    });

    roboticsApi.getOverview().then((data) => {
      setMissions(data.recentMissions);
    });
  }, []);

  const addWaypoint = () => {
    const x = parseFloat(wpX);
    const y = parseFloat(wpY);
    const z = parseFloat(wpZ);
    if (isNaN(x) || isNaN(y) || isNaN(z)) return;

    setWaypoints([...waypoints, { x, y, z, actionDescription: wpAction }]);
    setWpAction('');
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionName.trim() || waypoints.length === 0 || !selectedRobotId) return;

    setSubmitting(true);
    try {
      const newMission = await roboticsApi.createMission({
        missionName,
        assignedRobotIds: [selectedRobotId],
        waypointsList: waypoints,
      });
      setMissions([newMission, ...missions]);
      setMissionName('');
      setWaypoints([]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plan Mission Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">Plan Robotic Mission</h2>
          <form onSubmit={handlePlan} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Mission Name</label>
              <input
                type="text"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                placeholder="e.g. Area Specular Invariant Check"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Assign Robot</label>
              <select
                value={selectedRobotId}
                onChange={(e) => setSelectedRobotId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              >
                {robots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.robotName}
                  </option>
                ))}
              </select>
            </div>

            {/* Waypoint Adder */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-350 font-mono">Add Waypoints</h3>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={wpX}
                  onChange={(e) => setWpX(e.target.value)}
                  placeholder="X"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 font-mono text-xs text-center"
                />
                <input
                  type="text"
                  value={wpY}
                  onChange={(e) => setWpY(e.target.value)}
                  placeholder="Y"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 font-mono text-xs text-center"
                />
                <input
                  type="text"
                  value={wpZ}
                  onChange={(e) => setWpZ(e.target.value)}
                  placeholder="Z"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 font-mono text-xs text-center"
                />
              </div>
              <input
                type="text"
                value={wpAction}
                onChange={(e) => setWpAction(e.target.value)}
                placeholder="Action (e.g. Scans LIDAR)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={addWaypoint}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg font-semibold transition-all"
              >
                Add Waypoint to Route
              </button>
            </div>

            {/* Waypoints list overview */}
            {waypoints.length > 0 && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                <span className="text-[10px] uppercase text-slate-500 font-mono">Buffered Route Details</span>
                {waypoints.map((wp, idx) => (
                  <div key={idx} className="text-[10px] text-slate-400 font-mono">
                    Wp #{idx + 1}: [{wp.x}, {wp.y}, {wp.z}] - {wp.actionDescription || 'None'}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || waypoints.length === 0}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 active:scale-[0.98]"
            >
              {submitting ? 'Dispatching Mission...' : 'Dispatch Mission'}
            </button>
          </form>
        </div>

        {/* Missions Dispatch List */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Planned Missions List ({missions.length})</h2>

          <div className="space-y-4">
            {missions.map((m) => (
              <div key={m.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">{m.missionName}</h3>
                    <span className="text-[10px] text-slate-550 font-mono">ID: {m.id.slice(-6)}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {m.status}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-900 mt-2">
                  {m.waypointsList.map((w, idx) => (
                    <div key={idx} className="text-xs text-slate-500 font-mono">
                      Step #{idx + 1}: [{w.x}, {w.y}, {w.z}] {w.actionDescription ? `- ${w.actionDescription}` : ''}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
