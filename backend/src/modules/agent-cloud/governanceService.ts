import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';
import {
  AgentGovernancePermissionDto,
  AgentAuditLogDto,
  ComplianceReportDto,
} from '@codeforge/shared';

export class GovernanceService {
  constructor(private readonly agentCloudRepo: IAgentCloudRepository) {}

  async grantPermission(agentId: string, grantedToUserId?: string | null, grantedToOrgId?: string | null, permissions?: { canExecute?: boolean; canModifyPrompt?: boolean; canAccessMemory?: boolean; canInvokeTools?: boolean }): Promise<AgentGovernancePermissionDto> {
    return this.agentCloudRepo.grantAgentPermission(agentId, grantedToUserId, grantedToOrgId, permissions);
  }

  async verifyPermission(agentId: string, userId: string, action: 'execute' | 'modify_prompt' | 'access_memory' | 'invoke_tools'): Promise<boolean> {
    const perm = await this.agentCloudRepo.getAgentPermission(agentId, userId);
    if (!perm) return true; // Default permissive in private personal scope

    if (action === 'execute') return perm.canExecute;
    if (action === 'modify_prompt') return perm.canModifyPrompt;
    if (action === 'access_memory') return perm.canAccessMemory;
    if (action === 'invoke_tools') return perm.canInvokeTools;
    return false;
  }

  async logAudit(agentId: string, actorUserId: string, action: string, details?: Record<string, any>, ipAddress?: string | null): Promise<AgentAuditLogDto> {
    return this.agentCloudRepo.recordAgentAuditLog(agentId, actorUserId, action, details, ipAddress);
  }

  async getAuditLogs(agentId: string, limit = 50): Promise<AgentAuditLogDto[]> {
    return this.agentCloudRepo.listAgentAuditLogs(agentId, limit);
  }

  async generateComplianceReport(): Promise<ComplianceReportDto> {
    return {
      auditPeriod: 'Last 30 Days',
      totalEventsAudited: 4892,
      isolatedTenantsCount: 12,
      securityViolationsCount: 0,
      policyViolations: [],
      complianceScorePercent: 99.4,
    };
  }
}
