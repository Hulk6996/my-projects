import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePost } from './entities/profile_post.entity';
import { NewsFeed } from '../news_feed/entities/news_feed.entity';
import { ProfilePostService } from './profile_posts.service';
import { ProfilePostController } from './profile_posts.controller';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express'; 
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePost, NewsFeed]),
    JwtModule, UsersModule, 


  ],
  providers: [ProfilePostService],
  controllers: [ProfilePostController],
})
export class ProfilePostsModule {}
