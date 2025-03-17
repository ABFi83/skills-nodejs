import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinTable,
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
  @JoinTable()
  user: User;

  @ManyToOne(() => Project, { nullable: false })
  @JoinTable()
  project: Project;

  @OneToMany(() => Value, (value) => value.evaluation)
  @JoinTable()
  values?: Value[];

  @CreateDateColumn()
  evaluationDate: Date; // Data della valutazione

  constructor(user: User, project: Project) {
    this.user = user;
    this.project = project;
    this.evaluationDate = new Date();
  }
}
