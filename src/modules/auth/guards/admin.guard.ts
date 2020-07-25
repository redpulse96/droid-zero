import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestWithUser } from 'src/shared/types';

@Injectable()
export class AdminGuard implements CanActivate {
  public async canActivate(context: ExecutionContext) {
    let request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    const { user } = request;

    return user.is_admin;
  }
}
