import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsFeedDto } from './create-news_feed.dto';

export class UpdateNewsFeedDto extends PartialType(CreateNewsFeedDto) {}
