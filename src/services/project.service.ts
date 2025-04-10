import { Evaluation } from "./../entity/evaluation.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Project } from "../entity/project.entity";
import {
  EvaluationLM,
  EvaluationRequest,
  EvaluationsLM,
  ProjectRequest,
  ProjectResponse,
  ValueRequest,
} from "../models/project.model"; // Supponiamo che ProjectResponse sia un DTO
import { User } from "../entity/user.entity";
import { EvaluationService } from "./evaluation.service";
import { Value } from "../entity/values.entity";
import { Skill } from "../entity/skill.entity";
import { UserProject } from "../entity/userproject.entity";
import { Role } from "../entity/role.entity";
import { Client } from "../entity/client.entity";

export class ProjectService {
  private projectRepository: Repository<Project>;
  private skillRepository: Repository<Skill>;
  private userRepository: Repository<User>;
  private evaluationRepository: Repository<Evaluation>;
  private valueRepository: Repository<Value>;
  private evaluationService: EvaluationService;
  private userProjectRepository: Repository<UserProject>;
  private roleRepository: Repository<Role>;
  private clientRepository: Repository<Client>;

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project); // Ottieni il repository per Project
    this.evaluationService = new EvaluationService();
    this.skillRepository = AppDataSource.getRepository(Skill);
    this.userRepository = AppDataSource.getRepository(User);
    this.evaluationRepository = AppDataSource.getRepository(Evaluation);
    this.valueRepository = AppDataSource.getRepository(Value);
    this.userProjectRepository = AppDataSource.getRepository(UserProject);
    this.roleRepository = AppDataSource.getRepository(Role);
    this.clientRepository = AppDataSource.getRepository(Client);
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
          "userProjects.project.client",
          "userProjects.evaluation",
          "userProjects.evaluation.values",
          "userProjects.evaluation.values.skill",
          "userProjects.role",
          "userProjects.user",
          "userProjects.project.userProjects",
          "userProjects.project.userProjects.user",
        ],
      });
      if (!user || !user.userProjects) {
        throw new Error("L'utente non esiste o non ha progetti associati.");
      }

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
              client: {
                id: userProject.project.client.id,
                code: userProject.project.client.code,
                name: userProject.project.client.name,
                logo: userProject.project.client.file,
              },
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
        relations: ["userProjects", "skills", "evaluation"],
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
    updatedProject: ProjectRequest
  ): Promise<Project> {
    try {
      // Recupera il progetto dal database
      const project = await this.getProjectById(id);
      if (!project) {
        throw new Error("Progetto non trovato.");
      }

      // Aggiorna i campi principali del progetto
      project.name = updatedProject.projectName || project.name;
      project.description = updatedProject.description || project.description;

      // Gestione del client
      if (updatedProject.clientCode) {
        let client = await this.clientRepository.findOne({
          where: { code: updatedProject.clientCode },
        });
        if (!client) {
          client = this.clientRepository.create({
            code: updatedProject.clientCode,
            name: updatedProject.clientName || "",
            file: "",
          });
          client = await this.clientRepository.save(client);
        }
        project.client = client;
      }

      // Gestione degli utenti (userProjects)
      if (updatedProject.users) {
        const currentUserProjects = await this.userProjectRepository.find({
          where: { project: { id: project.id } },
          relations: ["user", "role"],
        });

        // Trova gli utenti da aggiungere
        const updatedUserIds = updatedProject.users.map((u) => u.id);
        const usersToAdd = updatedProject.users.filter(
          (u) => !currentUserProjects.some((up) => up.user.id === u.id)
        );

        // Trova gli utenti da rimuovere
        const usersToRemove = currentUserProjects.filter(
          (up) => !updatedUserIds.includes(up.user.id)
        );

        // Rimuovi gli utenti non più presenti
        for (const userProject of usersToRemove) {
          await this.userProjectRepository.remove(userProject);
        }

        // Aggiungi i nuovi utenti
        for (const userData of usersToAdd) {
          const user = await this.userRepository.findOne({
            where: { id: userData.id },
          });
          if (!user) {
            throw new Error(`Utente con ID ${userData.id} non trovato.`);
          }

          if (userData.role) {
            const role = await this.roleRepository.findOne({
              where: { id: userData.role.id },
            });
            if (!role) {
              throw new Error(`Ruolo con ID ${userData.role.id} non trovato.`);
            }
            const userProject = this.userProjectRepository.create({
              user: user,
              project: project,
              role: role,
            });

            const savedUserProject = await this.userProjectRepository.save(
              userProject
            );

            project.userProjects = [
              ...(project.userProjects || []),
              ...[savedUserProject],
            ];
          }
        }
      }

      // Gestione delle competenze (skills)
      if (updatedProject.skills) {
        const currentSkills = project.skills || [];

        // Trova le skill da aggiungere
        const updatedSkillIds = updatedProject.skills.map((s) => s.id);
        const skillsToAdd = await this.skillRepository.findByIds(
          updatedSkillIds.filter(
            (id) => !currentSkills.some((s) => s.id === id)
          )
        );

        // Trova le skill da rimuovere
        const skillsToRemove = currentSkills.filter(
          (s) => !updatedSkillIds.includes(s.id)
        );

        // Rimuovi le skill non più presenti
        project.skills = currentSkills.filter(
          (s) => !skillsToRemove.some((skill) => skill.id === s.id)
        );

        // Aggiungi le nuove skill
        project.skills = [...project.skills, ...skillsToAdd];
      }

      // Salva il progetto aggiornato nel database
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
      // Recupera il progetto con il singolo userProject associato all'utente
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: [
          "userProjects",
          "userProjects.role",
          "userProjects.evaluation",
          "userProjects.evaluation.values",
          "userProjects.evaluation.values.skill",
          "userProjects.user",
          "skills",
          "client",
        ],
      });

      if (!project) {
        throw new Error("Progetto non trovato.");
      }

      // Filtra per ottenere solo lo userProject associato all'utente
      const userProject = project.userProjects?.find(
        (up) => up.user.id === userId
      );

      if (!userProject) {
        throw new Error("UserProject non trovato per l'utente specificato.");
      }

      // Ordina le valutazioni per data decrescente
      const evaluations = userProject.evaluation
        ?.sort(
          (a, b) => b.evaluationDate.getTime() - a.evaluationDate.getTime()
        )
        .map((evaluation) => ({
          id: evaluation.id,
          startDate: evaluation.startDate,
          endDate: evaluation.endDate,
          label: evaluation.evaluationDate.toLocaleDateString(), // Formatta la data
          ratingAverage: this.calcolaMedia(evaluation.values),
          close: evaluation.close,
          values: evaluation.values
            ? evaluation.values.map((value) => ({
                id: value.id,
                skill: value.skill.name,
                value: value.value,
              }))
            : [],
        }));

      // Costruisci la risposta
      const response: ProjectResponse = {
        id: project.id,
        projectName: project.name,
        role: {
          id: userProject.role.id,
          code: userProject.role.code,
          name: userProject.role.name,
        },
        description: project.description,
        users: project.userProjects
          ? project.userProjects.map((userProject) => ({
              id: userProject.user.id,
              username: userProject.user.username,
              name: userProject.user.name || "",
              surname: userProject.user.surname || "",
              code: userProject.user.code,
              role: {
                id: userProject.role.id,
                code: userProject.role.code,
                name: userProject.role.name,
              },
            }))
          : [],
        labelEvaluations: project.skills
          ? project.skills.map((skill) => ({
              id: skill.id,
              label: skill.name,
              shortLabel: skill.shortName,
            }))
          : [],
        evaluations: evaluations || [],
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
        "Errore durante il recupero dei dettagli del progetto:",
        error
      );
      throw new Error(
        "Non è stato possibile recuperare i dettagli del progetto."
      );
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

      if (project?.userProjects) {
        for (const userProject of project.userProjects) {
          // Converte le date in oggetti Date validi
          const startDate = new Date(evaluationRequest.startDate);
          const endDate = new Date(evaluationRequest.endDate);
          const evaluationDate = new Date(evaluationRequest.evaluationDate);

          // Verifica che le date siano valide
          if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime()) ||
            isNaN(evaluationDate.getTime())
          ) {
            throw new Error("Una o più date fornite non sono valide.");
          }
          // Crea l'entità Evaluation con i valori corretti
          const evaluation = this.evaluationRepository.create({
            startDate,
            endDate,
            evaluationDate,
            userProject: userProject,
            close: false,
          });
          // Salva l'entità Evaluation
          await this.evaluationRepository.save(evaluation);
        }
      }
      return project;
    } catch (error) {
      console.error("Errore durante il salvataggio della valutazione:", error);
      throw new Error("Non è stato possibile salvare la valutazione.");
    }
  }

  async createProject(
    projectData: ProjectRequest,
    userId: number
  ): Promise<Project> {
    try {
      let client = await this.clientRepository.findOne({
        where: { code: projectData.clientCode },
      });
      if (!client) {
        client = this.clientRepository.create({
          name: "",
          code: projectData.clientCode,
          file: "",
        });
        client = await this.clientRepository.save(client);
      }
      const newProject: Partial<Project> = {
        name: projectData.projectName,
        description: projectData.description,
        client: client,
      };
      const project = this.projectRepository.create(newProject);
      const savedProject = await this.projectRepository.save(project);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("Utente non trovato.");
      }

      let roleLm = await this.roleRepository.findOne({
        where: { name: "Line Manager" },
      });
      if (!roleLm) {
        roleLm = this.roleRepository.create({
          code: "LM",
          name: "Line Manager",
        });
        roleLm = await this.roleRepository.save(roleLm);
      }

      const userProject = this.userProjectRepository.create({
        user: user,
        project: savedProject,
        role: roleLm,
      });
      await this.userProjectRepository.save(userProject);
      return savedProject;
    } catch (error) {
      console.error("Errore durante la creazione del progetto:", error);
      throw new Error("Non è stato possibile creare il progetto.");
    }
  }

  async getEvaluationDates(projectId: number): Promise<Date[]> {
    try {
      // Recupera le valutazioni distinte per il progetto, ordinate per evaluationDate in ordine decrescente
      const evaluations = await this.evaluationRepository
        .createQueryBuilder("evaluation")
        .select("DISTINCT evaluation.evaluationDate", "evaluationDate")
        .innerJoin("evaluation.userProject", "userProject")
        .innerJoin("userProject.project", "project")
        .where("project.id = :projectId", { projectId })
        .orderBy("evaluation.evaluationDate", "DESC")
        .getRawMany();

      // Rimuovi duplicati basandoti su evaluationDate
      const uniqueDates = Array.from(
        new Set(evaluations.map((evaluation) => evaluation.evaluationDate))
      );

      // Restituisci solo le date
      return uniqueDates;
    } catch (error) {
      console.error(
        "Errore durante il recupero delle date di valutazione:",
        error
      );
      throw new Error(
        "Non è stato possibile recuperare le date di valutazione."
      );
    }
  }

  async getEvaluationsByProjectAndDate(
    projectId: number,
    evaluationDate: string
  ): Promise<EvaluationsLM> {
    try {
      // Recupera il progetto con i relativi userProjects, valutazioni e competenze
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: [
          "userProjects",
          "userProjects.user",
          "userProjects.role",
          "userProjects.evaluation",
          "userProjects.evaluation.values",
          "userProjects.evaluation.values.skill",
          "skills",
        ],
      });

      if (!project || !project.userProjects || !project.skills) {
        throw new Error("Progetto non trovato o struttura non valida.");
      }

      // Filtra gli userProjects che non hanno il ruolo "Line Manager" (LM)
      const nonLmUserProjects = project.userProjects.filter(
        (userProject) => userProject.role.name !== "Line Manager"
      );

      // Lista per raccogliere tutte le valutazioni
      const evaluationLMList: EvaluationLM[] = [];
      const skillSet = new Set<number>(); // Per raccogliere le skill con almeno una valutazione

      // Itera su ogni userProject non "Line Manager"
      for (const userProject of nonLmUserProjects) {
        // Filtra le valutazioni per la data specificata
        const evaluationsForDate = userProject.evaluation?.filter(
          (evaluation) =>
            evaluation.evaluationDate.toISOString().split("T")[0] ===
            evaluationDate.split("T")[0]
        );

        if (evaluationsForDate && evaluationsForDate.length > 0) {
          for (const evaluation of evaluationsForDate) {
            for (const value of evaluation.values || []) {
              evaluationLMList.push({
                skillId: value.skill.id.toString(),
                score: value.value,
                user: {
                  id: userProject.user.id,
                  username: userProject.user.username,
                  name: userProject.user.name,
                  surname: userProject.user.surname,
                  code: userProject.user.code,
                },
              });

              // Aggiungi la skill all'elenco delle skill valutate
              skillSet.add(value.skill.id);
            }
          }
        }
      }

      // Recupera le skill che hanno almeno una valutazione
      const evaluatedSkills = project.skills
        .filter((skill) => skillSet.has(skill.id))
        .map((skill) => ({
          id: skill.id,
          label: skill.name,
          shortLabel: skill.shortName,
        }));

      // Restituisci l'oggetto EvaluationsLM
      return {
        evaluation: evaluationLMList,
        skill: evaluatedSkills,
      };
    } catch (error) {
      console.error(
        "Errore durante il recupero delle valutazioni per progetto e data:",
        error
      );
      throw new Error(
        "Non è stato possibile recuperare le valutazioni per progetto e data."
      );
    }
  }
}
