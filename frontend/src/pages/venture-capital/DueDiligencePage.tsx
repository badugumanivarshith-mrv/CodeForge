import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { DueDiligenceReportDto } from '@codeforge/shared';

export const DueDiligencePage: React.FC = () => {
  const [report, setReport] = useState<DueDiligenceReportDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await ventureCapitalApi.getDueDiligence('startup-seed-1');
        setReport(data);
      } catch (err) {
        console.error('Failed to load due diligence report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Running autonomous due diligence evaluation...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-indigo-400">
              Autonomous Due Diligence Report
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Multi-vector technical, financial, team, and legal audit synthesis</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
            Recommendation: {report?.recommendation} (Score: {report?.overallScore}/100)
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Diligence Summary</h3>
        <p className="text-sm text-slate-200 leading-relaxed">{report?.executiveSummary}</p>
      </div>

      {/* Diligence Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(report?.dimensions || []).map((dim, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-200 capitalize">{dim.category.replace('_', ' ')}</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                Score: {dim.score}/100
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              {dim.findings.map((f, fIdx) => (
                <div key={fIdx}>• {f}</div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
              <span>Strengths: {dim.strengths.join(', ')}</span>
              <span className="text-amber-400">Concerns: {dim.concerns.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detected Risks & Red Flags */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Risks & Mitigations</h3>
        <div className="space-y-3">
          {(report?.detectedRisks || []).map((risk, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/30 uppercase">
                    {risk.severity} Risk
                  </span>
                  <span className="font-bold text-slate-200">{risk.riskTitle}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">{risk.description}</p>
              </div>
              <div className="text-[11px] text-indigo-300 font-medium md:text-right">
                Mitigation: {risk.mitigationRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
