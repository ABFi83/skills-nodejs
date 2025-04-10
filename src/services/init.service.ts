import { Repository } from "typeorm";
import { Evaluation } from "../entity/evaluation.entity";
import { Project } from "../entity/project.entity";
import { Role } from "../entity/role.entity";
import { Skill } from "../entity/skill.entity";
import { User } from "../entity/user.entity";
import { UserProject } from "../entity/userproject.entity";
import { Value } from "../entity/values.entity";
import { EvaluationService } from "./evaluation.service";
import { AppDataSource } from "../database/database";
import { Client } from "../entity/client.entity";

export class InitService {
  private projectRepository: Repository<Project>;
  private skillRepository: Repository<Skill>;
  private userRepository: Repository<User>;
  private evaluationRepository: Repository<Evaluation>;
  private valueRepository: Repository<Value>;
  private userProjectRepository: Repository<UserProject>;
  private roleRepository: Repository<Role>;
  private clientRepository: Repository<Client>;

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project); // Ottieni il repository per Project
    this.clientRepository = AppDataSource.getRepository(Client);
    this.skillRepository = AppDataSource.getRepository(Skill);
    this.userRepository = AppDataSource.getRepository(User);
    this.evaluationRepository = AppDataSource.getRepository(Evaluation);
    this.valueRepository = AppDataSource.getRepository(Value);
    this.userProjectRepository = AppDataSource.getRepository(UserProject);
    this.roleRepository = AppDataSource.getRepository(Role);
  }
  async createProject(): Promise<number[]> {
    try {
      let newProject: Project = this.projectRepository.create();

      const user = await this.userRepository.findOne({
        where: { id: 1 },
        relations: ["userProjects"],
      });
      if (!user) {
        throw new Error("Utente non trovato!");
      }

      const user1 = await this.userRepository.findOne({
        where: { id: 2 },
        relations: ["userProjects"],
      });
      if (!user1) {
        throw new Error("Utente non trovato!");
      }

      const userLm = await this.userRepository.findOne({
        where: { id: 3 },
        relations: ["userProjects"],
      });
      if (!userLm) {
        throw new Error("Utente non trovato!");
      }

      let client = await this.clientRepository.findOne({
        where: { code: "LUM" },
      });
      if (!client) {
        client = this.clientRepository.create({
          name: "Lumon",
          code: "LUM",
          file: "LUM.jpg",
        });
        client = await this.clientRepository.save(client);
      }

      let client2 = await this.clientRepository.findOne({
        where: { code: "POH" },
      });
      if (!client2) {
        client2 = this.clientRepository.create({
          name: "Pollo Hermanos",
          code: "POH",
          file: "POH.jpg",
        });
        client2 = await this.clientRepository.save(client2);
      }
      newProject.name = "Lumon - Scissione";
      newProject.client = client;
      newProject.description = "Avanti ad oltranza";
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

      let skill4 = await this.skillRepository.findOne({
        where: { name: "Java" },
      });
      if (!skill4) {
        skill4 = this.skillRepository.create({
          name: "Java",
          shortName: "JA",
        });
        skill4 = await this.skillRepository.save(skill4);
      }

      newProject.skills = [skill1, skill2, skill4];
      newProject = await this.projectRepository.save(newProject);

      let role = await this.roleRepository.findOne({
        where: { name: "Team Leader" },
      });
      if (!role) {
        role = this.roleRepository.create({
          code: "TL",
          name: "Team Leader",
        });
        role = await this.roleRepository.save(role);
      }

      let role1 = await this.roleRepository.findOne({
        where: { name: "Developer" },
      });
      if (!role1) {
        role1 = this.roleRepository.create({
          code: "DV",
          name: "Developer",
        });
        role1 = await this.roleRepository.save(role1);
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

      const userProject = new UserProject();
      userProject.user = user;
      userProject.project = newProject;
      userProject.role = role;
      userProject.level = "beginner";
      await this.userProjectRepository.save(userProject);

      const userProject1 = new UserProject();
      userProject1.user = user1;
      userProject1.project = newProject;
      userProject1.role = role1;
      userProject1.level = "beginner";
      await this.userProjectRepository.save(userProject1);

      const userProjectLm = new UserProject();
      userProjectLm.user = userLm;
      userProjectLm.project = newProject;
      userProjectLm.role = roleLm;
      userProjectLm.level = "beginner";
      await this.userProjectRepository.save(userProjectLm);

      let evaluation = this.evaluationRepository.create({
        evaluationDate: new Date("2024-02-28"),
        userProject: userProject,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-28"),
        close: true,
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
      let value4 = this.valueRepository.create({
        skill: skill4,
        value: 8,
        evaluation: evaluation,
      });
      await this.valueRepository.save(value4);

      let yestarday = new Date();
      yestarday.setDate(yestarday.getDate() - 1);
      let evaluationOld = this.evaluationRepository.create({
        evaluationDate: new Date("2024-01-31"),
        userProject: userProject,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        close: true,
      });
      evaluationOld = await this.evaluationRepository.save(evaluationOld);

      let valueOld = this.valueRepository.create({
        skill: skill1,
        value: 7,
        evaluation: evaluationOld,
      });
      await this.valueRepository.save(valueOld);
      let valueOld1 = this.valueRepository.create({
        skill: skill2,
        value: 9,
        evaluation: evaluationOld,
      });
      await this.valueRepository.save(valueOld1);

      await this.valueRepository.save(valueOld);
      let valueOld2 = this.valueRepository.create({
        skill: skill4,
        value: 2,
        evaluation: evaluationOld,
      });
      await this.valueRepository.save(valueOld2);

      let evaluation1 = this.evaluationRepository.create({
        evaluationDate: new Date("2024-02-28"),
        userProject: userProject1,
        startDate: new Date("2024-02-28"),
        endDate: new Date("2024-02-28"),
        close: true,
      });
      evaluation1 = await this.evaluationRepository.save(evaluation1);

      let valueSn = this.valueRepository.create({
        skill: skill1,
        value: 2,
        evaluation: evaluation1,
      });
      await this.valueRepository.save(valueSn);
      let valueSn1 = this.valueRepository.create({
        skill: skill2,
        value: 3,
        evaluation: evaluation1,
      });
      await this.valueRepository.save(valueSn1);
      let valueSn4 = this.valueRepository.create({
        skill: skill4,
        value: 4,
        evaluation: evaluation1,
      });
      await this.valueRepository.save(valueSn4);

      yestarday.setDate(yestarday.getDate() - 1);
      let evaluationOldSn = this.evaluationRepository.create({
        evaluationDate: new Date("2024-01-31"),
        userProject: userProject1,
        startDate: new Date("2024-01-31"),
        endDate: new Date("2024-01-31"),
        close: true,
      });
      evaluationOldSn = await this.evaluationRepository.save(evaluationOldSn);

      let valueOldSn = this.valueRepository.create({
        skill: skill1,
        value: 7,
        evaluation: evaluationOldSn,
      });
      await this.valueRepository.save(valueOldSn);
      let valueOldSn1 = this.valueRepository.create({
        skill: skill2,
        value: 9,
        evaluation: evaluationOldSn,
      });
      await this.valueRepository.save(valueOldSn1);

      await this.valueRepository.save(valueOld);
      let valueOldSn2 = this.valueRepository.create({
        skill: skill4,
        value: 2,
        evaluation: evaluationOldSn,
      });
      await this.valueRepository.save(valueOldSn2);

      //progetto 2 legato ad user1
      let newProject2: Project = this.projectRepository.create();
      newProject2.client = client2;
      newProject2.name = "Pollo Hermanos - Icemberg ";
      newProject2.description = "Breaking";
      newProject2.skills = [skill1, skill2, skill4];
      newProject2 = await this.projectRepository.save(newProject2);

      const userProject3 = new UserProject();
      userProject3.user = user;
      userProject3.project = newProject2;
      userProject3.role = role;
      userProject3.level = "beginner";
      await this.userProjectRepository.save(userProject3);

      const userProjectLm2 = new UserProject();
      userProjectLm2.user = userLm;
      userProjectLm2.project = newProject2;
      userProjectLm2.role = roleLm;
      userProjectLm2.level = "beginner";
      await this.userProjectRepository.save(userProjectLm2);

      let evaluationNP2 = this.evaluationRepository.create({
        evaluationDate: new Date("2024-01-28"),
        userProject: userProject3,
        startDate: new Date("2024-01-28"),
        endDate: new Date("2024-01-28"),
        close: true,
      });
      evaluationNP2 = await this.evaluationRepository.save(evaluationNP2);

      let valueNP2 = this.valueRepository.create({
        skill: skill1,
        value: 10,
        evaluation: evaluationNP2,
      });

      await this.valueRepository.save(valueNP2);
      let value1NP2 = this.valueRepository.create({
        skill: skill2,
        value: 5,
        evaluation: evaluationNP2,
      });
      await this.valueRepository.save(value1NP2);
      let value4NP2 = this.valueRepository.create({
        skill: skill4,
        value: 8,
        evaluation: evaluationNP2,
      });
      await this.valueRepository.save(value4NP2);

      return [newProject.id, newProject2.id];
    } catch (error) {
      console.error("Errore durante l'aggiornamento del progetto:", error);
      throw new Error("Non è stato possibile aggiornare il progetto.");
    }
  }
}
