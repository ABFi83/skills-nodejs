import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Project } from "./project.entity";
import { Value } from "./values.entity";

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ nullable: true })
  name: string = "";
  @Column({ nullable: true })
  shortName: string = "";
  @ManyToMany(() => Project, (project) => project.skills)
  projects: Project[];

  constructor(name: string, projects: Project[]) {
    if (name) {
      this.name = name;
    }
    this.projects = projects;
  }
}
