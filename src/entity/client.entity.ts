import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Project } from "./project.entity";
import { User } from "./user.entity";
import { Role } from "./role.entity";
@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @Column()
  file!: string;

  @ManyToOne(() => Project, (project) => project.client, {
    onDelete: "CASCADE",
  })
  project!: Project[];
}
