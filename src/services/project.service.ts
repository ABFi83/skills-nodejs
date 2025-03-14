import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Project } from "../entity/project.entity";
import { ProjectResponse } from "../models/project.model"; // Supponiamo che ProjectResponse sia un DTO
import { User } from "../entity/user.entity";
import { EvaluationService } from "./evalutaion.service";
import { Value } from "../entity/values.entity";

export class ProjectService {
  private projectRepository: Repository<Project>;
  userRepository: any;
  private evaluationService: EvaluationService = new EvaluationService();
  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project); // Ottieni il repository per Project
    this.evaluationService = new EvaluationService();
  }

  async getProjectsByUser(userId: number): Promise<ProjectResponse[]> {
    try {
      // Trova l'utente con i progetti associati
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["projects"], // Assicurati che la relazione "projects" sia caricata
      });

      // Verifica se l'utente esiste
      if (!user) {
        throw new Error("Utente non trovato");
      }

      // Ottieni i progetti associati all'utente
      const projects = user.projects;

      // Mappa i progetti e ottieni la valutazione più recente per ciascuno
      return Promise.all(
        projects.map(async (project: Project) => {
          // Ottieni la valutazione più recente per il progetto e l'utente
          const latestEvaluation =
            await this.evaluationService.getLatestEvaluation(
              project.id,
              userId
            );
          if (latestEvaluation != null)
            return {
              id: project.id.toString(),
              projectName: project.name,
              ratingAverage: this.calculateRatingAverage(
                latestEvaluation.values ? latestEvaluation.values : []
              ), // Metodo per calcolare la valutazione media
              evaluations: {
                id: latestEvaluation.id.toString(),
                label: latestEvaluation.evaluationDate, // La data potrebbe essere rappresentata come stringa (se necessario)
                values: latestEvaluation.values
                  ? latestEvaluation.values.map((value) => ({
                      id: value.id.toString(),
                      skill: value.skill,
                      value: value.value,
                    }))
                  : [],
              }, // In caso di nessuna valutazione, restituisce null
              labelEvaluations: latestEvaluation.values
                ? latestEvaluation.values.map((label) => ({
                    id: label.id.toString(),
                    label: label.skill.name,
                    shortLabel: label.skill.shortName,
                  }))
                : [], // In caso di nessuna valutazione, restituisce un array vuoto
            };
        })
      );
    } catch (error) {
      console.error(
        "Errore durante il recupero dei progetti per l'utente:",
        error
      );
      throw new Error("Non è stato possibile recuperare i progetti.");
    }
  }

  // Metodo per calcolare la valutazione media
  private calculateRatingAverage(values: Value[]): number {
    // Calcola la somma totale delle valutazioni
    const totalRating = values.reduce((acc, value) => acc + value.value, 0);

    // Il conteggio delle valutazioni
    const totalCount = values.length;

    // Restituisce la media delle valutazioni o 0 se non ci sono valori
    return totalCount > 0 ? totalRating / totalCount : 0;
  }

  // **Read (One)**: Ottieni un progetto per ID
  async getProjectById(id: number): Promise<Project | null> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
      });
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      return project;
    } catch (error) {
      console.error("Errore durante il recupero del progetto:", error);
      throw new Error("Non è stato possibile recuperare il progetto.");
    }
  }

  // **Update**: Aggiorna un progetto esistente
  async updateProject(
    id: number,
    updatedProject: Partial<Project>
  ): Promise<Project> {
    try {
      const project = await this.getProjectById(id); // Ottieni il progetto
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      // Aggiorna il progetto con i dati nuovi
      Object.assign(project, updatedProject); // Copia i nuovi valori nel progetto esistente
      return await this.projectRepository.save(project);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del progetto:", error);
      throw new Error("Non è stato possibile aggiornare il progetto.");
    }
  }

  // **Delete**: Elimina un progetto per ID
  async deleteProject(id: number): Promise<void> {
    try {
      const project = await this.getProjectById(id);
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      await this.projectRepository.remove(project); // Elimina il progetto
    } catch (error) {
      console.error("Errore durante l'eliminazione del progetto:", error);
      throw new Error("Non è stato possibile eliminare il progetto.");
    }
  }
}
