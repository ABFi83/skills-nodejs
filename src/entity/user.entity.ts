import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";

import { UserProject } from "./userproject.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  surname?: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  code!: string;

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  userProjects?: UserProject[];
}
