import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TelemetryService } from '../../src/modules/agent-cloud/telemetryService';
import { GovernanceService } from '../../src/modules/agent-cloud/governanceService';
import { TelemetryMetricType } from '@codeforge/shared';

describe('AI Telemetry & Governance Security Unit Tests', () => {
  const createMockRepo = () => {
    const metrics: any[] = [];
    const permissions = new Map<string, any>();
    const logs: any[] = [];

    return {
      metrics,
      permissions,
      logs,
      async recordTelemetryMetric(data: any) {
        const item = {
          id: `tel_${Date.now()}_${Math.random()}`,
          metricType: data.metricType,
          agentId: data.agentId || null,
          userId: data.userId || null,
          value: data.value,
          unit: data.unit,
          tags: data.tags || {},
          timestamp: new Date().toISOString(),
        };
        metrics.push(item);
        return item;
      },
      async listTelemetryMetrics(agentId?: string | null, metricType?: TelemetryMetricType, limit = 50) {
        let list = [...metrics];
        if (agentId) list = list.filter(m => m.agentId === agentId);
        if (metricType) list = list.filter(m => m.metricType === metricType);
        return list.slice(0, limit);
      },
      async grantAgentPermission(agentId: string, grantedToUserId?: string | null, grantedToOrgId?: string | null, permissionsObj?: any) {
        const item = {
          id: `perm_${Date.now()}`,
          agentId,
          grantedToUserId: grantedToUserId || null,
          grantedToOrgId: grantedToOrgId || null,
          canExecute: permissionsObj?.canExecute ?? true,
          canModifyPrompt: permissionsObj?.canModifyPrompt ?? false,
          canAccessMemory: permissionsObj?.canAccessMemory ?? false,
          canInvokeTools: permissionsObj?.canInvokeTools ?? true,
          createdAt: new Date().toISOString(),
        };
        permissions.set(`${agentId}_${grantedToUserId}`, item);
        return item;
      },
      async getAgentPermission(agentId: string, userId?: string | null) {
        return permissions.get(`${agentId}_${userId}`) || null;
      },
      async recordAgentAuditLog(agentId: string, actorUserId: string, action: string, details?: any, ipAddress?: string | null) {
        const item = {
          id: `log_${Date.now()}_${Math.random()}`,
          agentId,
          actorUserId,
          action,
          details: details || {},
          ipAddress: ipAddress || null,
          timestamp: new Date().toISOString(),
        };
        logs.unshift(item);
        return item;
      },
      async listAgentAuditLogs(agentId: string, limit = 50) {
        return logs.filter(l => l.agentId === agentId).slice(0, limit);
      },
    };
  };

  test('should record telemetry metrics and generate comprehensive observability dashboard', async () => {
    const mockRepo = createMockRepo();
    const service = new TelemetryService(mockRepo as any);

    await service.recordMetric({
      metricType: TelemetryMetricType.TOKEN_USAGE,
      agentId: 'ag-1',
      value: 1250,
      unit: 'tokens',
      tags: { model: 'gemini-pro' },
    });

    await service.recordMetric({
      metricType: TelemetryMetricType.EXECUTION_TIME,
      agentId: 'ag-1',
      value: 340,
      unit: 'ms',
    });

    const dashboard = await service.getDashboardSummary('user-1');
    assert.strictEqual(dashboard.totalAgentsOnline, 14);
    assert.ok(dashboard.totalTokensConsumed24h >= 1250);
    assert.ok(dashboard.costBreakdown.agentExecutionCostUsd > 0);
  });

  test('should enforce granular permissions, log immutable audit trails, and generate compliance report', async () => {
    const mockRepo = createMockRepo();
    const service = new GovernanceService(mockRepo as any);

    await service.grantPermission('ag-1', 'user-1', null, {
      canExecute: true,
      canInvokeTools: true,
      canModifyPrompt: false,
      canAccessMemory: false,
    });

    const hasToolPerm = await service.verifyPermission('ag-1', 'user-1', 'invoke_tools');
    assert.strictEqual(hasToolPerm, true);

    const hasModifyPromptPerm = await service.verifyPermission('ag-1', 'user-1', 'modify_prompt');
    assert.strictEqual(hasModifyPromptPerm, false);

    await service.logAudit('ag-1', 'admin-user', 'EXECUTE_PIPELINE', { pipelineId: 'pipe-99' });

    const logs = await service.getAuditLogs('ag-1');
    assert.strictEqual(logs.length, 1);
    assert.strictEqual(logs[0].action, 'EXECUTE_PIPELINE');

    const report = await service.generateComplianceReport();
    assert.strictEqual(report.complianceScorePercent, 99.4);
    assert.strictEqual(report.securityViolationsCount, 0);
  });
});
