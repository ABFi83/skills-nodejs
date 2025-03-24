import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Project } from "./project.entity";
import { User } from "./user.entity";
import { Role } from "./role.entity";
@Entity()
export class UserProject {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userProjects, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Project, (project) => project.userProjects, {
    onDelete: "CASCADE",
  })
  project!: Project;

  @ManyToOne(() => Role, (role) => role.userProjects)
  role!: Role;
}
