import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { Value } from "./values.entity";

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinTable()
  user!: User;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  close?: boolean;

  @Column()
  evaluationDate!: Date; // Data della valutazione con vincolo di unicità

  @ManyToOne(() => Project, { nullable: false, onDelete: "CASCADE" })
  @JoinTable()
  project!: Project;

  @OneToMany(() => Value, (value) => value.evaluation, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  values?: Value[];
}
