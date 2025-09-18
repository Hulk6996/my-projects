import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Replacement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selectedTeacherId: number;

  @ManyToOne(() => User, user => user.replacements)
  @JoinColumn({ name: 'selectedTeacherId' })
  selectedTeacher: User;

  @Column()
  replacementTeacherId: number;

  @ManyToOne(() => User, user => user.replacementsAsReplacement)
  @JoinColumn({ name: 'replacementTeacherId' })
  replacementTeacher: User;

  @Column()
  lessonNumber: number;

  @Column()
  classNumber: string;

  @Column()
  date: string;
}
