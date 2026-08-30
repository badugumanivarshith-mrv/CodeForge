import React from 'react';

export const ResearchImpactChart: React.FC = () => {
  // SVG representation of a sleek, premium grid chart showing publications & citations growth over time
  return (
    <div className="w-full h-64 bg-slate-950/40 rounded-xl p-4 border border-slate-900/60 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/10 via-transparent to-transparent pointer-events-none" />
      <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 200">
        {/* Grid lines */}
        <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

        {/* Citation area gradient */}
        <defs>
          <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Areas */}
        <path
          d="M 0 180 L 100 160 L 200 120 L 300 90 L 400 60 L 500 30 L 500 200 L 0 200 Z"
          fill="url(#gradient-chart)"
        />

        {/* Lines */}
        <path
          d="M 0 180 L 100 160 L 200 120 L 300 90 L 400 60 L 500 30"
          fill="none"
          stroke="#6366f1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <path
          d="M 0 195 L 100 190 L 200 170 L 300 150 L 400 120 L 500 95"
          fill="none"
          stroke="#c084fc"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          strokeLinecap="round"
        />

        {/* Data points */}
        <circle cx="200" cy="120" r="5" fill="#818cf8" stroke="#1e1b4b" strokeWidth="2" />
        <circle cx="300" cy="90" r="5" fill="#818cf8" stroke="#1e1b4b" strokeWidth="2" />
        <circle cx="400" cy="60" r="5" fill="#818cf8" stroke="#1e1b4b" strokeWidth="2" />
        <circle cx="500" cy="30" r="5" fill="#a78bfa" stroke="#1e1b4b" strokeWidth="2" />
      </svg>
      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-2 pt-2 border-t border-slate-900/60">
        <span>Q1 2026 (Pre-alpha)</span>
        <span>Q2 2026 (Alpha)</span>
        <span>Q3 2026 (Beta Launch)</span>
        <span>Q4 2026 (Active Deployment)</span>
      </div>
    </div>
  );
};
