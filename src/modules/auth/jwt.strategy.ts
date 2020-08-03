import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionMiddleware } from '../../middleware/session.middleware';
import { SESSION_USER } from '../../shared/constants';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly log = new BackendLogger(JwtStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly dotenvService: DotenvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: dotenvService.get('APP_KEY'),
    });
  }

  public async validate(payload: { mobile_number: string }) {
    const user = await this.userService.findOne({
      mobile_number: payload.mobile_number,
    });

    if (!user) {
      this.log.debug('Invalid/expired payload:');
      this.log.debug(JSON.stringify(payload));
      throw new UnauthorizedException();
    }
    SessionMiddleware.set(SESSION_USER, user);

    return user;
  }
}
