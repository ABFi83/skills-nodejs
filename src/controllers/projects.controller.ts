import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  // Aggiungi altri metodi del controller
}
