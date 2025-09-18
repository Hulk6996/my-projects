import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number; 

  @Column()
  sender_id: number; 

  @Column({ type: 'text' })
  text_message: string; 

  @Column({ type: 'timestamp' })
  date_and_time_sending: Date; 

  @ManyToOne(() => User, user => user.sentMessages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' }) 
  sender: User;
}