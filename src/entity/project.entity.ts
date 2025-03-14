import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Skill } from "./skill.entity";
import { Evaluation } from "./evaluation.entity";
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  name: string = "";

  @ManyToMany(() => User, (user) => user.projects, { lazy: true })
  users: User[] | undefined;

  @ManyToMany(() => Skill, (skill) => skill.projects)
  skills: Skill[] | undefined;

  @OneToMany(() => Evaluation, (evaluation) => evaluation.project, {
    lazy: true,
  })
  evaluations: Evaluation[] | undefined;

  constructor(name: string) {
    if (name) {
      this.name = name;
    }
  }
}
