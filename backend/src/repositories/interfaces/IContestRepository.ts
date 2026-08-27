import { ContestState } from '@codeforge/shared';

export interface IContestRepository {
  listContests(status?: ContestState): Promise<any[]>;
  getContestById(id: string): Promise<any | null>;
  getContestBySlug(slug: string): Promise<any | null>;
  createContest(data: {
    slug: string;
    title: string;
    descriptionMdx: string;
    status: ContestState;
    startAt: Date;
    endAt: Date;
    durationMinutes: number;
    createdBy?: string;
    totalPoints: number;
    rulesJson?: Record<string, unknown>;
    scoringFormula?: string;
  }): Promise<any>;
  addContestProblem(data: {
    contestId: string;
    problemId: string;
    sequence: number;
    points: number;
    penaltyMinutes: number;
  }): Promise<any>;
  getContestProblems(contestId: string): Promise<any[]>;
  getParticipant(contestId: string, userId: string): Promise<any | null>;
  registerParticipant(contestId: string, userId: string): Promise<any>;
  updateParticipant(
    id: string,
    data: {
      startedAt?: Date;
      finishedAt?: Date;
      score?: number;
      penaltyTimeMinutes?: number;
      rank?: number;
      finalRatingChange?: number;
      status?: string;
    },
  ): Promise<any>;
  listParticipants(contestId: string): Promise<any[]>;
  recordContestSubmission(data: {
    contestId: string;
    participantId: string;
    problemId: string;
    submissionId: string;
    scoreEarned: number;
    isPassed: boolean;
    penaltyAppliedMinutes: number;
  }): Promise<any>;
  getContestSubmissions(contestId: string, participantId?: string): Promise<any[]>;
}
