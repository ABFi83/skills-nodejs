import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Evaluation } from "./evaluation.entity"; // Assicurati che il percorso sia corretto
import { Skill } from "./skill.entity";

@Entity()
export class Value {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Skill, { nullable: false })
  skill!: Skill;

  @Column()
  value!: number;

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.values, {
    onDelete: "CASCADE",
  })
  evaluation!: Evaluation;
}
