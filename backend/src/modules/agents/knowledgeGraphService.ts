import { IAgenticWorkspaceRepository } from '../../repositories/interfaces/IAgenticWorkspaceRepository';
import { agenticWorkspaceRepository } from '../../repositories/AgenticWorkspaceRepository';
import {
  KnowledgeNodeDto,
  KnowledgeEdgeDto,
  KnowledgeGraphDto,
  KnowledgeNodeType,
  KnowledgeRelationType,
} from '@codeforge/shared';

export class KnowledgeGraphService {
  constructor(private repo: IAgenticWorkspaceRepository = agenticWorkspaceRepository) {}

  /**
   * Initializes starter knowledge graph nodes and connections for a user
   */
  async initializeDefaultKnowledgeGraph(userId: string): Promise<KnowledgeGraphDto> {
    const existing = await this.repo.getKnowledgeGraph(userId);
    if (existing.nodes.length >= 6) return existing;

    const defaultNodes = [
      { name: 'Distributed Consensus', nodeType: KnowledgeNodeType.CONCEPT, category: 'Distributed Systems' },
      { name: 'Raft Protocol', nodeType: KnowledgeNodeType.SKILL, category: 'Algorithms & Protocols' },
      { name: 'Rust Async Runtime', nodeType: KnowledgeNodeType.SKILL, category: 'Systems Programming' },
      { name: 'High-Throughput Key-Value Store', nodeType: KnowledgeNodeType.PROJECT, category: 'Infrastructure' },
      { name: 'Staff Infrastructure Architect', nodeType: KnowledgeNodeType.ROLE, category: 'Career Target' },
      { name: 'CodeForge Distributed Systems Master', nodeType: KnowledgeNodeType.CERTIFICATION, category: 'Credentials' },
    ];

    const createdNodes: KnowledgeNodeDto[] = [];
    for (const n of defaultNodes) {
      const node = await this.repo.createNode(userId, {
        name: n.name,
        nodeType: n.nodeType,
        category: n.category,
        properties: { source: 'SYSTEM_BOOTSTRAP' },
        confidenceScore: 95,
      });
      createdNodes.push(node);
    }

    if (createdNodes.length >= 5) {
      // Connect nodes with semantic edges
      await this.repo.createEdge(userId, {
        sourceNodeId: createdNodes[1].id, // Raft
        targetNodeId: createdNodes[0].id, // Distributed Consensus
        relationType: KnowledgeRelationType.REQUIRES,
        weight: 0.95,
      });

      await this.repo.createEdge(userId, {
        sourceNodeId: createdNodes[2].id, // Rust Async
        targetNodeId: createdNodes[3].id, // Key-Value Store Project
        relationType: KnowledgeRelationType.APPLIED_IN,
        weight: 0.90,
      });

      await this.repo.createEdge(userId, {
        sourceNodeId: createdNodes[0].id, // Distributed Consensus
        targetNodeId: createdNodes[4].id, // Staff Architect
        relationType: KnowledgeRelationType.HIRED_FOR,
        weight: 0.98,
      });

      await this.repo.createEdge(userId, {
        sourceNodeId: createdNodes[5].id, // Certification
        targetNodeId: createdNodes[4].id, // Staff Architect
        relationType: KnowledgeRelationType.ENABLES,
        weight: 0.88,
      });
    }

    return this.repo.getKnowledgeGraph(userId);
  }

