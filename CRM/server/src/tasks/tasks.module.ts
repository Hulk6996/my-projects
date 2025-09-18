import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    LogModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
