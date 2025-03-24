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
  username: string;

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  userProjects?: UserProject[];

  constructor(username: string, surname: string, name?: string) {
    this.username = username;
    this.surname = surname;
    if (name) {
      this.name = name;
    }
  }
}
