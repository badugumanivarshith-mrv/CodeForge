import React, { useEffect, useState } from 'react';
import {
  Compass,
  CheckCircle2,
  DollarSign,
  Zap,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { careerApi } from '../services/careerApi';
import {
  CareerPathDetailDto,
  CareerReadinessDto,
  CareerRole,
  CareerGoalDto,
} from '@codeforge/shared';

export const CareerDashboardPage: React.FC = () => {
  const [paths, setPaths] = useState<CareerPathDetailDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<CareerRole>(CareerRole.FULLSTACK_DEVELOPER);
  const [selectedPath, setSelectedPath] = useState<CareerPathDetailDto | null>(null);
  const [readiness, setReadiness] = useState<CareerReadinessDto | null>(null);
  const [activeGoal, setActiveGoal] = useState<CareerGoalDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  const fetchCareerData = async () => {
    setIsLoading(true);
    try {
      const [pathList, goal] = await Promise.all([
        careerApi.getCareerPaths(),
        careerApi.getGoal().catch(() => null),
      ]);
      setPaths(pathList);
      if (goal) {
        setActiveGoal(goal);
        setSelectedRole(goal.targetRole);
      } else if (pathList.length > 0) {
        setSelectedRole(pathList[0].role);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData();
  }, []);

  useEffect(() => {
    if (!selectedRole) return;
    const path = paths.find(p => p.role === selectedRole) || null;
    setSelectedPath(path);

    careerApi
      .getReadiness(selectedRole)
      .then(res => setReadiness(res))
      .catch(err => console.error(err));
  }, [selectedRole, paths]);

  const handleSetGoal = async () => {
    setIsSavingGoal(true);
    try {
      const goal = await careerApi.setGoal({ targetRole: selectedRole });
      setActiveGoal(goal);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingGoal(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading Career Intelligence & Readiness Engine...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Career Intelligence & Skill Gap Matrix
            </h1>
            <Badge variant="brand" size="sm">AI Guidance</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Evaluate your job readiness across 9 high-demand software engineering tracks and bridge skill gaps with tailored roadmaps.
          </p>
        </div>

        {activeGoal && (
          <Badge variant="success" size="md">
            Active Target: {paths.find(p => p.role === activeGoal.targetRole)?.title || activeGoal.targetRole}
          </Badge>
        )}
      </div>

      {/* Role Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
        {paths.map(p => (
          <button
            key={p.role}
            onClick={() => setSelectedRole(p.role)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedRole === p.role ? '1px solid var(--color-brand-primary)' : '1px solid var(--border-subtle)',
              background: selectedRole === p.role ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
              color: selectedRole === p.role ? 'var(--color-brand-primary)' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Content Layout: Left Details / Right Readiness */}
      {selectedPath && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px' }}>
          {/* Left: Role Overview & Step-by-Step Roadmap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card glow padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>{selectedPath.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, maxWidth: '650px' }}>
                    {selectedPath.description}
                  </p>
                </div>

                <Button
                  variant={activeGoal?.targetRole === selectedRole ? 'secondary' : 'primary'}
                  size="md"
                  onClick={handleSetGoal}
                  disabled={isSavingGoal || activeGoal?.targetRole === selectedRole}
                >
                  {activeGoal?.targetRole === selectedRole ? '✓ Current Goal' : 'Set as Career Goal'}
                </Button>
              </div>

              <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <DollarSign size={16} color="#10b981" />
                  <span style={{ color: 'var(--text-secondary)' }}>Salary Range:</span>
                  <strong style={{ color: '#fff' }}>{selectedPath.avgSalaryRange}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Zap size={16} color="#f59e0b" />
                  <span style={{ color: 'var(--text-secondary)' }}>Market Demand:</span>
                  <strong style={{ color: '#fff' }}>{selectedPath.marketDemand}</strong>
                </div>
              </div>
            </Card>

            {/* Step-by-Step Career Roadmap */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="var(--color-brand-primary)" /> Step-by-Step Career Roadmap
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedPath.roadmapPhases.map(phase => (
                  <Card key={phase.phaseNumber} padding="lg">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'var(--color-brand-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#fff',
                        }}
                      >
                        {phase.phaseNumber}
                      </div>
                      <h4 style={{ fontSize: '17px', fontWeight: 700 }}>{phase.title}</h4>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px', paddingLeft: '40px' }}>
                      {phase.description}
                    </p>

                    <div style={{ paddingLeft: '40px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Key Topics:</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {phase.topics.map(t => (
                            <Badge key={t} variant="brand" size="sm">{t}</Badge>
                          ))}
                        </div>
                      </div>

                      {phase.recommendedProjects.length > 0 && (
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Recommended Projects:</span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {phase.recommendedProjects.map(proj => (
                              <Badge key={proj} variant="default" size="sm">{proj}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Real-time Job Readiness & Skill Gap Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {readiness && (
              <>
                {/* Readiness Scorecard */}
                <Card glow padding="lg" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Job Readiness Index
                  </span>

                  <div style={{ margin: '16px 0' }}>
                    <div style={{ fontSize: '48px', fontWeight: 900, color: readiness.readinessScore >= 70 ? '#10b981' : readiness.readinessScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {readiness.readinessScore}%
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', maxWidth: '200px', margin: '8px auto 0' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${readiness.readinessScore}%`,
                          background: readiness.readinessScore >= 70 ? '#10b981' : '#f59e0b',
                        }}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Estimated Timeline to Job Ready: <strong style={{ color: '#fff' }}>{readiness.timelineEstimate}</strong>
                  </p>
                </Card>

                {/* Skill Gaps Breakdown */}
                <Card padding="lg">
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} color="var(--color-brand-primary)" /> Skill Gap Breakdown
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {readiness.skillGaps.map(gap => (
                      <div
                        key={gap.skillName}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{gap.skillName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Req: {gap.requiredLevel} | Current: {gap.currentLevel}
                          </div>
                        </div>

                        {gap.isMet ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 2 }} /> Met
                          </Badge>
                        ) : (
                          <Badge variant={gap.gapSeverity === 'critical' ? 'danger' : 'warning'} size="sm">
                            <AlertTriangle size={12} style={{ display: 'inline', marginRight: 2 }} /> {gap.gapSeverity}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommended Next Topics */}
                {readiness.recommendedCourses.length > 0 && (
                  <Card padding="lg">
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                      Recommended Next Lessons
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {readiness.recommendedCourses.map(c => (
                        <div key={c.topicId} style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.05)', fontSize: '13px', fontWeight: 600 }}>
                          {c.title}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
