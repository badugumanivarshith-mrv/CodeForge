import { Request, Response } from 'express';
import {
  StartupGenerationService,
  StartupValidationService,
  StartupLifecycleService,
  MarketIntelligenceService,
  AIFounderService,
  IncubationEngineService,
  CustomerDiscoveryService,
  GrowthEngineService,
  VenturePortfolioService,
  FundraisingService,
} from '../modules/startup-builder';
import { IStartupBuilderRepository, StartupBuilderRepository } from '../repositories';
import { StartupCategory, StartupStage, GrowthChannel, CustomerPersonaType, StartupFundingStage } from '@codeforge/shared';

export class StartupBuilderController {
  private repo: IStartupBuilderRepository;
  private startupGen: StartupGenerationService;
  private startupVal: StartupValidationService;
  private startupLife: StartupLifecycleService;
  private marketIntel: MarketIntelligenceService;
  private aiFounder: AIFounderService;
  private incubationEng: IncubationEngineService;
  private customerDisc: CustomerDiscoveryService;
  private growthEng: GrowthEngineService;
  private portfolioServ: VenturePortfolioService;
  private fundraisingServ: FundraisingService;

  constructor(repo?: IStartupBuilderRepository) {
    this.repo = repo || new StartupBuilderRepository();
    this.startupGen = new StartupGenerationService(this.repo);
    this.startupVal = new StartupValidationService(this.repo);
    this.startupLife = new StartupLifecycleService(this.repo);
    this.marketIntel = new MarketIntelligenceService(this.repo);
    this.aiFounder = new AIFounderService(this.repo);
    this.incubationEng = new IncubationEngineService(this.repo);
    this.customerDisc = new CustomerDiscoveryService(this.repo);
    this.growthEng = new GrowthEngineService(this.repo);
    this.portfolioServ = new VenturePortfolioService(this.repo);
    this.fundraisingServ = new FundraisingService(this.repo);
  }

