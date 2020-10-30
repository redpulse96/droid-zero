import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SessionMiddleware } from 'src/middleware/session.middleware';
import { DotenvService } from 'src/modules/dotenv/dotenv.service';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { Users } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { SESSION_USER, UserConfigs } from 'src/shared/constants';
import { RequestWithUser } from 'src/shared/types';
import { Utils } from 'src/shared/util';
const { verifyAsync } = Utils;
const { AppConfigs, PortalConfigs } = UserConfigs;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new BackendLogger(AuthMiddleware.name);

  constructor(
    private readonly userService: UserService,
    private readonly dotenvService: DotenvService,
  ) {}

  public async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // Check API key first
    const api_key = req.query.key || req.body.key;
    let user: Users;

    // Check API key first
    if (api_key) {
      user = await this.userService.findOne({ api_key }, ['access']);
      if (!user) {
        this.logger.warn(`Unauthorized exception for url: ${req.originalUrl}`);
        throw new UnauthorizedException();
      }

      req.user = user;
      SessionMiddleware.set(SESSION_USER, user);
      return next();
    }

    // Try JWT next
    const token = this.getTokenFromReq(req);
    if (!token) {
      return next();
    }

    try {
      const payload: any = await verifyAsync(
        token,
        this.dotenvService.get('APP_KEY'),
        { ignoreExpiration: this.isApplicationUser(req) },
      );
      const mobile_number: string = payload.mobile_number;
      user = await this.userService.findOne({ mobile_number }, ['user_access']);
    } catch (err) {
      // This should be a debug message, since regularly JWTs will expire
      // during normal use of the portal so we don't want to raise alarms
      // when we can't verify it
      this.logger.debug(`Error verifying JWT: ${err}`);
    }

    SessionMiddleware.set(SESSION_USER, user);
    req.user = user;

    return next();
  }

  private getTokenFromReq(req: Request) {
    let authHeader = req.headers.authorization;
    const access_token: any = req.query.token;
    if (!authHeader) {
      authHeader = decodeURIComponent(access_token) || access_token;
    }

    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    return token;
  }

  private isApplicationUser(req: Request) {
    const authHeader: string = req?.headers?.authorization;
    if (!authHeader) {
      return false;
    }
    const tokenType: string = authHeader.split(' ')[0];
    switch (tokenType) {
      case AppConfigs.AuthorizationType:
        return true;
      case PortalConfigs.AuthorizationType:
        return false;
    }
  }
}
