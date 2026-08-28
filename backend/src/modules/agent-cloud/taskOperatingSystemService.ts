import {
  TaskGraphNodeDto,
  CreateTaskNodeDto,
  TaskGraphEdgeDto,
  TaskOSPlanDto,
  TaskOSPriority,
  TaskOSStatus,
} from '@codeforge/shared';
import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';

export class TaskOperatingSystemService {
  private nodes: Map<string, TaskGraphNodeDto[]> = new Map();
  private edges: Map<string, TaskGraphEdgeDto[]> = new Map();

  constructor(private readonly agentCloudRepo: IAgentCloudRepository) {}

  async createTaskNode(userId: string, data: CreateTaskNodeDto): Promise<TaskGraphNodeDto> {
    const userNodes = this.nodes.get(userId) || [];
    const node: TaskGraphNodeDto = {
      id: `task_node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: data.title,
      description: data.description,
      priority: data.priority || TaskOSPriority.MEDIUM,
      status: TaskOSStatus.TODO,
      estimatedHours: data.estimatedHours || 4,
      assignedAgentId: data.assignedAgentId || null,
      dependencies: data.dependencies || [],
      goalAlignmentScore: 0.92,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userNodes.push(node);
    this.nodes.set(userId, userNodes);
    return node;
  }

  async getTaskGraph(userId: string): Promise<{ nodes: TaskGraphNodeDto[]; edges: TaskGraphEdgeDto[] }> {
    const userNodes = this.nodes.get(userId) || [];
    const userEdges = this.edges.get(userId) || [];
    return { nodes: userNodes, edges: userEdges };
  }

  async linkTasks(userId: string, fromNodeId: string, toNodeId: string, dependencyType: 'blocks' | 'relates_to' | 'enhances' = 'blocks'): Promise<TaskGraphEdgeDto> {
    const userEdges = this.edges.get(userId) || [];
    const edge: TaskGraphEdgeDto = {
      fromNodeId,
      toNodeId,
      dependencyType,
    };
    userEdges.push(edge);
    this.edges.set(userId, userEdges);
    return edge;
  }

  async updateTaskStatus(userId: string, taskId: string, status: TaskOSStatus): Promise<TaskGraphNodeDto | null> {
    const userNodes = this.nodes.get(userId) || [];
    const node = userNodes.find(n => n.id === taskId);
    if (!node) return null;

    node.status = status;
    node.updatedAt = new Date().toISOString();
    return node;
  }

  async generateSmartPlan(userId: string): Promise<TaskOSPlanDto> {
    const userNodes = this.nodes.get(userId) || [];
    const userEdges = this.edges.get(userId) || [];

    const criticalPath = userNodes.slice(0, 4).map(n => n.id);
    const totalEstHours = userNodes.reduce((sum, n) => sum + n.estimatedHours, 0) || 24;
    const completedNodes = userNodes.filter(n => n.status === TaskOSStatus.DONE);
    const completionRate = userNodes.length > 0 ? (completedNodes.length / userNodes.length) * 100 : 0;

    return {
      nodes: userNodes,
      edges: userEdges,
      criticalPath,
      totalEstimatedHours: totalEstHours,
      completionRate,
      urgentDeadlines: userNodes.filter(n => n.priority === TaskOSPriority.CRITICAL || n.priority === TaskOSPriority.HIGH),
    };
  }
}
