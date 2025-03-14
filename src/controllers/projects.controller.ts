import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { Project } from "../entity/project.entity";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const project: Project = req.body as Project;
      const response = await this.projectService.createProject(project);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aggiungi altri metodi del controller
}
