import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Project } from "../entity/project.entity";
import { ProjectResponse } from "../models/project.model"; // Supponiamo che ProjectResponse sia un DTO
import { User } from "../entity/user.entity";
import { EvaluationService } from "./evalutaion.service";
import { Value } from "../entity/values.entity";
import { Skill } from "../entity/skill.entity";

export class ProjectService {
  private projectRepository: Repository<Project>;
  private skillRepository: Repository<Skill>;
  private userRepository: Repository<User>;
  private evaluationService: any;
  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project); // Ottieni il repository per Project
    this.evaluationService = new EvaluationService();
    this.skillRepository = AppDataSource.getRepository(Skill);
    this.evaluationService = new EvaluationService();
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getProjectsByUser(userId: number): Promise<ProjectResponse[]> {
    try {
      console.log("userId", userId);
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["projects"], // Assicurati che la relazione "projects" sia caricata
      });
      console.log("user", user);
      // Verifica se l'utente esiste
      if (!user || !user.projects) {
        throw new Error("L'utente non esiste o non ha progetti associati.");
      }

      // Ottieni i progetti associati all'utente
      const projects = user.projects;

      // Mappa i progetti e ottieni la valutazione più recente per ciascuno
      const projectResponses = await Promise.all(
        projects.map(async (project: Project) => {
          // Ottieni la valutazione più recente per il progetto e l'utente
          const latestEvaluation =
            await this.evaluationService.getLatestEvaluation(
              project.id,
              userId
            );

          // Se non ci sono valutazioni, ritorna `null`
          if (!latestEvaluation) return null;

          let response: ProjectResponse = {
            id: project.id.toString(),
            projectName: project.name,
            ratingAverage: this.calculateRatingAverage(
              latestEvaluation.values ?? []
            ),
            evaluations: [
              {
                id: latestEvaluation.id.toString(),
                label: latestEvaluation.evaluationDate, // La data potrebbe essere rappresentata come stringa
                values:
                  latestEvaluation.values?.map((value: Value) => ({
                    id: value.id.toString(),
                    skill: value.skill,
                    value: value.value,
                  })) ?? [],
              },
            ],
            labelEvaluations:
              latestEvaluation.values?.map((label: Value) => ({
                id: label.id.toString(),
                label: label.skill.name,
                shortLabel: label.skill.shortName,
              })) ?? [],
          };
          return response;
        })
      );

      // Rimuove eventuali `null`
      return projectResponses.filter((p): p is ProjectResponse => p !== null);
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

  async createProject(project: Partial<Project>): Promise<Project> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: 1 },
        relations: ["projects"], // Assicurati che la relazione "projects" sia caricata
      });
      if (user) {
        project.users = [user];
      }
      project.name = "Progetto di prova";
      let skill1 = await this.skillRepository.findOne({
        where: { name: "JavaScript" },
      });
      if (!skill1) {
        skill1 = this.skillRepository.create({
          name: "JavaScript",
          shortName: "JS",
        });
        await this.skillRepository.save(skill1);
      }

      let skill2 = await this.skillRepository.findOne({
        where: { name: "TypeScript" },
      });
      if (!skill2) {
        skill2 = this.skillRepository.create({
          name: "TypeScript",
          shortName: "TS",
        });
        await this.skillRepository.save(skill2);
      }

      project.skills = [skill1, skill2];

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
