import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { EnterpriseCivilizationController } from '../../controllers/enterpriseCivilization.controller';

const router = Router();
const controller = new EnterpriseCivilizationController();

// Overview
router.get('/overview', authGuard, (req, res) => controller.getOverview(req, res));

// Organizations
router.post('/organizations', authGuard, (req, res) => controller.createOrganization(req, res));
router.get('/organizations', authGuard, (req, res) => controller.listOrganizations(req, res));
router.get('/organizations/:id', authGuard, (req, res) => controller.getOrganization(req, res));
router.get('/organizations/:id/departments', authGuard, (req, res) => controller.listDepartments(req, res));
router.get('/departments/:id/teams', authGuard, (req, res) => controller.listTeams(req, res));
router.get('/organizations/:id/workforce-plan', authGuard, (req, res) => controller.getWorkforcePlan(req, res));

// Digital Employees
router.post('/employees', authGuard, (req, res) => controller.createEmployee(req, res));
router.get('/employees', authGuard, (req, res) => controller.listEmployees(req, res));
router.get('/employees/:id/performance', authGuard, (req, res) => controller.getEmployeePerformance(req, res));

// Company Blueprints
router.post('/company-blueprints', authGuard, (req, res) => controller.createBlueprint(req, res));
router.get('/company-blueprints', authGuard, (req, res) => controller.listBlueprints(req, res));
router.get('/company-blueprints/:id/business-plan', authGuard, (req, res) => controller.getBusinessPlan(req, res));
router.get('/company-blueprints/:id/investment-readiness', authGuard, (req, res) => controller.getInvestmentReadiness(req, res));

// Enterprise Federations
router.post('/federations', authGuard, (req, res) => controller.createFederation(req, res));
router.get('/federations', authGuard, (req, res) => controller.listFederations(req, res));

// Product Factory
router.post('/products', authGuard, (req, res) => controller.createProduct(req, res));
router.get('/products', authGuard, (req, res) => controller.listProducts(req, res));

// Economic Simulation
router.post('/economic-simulations', authGuard, (req, res) => controller.runEconomicSimulation(req, res));
router.get('/economic-simulations', authGuard, (req, res) => controller.listEconomicSimulations(req, res));

// Capital & Investment Intelligence
router.post('/investments', authGuard, (req, res) => controller.recordInvestment(req, res));
router.get('/investments', authGuard, (req, res) => controller.listInvestments(req, res));

// Autonomous Execution Network
router.post('/tasks', authGuard, (req, res) => controller.delegateTask(req, res));
router.get('/tasks', authGuard, (req, res) => controller.listTasks(req, res));
router.post('/tasks/:id/execute', authGuard, (req, res) => controller.executeTask(req, res));

export default router;
