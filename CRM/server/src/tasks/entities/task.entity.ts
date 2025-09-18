import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum TaskStatus {
  Incoming = 'Входящие',
  OnApproval = 'На согласовании',
  InProduction = 'В производстве',
  Produced = 'Произведено',
  ToShipment = 'К отгрузке',
  Completed = 'Завершено',
  Cancelled = 'Отменено'
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.Incoming
  })
  status: TaskStatus;

  @CreateDateColumn()
  creationDate: Date;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comment, comment => comment.task, { cascade: true })
  comments: Comment[];
}
