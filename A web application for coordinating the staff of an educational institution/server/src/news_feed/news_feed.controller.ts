import { Controller, Get } from '@nestjs/common';
import { NewsFeedService } from './news_feed.service';

@Controller('news-feed')
export class NewsFeedController {
  constructor(private readonly newsFeedService: NewsFeedService) {}

  @Get()
  findAll() {
    return this.newsFeedService.findAll();
  }
}