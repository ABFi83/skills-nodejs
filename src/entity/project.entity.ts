import { Evaluation } from "./evaluation.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Skill } from "./skill.entity";
import e from "express";
@Entity()
export class Project {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name: string = "";

  @ManyToMany(() => User, (user) => user.projects)
  users: User[] | undefined;

  @ManyToMany(() => Skill, (skill) => skill.projects)
  @JoinTable()
  skills?: Skill[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.project, {
    cascade: true,
    onDelete: "CASCADE",
  })
  evaluation?: Evaluation[];

  constructor(name: string) {
    if (name) {
      this.name = name;
    }
  }
}
