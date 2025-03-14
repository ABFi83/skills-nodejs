import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { Skill } from "./skill.entity";
import { Value } from "./values.entity";

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Project, { nullable: false })
  project: Project;

  @OneToMany(() => Value, (value) => value.evaluation)
  values: Value[] | undefined;

  @CreateDateColumn()
  evaluationDate: Date; // Data della valutazione

  constructor(user: User, project: Project) {
    this.user = user;
    this.project = project;
    this.evaluationDate = new Date();
  }
}
