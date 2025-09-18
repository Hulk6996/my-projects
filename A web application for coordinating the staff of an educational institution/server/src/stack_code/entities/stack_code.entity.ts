import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'stack_codes' })
export class StackCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  isActive: boolean;
}