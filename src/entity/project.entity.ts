import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
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

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  users: User[] | undefined;

  @ManyToMany(() => Skill, (skill) => skill.projects)
  @JoinTable() // Solo qui! NON metterlo su `Skill`
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
