import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';
import {
  MemoryFabricRecordDto,
  StoreMemoryDto,
  SharedMemoryDto,
  SemanticQueryDto,
  MemoryFabricType,
} from '@codeforge/shared';

export class MemoryFabricService {
  constructor(private readonly agentCloudRepo: IAgentCloudRepository) {}

  async storeMemory(userId: string, data: StoreMemoryDto): Promise<MemoryFabricRecordDto> {
    if (!data.key || !data.content) {
      throw new Error('Memory key and content are required');
    }
    return this.agentCloudRepo.storeMemory(userId, data);
  }

  async recallMemory(userId: string, key: string, agentId?: string | null): Promise<MemoryFabricRecordDto | null> {
    return this.agentCloudRepo.findMemoryByKey(userId, key, agentId);
  }

  async semanticSearch(userId: string, data: SemanticQueryDto): Promise<MemoryFabricRecordDto[]> {
    return this.agentCloudRepo.searchMemories(userId, data.query, data.memoryType, data.topK || 20);
  }

  async storeSharedMemory(scopeType: 'team' | 'organization' | 'global', scopeId: string, key: string, value: string, contributorId: string): Promise<SharedMemoryDto> {
    return this.agentCloudRepo.storeSharedMemory(scopeType, scopeId, key, value, contributorId);
  }

  async getSharedMemory(scopeType: string, scopeId: string, key: string): Promise<SharedMemoryDto | null> {
    return this.agentCloudRepo.getSharedMemory(scopeType, scopeId, key);
  }

  async compressMemories(userId: string, memoryType: MemoryFabricType): Promise<{ compressedCount: number; summary: string }> {
    const memories = await this.agentCloudRepo.searchMemories(userId, '', memoryType, 100);
    if (memories.length === 0) {
      return { compressedCount: 0, summary: 'No memories available for compression' };
    }

    const compressedKey = `compressed_summary_${memoryType.toLowerCase()}_${Date.now()}`;
    const consolidatedContent = memories.map(m => `[${m.key}]: ${m.content}`).join('\n');
    const summary = `Consolidated knowledge base containing ${memories.length} records in domain ${memoryType}.`;

    await this.agentCloudRepo.storeMemory(userId, {
      memoryType,
      key: compressedKey,
      content: `${summary}\n\n${consolidatedContent.substring(0, 2000)}...`,
      importance: 1.5,
      metadata: { originalCount: memories.length, compressedAt: new Date().toISOString() },
    });

    return {
      compressedCount: memories.length,
      summary,
    };
  }
}
