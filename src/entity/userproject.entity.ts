import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from "typeorm";
import { Project } from "./project.entity";
import { User } from "./user.entity";
import { Role } from "./role.entity";
import { Evaluation } from "./evaluation.entity";

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

  @OneToMany(() => Evaluation, (evaluation) => evaluation.userProject, {
    cascade: true,
    onDelete: "CASCADE",
  })
  evaluation?: Evaluation[];

  @ManyToOne(() => Role, (role) => role.userProjects)
  role!: Role;

  @Column()
  level!: string;
}
