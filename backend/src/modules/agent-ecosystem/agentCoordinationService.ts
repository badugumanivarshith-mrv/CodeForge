import { IAgentEcosystemRepository } from '../../repositories/interfaces/IAgentEcosystemRepository';
import { AgentInteractionDto, CreateAgentInteractionDto } from '@codeforge/shared';

export class AgentCoordinationService {
  constructor(private repo: IAgentEcosystemRepository) {}

  public async coordinateSwarm(
    sourceAgentId: string,
    targetAgentIds: string[],
    instruction: string
  ): Promise<AgentInteractionDto[]> {
    const interactions: AgentInteractionDto[] = [];

    for (const targetId of targetAgentIds) {
      const inter = await this.repo.logInteraction({
        sourceAgentId,
        targetAgentId: targetId,
        messageType: 'SWARM_DIRECTIVE',
        payload: { instruction },
      });
      interactions.push(inter);
    }

    return interactions;
  }

  public async listInteractions(agentId: string): Promise<AgentInteractionDto[]> {
    return this.repo.listInteractions(agentId);
  }
}
