import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { Project } from "../entity/project.entity";
import { EvaluationRequest, ValueRequest } from "../models/project.model";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      //const project: Project = req.body as Project;
      //const response = await this.projectService.createProject(project);
      //res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id);
      const response = await this.projectService.deleteProject(projectId);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProjectsDetails(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id);
      const userId = (req as any).user.userId;
      const project = await this.projectService.getProjectsDetail(
        projectId,
        userId
      );
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserProjects(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const project = await this.projectService.getProjectsByUser(userId);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id);
      const evaluationRequest: EvaluationRequest =
        req.body as EvaluationRequest;
      const project = await this.projectService.createEvaluation(
        projectId,
        evaluationRequest
      );
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveValue(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id);
      const valueRequest: ValueRequest = req.body as ValueRequest;
      const evaluation = await this.projectService.saveValue(
        valueRequest,
        projectId
      );
      res.json(evaluation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.projectService.getAllProject();
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
