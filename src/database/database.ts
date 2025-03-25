import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { Project } from "../entity/project.entity";
import { Evaluation } from "../entity/evaluation.entity";
import { Skill } from "../entity/skill.entity";
import { Value } from "../entity/values.entity";
import { UserProject } from "../entity/userproject.entity";
import { Role } from "../entity/role.entity";
import { Client } from "../entity/client.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./mydb.db",
  synchronize: true,
  logging: false,
  entities: [
    User,
    Project,
    Skill,
    Evaluation,
    Value,
    UserProject,
    Role,
    Client,
  ],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
