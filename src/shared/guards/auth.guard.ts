import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { RequestWithUser } from 'src/shared/types';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly log = new BackendLogger(AuthGuard.name);

  public async canActivate(context: ExecutionContext) {
    let request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    if (!request.user) {
      this.log.warn(`No user found for request: ${request.path}`);
    }

    return !!request.user;
  }
}
