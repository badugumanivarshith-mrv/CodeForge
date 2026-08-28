import { IAgenticWorkspaceRepository } from '../../repositories/interfaces/IAgenticWorkspaceRepository';
import { agenticWorkspaceRepository } from '../../repositories/AgenticWorkspaceRepository';
import {
  AgentMemoryDto,
  CreateAgentMemoryDto,
  MemoryType,
} from '@codeforge/shared';

export class AgentMemoryService {
  constructor(private repo: IAgenticWorkspaceRepository = agenticWorkspaceRepository) {}

  /**
   * Stores a new memory unit into the user's personal memory system
   */
  async storeMemory(
    userId: string,
    memoryType: MemoryType,
    contextKey: string,
    content: string,
    importanceScore = 75,
    agentId?: string,
    metadata?: Record<string, unknown>
  ): Promise<AgentMemoryDto> {
    const clampedScore = Math.max(10, Math.min(100, Math.round(importanceScore)));

    return this.repo.createMemory(userId, {
      agentId,
      memoryType,
      contextKey,
      content,
      importanceScore: clampedScore,
      metadata: metadata || {},
    });
  }

  /**
   * Retrieves relevant contextual memories for query planning and prompt injection
   */
  async retrieveContext(userId: string, query: string, limit = 5): Promise<AgentMemoryDto[]> {
    if (!query || query.trim().length === 0) {
      return this.repo.listMemories(userId, undefined, limit);
    }

    const searchResults = await this.repo.searchMemories(userId, query.trim(), limit);
    if (searchResults.length > 0) return searchResults;

    // Fallback: return top memories by importance score
    return this.repo.listMemories(userId, undefined, limit);
  }

  /**
   * Synthesizes and summarizes episodic or semantic memories into an executive briefing
   */
  async summarizeMemories(userId: string, memoryType?: MemoryType): Promise<{
    summary: string;
    totalMemoriesProcessed: number;
    keyThemes: string[];
    retentionScore: number;
  }> {
    const memories = await this.repo.listMemories(userId, memoryType, 30);

    if (memories.length === 0) {
      return {
        summary: 'No memories recorded yet. Agents will automatically index key learnings and milestones as you interact.',
        totalMemoriesProcessed: 0,
        keyThemes: ['Getting Started', 'Initial Goal Alignment'],
        retentionScore: 100,
      };
    }

    const keyThemes = Array.from(new Set(memories.map(m => m.contextKey))).slice(0, 5);
    const avgImportance = Math.round(memories.reduce((acc, m) => acc + m.importanceScore, 0) / memories.length);

    return {
      summary: `Synthesized ${memories.length} historical memories across ${keyThemes.length} context areas. Active focus areas include ${keyThemes.join(', ')}.`,
      totalMemoriesProcessed: memories.length,
      keyThemes,
      retentionScore: Math.min(98, Math.max(70, avgImportance + 10)),
    };
  }

  /**
   * Prunes stale or low-importance memories to optimize memory index efficiency
   */
  async pruneStaleMemories(userId: string, minImportanceScore = 40): Promise<{ prunedCount: number; remainingCount: number }> {
    const allMemories = await this.repo.listMemories(userId, undefined, 100);
    let prunedCount = 0;

    for (const mem of allMemories) {
      if (mem.importanceScore < minImportanceScore) {
        await this.repo.deleteMemory(mem.id, userId);
        prunedCount++;
      }
    }

    const remaining = await this.repo.listMemories(userId, undefined, 100);
    return {
      prunedCount,
      remainingCount: remaining.length,
    };
  }

  async listMemories(userId: string, memoryType?: MemoryType, limit = 50): Promise<AgentMemoryDto[]> {
    return this.repo.listMemories(userId, memoryType, limit);
  }

  async deleteMemory(memoryId: string, userId: string): Promise<boolean> {
    return this.repo.deleteMemory(memoryId, userId);
  }
}

export const agentMemoryService = new AgentMemoryService();
