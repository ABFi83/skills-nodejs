import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Evaluation } from "../entity/evaluation.entity";
import e from "express";

export class EvaluationService {
  private evaluationRepository: Repository<Evaluation>;

  constructor() {
    this.evaluationRepository = AppDataSource.getRepository(Evaluation);
  }

  // 📌 Recupera tutte le valutazioni
  async getAllEvaluations(): Promise<Evaluation[]> {
    try {
      return await this.evaluationRepository.find({
        relations: ["user", "project", "values"], // Carica le relazioni se necessarie
      });
    } catch (error) {
      console.error("Errore durante il recupero delle valutazioni:", error);
      throw new Error("Non è stato possibile recuperare le valutazioni.");
    }
  }

  async getLastEvaluationByUserAndProject(
    userId: number,
    projectId: number
  ): Promise<Evaluation | null> {
    try {
      return await this.evaluationRepository.findOne({
        where: {
          user: { id: userId },
          project: { id: projectId },
        },
        order: { evaluationDate: "DESC" }, // Ordina per data in ordine decrescente
        relations: ["user", "project", "values", "values.skill"], // Carica le relazioni se necessarie
      });
    } catch (error) {
      console.error(
        "Errore durante il recupero dell'ultima valutazione:",
        error
      );
      throw new Error("Non è stato possibile recuperare l'ultima valutazione.");
    }
  }

  // 📌 Recupera una valutazione per ID
  async getEvaluationById(id: number): Promise<Evaluation | null> {
    try {
      return await this.evaluationRepository.findOne({
        where: { id },
        relations: ["user", "project"], // Carica le relazioni se necessarie
      });
    } catch (error) {
      console.error("Errore durante il recupero della valutazione:", error);
      throw new Error("Non è stato possibile recuperare la valutazione.");
    }
  }

  // 📌 Crea una nuova valutazione
  async createEvaluation(
    evaluationData: Partial<Evaluation>
  ): Promise<Evaluation> {
    try {
      const newEvaluation = this.evaluationRepository.create(evaluationData);
      return await this.evaluationRepository.save(newEvaluation);
    } catch (error) {
      console.error("Errore durante la creazione della valutazione:", error);
      throw new Error("Non è stato possibile creare la valutazione.");
    }
  }

  // 📌 Aggiorna una valutazione esistente
  async updateEvaluation(
    id: number,
    evaluationData: Partial<Evaluation>
  ): Promise<Evaluation | null> {
    try {
      const evaluation = await this.getEvaluationById(id);
      if (!evaluation) {
        throw new Error("Valutazione non trovata");
      }

      Object.assign(evaluation, evaluationData);
      return await this.evaluationRepository.save(evaluation);
    } catch (error) {
      console.error("Errore durante l'aggiornamento della valutazione:", error);
      throw new Error("Non è stato possibile aggiornare la valutazione.");
    }
  }

  // 📌 Elimina una valutazione
  async deleteEvaluation(id: number): Promise<void> {
    try {
      await this.evaluationRepository.delete(id);
    } catch (error) {
      console.error("Errore durante l'eliminazione della valutazione:", error);
      throw new Error("Non è stato possibile eliminare la valutazione.");
    }
  }
}
