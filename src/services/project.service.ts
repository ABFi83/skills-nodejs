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
import { UserProject } from "../entity/userproject.entity";
import { Role } from "../entity/role.entity";

export class ProjectService {
  private projectRepository: Repository<Project>;
  private skillRepository: Repository<Skill>;
  private userRepository: Repository<User>;
  private evaluationRepository: Repository<Evaluation>;
  private valueRepository: Repository<Value>;
  private evaluationService: EvaluationService;
  private userProjectRepository: Repository<UserProject>;
  private roleRepository: Repository<Role>;

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project); // Ottieni il repository per Project
    this.evaluationService = new EvaluationService();
    this.skillRepository = AppDataSource.getRepository(Skill);
    this.userRepository = AppDataSource.getRepository(User);
    this.evaluationRepository = AppDataSource.getRepository(Evaluation);
    this.valueRepository = AppDataSource.getRepository(Value);
    this.userProjectRepository = AppDataSource.getRepository(UserProject);
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  async getProjectsByUser(userId: number): Promise<ProjectResponse[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          "userProjects",
          "userProjects.project.skills",
          "userProjects.project.evaluation",
          "userProjects.project.evaluation.values",
          "userProjects.project.evaluation.values.skill",
          "userProjects.role",
        ],
      });

      if (!user || !user.userProjects) {
        throw new Error("L'utente non esiste o non ha progetti associati.");
      }

      const projects = user.userProjects;
      const projectResponses = await Promise.all(
        projects.map(async (userProject: UserProject) => {
          let lastEva: Evaluation | null =
            await this.evaluationService.getLastEvaluationByUserAndProject(
              user.id,
              userProject.project.id
            );

          let response: ProjectResponse = {
            id: userProject.project.id,
            projectName: userProject.project.name,
            role: {
              id: userProject.role.id,
              code: userProject.role.code,
              name: userProject.role.name,
            },
            labelEvaluations: userProject.project.skills
              ? userProject.project.skills.map((skill: Skill) => {
                  let label = {
                    id: skill.id,
                    label: skill.name,
                    shortLabel: skill.shortName,
                  };
                  return label;
                })
              : [],
            evaluations: lastEva
              ? [
                  {
                    id: lastEva.id,
                    label: lastEva.evaluationDate.toLocaleDateString(), //01/01/2024
                    ratingAverage: this.calcolaMedia(lastEva.values),
                    values: lastEva.values
                      ? lastEva.values.map((value: Value) => {
                          let v = {
                            id: value.id,
                            skill: value.skill.name,
                            value: value.value,
                          };
                          return v;
                        })
                      : [],
                  },
                ]
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

  calcolaMedia(valori: Value[] | undefined): number {
    let somma = 0;
    if (!valori) return somma;
    for (let valore of valori) {
      somma += valore.value;
    }
    const media = somma / valori.length;
    return parseFloat(media.toFixed(1));
  }
  async getProjectsDetail(projectId: number): Promise<ProjectResponse> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: [
          "userProjects",
          "userProjects.role",
          "skills",
          "evaluation",
          "evaluation.values",
          "evaluation.values.skill",
        ],
      });
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      project.evaluation =
        project.evaluation?.sort(
          (a, b) => b.evaluationDate.getTime() - a.evaluationDate.getTime()
        ) || [];
      project.skills = project.skills?.sort((a, b) => b.id - a.id) || [];

      let response: ProjectResponse = {
        id: project.id,
        projectName: project.name,
        role: {
          id: project.userProjects[0].role.id,
          code: project.userProjects[0].role.code,
          name: project.userProjects[0].role.name,
        },
        labelEvaluations: project.skills
          ? project.skills.map((skill: Skill) => {
              let label = {
                id: skill.id,
                label: skill.name,
                shortLabel: skill.shortName,
              };
              return label;
            })
          : [],
        evaluations: project.evaluation?.map((evaluation: Evaluation) => {
          evaluation.values =
            evaluation.values?.sort((a, b) => b.skill.id - a.skill.id) || [];
          return {
            id: evaluation.id,
            label: evaluation.evaluationDate.toLocaleDateString(), //01/01/2024
            ratingAverage: this.calcolaMedia(evaluation.values),
            values: evaluation.values
              ? evaluation.values.map((value: Value) => {
                  let v = {
                    id: value.id,
                    skill: value.skill.name,
                    value: value.value,
                  };
                  return v;
                })
              : [],
          };
        }),
      };
      return response;
    } catch (error) {
      console.error(
        "Errore durante il recupero dei progetti per l'utente:",
        error
      );
      throw new Error("Non è stato possibile recuperare i progetti.");
    }
  }
}
