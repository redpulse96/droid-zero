import {
  Body, Controller,
  Headers, Post, Put,
  Req, Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestWithUser } from 'src/shared/types';
import { BackendLogger } from '../logger/BackendLogger';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly log = new BackendLogger(UserController.name);

  constructor (private readonly userService: UserService) { }

  @Post('/create-user')
  public async createUser(@Req() request: Request) {
    const { body }: any = request;
    this.log.info('---createUser.body---');
    this.log.info(body);
    return await this.userService.createUser(body);
  }

  @Post('/login')
  @UseGuards(AuthGuard)
  public login(@Req() request: Request) {
    const { body }: any = request;
    return this.userService.login(body.email, body.password);
  }

  @Post('/request-password-reset')
  public requestPasswordReset(@Body('email') email: string) {
    return this.userService.generatePasswordResetToken(email);
  }

  @Post('/reset-password')
  public resetPassword(
    @Headers('authorization') token: string,
    @Body('newPassword') newPassword: string,
    @Body('newPasswordDuplicate') newPasswordDuplicate: string,
  ) {
    return this.userService.resetPassword(
      token,
      newPassword,
      newPasswordDuplicate,
    );
  }

  @Put('/change-password')
  @UseGuards(AuthGuard)
  public changePassword(
    @Request() req: RequestWithUser,
    @Body()
    {
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    },
  ) {
    return this.userService.changePassword(
      req.user.email,
      currentPassword,
      newPassword,
    );
  }
}
