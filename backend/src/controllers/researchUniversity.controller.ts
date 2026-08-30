import { Request, Response } from 'express';
import {
  academicProgramsService,
  scientificDiscoveryService,
  digitalLaboratoryService,
  academicKnowledgeGraphService,
  publicationEngineService,
  peerReviewNetworkService,
  researchFundingService,
  globalCollaborationService,
  researchMetricsService,
} from '../modules/research-university';
import { AcademicDepartment, PeerReviewRole } from '@codeforge/shared';

export class ResearchUniversityController {
  // 1. Academic Command Center Overview & Metrics
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await researchMetricsService.getAcademicCommandCenterOverview();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const data = await researchMetricsService.getMetrics();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Programs & Projects
  async proposeProgram(req: Request, res: Response): Promise<void> {
    try {
      const data = await academicProgramsService.proposeProgram(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async activateProgram(req: Request, res: Response): Promise<void> {
    try {
      const data = await academicProgramsService.activateProgram(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async getProgram(req: Request, res: Response): Promise<void> {
    try {
      const data = await academicProgramsService.getProgram(req.params.id);
      if (!data) {
        res.status(404).json({ success: false, error: 'Program not found' });
        return;
      }
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async listPrograms(req: Request, res: Response): Promise<void> {
    try {
      const department = req.query.department as AcademicDepartment | undefined;
      const data = await academicProgramsService.listPrograms(department);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const data = await academicProgramsService.createProject(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listProjects(req: Request, res: Response): Promise<void> {
    try {
      const programId = req.params.programId;
      const data = await academicProgramsService.listProjectsByProgram(programId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. Hypotheses & Discoveries
  async formulateHypothesis(req: Request, res: Response): Promise<void> {
    try {
      const data = await scientificDiscoveryService.formulateHypothesis(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async testHypothesis(req: Request, res: Response): Promise<void> {
    try {
      const data = await scientificDiscoveryService.testHypothesis(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listHypotheses(req: Request, res: Response): Promise<void> {
    try {
      const programId = req.query.programId as string | undefined;
      const data = await scientificDiscoveryService.listHypotheses(programId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async confirmDiscovery(req: Request, res: Response): Promise<void> {
    try {
      const data = await scientificDiscoveryService.confirmDiscovery(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listDiscoveries(req: Request, res: Response): Promise<void> {
    try {
      const programId = req.query.programId as string | undefined;
      const data = await scientificDiscoveryService.listDiscoveries(programId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Digital Laboratories & Experiments
  async provisionLaboratory(req: Request, res: Response): Promise<void> {
    try {
      const data = await digitalLaboratoryService.provisionLaboratory(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async getLaboratory(req: Request, res: Response): Promise<void> {
    try {
      const data = await digitalLaboratoryService.getLaboratory(req.params.id);
      if (!data) {
        res.status(404).json({ success: false, error: 'Laboratory not found' });
        return;
      }
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async listLaboratories(req: Request, res: Response): Promise<void> {
    try {
      const department = req.query.department as AcademicDepartment | undefined;
      const data = await digitalLaboratoryService.listLaboratories(department);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async runExperiment(req: Request, res: Response): Promise<void> {
    try {
      const data = await digitalLaboratoryService.runExperiment(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listExperiments(req: Request, res: Response): Promise<void> {
    try {
      const labId = req.query.labId as string | undefined;
      const data = await digitalLaboratoryService.listExperiments(labId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getLaboratoryMetrics(req: Request, res: Response): Promise<void> {
    try {
      const data = await digitalLaboratoryService.getLaboratoryMetrics(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  // 5. Academic Knowledge Graph
  async indexKnowledgeNode(req: Request, res: Response): Promise<void> {
    try {
      const data = await academicKnowledgeGraphService.indexNode(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listKnowledgeNodes(req: Request, res: Response): Promise<void> {
    try {
      const domain = req.query.domain as AcademicDepartment | undefined;
      const data = await academicKnowledgeGraphService.listNodes(domain);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getKnowledgeLineages(req: Request, res: Response): Promise<void> {
    try {
      const domain = req.query.domain as AcademicDepartment | undefined;
      const data = await academicKnowledgeGraphService.discoverCrossDisciplinaryLineages(domain);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 6. Publications & Citations
  async draftPublication(req: Request, res: Response): Promise<void> {
    try {
      const data = await publicationEngineService.draftPublication(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async publishPaper(req: Request, res: Response): Promise<void> {
    try {
      const data = await publicationEngineService.publishPaper(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async getPublication(req: Request, res: Response): Promise<void> {
    try {
      const data = await publicationEngineService.getPublication(req.params.id);
      if (!data) {
        res.status(404).json({ success: false, error: 'Publication not found' });
        return;
      }
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async listPublications(req: Request, res: Response): Promise<void> {
    try {
      const department = req.query.department as AcademicDepartment | undefined;
      const data = await publicationEngineService.listPublications(department);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async citePublication(req: Request, res: Response): Promise<void> {
    try {
      const data = await publicationEngineService.citePublication(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listCitations(req: Request, res: Response): Promise<void> {
    try {
      const data = await publicationEngineService.listCitations(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 7. Peer Review Network
  async conductReview(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.body;
      const data = await peerReviewNetworkService.conductAutonomousReview(
        req.params.publicationId,
        role as PeerReviewRole
      );
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listReviews(req: Request, res: Response): Promise<void> {
    try {
      const data = await peerReviewNetworkService.listReviews(req.params.publicationId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getReviewConsensus(req: Request, res: Response): Promise<void> {
    try {
      const data = await peerReviewNetworkService.getReviewConsensus(req.params.publicationId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 8. Research Grants & Funding
  async registerGrant(req: Request, res: Response): Promise<void> {
    try {
      const data = await researchFundingService.registerGrantPool(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listGrants(req: Request, res: Response): Promise<void> {
    try {
      const department = req.query.department as AcademicDepartment | undefined;
      const data = department
        ? await researchFundingService.matchGrantsForDepartment(department)
        : await researchFundingService.listGrants();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async applyForGrant(req: Request, res: Response): Promise<void> {
    try {
      const { programId } = req.body;
      const data = await researchFundingService.applyForGrant(req.params.grantId, programId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async awardGrant(req: Request, res: Response): Promise<void> {
    try {
      const { awardAmountUsd } = req.body;
      const data = await researchFundingService.awardGrant(req.params.grantId, awardAmountUsd);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 9. Global Collaboration
  async registerCollaborator(req: Request, res: Response): Promise<void> {
    try {
      const data = await globalCollaborationService.registerCollaborator(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  async listCollaborators(req: Request, res: Response): Promise<void> {
    try {
      const department = req.query.department as AcademicDepartment | undefined;
      const data = await globalCollaborationService.listCollaborators(department);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async linkCollaboratorProject(req: Request, res: Response): Promise<void> {
    try {
      const { programId } = req.body;
      const data = await globalCollaborationService.linkSharedProject(req.params.collaboratorId, programId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const researchUniversityController = new ResearchUniversityController();
