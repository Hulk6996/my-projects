import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsFeed } from './entities/news_feed.entity';

@Injectable()
export class NewsFeedService {
  constructor(
    @InjectRepository(NewsFeed)
    private newsFeedRepository: Repository<NewsFeed>,
  ) {}

  async findAll(): Promise<NewsFeed[]> {
    return this.newsFeedRepository.find({ relations: ['user', 'profilePost'] });
  }
}