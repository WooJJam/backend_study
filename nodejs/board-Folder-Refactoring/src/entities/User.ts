// User.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:"user"})
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
