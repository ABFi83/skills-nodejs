import { Request, Response } from "express";
import { EvaluationService } from "../services/evaluation.service";
import { Evaluation } from "../entity/evaluation.entity";

export class EvaluationController {
  private evaluationService: EvaluationService;

  constructor() {
    this.evaluationService = new EvaluationService();
  }

  async getAllEvaluations(req: Request, res: Response): Promise<void> {
    try {
      const evaluations = await this.evaluationService.getAllEvaluations();
      res.json(evaluations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEvaluationById(req: Request, res: Response): Promise<void> {
    try {
      const evaluationId = parseInt(req.params.id);
      const evaluation = await this.evaluationService.getEvaluationById(
        evaluationId
      );
      if (!evaluation) {
        res.status(404).json({ message: "Valutazione non trovata" });
        return;
      }
      res.json(evaluation);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async createEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const evaluationData: Partial<Evaluation> = req.body;
      const createdEvaluation = await this.evaluationService.createEvaluation(
        evaluationData
      );
      res.status(201).json(createdEvaluation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const evaluationId = parseInt(req.params.id);
      const evaluationData: Partial<Evaluation> = req.body;
      const updatedEvaluation = await this.evaluationService.updateEvaluation(
        evaluationId,
        evaluationData
      );

      res.json(updatedEvaluation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const evaluationId = parseInt(req.params.id);
      await this.evaluationService.deleteEvaluation(evaluationId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
