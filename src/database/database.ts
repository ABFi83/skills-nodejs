import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./mydb.db",
  synchronize: true,
  logging: false,
  entities: [User],
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
