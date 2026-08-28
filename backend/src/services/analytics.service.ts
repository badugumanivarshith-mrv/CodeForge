import { eq, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import { submissions, problems, userTopicMastery, topics } from '../database/schema';
import {
  PerformanceAnalyticsDto,
  LanguageId,
  ProblemDifficulty,
  SubmissionStatus,
  JudgeVerdict,
} from '@codeforge/shared';

export class AnalyticsService {
  public async getPerformanceAnalytics(userId: string): Promise<PerformanceAnalyticsDto> {
    // 1. Fetch user's submissions
    const userSubs = await db
      .select({
        id: submissions.id,
        problemId: submissions.problemId,
        languageId: submissions.languageId,
        status: submissions.status,
        verdict: submissions.verdict,
        executionTimeMs: submissions.executionTimeMs,
        memoryUsedKb: submissions.memoryUsedKb,
        createdAt: submissions.createdAt,
        difficulty: problems.difficulty,
      })
      .from(submissions)
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt));

    const isAcceptedSub = (s: { verdict?: string | null; status?: string | null }) => {
      const v = (s.verdict || '').toUpperCase();
      const st = (s.status || '').toLowerCase();
      return v === 'ACCEPTED' || st === 'accepted';
    };

    const totalSubmissions = userSubs.length;
    const acceptedSubs = userSubs.filter(isAcceptedSub);
    const acceptedSubmissions = acceptedSubs.length;
    const acceptanceRate =
      totalSubmissions > 0 ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)) : 0;

    // Average runtime & memory for evaluated submissions
    const runtimeSubs = userSubs.filter(s => s.executionTimeMs !== null && s.executionTimeMs !== undefined);
    const averageRuntimeMs =
      runtimeSubs.length > 0
        ? Math.round(runtimeSubs.reduce((acc, s) => acc + (s.executionTimeMs || 0), 0) / runtimeSubs.length)
        : 0;

    const memorySubs = userSubs.filter(s => s.memoryUsedKb !== null && s.memoryUsedKb !== undefined);
    const averageMemoryKb =
      memorySubs.length > 0
        ? Math.round(memorySubs.reduce((acc, s) => acc + (s.memoryUsedKb || 0), 0) / memorySubs.length)
        : 0;

    // Language Usage Breakdown
    const langCounts: Record<string, number> = {};
    for (const sub of userSubs) {
      langCounts[sub.languageId] = (langCounts[sub.languageId] || 0) + 1;
    }
    const languageUsage = Object.entries(langCounts).map(([langId, count]) => ({
      languageId: langId as LanguageId,
      count,
      percentage: totalSubmissions > 0 ? Number(((count / totalSubmissions) * 100).toFixed(1)) : 0,
    }));

    // Solved distinct problems by difficulty
    const solvedProblemIds = new Set<string>();
    const solvedByDiff = { easy: 0, medium: 0, difficult: 0, total: 0 };

    for (const sub of acceptedSubs) {
      if (!solvedProblemIds.has(sub.problemId)) {
        solvedProblemIds.add(sub.problemId);
        const diff = sub.difficulty;
        if (diff === ProblemDifficulty.EASY) {
          solvedByDiff.easy++;
        } else if (diff === ProblemDifficulty.MEDIUM) {
          solvedByDiff.medium++;
        } else if (diff === ProblemDifficulty.DIFFICULT) {
          solvedByDiff.difficult++;
        }
      }
    }
    solvedByDiff.total = solvedProblemIds.size;

    // Verdict distribution
    const verdictDistribution: Record<string, number> = {};
    for (const sub of userSubs) {
      const v = (sub.verdict as string) || (sub.status as string);
      verdictDistribution[v] = (verdictDistribution[v] || 0) + 1;
    }

    // Recent 14-day trend
    const recentTrendMap: Record<string, { submissionsCount: number; acceptedCount: number }> = {};
    for (const sub of userSubs) {
      const dateStr = sub.createdAt.toISOString().split('T')[0];
      if (!recentTrendMap[dateStr]) {
        recentTrendMap[dateStr] = { submissionsCount: 0, acceptedCount: 0 };
      }
      recentTrendMap[dateStr].submissionsCount++;
      if (isAcceptedSub(sub)) {
        recentTrendMap[dateStr].acceptedCount++;
      }
    }

    const recentTrend = Object.entries(recentTrendMap)
      .map(([date, counts]) => ({
        date,
        submissionsCount: counts.submissionsCount,
        acceptedCount: counts.acceptedCount,
      }))
      .slice(0, 14);

    // Topic mastery indicators
    const masteryRows = await db
      .select({
        topicId: userTopicMastery.topicId,
        topicName: topics.title,
        masteryScore: userTopicMastery.masteryScore,
        solvedCount: userTopicMastery.problemsSolvedCount,
      })
      .from(userTopicMastery)
      .leftJoin(topics, eq(userTopicMastery.topicId, topics.id))
      .where(eq(userTopicMastery.userId, userId))
      .limit(10);

    const topicMasteryIndicators = masteryRows.map(r => ({
      topicId: r.topicId,
      topicName: r.topicName || 'General Topic',
      masteryScore: Number(r.masteryScore) || 0,
      solvedCount: r.solvedCount || 0,
    }));

    return {
      userId,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate,
      averageRuntimeMs,
      averageMemoryKb,
      languageUsage,
      solvedByDifficulty: solvedByDiff,
      verdictDistribution,
      recentTrend,
      topicMasteryIndicators,
    };
  }
}
