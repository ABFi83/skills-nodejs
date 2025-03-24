import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { UserProject } from "./userproject.entity";
@Entity()
export class Role {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @ManyToOne(() => UserProject, (userProject) => userProject.role)
  userProjects?: UserProject[];
}
