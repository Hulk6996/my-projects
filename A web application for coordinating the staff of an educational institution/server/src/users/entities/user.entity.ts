import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Message } from './../../messages/entities/message.entity';
import { ProfilePost } from './../../profile_posts/entities/profile_post.entity';
import { NewsFeed } from './../../news_feed/entities/news_feed.entity';
import { Replacement } from './../../replacement/entities/replacement.entity';  // Путь к replacement.entity.ts может варьироваться

export enum Gender {
  Male = 'male',
  Female = 'female',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  surname: string;

  @Column({ type: 'date', nullable: true }) 
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 'employee' })
  role: string;

  @Column({ nullable: true })
  profilePicture: string;

  @OneToMany(() => Message, message => message.sender, { onDelete: 'CASCADE' })
  sentMessages: Message[];

  @OneToMany(() => ProfilePost, post => post.user, { onDelete: 'CASCADE' })
  posts: ProfilePost[];

  @OneToMany(() => NewsFeed, feed => feed.user, { onDelete: 'CASCADE' })
  newsFeeds: NewsFeed[];

  @OneToMany(() => Replacement, replacement => replacement.selectedTeacher)
  replacements: Replacement[];

  @OneToMany(() => Replacement, replacement => replacement.replacementTeacher)
  replacementsAsReplacement: Replacement[];

  @Column({ default: true })
  isActive: boolean; 
}
