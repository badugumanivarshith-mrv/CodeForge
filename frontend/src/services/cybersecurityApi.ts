import {
  ThreatDto,
  VulnerabilityDto,
  IncidentDto,
  SecurityOverviewDto,
  ThreatSeverity,
  ThreatStatus,
  VulnerabilityStatus,
  IncidentStatus,
} from '@codeforge/shared';

const API_BASE = '/api/v1/security';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const cybersecurityApi = {
  async getOverview(): Promise<SecurityOverviewDto> {
    try {
      const res = await fetch(`${API_BASE}/metrics`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock overview:', err);
    }
    return getOfflineOverview();
  },

  async listThreats(): Promise<ThreatDto[]> {
    try {
      const res = await fetch(`${API_BASE}/threats`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock threats:', err);
    }
    return getOfflineOverview().activeThreats;
  },

  async listVulnerabilities(): Promise<VulnerabilityDto[]> {
    try {
      const res = await fetch(`${API_BASE}/vulnerabilities`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock vulnerabilities:', err);
    }
    return getOfflineOverview().openVulnerabilities;
  },

  async declareIncident(dto: {
    title: string;
    description: string;
    severity: ThreatSeverity;
    assignedTeam: string;
  }): Promise<IncidentDto> {
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch (err) {
      console.warn('Fallback to offline mock declareIncident:', err);
    }

    return {
      id: `incident-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      severity: dto.severity,
      status: IncidentStatus.OPEN,
      assignedTeam: dto.assignedTeam,
      createdAt: new Date().toISOString(),
    };
  },
};

function getOfflineOverview(): SecurityOverviewDto {
  return {
    metrics: {
      aggregateRiskScore: 84.6,
      totalThreatsDetected: 12,
      mitigatedThreatsCount: 10,
      openVulnerabilitiesCount: 1,
      activeIncidentsCount: 1,
      calculatedAt: new Date().toISOString(),
    },
    recentEvents: [
      {
        id: 'event-seed-1',
        eventType: 'SQL Injection Attempt',
        sourceIp: '198.51.100.42',
        severity: ThreatSeverity.HIGH,
        payload: { targetEndpoint: '/api/v1/auth/login' },
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        id: 'event-seed-2',
        eventType: 'Brute Force Access Blocked',
        sourceIp: '203.0.113.110',
        severity: ThreatSeverity.MEDIUM,
        payload: { failedAttemptsCount: 15 },
        timestamp: new Date().toISOString(),
      },
    ],
    activeThreats: [
      {
        id: 'threat-seed-1',
        title: 'Credential Stuffing Botnet',
        description: 'Distributed attacks targeting endpoint portals using automated libraries.',
        severity: ThreatSeverity.HIGH,
        status: ThreatStatus.ACTIVE,
        affectedSystems: ['auth-service', 'user-gateway'],
        mitigationSteps: ['Enable Cloudflare rate-limits', 'Invalidate suspicious sessions'],
        detectedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
      },
    ],
    openVulnerabilities: [
      {
        id: 'vuln-seed-1',
        cveId: 'CVE-2026-38290',
        packageName: 'express-jwt',
        severity: ThreatSeverity.CRITICAL,
        status: VulnerabilityStatus.OPEN,
        cvssScore: 9.8,
        description: 'Remote Code Execution vulnerability due to insecure verification options configuration.',
        remediationPlan: 'Upgrade package express-jwt to version >= 8.4.2 immediately.',
        detectedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
      },
    ],
    recentIncidents: [
      {
        id: 'incident-seed-1',
        title: 'Suspicious Database Outbound Spikes',
        description: 'Unusual query telemetry exceeding threshold capacity patterns.',
        severity: ThreatSeverity.MEDIUM,
        status: IncidentStatus.CONTAINED,
        assignedTeam: 'SecOps-Alpha',
        containmentAction: 'Temporarily blocked outgoing cross-region replica calls.',
        createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      },
    ],
  };
}
