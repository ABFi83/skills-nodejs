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

import { Skill } from "./skill.entity";
import { UserProject } from "./userproject.entity";
@Entity()
export class Project {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name: string = "";

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects!: UserProject[];

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
