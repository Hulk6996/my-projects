import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/entities/user.entity';
import { ProfilePost } from './entities/profile_post.entity';
import { NewsFeed } from './../news_feed/entities/news_feed.entity';
import * as path from 'path';

@Injectable()
export class ProfilePostService {
  private readonly logger = new Logger(ProfilePostService.name);

  constructor(
    @InjectRepository(ProfilePost)
    private profilePostRepository: Repository<ProfilePost>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(NewsFeed)
    private newsFeedRepository: Repository<NewsFeed>,
  ) {}

  async create(text: string, userId: string, imageName: string): Promise<ProfilePost> {
    try {
      const user = await this.userRepository.findOne({ where: { id: Number(userId) } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      this.logger.log(`Creating new profile post for user ID ${userId}`);
  
      const newPost = new ProfilePost();
      newPost.post_text = text;
      newPost.postImage = imageName ? `http://localhost:3001/uploads/${path.basename(imageName)}` : null;
      newPost.date_and_time_of_post = new Date();
      newPost.user = user;
  
      const savedPost = await this.profilePostRepository.save(newPost);
  
      this.logger.log(`Profile post created successfully: ${JSON.stringify(savedPost)}`);
  
      const newsFeed = new NewsFeed();
      newsFeed.user = savedPost.user;
      newsFeed.profilePost = savedPost;
      newsFeed.post_type = 'profile';
      newsFeed.date_and_time_added = savedPost.date_and_time_of_post;
  
      await this.newsFeedRepository.save(newsFeed);
  
      return savedPost;
    } catch (error) {
      this.logger.error('Error creating profile post', error);
      throw error;
    }
  }

  async findAll(): Promise<ProfilePost[]> {
    try {
      const posts = await this.profilePostRepository.find({ relations: ['user', 'newsFeeds'] });
      this.logger.log(`Found posts: ${posts.length}`);
      if (posts.length > 0) {
        this.logger.log(`First post: ${JSON.stringify(posts[0])}`);
      }
      return posts;
    } catch (error) {
      this.logger.error('Error getting posts', error.stack);
      throw error;
    }
  }
}
