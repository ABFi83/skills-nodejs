import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Project } from "./project.entity";
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

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  projects: Project[] | undefined;

  constructor(username: string, surname: string, name?: string) {
    this.username = username;
    this.surname = surname;
    if (name) {
      this.name = name;
    }
  }
}
