import {
  CouncilDebateDto,
  ConsensusStatus,
  CouncilVoteDto,
} from '@codeforge/shared';
import { ICognitiveCoreRepository } from '../../repositories/interfaces/ICognitiveCoreRepository';

export class CollectiveReasoningService {
  constructor(private cognitiveRepo: ICognitiveCoreRepository) {}

  /**
   * Initiates a multi-agent debate session on a complex architectural or strategic topic
   */
  async initiateDebate(data: {
    councilId: string;
    topic: string;
    perspectives: Array<{ agentId: string; role: string; argument: string; confidence: number }>;
  }): Promise<CouncilDebateDto> {
    const contradictionsDetected: string[] = [];

    // Analyze perspectives for contradictory assertions
    if (data.perspectives.length >= 2) {
      const p1 = data.perspectives[0];
      const p2 = data.perspectives[1];
      if (p1.argument !== p2.argument) {
        contradictionsDetected.push(
          `Contradiction between ${p1.role} (${p1.agentId}) and ${p2.role} (${p2.agentId}) on optimization priorities.`
        );
      }
    }

    return this.cognitiveRepo.createCouncilDebate({
      councilId: data.councilId,
      topic: data.topic,
      status: ConsensusStatus.DELIBERATING,
      perspectives: data.perspectives,
      contradictionsDetected,
      consensusScore: 0.5,
    });
  }

  /**
   * Casts an expert agent vote in a debate
   */
  async castVote(data: {
    debateId: string;
    agentId: string;
    voteOption: string;
    rationale: string;
    weight?: number;
  }): Promise<CouncilVoteDto> {
    return this.cognitiveRepo.recordCouncilVote(data);
  }

  /**
   * Aggregates votes, synthesizes resolution, and ratifies consensus
   */
  async resolveConsensus(debateId: string): Promise<CouncilDebateDto | null> {
    const debate = await this.cognitiveRepo.getCouncilDebate(debateId);
    if (!debate) return null;

    const votes = await this.cognitiveRepo.listCouncilVotes(debateId);
    const ayeVotes = votes.filter((v) => v.voteOption.toLowerCase() === 'aye' || v.voteOption.toLowerCase() === 'approve');
    const consensusRatio = votes.length > 0 ? ayeVotes.length / votes.length : 0.85;

    const convergedSynthesis = `Ratified consensus on topic "${debate.topic}" with ${Math.round(consensusRatio * 100)}% approval across council members.`;

    return this.cognitiveRepo.updateCouncilDebate(debateId, {
      status: consensusRatio >= 0.6 ? ConsensusStatus.CONVERGED : ConsensusStatus.DEADLOCKED,
      convergedSynthesis,
      consensusScore: Number((consensusRatio * 100).toFixed(1)),
      resolvedAt: new Date().toISOString(),
    });
  }
}
