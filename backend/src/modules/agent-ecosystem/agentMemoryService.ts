import { IAgentEcosystemRepository } from '../../repositories/interfaces/IAgentEcosystemRepository';
import { EcosystemAgentMemoryDto, CreateEcosystemAgentMemoryDto } from '@codeforge/shared';

export class AgentMemoryService {
  constructor(private repo: IAgentEcosystemRepository) {}

  public async recordMemory(dto: CreateEcosystemAgentMemoryDto): Promise<EcosystemAgentMemoryDto> {
    return this.repo.createMemory(dto);
  }

  public async fetchMemories(agentId: string): Promise<EcosystemAgentMemoryDto[]> {
    return this.repo.listMemories(agentId);
  }
}
