import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]),
LogModule
],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
