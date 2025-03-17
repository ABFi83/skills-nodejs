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
  id: number = 0;

  @ManyToOne(() => Skill, { nullable: false })
  skill: Skill;

  @Column()
  value: number; // Il valore numerico associato alla skill

  // Relazione molti a uno con Evaluation
  @ManyToOne(() => Evaluation, (evaluation) => evaluation.values)
  @JoinTable()
  evaluation: Evaluation; // Una valutazione può avere molti valori

  constructor(skill: Skill, value: number, evaluation: Evaluation) {
    this.skill = skill;
    this.value = value;
    this.evaluation = evaluation;
  }
}
