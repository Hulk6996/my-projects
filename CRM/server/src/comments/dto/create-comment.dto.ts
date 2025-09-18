import { IsString, IsNumber} from 'class-validator';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  taskId: number;

  user?: User;
  task?: Task;
}
