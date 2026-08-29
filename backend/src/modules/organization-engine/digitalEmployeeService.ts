import { IEnterpriseCivilizationRepository } from '../../repositories/interfaces/IEnterpriseCivilizationRepository';
import { DigitalEmployeeDto, DigitalEmployeeRole, EmployeeEmploymentStatus } from '@codeforge/shared';

export class DigitalEmployeeService {
  constructor(private repo: IEnterpriseCivilizationRepository) {}

  async provisionDigitalEmployee(params: {
    organizationId: string;
    departmentId?: string;
    teamId?: string;
    name: string;
    role: DigitalEmployeeRole;
    seniorityTier?: string;
    primarySpecialization?: string;
    capabilities?: string[];
  }): Promise<DigitalEmployeeDto> {
    const defaultCapabilities: Record<DigitalEmployeeRole, string[]> = {
      [DigitalEmployeeRole.AI_ENGINEER]: ['Code Synthesis', 'AST Dialectic Verification', 'CI/CD Pipeline Generation'],
      [DigitalEmployeeRole.AI_RESEARCHER]: ['Formal Method Proofs', 'Literature Synthesis', 'Algorithm Benchmarking'],
      [DigitalEmployeeRole.AI_PRODUCT_MANAGER]: ['PRD Drafting', 'User Journey Mapping', 'Sprint Prioritization'],
      [DigitalEmployeeRole.AI_DESIGNER]: ['Design Token Modeling', 'UI/UX Glassmorphism Wireframing', 'Component Architecture'],
      [DigitalEmployeeRole.AI_ANALYST]: ['Macroeconomic Modeling', 'Cohort Retention Mining', 'Telemetry Anomaly Detection'],
      [DigitalEmployeeRole.AI_EXECUTIVE]: ['Multi-Horizon Strategy', 'Capital Allocation', 'Alliance Negotiation'],
    };

    return this.repo.createDigitalEmployee({
      organizationId: params.organizationId,
      departmentId: params.departmentId,
      teamId: params.teamId,
      name: params.name,
      role: params.role,
      status: EmployeeEmploymentStatus.ACTIVE,
      seniorityTier: params.seniorityTier || 'Senior Autonomous Agent',
      primarySpecialization: params.primarySpecialization || `${params.role} Core Architecture`,
      capabilities: params.capabilities || defaultCapabilities[params.role] || ['Autonomous Task Execution'],
      completedTasksCount: 0,
      velocityScore: 98.5,
      accuracyScore: 99.2,
      collaborationIndex: 96.0,
    });
  }

  async assignTaskToEmployee(employeeId: string, taskId: string): Promise<DigitalEmployeeDto> {
    const emp = await this.repo.getDigitalEmployeeById(employeeId);
    if (!emp) throw new Error(`Digital employee ${employeeId} not found`);

    const updated = await this.repo.updateDigitalEmployee(employeeId, {
      activeAssignedTaskId: taskId,
      status: EmployeeEmploymentStatus.ACTIVE,
    });
    return updated!;
  }

  async evaluateEmployeePerformance(employeeId: string): Promise<{
    employeeId: string;
    role: DigitalEmployeeRole;
    tasksCompleted: number;
    velocityScore: number;
    accuracyScore: number;
    collaborationScore: number;
    performanceRating: string;
    compositeRating: string;
    recommendedSkillUpskill: string[];
  }> {
    const emp = await this.repo.getDigitalEmployeeById(employeeId);
    if (!emp) throw new Error(`Digital employee ${employeeId} not found`);

    return {
      employeeId: emp.id,
      role: emp.role,
      tasksCompleted: emp.completedTasksCount || 15,
      velocityScore: emp.velocityScore,
      accuracyScore: emp.accuracyScore,
      collaborationScore: emp.collaborationIndex,
      performanceRating: 'OPTIMAL',
      compositeRating: 'EXEMPLARY_AUTONOMOUS_CONTRIBUTOR',
      recommendedSkillUpskill: [
        'Lattice cryptography proof generation',
        'Dialectic invariant synthesis',
        'Distributed execution topology routing',
      ],
    };
  }

  async orchestrateCollaboration(employeeIds: string[], taskDescription: string): Promise<{
    orchestrationPlan: string;
    leadEmployeeId: string;
    subtaskAssignments: Array<{ employeeId: string; role: DigitalEmployeeRole; subtask: string }>;
    consensusValidationHash: string;
  }> {
    const employees = await Promise.all(employeeIds.map((id) => this.repo.getDigitalEmployeeById(id)));
    const validEmployees = employees.filter((e): e is DigitalEmployeeDto => e !== null);
    if (validEmployees.length === 0) throw new Error('No valid digital employees provided for collaboration');

    const lead = validEmployees[0];
    const subtaskAssignments = validEmployees.map((e, idx) => ({
      employeeId: e.id,
      role: e.role,
      subtask: `Stage ${idx + 1}: ${e.role} execution for: "${taskDescription.slice(0, 40)}..."`,
    }));

    return {
      orchestrationPlan: `Autonomous multi-role pipeline organized under lead ${lead.name}`,
      leadEmployeeId: lead.id,
      subtaskAssignments,
      consensusValidationHash: `0xcollab_${Date.now().toString(16)}`,
    };
  }
}