  // 1. Overview
  async getOverview(req: Request, res: Response) {
    try {
      const creatorUserId = (req as any).user?.userId;
      const overview = await this.repo.getCommandCenterOverview(creatorUserId);
      return res.status(200).json({ success: true, data: overview });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Startups
  async createStartup(req: Request, res: Response) {
    try {
      const creatorUserId = (req as any).user?.userId;
      const startup = await this.startupGen.createStartup(req.body, creatorUserId);
      return res.status(201).json({ success: true, data: startup });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async listStartups(req: Request, res: Response) {
    try {
      const creatorUserId = req.query.creatorUserId as string | undefined;
      const category = req.query.category as StartupCategory | undefined;
      const stage = req.query.stage as StartupStage | undefined;
      const startups = await this.repo.listStartups(creatorUserId, category, stage);
      return res.status(200).json({ success: true, data: startups });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getStartup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const startup = await this.repo.getStartupById(id);
      if (!startup) {
        return res.status(404).json({ success: false, error: 'Startup not found' });
      }
      return res.status(200).json({ success: true, data: startup });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getStartupBlueprint(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blueprint = await this.startupGen.generateStartupBlueprint(id);
      return res.status(200).json({ success: true, data: blueprint });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async validateViability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = await this.startupVal.validateStartupViability(id);
      return res.status(200).json({ success: true, data: validation });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async advanceStage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { targetStage } = req.body;
      const result = await this.startupLife.advanceStartupStage(id, targetStage);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async executePivot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.startupLife.executeStartupPivot(id, req.body);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 3. Ideas
  async generateIdea(req: Request, res: Response) {
    try {
      const creatorUserId = (req as any).user?.userId;
      const idea = await this.startupGen.generateStartupIdea(req.body, creatorUserId);
      return res.status(201).json({ success: true, data: idea });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async listIdeas(req: Request, res: Response) {
    try {
      const category = req.query.category as StartupCategory | undefined;
      const ideas = await this.repo.listStartupIdeas(undefined, category);
      return res.status(200).json({ success: true, data: ideas });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Market Intelligence
  async generateMarketReport(req: Request, res: Response) {
    try {
      const report = await this.marketIntel.generateMarketReport(req.body);
      return res.status(201).json({ success: true, data: report });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async listMarketReports(req: Request, res: Response) {
    try {
      const startupId = req.query.startupId as string | undefined;
      const sector = req.query.sector as StartupCategory | undefined;
      const reports = await this.repo.listMarketReports(startupId, sector);
      return res.status(200).json({ success: true, data: reports });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 5. AI Founder
  async getFounderDecisionSupport(req: Request, res: Response) {
    try {
      const { startupId, decisionTitle, context, options } = req.body;
      const decision = await this.aiFounder.generateDecisionSupport(startupId, { decisionTitle, context, options });
      return res.status(200).json({ success: true, data: decision });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getStrategicPlan(req: Request, res: Response) {
    try {
      const { startupId } = req.params;
      const plan = await this.aiFounder.formulateStrategicPlan(startupId);
      return res.status(200).json({ success: true, data: plan });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 6. Product Incubation
  async incubateProduct(req: Request, res: Response) {
    try {
      const incubation = await this.incubationEng.incubateProduct(req.body);
      return res.status(201).json({ success: true, data: incubation });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async listIncubations(req: Request, res: Response) {
    try {
      const startupId = req.query.startupId as string | undefined;
      const incubations = await this.repo.listProductIncubations(startupId);
      return res.status(200).json({ success: true, data: incubations });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getProductMarketFit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pmf = await this.incubationEng.evaluateProductMarketFit(id);
      return res.status(200).json({ success: true, data: pmf });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 7. Customer Discovery
  async generatePersona(req: Request, res: Response) {
    try {
      const { startupId, personaType } = req.body;
      const persona = await this.customerDisc.generateCustomerPersona(startupId, personaType as CustomerPersonaType);
      return res.status(201).json({ success: true, data: persona });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getDiscoveryFeedback(req: Request, res: Response) {
    try {
      const { startupId } = req.params;
      const feedback = await this.customerDisc.synthesizeDiscoveryFeedback(startupId);
      return res.status(200).json({ success: true, data: feedback });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 8. Growth Engine
  async generateGrowthForecast(req: Request, res: Response) {
    try {
      const { startupId, channel } = req.body;
      const forecast = await this.growthEng.generateGrowthForecast(startupId, channel as GrowthChannel);
      return res.status(201).json({ success: true, data: forecast });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getUnitEconomics(req: Request, res: Response) {
    try {
      const { startupId } = req.params;
      const unitEcon = await this.growthEng.evaluateUnitEconomics(startupId);
      return res.status(200).json({ success: true, data: unitEcon });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 9. Venture Portfolio
  async createPortfolio(req: Request, res: Response) {
    try {
      const creatorUserId = (req as any).user?.userId;
      const portfolio = await this.portfolioServ.createPortfolio({ ...req.body, creatorUserId });
      return res.status(201).json({ success: true, data: portfolio });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async listPortfolios(req: Request, res: Response) {
    try {
      const creatorUserId = (req as any).user?.userId;
      const portfolios = await this.repo.listVenturePortfolios(creatorUserId);
      return res.status(200).json({ success: true, data: portfolios });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getPortfolioHealth(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const health = await this.portfolioServ.evaluatePortfolioHealth(id);
      return res.status(200).json({ success: true, data: health });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 10. Fundraising
  async getFundraisingReadiness(req: Request, res: Response) {
    try {
      const { startupId } = req.params;
      const readiness = await this.fundraisingServ.evaluateFundraisingReadiness(startupId);
      return res.status(200).json({ success: true, data: readiness });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getMatchedInvestors(req: Request, res: Response) {
    try {
      const { startupId } = req.params;
      const matches = await this.fundraisingServ.matchInvestors(startupId);
      return res.status(200).json({ success: true, data: matches });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async simulateFunding(req: Request, res: Response) {
    try {
      const simulation = await this.fundraisingServ.simulateFundingRound(req.body);
      return res.status(200).json({ success: true, data: simulation });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
