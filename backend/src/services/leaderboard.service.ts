import { IRatingRepository } from '../repositories/interfaces/IRatingRepository';
import { IContestRepository } from '../repositories/interfaces/IContestRepository';
import {
  GlobalLeaderboardDto,
  ContestLeaderboardDto,
  LeaderboardTimeframe,
  ContestState,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class LeaderboardService {
  constructor(
    private readonly ratingRepo: IRatingRepository,
    private readonly contestRepo: IContestRepository,
  ) {}

  async getGlobalLeaderboard(
    timeframe: LeaderboardTimeframe = LeaderboardTimeframe.GLOBAL,
    page: number = 1,
    limit: number = 50,
  ): Promise<GlobalLeaderboardDto> {
    const pageNum = Math.max(1, page);
    const limitNum = Math.min(100, Math.max(1, limit));
    const offset = (pageNum - 1) * limitNum;

    const { entries, total } = await this.ratingRepo.getGlobalLeaderboard(timeframe, limitNum, offset);

    return {
      timeframe,
      totalUsers: total,
      entries,
    };
  }

  async getContestLeaderboard(contestId: string): Promise<ContestLeaderboardDto> {
    const contest = await this.contestRepo.getContestById(contestId);
    if (!contest) {
      throw new NotFoundError('Contest not found');
    }

    const participants = await this.contestRepo.listParticipants(contestId);
    const submissions = await this.contestRepo.getContestSubmissions(contestId);

    // Group submission performance per participant and problem
    const participantMap = new Map<string, any>();
    for (const p of participants) {
      participantMap.set(p.id, {
        rank: p.rank,
        userId: p.userId,
        username: p.username,
        displayName: p.displayName || p.username,
        avatarUrl: p.avatarUrl || null,
        score: p.score,
        penaltyTimeMinutes: p.penaltyTimeMinutes,
        solvedProblemsCount: 0,
        problemResults: {},
      });
    }

    for (const sub of submissions) {
      const entry = participantMap.get(sub.participantId);
      if (!entry) continue;

      if (!entry.problemResults[sub.problemId]) {
        entry.problemResults[sub.problemId] = {
          problemId: sub.problemId,
          solved: false,
          attempts: 0,
          points: 0,
          timeMinutes: 0,
        };
      }

      const pr = entry.problemResults[sub.problemId];
      pr.attempts += 1;
      if (sub.isPassed && !pr.solved) {
        pr.solved = true;
        pr.points = sub.scoreEarned;
        entry.solvedProblemsCount += 1;
      }
    }

    const entries = Array.from(participantMap.values());
    // Re-rank based on score descending and penalty time ascending
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.penaltyTimeMinutes - b.penaltyTimeMinutes;
    });

    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    return {
      contestId,
      contestTitle: contest.title,
      status: contest.status as ContestState,
      totalParticipants: entries.length,
      entries,
    };
  }
}