  /**
   * Automatically extracts conceptual entities from text and creates semantic knowledge graph connections
   */
  async extractAndLinkEntities(userId: string, textContent: string): Promise<{ nodesAdded: number; edgesAdded: number }> {
    const text = textContent.toLowerCase();
    let nodesAdded = 0;
    let edgesAdded = 0;

    const candidateEntities: { name: string; type: KnowledgeNodeType; category: string }[] = [];

    if (text.includes('wasm') || text.includes('webassembly')) {
      candidateEntities.push({ name: 'WebAssembly / WASI', type: KnowledgeNodeType.SKILL, category: 'Edge Computing' });
    }
    if (text.includes('vector') || text.includes('embedding') || text.includes('rag')) {
      candidateEntities.push({ name: 'Vector Indexing & RAG', type: KnowledgeNodeType.SKILL, category: 'AI Engineering' });
    }
    if (text.includes('ebpf') || text.includes('kernel')) {
      candidateEntities.push({ name: 'eBPF Kernel Probes', type: KnowledgeNodeType.SKILL, category: 'Networking & SRE' });
    }
    if (text.includes('kubernetes') || text.includes('k8s')) {
      candidateEntities.push({ name: 'Kubernetes Platforming', type: KnowledgeNodeType.SKILL, category: 'Cloud Infrastructure' });
    }

    const created: KnowledgeNodeDto[] = [];
    for (const cand of candidateEntities) {
      const node = await this.repo.createNode(userId, {
        name: cand.name,
        nodeType: cand.type,
        category: cand.category,
        properties: { extractedFromText: true },
        confidenceScore: 90,
      });
      created.push(node);
      nodesAdded++;
    }

    const allNodes = await this.repo.listNodes(userId);
    if (created.length > 0 && allNodes.length > created.length) {
      const anchorNode = allNodes[0];
      for (const newNode of created) {
        await this.repo.createEdge(userId, {
          sourceNodeId: newNode.id,
          targetNodeId: anchorNode.id,
          relationType: KnowledgeRelationType.COMPLEMENTS,
          weight: 0.85,
        });
        edgesAdded++;
      }
    }

    return { nodesAdded, edgesAdded };
  }

  /**
   * Traverses knowledge graph to detect missing prerequisite skills for a target career role
   */
  async findSkillGaps(userId: string, targetRole = 'Staff Systems Architect'): Promise<{
    targetRole: string;
    acquiredSkills: string[];
    missingPrerequisites: { skill: string; importance: string; recommendation: string }[];
    readinessScore: number;
  }> {
    const graph = await this.getGraph(userId);
    const nodeNames = graph.nodes.map(n => n.name.toLowerCase());

    const prerequisites = [
      { skill: 'Distributed Consensus (Raft/Paxos)', importance: 'CRITICAL', recommendation: 'Complete Raft implementation sandbox.' },
      { skill: 'Zero-Copy Serialization & Memory Mapping', importance: 'HIGH', recommendation: 'Implement LSM-tree storage compaction.' },
      { skill: 'Fault-Tolerant Distributed Networking', importance: 'HIGH', recommendation: 'Build async RPC cluster communication.' },
      { skill: 'Cross-Squad Architecture RFC Governance', importance: 'MEDIUM', recommendation: 'Author technical blueprint and review.' },
    ];

    const missingPrerequisites = prerequisites.filter(
      p => !nodeNames.some(n => n.includes(p.skill.split(' ')[0].toLowerCase()))
    );

    const readinessScore = Math.max(30, Math.min(95, Math.round(((prerequisites.length - missingPrerequisites.length) / prerequisites.length) * 100)));

    return {
      targetRole,
      acquiredSkills: graph.nodes.filter(n => n.nodeType === KnowledgeNodeType.SKILL).map(n => n.name),
      missingPrerequisites,
      readinessScore,
    };
  }

  async getGraph(userId: string): Promise<KnowledgeGraphDto> {
    await this.initializeDefaultKnowledgeGraph(userId);
    return this.repo.getKnowledgeGraph(userId);
  }

  async addNode(userId: string, data: Omit<KnowledgeNodeDto, 'id' | 'userId' | 'createdAt'>): Promise<KnowledgeNodeDto> {
    return this.repo.createNode(userId, data);
  }

  async addEdge(userId: string, data: Omit<KnowledgeEdgeDto, 'id' | 'userId' | 'createdAt'>): Promise<KnowledgeEdgeDto> {
    return this.repo.createEdge(userId, data);
  }

  async deleteNode(nodeId: string, userId: string): Promise<boolean> {
    return this.repo.deleteNode(nodeId, userId);
  }

  async deleteEdge(edgeId: string, userId: string): Promise<boolean> {
    return this.repo.deleteEdge(edgeId, userId);
  }
}

export const knowledgeGraphService = new KnowledgeGraphService();
