import { test, describe } from 'node:test';
import assert from 'node:assert';
import { PluginEngineService } from '../../src/modules/plugins/pluginEngineService';
import {
  PluginType,
  PluginPermission,
} from '@codeforge/shared';

describe('Plugin Ecosystem & Sandboxing Unit Tests', () => {
  const createMockRepo = () => {
    const plugins = new Map<string, any>();
    const versions = new Map<string, any[]>();
    const installs = new Map<string, any>();

    return {
      plugins,
      versions,
      installs,
      async createPlugin(creatorId: string, data: any) {
        const plugin = {
          id: `plugin-${Date.now()}-${Math.random()}`,
          creatorId,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          pluginType: data.pluginType,
          requiredPermissions: data.requiredPermissions || [],
          repositoryUrl: data.repositoryUrl || null,
          isVerified: true,
          downloadCount: 0,
          ratingAverage: 5.0,
          ratingCount: 0,
          latestVersion: data.initialVersion || '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        plugins.set(plugin.id, plugin);
        return plugin;
      },
      async getPluginById(id: string) {
        return plugins.get(id) || null;
      },
      async listPlugins(type?: string) {
        let list = Array.from(plugins.values());
        if (type) {
          list = list.filter(p => p.pluginType === type);
        }
        return list;
      },
      async updatePlugin(id: string, creatorId: string, data: any) {
        const p = plugins.get(id);
        if (!p || p.creatorId !== creatorId) return null;
        const updated = { ...p, ...data, updatedAt: new Date().toISOString() };
        plugins.set(id, updated);
        return updated;
      },
      async deletePlugin(id: string, creatorId: string) {
        const p = plugins.get(id);
        if (!p || p.creatorId !== creatorId) return false;
        plugins.delete(id);
        return true;
      },
      async createPluginVersion(pluginId: string, data: any) {
        const v = {
          id: `ver-${Date.now()}`,
          pluginId,
          version: data.version,
          changelog: data.changelog,
          bundleUrl: data.bundleUrl,
          permissions: data.permissions,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        const list = versions.get(pluginId) || [];
        list.push(v);
        versions.set(pluginId, list);

        const plugin = plugins.get(pluginId);
        if (plugin) plugin.latestVersion = data.version;
        return v;
      },
      async listPluginVersions(pluginId: string) {
        return versions.get(pluginId) || [];
      },
      async installPlugin(userId: string, data: any) {
        const install = {
          id: `inst-${Date.now()}-${Math.random()}`,
          pluginId: data.pluginId,
          userId,
          installedVersion: '1.0.0',
          isEnabled: true,
          configuration: data.configuration || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        installs.set(`${userId}-${data.pluginId}`, install);

        const plugin = plugins.get(data.pluginId);
        if (plugin) plugin.downloadCount += 1;
        return install;
      },
      async uninstallPlugin(pluginId: string, userId: string) {
        const key = `${userId}-${pluginId}`;
        if (!installs.has(key)) return false;
        installs.delete(key);
        return true;
      },
      async listUserPluginInstalls(userId: string) {
        return Array.from(installs.values()).filter(i => i.userId === userId);
      },
      async togglePluginInstall(installId: string, userId: string, isEnabled: boolean) {
        for (const [k, v] of installs.entries()) {
          if (v.id === installId && v.userId === userId) {
            v.isEnabled = isEnabled;
            return v;
          }
        }
        return null;
      },
    };
  };

  test('1. initializes starter plugin suite with 4 sandboxed extensions', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);
    const plugins = await service.initializeStarterPlugins('admin-system');

    assert.strictEqual(plugins.length, 4);
    assert.ok(plugins.some(p => p.pluginType === PluginType.AI_TOOL));
    assert.ok(plugins.some(p => p.pluginType === PluginType.INTEGRATION));
    assert.ok(plugins.some(p => p.pluginType === PluginType.ENTERPRISE_EXTENSION));
  });

  test('2. registers new developer plugin with permissions manifest', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);

    const plugin = await service.registerPlugin('dev-1', {
      name: 'Prometheus & Grafana Alert Streamer',
      description: 'Pushes agentic task latency and memory telemetry to Prometheus endpoints.',
      pluginType: PluginType.ANALYTICS_EXTENSION,
      requiredPermissions: [PluginPermission.READ_WORKSPACE, PluginPermission.NETWORK_ACCESS],
      repositoryUrl: 'https://github.com/org/prometheus-streamer',
      initialVersion: '1.0.0',
    });

    assert.ok(plugin.id);
    assert.strictEqual(plugin.name, 'Prometheus & Grafana Alert Streamer');
    assert.strictEqual(plugin.pluginType, PluginType.ANALYTICS_EXTENSION);
  });

  test('3. audits plugin sandbox permissions and flags privileged access', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);

    const safeAudit = await service.auditPluginPermissions('p-1', [
      PluginPermission.READ_WORKSPACE,
      PluginPermission.NETWORK_ACCESS,
    ]);
    assert.strictEqual(safeAudit.isSafe, true);
    assert.strictEqual(safeAudit.highRiskPermissions.length, 0);

    const riskyAudit = await service.auditPluginPermissions('p-2', [
      PluginPermission.READ_WORKSPACE,
      PluginPermission.DATABASE_ACCESS,
      PluginPermission.EXECUTE_CODE,
    ]);
    assert.strictEqual(riskyAudit.isSafe, false);
    assert.strictEqual(riskyAudit.highRiskPermissions.length, 2);
    assert.ok(riskyAudit.reason.includes('privileged sandbox access'));
  });

  test('4. installs plugin for user and updates download metrics', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);
    const plugins = await service.initializeStarterPlugins('admin-system');

    const install = await service.installPlugin('user-1', {
      pluginId: plugins[0].id,
      configuration: { syncIntervalSeconds: 60 },
    });

    assert.ok(install.id);
    assert.strictEqual(install.isEnabled, true);

    const userInstalls = await service.listUserInstalls('user-1');
    assert.strictEqual(userInstalls.length, 1);
  });

  test('5. toggles plugin active/disabled state cleanly', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);
    const plugins = await service.initializeStarterPlugins('admin-system');

    const install = await service.installPlugin('user-2', { pluginId: plugins[0].id });
    assert.strictEqual(install.isEnabled, true);

    const disabled = await service.togglePlugin(install.id, 'user-2', false);
    assert.strictEqual(disabled?.isEnabled, false);

    const enabled = await service.togglePlugin(install.id, 'user-2', true);
    assert.strictEqual(enabled?.isEnabled, true);
  });

  test('6. uninstalls plugin and removes from user environment', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);
    const plugins = await service.initializeStarterPlugins('admin-system');

    await service.installPlugin('user-3', { pluginId: plugins[0].id });
    const uninstalled = await service.uninstallPlugin(plugins[0].id, 'user-3');
    assert.strictEqual(uninstalled, true);

    const userInstalls = await service.listUserInstalls('user-3');
    assert.strictEqual(userInstalls.length, 0);
  });

  test('7. publishes new semver version for existing plugin', async () => {
    const mockRepo = createMockRepo();
    const service = new PluginEngineService(mockRepo as any);
    const plugins = await service.initializeStarterPlugins('admin-system');

    const version = await service.publishVersion(plugins[0].id, {
      pluginId: plugins[0].id,
      version: '2.0.0',
      changelog: 'Added Prometheus v3 metrics schema support',
      bundleUrl: 'https://cdn.codeforge.dev/plugins/p1/bundle-v2.0.0.js',
      permissions: [PluginPermission.READ_WORKSPACE],
    });

    assert.strictEqual(version.version, '2.0.0');
    const allVersions = await service.listVersions(plugins[0].id);
    assert.ok(allVersions.some(v => v.version === '2.0.0'));
  });
});
