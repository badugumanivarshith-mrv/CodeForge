import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import {
  PluginDto,
  CreatePluginDto,
  UpdatePluginDto,
  PluginVersionDto,
  CreatePluginVersionDto,
  PluginInstallDto,
  InstallPluginDto,
  PluginType,
  PluginPermission,
} from '@codeforge/shared';

export class PluginEngineService {
  constructor(private repo: IEcosystemRepository) {}

  async initializeStarterPlugins(creatorId: string): Promise<PluginDto[]> {
    const existing = await this.repo.listPlugins();
    if (existing.length >= 4) {
      return existing;
    }

    const starterPlugins: CreatePluginDto[] = [
      {
        name: 'GitHub CI/CD & Pull Request Telemetry Plugin',
        description: 'Synchronizes GitHub pull requests, runs automated checks, and streams build failures directly into Agentic Workspace.',
        pluginType: PluginType.INTEGRATION,
        requiredPermissions: [PluginPermission.READ_WORKSPACE, PluginPermission.NETWORK_ACCESS, PluginPermission.WEBHOOK_SEND],
        repositoryUrl: 'https://github.com/codeforge-plugins/github-telemetry',
        initialVersion: '1.2.0',
      },
      {
        name: 'PostgreSQL Advanced Query Profiler & EXPLAIN Tool',
        description: 'Exposes database EXPLAIN ANALYZE introspection tools to Coding Agents for real-time index optimization recommendations.',
        pluginType: PluginType.AI_TOOL,
        requiredPermissions: [PluginPermission.DATABASE_ACCESS, PluginPermission.EXECUTE_CODE],
        repositoryUrl: 'https://github.com/codeforge-plugins/pg-query-profiler',
        initialVersion: '2.0.1',
      },
      {
        name: 'Jira Agile Sprint & Epic Sync Extension',
        description: 'Connects Jira cloud instances to autonomously generate story point estimates and map user stories to task execution graphs.',
        pluginType: PluginType.WORKFLOW_EXTENSION,
        requiredPermissions: [PluginPermission.READ_WORKSPACE, PluginPermission.WRITE_WORKSPACE, PluginPermission.NETWORK_ACCESS],
        repositoryUrl: 'https://github.com/codeforge-plugins/jira-sprint-sync',
        initialVersion: '1.0.4',
      },
      {
        name: 'Enterprise SOC2 Compliance & Secret Guard',
        description: 'Scans all multi-agent prompts, memory layers, and code generation outputs for PII, API tokens, and secret entropy leaks.',
        pluginType: PluginType.ENTERPRISE_EXTENSION,
        requiredPermissions: [PluginPermission.ACCESS_MEMORY, PluginPermission.READ_WORKSPACE],
        repositoryUrl: 'https://github.com/codeforge-plugins/soc2-secret-guard',
        initialVersion: '3.1.0',
      },
    ];

    const created: PluginDto[] = [];
    for (const plugin of starterPlugins) {
      const p = await this.repo.createPlugin(creatorId, plugin);
      created.push(p);
    }
    return created;
  }

  async registerPlugin(creatorId: string, data: CreatePluginDto): Promise<PluginDto> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Plugin name is required');
    }
    if (!data.requiredPermissions || data.requiredPermissions.length === 0) {
      data.requiredPermissions = [PluginPermission.READ_WORKSPACE];
    }
    return this.repo.createPlugin(creatorId, data);
  }

  async getPluginById(id: string): Promise<PluginDto | null> {
    return this.repo.getPluginById(id);
  }

  async listPlugins(type?: string): Promise<PluginDto[]> {
    return this.repo.listPlugins(type);
  }

  async updatePlugin(id: string, creatorId: string, data: UpdatePluginDto): Promise<PluginDto | null> {
    return this.repo.updatePlugin(id, creatorId, data);
  }

  async deletePlugin(id: string, creatorId: string): Promise<boolean> {
    return this.repo.deletePlugin(id, creatorId);
  }

  async publishVersion(pluginId: string, data: CreatePluginVersionDto): Promise<PluginVersionDto> {
    if (!data.version) {
      throw new Error('Version string is required');
    }
    return this.repo.createPluginVersion(pluginId, data);
  }

  async listVersions(pluginId: string): Promise<PluginVersionDto[]> {
    return this.repo.listPluginVersions(pluginId);
  }

  async installPlugin(userId: string, data: InstallPluginDto): Promise<PluginInstallDto> {
    const plugin = await this.repo.getPluginById(data.pluginId);
    if (!plugin) {
      throw new Error('Plugin not found in registry');
    }
    return this.repo.installPlugin(userId, data);
  }

  async uninstallPlugin(pluginId: string, userId: string): Promise<boolean> {
    return this.repo.uninstallPlugin(pluginId, userId);
  }

  async listUserInstalls(userId: string): Promise<PluginInstallDto[]> {
    return this.repo.listUserPluginInstalls(userId);
  }

  async togglePlugin(installId: string, userId: string, isEnabled: boolean): Promise<PluginInstallDto | null> {
    return this.repo.togglePluginInstall(installId, userId, isEnabled);
  }

  async auditPluginPermissions(pluginId: string, requestedPermissions: PluginPermission[]): Promise<{
    isSafe: boolean;
    highRiskPermissions: PluginPermission[];
    reason: string;
  }> {
    const highRisk = [
      PluginPermission.DATABASE_ACCESS,
      PluginPermission.EXECUTE_CODE,
      PluginPermission.ACCESS_MEMORY,
    ];

    const flagged = requestedPermissions.filter(p => highRisk.includes(p));
    return {
      isSafe: flagged.length === 0,
      highRiskPermissions: flagged,
      reason: flagged.length > 0
        ? `Plugin requests privileged sandbox access: [${flagged.join(', ')}]. User confirmation required.`
        : 'All requested permissions are within standard sandboxed isolation limits.',
    };
  }
}
