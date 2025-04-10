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
import { UserProject } from "./userproject.entity";

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  close?: boolean;

  @Column()
  evaluationDate!: Date; // Data della valutazione con vincolo di unicità

  @ManyToOne(() => UserProject, { nullable: false })
  @JoinTable()
  userProject!: UserProject;

  @OneToMany(() => Value, (value) => value.evaluation, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  values?: Value[];
}
