import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import {
  IntegrationDto,
  ConnectIntegrationDto,
  SyncIntegrationResultDto,
  IntegrationProvider,
  IntegrationStatus,
} from '@codeforge/shared';

export class IntegrationHubService {
  constructor(private repo: IEcosystemRepository) {}

  async connect(userId: string, data: ConnectIntegrationDto): Promise<IntegrationDto> {
    if (!data.provider) {
      throw new Error('Integration provider is required');
    }
    return this.repo.connectIntegration(userId, data);
  }

  async getIntegration(userId: string, provider: IntegrationProvider): Promise<IntegrationDto | null> {
    return this.repo.getIntegration(userId, provider);
  }

  async listIntegrations(userId: string): Promise<IntegrationDto[]> {
    return this.repo.listUserIntegrations(userId);
  }

  async syncIntegration(userId: string, provider: IntegrationProvider): Promise<SyncIntegrationResultDto> {
    const integration = await this.repo.getIntegration(userId, provider);
    if (!integration) {
      throw new Error(`Integration for provider ${provider} is not connected`);
    }

    // Generate mock realistic sync payload based on provider
    let itemsSynced = 0;
    let details = '';

    switch (provider) {
      case IntegrationProvider.GITHUB:
        itemsSynced = 14;
        details = 'Synchronized 8 pull requests, 4 repository stars, and 2 CI/CD workflow runs.';
        break;
      case IntegrationProvider.GITLAB:
        itemsSynced = 9;
        details = 'Synchronized 5 merge requests and 4 pipeline deployment artifacts.';
        break;
      case IntegrationProvider.JIRA:
        itemsSynced = 12;
        details = 'Synchronized 7 sprint issues, 3 epics, and 2 story backlog items.';
        break;
      case IntegrationProvider.NOTION:
        itemsSynced = 6;
        details = 'Synchronized 4 technical RFC documents and 2 team engineering runbooks.';
        break;
      case IntegrationProvider.SLACK:
        itemsSynced = 25;
        details = 'Synchronized 25 incident channel notifications and engineering alerts.';
        break;
      case IntegrationProvider.DISCORD:
        itemsSynced = 18;
        details = 'Synchronized 18 developer community discussions and agent output streams.';
        break;
      case IntegrationProvider.GOOGLE_DRIVE:
        itemsSynced = 5;
        details = 'Synchronized 5 architecture diagrams and system design slide decks.';
        break;
      case IntegrationProvider.GOOGLE_CALENDAR:
        itemsSynced = 8;
        details = 'Synchronized 8 upcoming technical interviews, mentor loops, and standups.';
        break;
      case IntegrationProvider.MS_TEAMS:
        itemsSynced = 11;
        details = 'Synchronized 11 enterprise sprint sync threads and incident rooms.';
        break;
      case IntegrationProvider.LINKEDIN:
        itemsSynced = 3;
        details = 'Synchronized 3 recruiter outreach InMails and skill profile endorsements.';
        break;
      default:
        itemsSynced = 1;
        details = 'Synchronized general workspace telemetry payload.';
    }

    await this.repo.updateIntegrationStatus(integration.id, userId, IntegrationStatus.CONNECTED);

    return {
      provider,
      status: IntegrationStatus.CONNECTED,
      itemsSynced,
      details,
      syncedAt: new Date().toISOString(),
    };
  }

  async disconnect(userId: string, provider: IntegrationProvider): Promise<boolean> {
    return this.repo.disconnectIntegration(userId, provider);
  }

  async getIntegrationCatalog(): Promise<{
    provider: IntegrationProvider;
    name: string;
    description: string;
    category: 'code' | 'project' | 'communication' | 'storage' | 'career';
    icon: string;
    authType: 'oauth2' | 'api_key' | 'webhook';
  }[]> {
    return [
      {
        provider: IntegrationProvider.GITHUB,
        name: 'GitHub',
        description: 'Sync repositories, pull requests, CI/CD telemetry, and automated PR review loops.',
        category: 'code',
        icon: 'github',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.GITLAB,
        name: 'GitLab',
        description: 'Connect enterprise GitLab repositories and auto-remediate pipeline build failures.',
        category: 'code',
        icon: 'gitlab',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.JIRA,
        name: 'Jira Software',
        description: 'Auto-generate story point estimates and synchronize Kanban backlog tasks.',
        category: 'project',
        icon: 'trello',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.NOTION,
        name: 'Notion',
        description: 'Ingest engineering RFCs, team wikis, and system design specifications into Knowledge Graph 2.0.',
        category: 'storage',
        icon: 'file-text',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.SLACK,
        name: 'Slack',
        description: 'Stream proactive agent alerts, milestone completions, and multi-agent channel notifications.',
        category: 'communication',
        icon: 'message-square',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.DISCORD,
        name: 'Discord',
        description: 'Broadcast community leaderboard updates and coding contest results to Discord servers.',
        category: 'communication',
        icon: 'hash',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.GOOGLE_DRIVE,
        name: 'Google Drive',
        description: 'Auto-export research reports, executive career roadmaps, and document summaries to Google Docs.',
        category: 'storage',
        icon: 'hard-drive',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.GOOGLE_CALENDAR,
        name: 'Google Calendar',
        description: 'Schedule spaced repetition learning blocks, mock interview loops, and mentor sessions.',
        category: 'career',
        icon: 'calendar',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.MS_TEAMS,
        name: 'Microsoft Teams',
        description: 'Deploy enterprise bot agents into Microsoft Teams squads and engineering channels.',
        category: 'communication',
        icon: 'users',
        authType: 'oauth2',
      },
      {
        provider: IntegrationProvider.LINKEDIN,
        name: 'LinkedIn',
        description: 'Synchronize verified skill badges, recruiter referral requests, and job application stages.',
        category: 'career',
        icon: 'linkedin',
        authType: 'oauth2',
      },
    ];
  }
}
