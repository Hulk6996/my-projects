import { TaskStatus } from '../entities/task.entity'; 

export class UpdateTaskDto {
    status?: TaskStatus;
  }