import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity'; // Убедитесь, что путь к файлу сущности User правильный

export const GetUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user && user[data] : user;
  },
);
