import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({ name: 'employee_code' })
export class EmployeeCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  isActive: boolean;


}