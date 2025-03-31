import { Evaluation } from "./../entity/evaluation.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Project } from "../entity/project.entity";
import {
  EvaluationRequest,
  ProjectResponse,
  ValueRequest,
} from "../models/project.model"; // Supponiamo che ProjectResponse sia un DTO
import { User } from "../entity/user.entity";
import { EvaluationService } from "./evaluation.service";
import { Value } from "../entity/values.entity";
import { Skill } from "../entity/skill.entity";
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

  async getAllProject(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ["userProjects", "userProjects.user", "client"],
    });
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
          "userProjects.user",
          "userProjects.project.userProjects",
          "userProjects.project.userProjects.user",
        ],
      });
      if (!user || !user.userProjects) {
        throw new Error("L'utente non esiste o non ha progetti associati.");
      }
      console.log(user.userProjects[0].project.userProjects);
      const projects = user.userProjects;
      let projectResponses: ProjectResponse[] = [];
      if (!user.isAdmin)
        projectResponses = await Promise.all(
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
              description: userProject.project.description,
              users: [],

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
      else
        projectResponses = await Promise.all(
          projects.map(async (userProject: UserProject) => {
            let response: ProjectResponse = {
              id: userProject.project.id,
              projectName: userProject.project.name,
              role: {
                id: userProject.role.id,
                code: userProject.role.code,
                name: userProject.role.name,
              },
              description: userProject.project.description,
              users:
                userProject.project && userProject.project.userProjects
                  ? await Promise.all(
                      userProject.project.userProjects
                        .filter((up) => !up.user.isAdmin) // Esclude gli admin
                        .map(async (up) => {
                          let lastEva: Evaluation | null =
                            await this.evaluationService.getLastEvaluationByUserAndProject(
                              up.user.id,
                              userProject.project.id
                            );
                          return {
                            id: up.user.id,
                            username: up.user.username,
                            ratingAverage: lastEva
                              ? this.calcolaMedia(lastEva.values)
                              : 0,
                            code: up.user.code,
                          };
                        })
                    )
                  : [],

              labelEvaluations: [],
              evaluations: [],
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

  async saveValue(
    valueRequest: ValueRequest,
    projectId: number
  ): Promise<Evaluation | null> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      const evaluation = await this.evaluationRepository.findOne({
        where: { id: valueRequest.evaluationId },
      });
      if (!evaluation) {
        throw new Error("Evaluation non trovato.");
      }
      evaluation.close = true;
      valueRequest.values.forEach(async (v) => {
        const skill = await this.skillRepository.findOne({
          where: { id: parseInt(v.skill, 10) },
        });

        if (skill) {
          let value = this.valueRepository.create({
            skill: skill,
            value: v.value,
            evaluation: evaluation,
          });
          console.log(value);
          await this.valueRepository.save(value);
        }
      });
      this.evaluationRepository.save(evaluation);
      return evaluation;
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

  async getProjectsDetail(
    projectId: number,
    userId: number
  ): Promise<ProjectResponse> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: [
          "userProjects",
          "userProjects.role",
          "userProjects.user",
          "skills",
          "evaluation",
          "evaluation.user",
          "evaluation.values",
          "evaluation.values.skill",
          "client",
        ],
      });
      if (!project) {
        throw new Error("Progetto non trovato.");
      }
      project.evaluation = (
        project.evaluation?.filter((e) => e.user.id === userId) || []
      ).sort((a, b) => b.evaluationDate.getTime() - a.evaluationDate.getTime());

      const userRole = project.userProjects?.find(
        (e) => e.user.id === userId
      )?.role;

      project.skills = project.skills?.sort((a, b) => b.id - a.id) || [];

      let response: ProjectResponse = {
        id: project.id,
        projectName: project.name,
        role: {
          id: userRole ? userRole.id : 0,
          code: userRole ? userRole.code : "",
          name: userRole ? userRole.name : "",
        },
        description: project.description,
        users: project.userProjects
          ? project.userProjects.map((userProject: UserProject) => {
              let user = {
                id: userProject.user.id,
                username: userProject.user.username,
                name: userProject.user.name,
                surname: userProject.user.surname,
                code: userProject.user.code,
                role: {
                  id: userProject.role.id,
                  code: userProject.role.code,
                  name: userProject.role.name,
                },
              };
              return user;
            })
          : [],
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
            startDate: evaluation.startDate,
            endDate: evaluation.endDate,
            label: evaluation.evaluationDate.toLocaleDateString(), //01/01/2024
            ratingAverage: this.calcolaMedia(evaluation.values),
            close: evaluation.close,
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
        client: {
          id: project.client.id,
          code: project.client.code,
          name: project.client.name,
          logo: project.client.file,
        },
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

  async createEvaluation(
    projectId: number,
    evaluationRequest: EvaluationRequest
  ): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ["userProjects", "userProjects.user", "client"],
      });

      if (!project) throw new Error("Progetto non trovato.");
      if (project?.userProjects)
        project?.userProjects.forEach(async (userProject: UserProject) => {
          let evaluation = this.evaluationRepository.create({
            startDate: evaluationRequest.startDate,
            endDate: evaluationRequest.endDate,
            evaluationDate: evaluationRequest.evaluationDate,
            user: userProject.user,
            project: project,
            close: false,
          });
          evaluation = await this.evaluationRepository.save(evaluation);
        });
      return project;
    } catch (error) {
      console.error("Errore durante il recupero del progetto:", error);
      throw new Error("Non è stato possibile recuperare il progetto.");
    }
  }
}
