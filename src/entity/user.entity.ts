import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  surname?: string;

  @Column()
  username: string;

  constructor(username: string, surname: string, name?: string) {
    this.username = username;
    this.surname = surname;
    if (name) {
      this.name = name;
    }
  }
}
