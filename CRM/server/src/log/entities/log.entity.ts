import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  userId: number;

  @Column()
  description: string;

  @Column()
  timestamp: Date = new Date();
}