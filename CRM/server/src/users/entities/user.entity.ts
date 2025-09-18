import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ default: 'employee' })
  role: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Comment, comment => comment.user, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}
