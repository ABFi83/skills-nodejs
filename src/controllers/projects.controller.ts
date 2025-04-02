import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { Project } from "../entity/project.entity";
import {
  EvaluationRequest,
  ProjectRequest,
  ValueRequest,
} from "../models/project.model";
import { format, formatISO, parse } from "date-fns";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
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

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId; // Recupera l'ID dell'utente dal token
      const projectData: ProjectRequest = req.body; // Dati del progetto dal corpo della richiesta

      // Passa i dati del progetto e l'ID dell'utente al servizio
      const response = await this.projectService.createProject(
        projectData,
        userId
      );
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProjectDetail(req: Request, res: Response): Promise<void> {
    try {
      const projectData: ProjectRequest = req.body; // Dati del progetto dal corpo della richiesta
      const projectId = parseInt(req.params.id);
      const response = await this.projectService.updateProject(
        projectId,
        projectData
      );
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEvaluationDates(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id);

      // Chiama il servizio per ottenere le date delle valutazioni
      const evaluationDates = await this.projectService.getEvaluationDates(
        projectId
      );

      // Formatta le date in dd/MM/YYYY
      const formattedDates = evaluationDates.map((date) =>
        format(new Date(date), "dd/MM/yyyy")
      );

      res.json(formattedDates);
    } catch (error: any) {
      console.error(
        "Errore durante il recupero delle date di valutazione:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  }

  async getEvaluationsByProjectAndDate(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { evaluationDate } = req.query; // Ottieni la data di valutazione dalla query string
      if (!projectId || !evaluationDate) {
        return res.status(400).json({
          message: "projectId e evaluationDate sono obbligatori.",
        });
      }
      console.log("evaluations", new Date(evaluationDate as string));
      const parsedDate = parse(
        evaluationDate as string,
        "dd/MM/yyyy",
        new Date()
      );
      const isoDate = formatISO(parsedDate, { representation: "complete" });
      console.log("ISO Date:", isoDate);

      const evaluations =
        await this.projectService.getEvaluationsByProjectAndDate(
          parseInt(projectId, 10),
          isoDate
        );

      return res.status(200).json(evaluations);
    } catch (error) {
      console.error(
        "Errore nell'endpoint getEvaluationsByProjectAndDate:",
        error
      );
      return res.status(500).json({
        message: "Errore durante il recupero delle valutazioni.",
      });
    }
  }
}
