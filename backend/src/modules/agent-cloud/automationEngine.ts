import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';
import { EventBusService } from './eventBusService';
import { WorkflowEngineService } from './workflowEngineService';
import { AgentCloudService } from './agentCloudService';
import {
  AutomationRuleDto,
  CreateAutomationRuleDto,
  EventStreamDto,
  GlobalEventType,
} from '@codeforge/shared';

export class AutomationEngine {
  constructor(
    private readonly agentCloudRepo: IAgentCloudRepository,
    private readonly eventBus: EventBusService,
    private readonly workflowEngine: WorkflowEngineService,
    private readonly agentCloud: AgentCloudService
  ) {
    this.registerGlobalEventHandlers();
  }

  private registerGlobalEventHandlers(): void {
    const allEventTypes = Object.values(GlobalEventType);
    for (const eventType of allEventTypes) {
      this.eventBus.subscribe(eventType, async (event: EventStreamDto) => {
        await this.handleEvent(event);
      });
    }
  }

  async createRule(userId: string, data: CreateAutomationRuleDto): Promise<AutomationRuleDto> {
    if (!data.name || !data.triggerEvent) {
      throw new Error('Rule name and trigger event are required');
    }
    return this.agentCloudRepo.createAutomationRule(userId, data);
  }

  async listRules(userId: string, triggerEvent?: GlobalEventType): Promise<AutomationRuleDto[]> {
    return this.agentCloudRepo.listAutomationRules(userId, triggerEvent);
  }

  async handleEvent(event: EventStreamDto): Promise<{ executedRulesCount: number }> {
    if (!event.userId) return { executedRulesCount: 0 };

    const rules = await this.agentCloudRepo.listAutomationRules(event.userId, event.eventType);
    let executedRulesCount = 0;

    for (const rule of rules) {
      if (!rule.isActive) continue;

      // Condition expression evaluation
      if (rule.conditionExpression) {
        try {
          const pass = this.evaluateCondition(rule.conditionExpression, event.payload);
          if (!pass) continue;
        } catch {
          continue;
        }
      }

      // Execute target action
      if (rule.actionWorkflowId) {
        try {
          await this.workflowEngine.executeWorkflow(rule.actionWorkflowId, event.userId, {
            trigger: 'automation_rule',
            ruleId: rule.id,
            eventPayload: event.payload,
          }, event.eventType);
        } catch (err) {
          console.error(`[AutomationEngine] Failed to trigger workflow ${rule.actionWorkflowId}:`, err);
        }
      }

      if (rule.targetAgentId) {
        try {
          await this.agentCloud.runAgent(rule.targetAgentId, event.userId, {
            trigger: 'automation_rule',
            ruleId: rule.id,
            eventPayload: event.payload,
          });
        } catch (err) {
          console.error(`[AutomationEngine] Failed to trigger agent ${rule.targetAgentId}:`, err);
        }
      }

      await this.agentCloudRepo.incrementRuleExecution(rule.id);
      executedRulesCount++;
    }

    return { executedRulesCount };
  }

  private evaluateCondition(expression: string, payload: Record<string, any>): boolean {
    if (!expression || expression.trim() === '') return true;
    // Simple safe field match syntax: "key == 'value'" or "key != 'value'" or "key"
    try {
      if (expression.includes('==')) {
        const [k, v] = expression.split('==').map(s => s.trim().replace(/['"]/g, ''));
        return payload[k] == v;
      }
      if (expression.includes('!=')) {
        const [k, v] = expression.split('!=').map(s => s.trim().replace(/['"]/g, ''));
        return payload[k] != v;
      }
      return Boolean(payload[expression.trim()]);
    } catch {
      return false;
    }
  }
}
