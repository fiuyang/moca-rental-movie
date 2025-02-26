import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '../types/user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ICurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
