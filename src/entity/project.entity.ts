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
import { Client } from "./client.entity";
@Entity()
export class Project {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name: string = "";
  @Column()
  description: string = "";

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects?: UserProject[];

  @ManyToOne(() => Client, (client) => client.project)
  client!: Client;

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
