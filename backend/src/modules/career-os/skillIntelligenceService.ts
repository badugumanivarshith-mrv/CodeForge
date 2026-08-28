import {
  SkillDemandCategory,
  SkillMarketDemandForecastDto,
  SkillMarketIntelligenceDto,
} from '@codeforge/shared';

export class SkillIntelligenceService {
  /**
   * Generates comprehensive market skill demand forecasts across all major engineering vectors
   */
  forecastSkillDemand(skillFilter?: string): SkillMarketDemandForecastDto[] {
    const allSkills: SkillMarketDemandForecastDto[] = [
      {
        skill: 'Agentic AI Workflows & Tool Calling',
        category: 'AI Engineering',
        demandCategory: SkillDemandCategory.EXPLODING,
        demandScore: 98,
        growthRatePercentage: 142.5,
        forecast6Months: 110000,
        forecast1Year: 185000,
        forecast3Years: 340000,
        forecast5Years: 520000,
        isEmerging: true,
        isRecommended: true,
      },
      {
        skill: 'Rust for High-Performance Distributed Systems',
        category: 'Systems & Infrastructure',
        demandCategory: SkillDemandCategory.EXPLODING,
        demandScore: 94,
        growthRatePercentage: 86.4,
        forecast6Months: 75000,
        forecast1Year: 125000,
        forecast3Years: 240000,
        forecast5Years: 380000,
        isEmerging: true,
        isRecommended: true,
      },
      {
        skill: 'Vector Embeddings & Semantic Search Indexes',
        category: 'Data & AI Infrastructure',
        demandCategory: SkillDemandCategory.GROWING,
        demandScore: 91,
        growthRatePercentage: 64.2,
        forecast6Months: 88000,
        forecast1Year: 135000,
        forecast3Years: 220000,
        forecast5Years: 310000,
        isEmerging: false,
        isRecommended: true,
      },
      {
        skill: 'TypeScript & Full-Stack Cloud Architecture',
        category: 'Software Engineering',
        demandCategory: SkillDemandCategory.STABLE,
        demandScore: 89,
        growthRatePercentage: 24.5,
        forecast6Months: 240000,
        forecast1Year: 280000,
        forecast3Years: 320000,
        forecast5Years: 360000,
        isEmerging: false,
        isRecommended: true,
      },
      {
        skill: 'Kubernetes, eBPF & Cloud Native Platforming',
        category: 'DevOps & SRE',
        demandCategory: SkillDemandCategory.GROWING,
        demandScore: 87,
        growthRatePercentage: 42.8,
        forecast6Months: 95000,
        forecast1Year: 130000,
        forecast3Years: 210000,
        forecast5Years: 280000,
        isEmerging: false,
        isRecommended: true,
      },
      {
        skill: 'Monolithic PHP / Legacy jQuery Scripting',
        category: 'Legacy Web',
        demandCategory: SkillDemandCategory.DECLINING,
        demandScore: 28,
        growthRatePercentage: -38.4,
        forecast6Months: 35000,
        forecast1Year: 22000,
        forecast3Years: 9000,
        forecast5Years: 3500,
        isEmerging: false,
        isRecommended: false,
      },
      {
        skill: 'Flash ActionScript & ActiveX Systems',
        category: 'Obsolete Web',
        demandCategory: SkillDemandCategory.OBSOLETE,
        demandScore: 4,
        growthRatePercentage: -92.1,
        forecast6Months: 200,
        forecast1Year: 50,
        forecast3Years: 0,
        forecast5Years: 0,
        isEmerging: false,
        isRecommended: false,
      },
    ];

    if (!skillFilter) return allSkills;
    return allSkills.filter(s =>
      s.skill.toLowerCase().includes(skillFilter.toLowerCase()) ||
      s.category.toLowerCase().includes(skillFilter.toLowerCase())
    );
  }

  /**
   * Returns market intelligence snapshot
   */
  getMarketSkillIntelligence(): SkillMarketIntelligenceDto {
    const all = this.forecastSkillDemand();
    const exploding = all.filter(s => s.demandCategory === SkillDemandCategory.EXPLODING);
    const topInDemand = all.filter(s => s.demandScore >= 85);
    const declining = all.filter(s => s.demandCategory === SkillDemandCategory.DECLINING || s.demandCategory === SkillDemandCategory.OBSOLETE);

    return {
      asOf: new Date().toISOString(),
      topInDemandSkills: topInDemand,
      explodingSkills: exploding,
      decliningSkills: declining,
      emergingTechnologies: [
        { tech: 'Wasm / WASI Micro-Runtimes', domain: 'Edge Computing', adoptionVelocity: 'Very High (+118% YoY)' },
        { tech: 'Multi-Agent LLM Orchestration', domain: 'GenAI & Automation', adoptionVelocity: 'Exponential (+195% YoY)' },
        { tech: 'Zero-Knowledge Proofs & Cryptography', domain: 'Security & Web3', adoptionVelocity: 'High (+62% YoY)' },
      ],
      recommendedLearningFocus: [
        'Agentic AI Workflows & Tool Calling',
        'Rust for High-Performance Distributed Systems',
        'Vector Embeddings & Semantic Search Indexes',
      ],
    };
  }

  /**
   * Generates personalized skill recommendation gaps based on current user skills
   */
  getPersonalizedSkillRecommendations(userSkills: string[]): string[] {
    const market = this.getMarketSkillIntelligence();
    const lowerUserSkills = userSkills.map(s => s.toLowerCase());

    return market.recommendedLearningFocus.filter(rec =>
      !lowerUserSkills.some(u => rec.toLowerCase().includes(u) || u.includes(rec.toLowerCase()))
    );
  }
}

export const skillIntelligenceService = new SkillIntelligenceService();
