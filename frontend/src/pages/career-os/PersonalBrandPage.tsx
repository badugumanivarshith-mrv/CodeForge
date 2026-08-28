import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Github,
  Linkedin,
  Globe,
  BookOpen,
  GitPullRequest,
  Mic,
  Award,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import { PersonalBrandProfileDto, ContentPlanDto } from '@codeforge/shared';

export const PersonalBrandPage: React.FC = () => {
  const [brand, setBrand] = useState<PersonalBrandProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await careerOsApi.getPersonalBrand();
      if (res.data) setBrand(res.data);
    } catch (err) {
      console.error('Failed to load personal brand profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !brand) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Auditing Personal Technical Brand...</p>
        </div>
      </div>
    );
  }

  const { brandScore, contentPlans, speakingOpportunities, openSourceRecommendations } = brand;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Personal Brand Builder • Technical Authority</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Personal Brand Studio</h1>
            <p className="text-sm text-slate-400">
              Score your technical presence across GitHub, LinkedIn, portfolio, OSS contributions, and conference speaking.
            </p>
          </div>
        </div>

        {/* Brand Score & Vector Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Brand Overall Score */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase text-pink-400">Brand Authority Score</span>
              <Award className="h-4 w-4 text-pink-400" />
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black text-pink-400">{brandScore.brandScore}</span>
              <span className="text-sm text-slate-400">/ 100</span>
              <span className="ml-auto rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs font-bold text-pink-400">
                {brandScore.brandTier} TIER
              </span>
            </div>

            <div className="mt-6 space-y-2.5">
              <p className="text-xs font-bold uppercase text-slate-400">Channel Vector Breakdown</p>
              {[
                { label: 'GitHub Technical Footprint', val: brandScore.githubScore, icon: Github, color: 'bg-indigo-500' },
                { label: 'Portfolio Architecture', val: brandScore.portfolioScore, icon: Globe, color: 'bg-cyan-500' },
                { label: 'LinkedIn Reach', val: brandScore.linkedinScore, icon: Linkedin, color: 'bg-blue-500' },
                { label: 'Technical Content Impact', val: brandScore.contentScore, icon: BookOpen, color: 'bg-emerald-500' },
                { label: 'Open Source Footprint', val: brandScore.ossScore, icon: GitPullRequest, color: 'bg-purple-500' },
              ].map((vec) => {
                const Icon = vec.icon;
                return (
                  <div key={vec.label}>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{vec.label}</span>
                      </div>
                      <span className="font-bold">{vec.val}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full ${vec.color}`} style={{ width: `${vec.val}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Content Plan */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">AI Technical Content Plans ({contentPlans.length})</h3>
                <p className="text-xs text-slate-400">Curated writing prompts & thought leadership ideas tailored to your target role</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {contentPlans.map((plan: ContentPlanDto, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400">
                      {plan.platform}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">Reach: {plan.estimatedReachScore}/100</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white">{plan.title}</h4>
                  <p className="mt-1 text-xs text-slate-400"><span className="text-slate-300 font-semibold">Audience: </span>{plan.targetAudience}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {plan.recommendedKeywords.map((kw: string) => (
                      <span key={kw} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Speaking Opportunities & OSS Repositories */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recommended Speaking Conferences */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Mic className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Recommended Speaking Opportunities</h3>
            </div>

            <div className="mt-4 space-y-3">
              {speakingOpportunities.map((opp: { eventName: string; topic: string; deadline: string }) => (
                <div key={opp.eventName} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{opp.eventName}</h4>
                    <span className="rounded bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-400">
                      CFP: {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300"><span className="text-purple-400 font-semibold">Suggested Topic: </span>{opp.topic}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Curated OSS Contribution Targets */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <GitPullRequest className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Curated Open Source Targets</h3>
            </div>

            <div className="mt-4 space-y-3">
              {openSourceRecommendations.map((proj: { repoName: string; tech: string; difficulty: string }) => (
                <div key={proj.repoName} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-emerald-400">{proj.repoName}</h4>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">{proj.difficulty}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">Stack: <span className="text-indigo-300 font-semibold">{proj.tech}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
