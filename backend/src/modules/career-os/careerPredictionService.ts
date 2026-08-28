import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import { careerTwinService, CareerTwinService } from './careerTwinService';
import {
  ForecastHorizon,
  CareerPredictionDto,
  CareerPredictionReportDto,
} from '@codeforge/shared';

export class CareerPredictionService {
  constructor(
    private repo: ICareerOsRepository = careerOsRepository,
    private twinService: CareerTwinService = careerTwinService
  ) {}

  /**
   * Generates probabilistic forecasts across all 4 time horizons (6M, 1Y, 3Y, 5Y)
   */
  async generatePredictions(userId: string): Promise<CareerPredictionReportDto> {
    const twin = await this.twinService.getOrCreateTwin(userId);

    const baseHealth = twin.healthScore;
    const baseMom = twin.careerMomentum;
    const baseLead = twin.leadershipPotential;
    const baseComp = twin.marketCompetitiveness;

    const clamp = (val: number) => Math.max(5, Math.min(98, Math.round(val)));

    const predictions: CareerPredictionDto[] = [
      // 1. 6 Months Horizon
      {
        horizon: ForecastHorizon.MONTHS_6,
        promotionProbability: clamp(baseMom * 0.75 + 10),
        salaryGrowthProbability: clamp(baseComp * 0.80 + 12),
        jobSwitchProbability: clamp(baseComp * 0.70 + 15),
        leadershipReadiness: clamp(baseLead * 0.85 + 5),
        skillRelevanceScore: clamp(baseHealth * 0.95),
        careerRiskScore: clamp(100 - baseHealth * 0.85),
        confidenceScore: 92, // Short-term high confidence
        predictedRoles: [twin.currentRole, `${twin.currentRole} (Lead Track)`],
        growthDrivers: [
          'Strong contest arena rating progression',
          'High weekly problem-solving commit frequency',
        ],
        riskFactors: [
          'Lack of cross-team architecture RFC contributions',
        ],
      },
      // 2. 1 Year Horizon
      {
        horizon: ForecastHorizon.YEAR_1,
        promotionProbability: clamp(baseMom * 0.88 + 8),
        salaryGrowthProbability: clamp(baseComp * 0.90 + 8),
        jobSwitchProbability: clamp(baseComp * 0.85 + 10),
        leadershipReadiness: clamp(baseLead * 0.92 + 8),
        skillRelevanceScore: clamp(baseHealth * 0.90),
        careerRiskScore: clamp(100 - baseHealth * 0.80),
        confidenceScore: 86,
        predictedRoles: [twin.targetRole, `Staff Software Engineer`],
        growthDrivers: [
          `Mastery in ${twin.primarySkills[0] || 'Distributed Systems'}`,
          'Completion of verified enterprise certifications',
        ],
        riskFactors: [
          'Emergence of new generative agent frameworks requiring upskilling',
        ],
      },
      // 3. 3 Years Horizon
      {
        horizon: ForecastHorizon.YEARS_3,
        promotionProbability: clamp(baseMom * 0.92 + 6),
        salaryGrowthProbability: clamp(baseComp * 0.94 + 5),
        jobSwitchProbability: clamp(75),
        leadershipReadiness: clamp(baseLead * 0.96 + 6),
        skillRelevanceScore: clamp(baseHealth * 0.85),
        careerRiskScore: clamp(100 - baseHealth * 0.75),
        confidenceScore: 78,
        predictedRoles: ['Principal Architect', 'Director of Engineering', 'Founding Engineer / CTO'],
        growthDrivers: [
          'Proven track record of high-scale systems delivery',
          'Industry technical brand authority and speaking engagements',
        ],
        riskFactors: [
          'Legacy tech stack stickiness if continuous learning is halted',
        ],
      },
      // 4. 5 Years Horizon
      {
        horizon: ForecastHorizon.YEARS_5,
        promotionProbability: clamp(92),
        salaryGrowthProbability: clamp(95),
        jobSwitchProbability: clamp(80),
        leadershipReadiness: clamp(94),
        skillRelevanceScore: clamp(82),
        careerRiskScore: clamp(18),
        confidenceScore: 68,
        predictedRoles: ['VP of Engineering', 'Distinguished Engineer', 'Tech Co-Founder'],
        growthDrivers: [
          'Executive tech leadership and strategic roadmap governance',
          'High-value professional network across tier-1 venture and tech firms',
        ],
        riskFactors: [
          'Macro industry paradigm shifts',
        ],
      },
    ];

    // Persist predictions
    const saved = await this.repo.savePredictions(twin.id, userId, predictions);

    return {
      userId,
      generatedAt: new Date().toISOString(),
      predictions: saved,
      topRecommendations: [
        `Accelerate 1-Year target '${twin.targetRole}' by completing the Advanced Concurrency and Consensus learning track.`,
        'Leverage current market competitiveness (82/100) to negotiate external or promotion salary adjustments.',
        'Begin mentoring junior developers to fast-track leadership readiness from 68 to 85+ within 6 months.',
      ],
      fastestPathToTarget: `L4 Mid-Level ➔ Senior Systems Lead (Month 8) ➔ Staff Architect (Month 24)`,
    };
  }

  async getLatestPredictions(userId: string): Promise<CareerPredictionReportDto> {
    const existing = await this.repo.getLatestPredictions(userId);
    if (existing && existing.length > 0) {
      return {
        userId,
        generatedAt: new Date().toISOString(),
        predictions: existing,
        topRecommendations: [
          'Accelerate target role progression by completing core distributed system milestones.',
          'Leverage high market competitiveness for external and promotion compensation gains.',
        ],
        fastestPathToTarget: 'Current Role ➔ Senior Engineer ➔ Staff Architect',
      };
    }

    return this.generatePredictions(userId);
  }
}

export const careerPredictionService = new CareerPredictionService();
