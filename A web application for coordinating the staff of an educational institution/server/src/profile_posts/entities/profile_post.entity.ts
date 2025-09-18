import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './../../users/entities/user.entity';
import { NewsFeed } from './../../news_feed/entities/news_feed.entity';

@Entity({ name: 'profile_posts' })
export class ProfilePost {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ type: 'text', nullable: true })
  post_text: string;

  @Column({ type: 'timestamp' })
  date_and_time_of_post: Date;

  @Column({ nullable: true })
  postImage: string;

  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => NewsFeed, newsFeed => newsFeed.profilePost)
  newsFeeds: NewsFeed[];
}
