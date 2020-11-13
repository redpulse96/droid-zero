import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestWithUser } from 'src/shared/types';
import { BackendLogger } from '../logger/BackendLogger';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly log = new BackendLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('/initiate-registration')
  public initiateRegistration(@Req() request: Request) {
    const { body }: any = request;
    this.log.info('initiateRegistration.body');
    this.log.info(body);
    return this.userService.initiateRegistration(body);
  }

  @Get('/fetch-by-filter')
  public fetchUserByFilter(
    @Query('mobile_number') mobile_number?: string,
    @Query('id') id?: string,
  ) {
    const body = { id, mobile_number };
    this.log.info('fetchUserByFilter.body');
    console.log(mobile_number);
    this.log.info(body);
    return this.userService.fetchUserByFilter(body);
  }

  @Post('/validate-otp')
  public validateOtp(
    @Body('otp') otp: string,
    @Body('mobile_number') mobile_number: string,
    @Body('user_type') user_type: string,
  ) {
    const body = { otp, mobile_number, user_type };
    this.log.info('validateOtp.body');
    this.log.info(body);
    return this.userService.validateOtp(body);
  }

  @Post('/complete-registration')
  public completeRegistration(
    @Body('mobile_number') mobile_number: string,
    @Body('update_obj') update_obj: object,
  ) {
    const body = { update_obj, mobile_number };
    this.log.info('completeRegistration.body');
    this.log.info(body);
    return this.userService.completeRegistration(body);
  }

  @Post('/login')
  // @UseGuards(AuthGuard)
  public login(@Req() request: Request) {
    const { body }: any = request;
    return this.userService.login(body.mobile_number, body.password);
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
