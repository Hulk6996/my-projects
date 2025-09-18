import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'manager_code' })
export class ManagerCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  isActive: boolean;
}