import { Evaluation } from "./../entity/evaluation.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Project } from "../entity/project.entity";
import { ProjectResponse } from "../models/project.model"; // Supponiamo che ProjectResponse sia un DTO
import { User } from "../entity/user.entity";
import { EvaluationService } from "./evaluation.service";
import { Value } from "../entity/values.entity";
import { Skill } from "../entity/skill.entity";
import e from "express";

export class ProjectService {
  private projectRepository: Repository<Project>;
  private skillRepository: Repository<Skill>;
  private userRepository: Repository<User>;
  private evaluationRepository: Repository<Evaluation>;
  private valueRepository: Repository<Value>;
  private evaluationService: EvaluationService;
  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project); // Ottieni il repository per Project
    this.evaluationService = new EvaluationService();
    this.skillRepository = AppDataSource.getRepository(Skill);
    this.evaluationService = new EvaluationService();
    this.userRepository = AppDataSource.getRepository(User);
    this.evaluationRepository = AppDataSource.getRepository(Evaluation);
    this.valueRepository = AppDataSource.getRepository(Value);
  }

  async getProjectsByUser(userId: number): Promise<ProjectResponse[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          "projects",
          "projects.skills",
          "projects.evaluation",
          "projects.evaluation.values",
          "projects.evaluation.values.skill",
        ],
      });

      if (!user || !user.projects) {
        throw new Error("L'utente non esiste o non ha progetti associati.");
      }

      const projects = user.projects;

      const projectResponses = await Promise.all(
        projects.map(async (project: Project) => {
          console.log(project);
          let response: ProjectResponse = {
            id: project.id ? project.id.toString() : "",
            projectName: project.name,
            ratingAverage: 0,
            labelEvaluations: project.skills
              ? project.skills.map((skill: Skill) => {
                  let label = {
                    id: skill.id.toString(),
                    label: skill.name,
                    shortLabel: skill.shortName,
                  };
                  return label;
                })
              : [],
            evaluations: project.evaluation
              ? project.evaluation.map((evaluation: Evaluation) => {
                  let eva = {
                    id: evaluation.id.toString(),
                    label: evaluation.evaluationDate.toLocaleDateString(), //01/01/2024
                    values: evaluation.values
                      ? evaluation.values.map((value: Value) => {
                          let v = {
                            id: value.id?.toString(),
                            skill: value.skill.name,
                            value: value.value,
                          };
                          return v;
                        })
                      : [],
                  };
                  return eva;
                })
              : [],
          };
          return response;
        })
      );
      return projectResponses.filter((p): p is ProjectResponse => p !== null);
    } catch (error) {
      console.error(
        "Errore durante il recupero dei progetti per l'utente:",
        error
      );
      throw new Error("Non è stato possibile recuperare i progetti.");
    }
  }

  async getProjectById(id: number): Promise<Project | null> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ["users", "skills", "evaluations"],
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

  async updateProject(
    id: number,
    updatedProject: Partial<Project>
  ): Promise<Project> {
    try {
      const project = await this.getProjectById(id);
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      Object.assign(project, updatedProject);
      return await this.projectRepository.save(project);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del progetto:", error);
      throw new Error("Non è stato possibile aggiornare il progetto.");
    }
  }

  async createProject(project: Partial<Project>): Promise<number> {
    try {
      let newProject: Project = this.projectRepository.create();
      const user = await this.userRepository.findOne({
        where: { id: 1 },
        relations: ["projects"],
      });
      if (!user) {
        throw new Error("Utente non trovato!");
      }
      project.name = "Test";
      project.users = [user];

      let skill1 = await this.skillRepository.findOne({
        where: { name: "JavaScript" },
      });
      if (!skill1) {
        skill1 = this.skillRepository.create({
          name: "JavaScript",
          shortName: "JS",
        });
        skill1 = await this.skillRepository.save(skill1);
      }

      let skill2 = await this.skillRepository.findOne({
        where: { name: "TypeScript" },
      });
      if (!skill2) {
        skill2 = this.skillRepository.create({
          name: "TypeScript",
          shortName: "TS",
        });
        skill2 = await this.skillRepository.save(skill2);
      }

      project.skills = [skill1, skill2];
      newProject = await this.projectRepository.save(project);

      let evaluation = this.evaluationRepository.create({
        evaluationDate: new Date(),
        user: user,
        project: newProject,
      });
      evaluation = await this.evaluationRepository.save(evaluation);

      let value = this.valueRepository.create({
        skill: skill1,
        value: 10,
        evaluation: evaluation,
      });
      await this.valueRepository.save(value);
      let value1 = this.valueRepository.create({
        skill: skill2,
        value: 5,
        evaluation: evaluation,
      });
      await this.valueRepository.save(value1);

      return newProject.id;
    } catch (error) {
      console.error("Errore durante l'aggiornamento del progetto:", error);
      throw new Error("Non è stato possibile aggiornare il progetto.");
    }
  }

  // **Delete**: Elimina un progetto per ID
  async deleteProject(id: number): Promise<void> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
      });
      if (project) await this.projectRepository.remove(project);
      console.log(`Progetto con id ${id} eliminato con successo!`);
    } catch (error) {
      console.error("Errore durante l'eliminazione del progetto:", error);
      throw new Error("Non è stato possibile eliminare il progetto.");
    }
  }
}
