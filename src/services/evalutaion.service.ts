import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Evaluation } from "../entity/evaluation.entity";
import { Project } from "../entity/project.entity";
import { User } from "../entity/user.entity";

export class EvaluationService {
  private evaluationRepository: Repository<Evaluation>;

  constructor() {
    this.evaluationRepository = AppDataSource.getRepository(Evaluation);
  }

  // Ottieni la valutazione più recente per un dato progetto e utente
  async getLatestEvaluation(
    projectId: number,
    userId: number
  ): Promise<Evaluation | null> {
    try {
      // Trova la valutazione più recente per il progetto e l'utente specificato
      const evaluation = await this.evaluationRepository.findOne({
        where: { project: { id: projectId }, user: { id: userId } },
        order: { evaluationDate: "DESC" }, // Ordina per data in modo che la più recente sia la prima
      });

      return evaluation || null; // Restituisce la valutazione trovata o null se non esiste
    } catch (error) {
      console.error("Errore durante il recupero della valutazione:", error);
      throw new Error("Non è stato possibile recuperare la valutazione.");
    }
  }
}
