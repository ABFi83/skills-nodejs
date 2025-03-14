import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { Project } from "../entity/project.entity";
import { Evaluation } from "../entity/evaluation.entity";
import { Skill } from "../entity/skill.entity";
import { Value } from "../entity/values.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./mydb.db",
  synchronize: true,
  logging: true,
  entities: [User, Project, Skill, Evaluation, Value],
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
