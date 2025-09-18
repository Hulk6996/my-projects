import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsFeedService } from './news_feed.service';
import { NewsFeedController } from './news_feed.controller';
import { NewsFeed } from './entities/news_feed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsFeed])],
  controllers: [NewsFeedController],
  providers: [NewsFeedService],
})
export class NewsFeedModule {} 