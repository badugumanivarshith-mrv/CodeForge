import {
  AgentCouncilDto,
  AgentCouncilType,
} from '@codeforge/shared';
import { ICognitiveCoreRepository } from '../../repositories/interfaces/ICognitiveCoreRepository';

export class AgentCouncilService {
  constructor(private cognitiveRepo: ICognitiveCoreRepository) {}

  /**
   * Initializes or returns default system councils
   */
  async ensureDefaultCouncils(): Promise<AgentCouncilDto[]> {
    const existing = await this.cognitiveRepo.listCouncils();
    if (existing.length >= 5) return existing;

    const defaults: Array<{ type: AgentCouncilType; name: string; charter: string }> = [
      {
        type: AgentCouncilType.ENGINEERING_COUNCIL,
        name: 'High-Throughput Engineering Council',
        charter: 'Deliberates on system scalability, compiler pipelines, distributed CRDTs, and zero-trust security.',
      },
      {
        type: AgentCouncilType.RESEARCH_COUNCIL,
        name: 'Autonomous Research & Foundations Council',
        charter: 'Evaluates neuro-symbolic logic proofs, academic literature synthesis, and emergent model benchmarks.',
      },
      {
        type: AgentCouncilType.CAREER_COUNCIL,
        name: 'Executive Talent & Career Strategy Council',
        charter: 'Optimizes developer career roadmaps, compensation benchmarks, and executive leadership development.',
      },
      {
        type: AgentCouncilType.EDUCATION_COUNCIL,
        name: 'Socratic Curriculum & Pedagogy Council',
        charter: 'Guides cognitive learning mastery, spaced repetition curves, and adaptive assessment rubrics.',
      },
      {
        type: AgentCouncilType.EXECUTIVE_COUNCIL,
        name: 'Cognitive Superintelligence Executive Council',
        charter: 'Orchestrates planetary compute allocation, long-range strategic roadmaps, and self-improvement mandates.',
      },
    ];

    const results: AgentCouncilDto[] = [];
    for (const d of defaults) {
      const match = existing.find((c) => c.councilType === d.type);
      if (match) {
        results.push(match);
      } else {
        const created = await this.cognitiveRepo.createCouncil({
          councilType: d.type,
          councilName: d.name,
          leadAgentId: `agent-chair-${d.type.toLowerCase().replace(/_/g, '-')}`,
          participatingAgentIds: [
            `agent-1-${d.type.toLowerCase()}`,
            `agent-2-${d.type.toLowerCase()}`,
            `agent-3-${d.type.toLowerCase()}`,
          ],
          activeDebatesCount: 2,
          consensusRatio: 0.95,
          charterStatement: d.charter,
        });
        results.push(created);
      }
    }
    return results;
  }

  async listCouncils(type?: AgentCouncilType): Promise<AgentCouncilDto[]> {
    await this.ensureDefaultCouncils();
    return this.cognitiveRepo.listCouncils(type);
  }

  async getCouncil(id: string): Promise<AgentCouncilDto | null> {
    return this.cognitiveRepo.getCouncil(id);
  }
}
