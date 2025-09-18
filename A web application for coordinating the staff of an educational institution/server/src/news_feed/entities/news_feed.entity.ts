import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './../../users/entities/user.entity';
import { ProfilePost } from './../../profile_posts/entities/profile_post.entity';

@Entity({ name: 'news_feed' })
export class NewsFeed {
  @PrimaryGeneratedColumn()
  news_id: number;

  @ManyToOne(() => User, user => user.newsFeeds, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ProfilePost, profilePost => profilePost.newsFeeds)
  profilePost: ProfilePost;

  @Column({ type: 'varchar', length: 10 })
  post_type: string;

  @Column({ type: 'timestamp' })
  date_and_time_added: Date;
}