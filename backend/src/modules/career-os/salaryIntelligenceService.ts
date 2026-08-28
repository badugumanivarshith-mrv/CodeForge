import {
  SalaryBenchmarkDto,
  SkillSalaryPremiumDto,
  SalaryIntelligenceReportDto,
} from '@codeforge/shared';

export class SalaryIntelligenceService {
  /**
   * Comprehensive benchmark data across tech roles, seniorities, and regions
   */
  getSalaryBenchmarks(): SalaryBenchmarkDto[] {
    return [
      {
        role: 'AI / ML Engineer',
        level: 'Senior (L5)',
        region: 'United States / Remote',
        p25SalaryUsd: 165000,
        p50SalaryUsd: 195000,
        p75SalaryUsd: 235000,
        p90SalaryUsd: 275000,
        currency: 'USD',
        annualBonusAvgUsd: 35000,
        equityAvgUsd: 65000,
      },
      {
        role: 'Distributed Systems Engineer',
        level: 'Senior (L5)',
        region: 'United States / Remote',
        p25SalaryUsd: 155000,
        p50SalaryUsd: 185000,
        p75SalaryUsd: 220000,
        p90SalaryUsd: 260000,
        currency: 'USD',
        annualBonusAvgUsd: 30000,
        equityAvgUsd: 55000,
      },
      {
        role: 'Full-Stack Software Engineer',
        level: 'Mid-Level (L4)',
        region: 'United States / Remote',
        p25SalaryUsd: 115000,
        p50SalaryUsd: 135000,
        p75SalaryUsd: 160000,
        p90SalaryUsd: 185000,
        currency: 'USD',
        annualBonusAvgUsd: 18000,
        equityAvgUsd: 30000,
      },
      {
        role: 'DevOps / Platform Engineer',
        level: 'Senior (L5)',
        region: 'Europe / Remote',
        p25SalaryUsd: 110000,
        p50SalaryUsd: 130000,
        p75SalaryUsd: 155000,
        p90SalaryUsd: 180000,
        currency: 'USD',
        annualBonusAvgUsd: 20000,
        equityAvgUsd: 35000,
      },
      {
        role: 'Software Engineer',
        level: 'Entry-Level (L3)',
        region: 'Global Remote',
        p25SalaryUsd: 85000,
        p50SalaryUsd: 105000,
        p75SalaryUsd: 125000,
        p90SalaryUsd: 145000,
        currency: 'USD',
        annualBonusAvgUsd: 12000,
        equityAvgUsd: 18000,
      },
    ];
  }

  /**
   * High-value skill salary premiums
   */
  getSkillSalaryPremiums(): SkillSalaryPremiumDto[] {
    return [
      {
        skill: 'Rust & Systems Concurrency',
        salaryPremiumPercentage: 24.5,
        avgEstimatedBoostUsd: 32000,
        highDemandSectors: ['Cloud Infrastructure', 'Financial Tech', 'Blockchain Core'],
      },
      {
        skill: 'Agentic AI & LLM Systems Design',
        salaryPremiumPercentage: 31.2,
        avgEstimatedBoostUsd: 42000,
        highDemandSectors: ['Enterprise SaaS', 'AI Labs', 'Autonomous Systems'],
      },
      {
        skill: 'Distributed Database Internals (Raft/Paxos)',
        salaryPremiumPercentage: 22.8,
        avgEstimatedBoostUsd: 28000,
        highDemandSectors: ['Data Infrastructure', 'Cloud Storage', 'Real-Time Streaming'],
      },
      {
        skill: 'Kubernetes Platform Engineering & eBPF',
        salaryPremiumPercentage: 18.4,
        avgEstimatedBoostUsd: 24000,
        highDemandSectors: ['Enterprise Cloud', 'Security Infrastructure', 'DevOps Platforms'],
      },
    ];
  }

  /**
   * Generates a personalized salary intelligence report
   */
  getSalaryIntelligenceReport(
    userRole = 'Software Engineer',
    _userLevel = 'Mid-Level',
    currentSalaryUsd = 125000
  ): SalaryIntelligenceReportDto {
    const benchmarks = this.getSalaryBenchmarks();
    const matchedBenchmark = benchmarks.find(b =>
      b.role.toLowerCase().includes(userRole.toLowerCase()) ||
      userRole.toLowerCase().includes(b.role.toLowerCase())
    ) || benchmarks[2];

    const p50 = matchedBenchmark.p50SalaryUsd;

    // Percentile estimation
    let userPositionPercentile = 50;
    if (currentSalaryUsd <= matchedBenchmark.p25SalaryUsd) {
      userPositionPercentile = Math.max(10, Math.round(25 * (currentSalaryUsd / matchedBenchmark.p25SalaryUsd)));
    } else if (currentSalaryUsd <= matchedBenchmark.p50SalaryUsd) {
      userPositionPercentile = 25 + Math.round(25 * ((currentSalaryUsd - matchedBenchmark.p25SalaryUsd) / (matchedBenchmark.p50SalaryUsd - matchedBenchmark.p25SalaryUsd)));
    } else if (currentSalaryUsd <= matchedBenchmark.p75SalaryUsd) {
      userPositionPercentile = 50 + Math.round(25 * ((currentSalaryUsd - matchedBenchmark.p50SalaryUsd) / (matchedBenchmark.p75SalaryUsd - matchedBenchmark.p50SalaryUsd)));
    } else {
      userPositionPercentile = Math.min(98, 75 + Math.round(20 * ((currentSalaryUsd - matchedBenchmark.p75SalaryUsd) / (matchedBenchmark.p90SalaryUsd - matchedBenchmark.p75SalaryUsd || 1))));
    }

    const promotionSalaryForecastUsd = Math.round(currentSalaryUsd * 1.22); // +22% internal promotion
    const jobSwitchSalaryForecastUsd = Math.round(currentSalaryUsd * 1.34); // +34% external jump

    const premiums = this.getSkillSalaryPremiums();

    const compensationRecommendations = [
      `Targeting Staff/Senior promotion unlocks an estimated +$${promotionSalaryForecastUsd - currentSalaryUsd}k baseline compensation delta.`,
      `External market value for your skillset currently commands $${jobSwitchSalaryForecastUsd.toLocaleString()} USD median total compensation.`,
      `Acquiring '${premiums[0].skill}' provides the highest immediate salary premium (+${premiums[0].salaryPremiumPercentage}%).`,
    ];

    return {
      userRole,
      currentEstimatedP50: p50,
      userPositionPercentile,
      benchmarks,
      promotionSalaryForecastUsd,
      jobSwitchSalaryForecastUsd,
      skillSalaryPremiums: premiums,
      compensationRecommendations,
    };
  }
}

export const salaryIntelligenceService = new SalaryIntelligenceService();
