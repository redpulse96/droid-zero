import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { authenticator } from 'otplib';
import * as owasp from 'owasp-password-strength-test';
import * as randToken from 'rand-token';
import { BaseService } from 'src/base.service';
import { DotenvService } from 'src/modules/dotenv/dotenv.service';
import { EmailService } from 'src/modules/email/email.service';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { UserAccessService } from 'src/modules/userAccess/userAccess.service';
import {
  InterfaceList,
  MomentFormat,
  ResponseCodes,
  Status,
} from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { In, Repository } from 'typeorm';
import {
  CompleteRegistration,
  FetchUserByFilter,
  RegisterUserDto,
  ValidateOtp,
} from './dtos/userInput.dto';
import { Users } from './user.entity';
const {
  signAsync,
  executePromise,
  returnCatchFunction,
  PasswordHasher,
  MomentFunctions,
} = Utils;
const { comparePassword, hashPassword } = PasswordHasher;
const {
  addCalculatedTimestamp,
  fetchCurrentTimestamp,
  fetchFormattedTimestamp,
} = MomentFunctions;
const { Hours, Timestamp } = MomentFormat;

@Injectable()
export class UserService extends BaseService<Users> {
  private readonly log = new BackendLogger(UserService.name);

  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly dotenvService: DotenvService,
    private readonly userAccessService: UserAccessService,
    private readonly emailService: EmailService,
  ) {
    super(userRepo);
  }

  public async initiateRegistration(
    data: RegisterUserDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      if (!data.is_portal_user || !data.mobile_number || !data.name) {
        return {
          response_code: ResponseCodes.BAD_REQUEST,
          data: {},
        };
      }
      const filter: any = {
        mobile_number: data.mobile_number,
        status: In([Status.Active, Status.Pending]),
      };
      const uniqueMobileNumber = await this.findOne(filter);
      if (uniqueMobileNumber) {
        this.log.info('---uniqueMobileNumber---');
        this.log.info(uniqueMobileNumber);
        return {
          response_code: ResponseCodes.EXISTING_USER,
          data: {},
        };
      }

      const otp: string = authenticator.generate(
        this.dotenvService.get('OTP_SECRET'),
      );
      const createUser: any = {
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number,
        password: data?.password
          ? await hashPassword(data.password)
          : await hashPassword(otp),
        api_key: randToken.generate(32),
        primary_address: data.primary_address,
        is_admin: data.is_admin,
        is_portal_user: data.is_portal_user,
        is_locked: false,
        secondary_address: data.secondary_address
          ? data.secondary_address
          : undefined,
        status: Status.Pending,
      };
      const [createUserError, userDetails]: any[] = await executePromise(
        this.create(createUser),
      );
      if (createUserError) {
        this.log.info('registerUser.createUserError');
        this.log.info(createUserError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      }
      this.log.info('registerUser.userDetails');
      this.log.info(userDetails);

      if (data.userAccess?.length) {
        const userAccessArr: any[] = [];
        data.userAccess.forEach((val: string) => {
          const obj: any = {
            id: userDetails.id,
            access_right: val,
          };
          userAccessArr.push(obj);
        });

        const [userAccessError, userAccess]: any[] = await executePromise(
          this.userAccessService.createAll(userAccessArr),
        );
        if (userAccessError) {
          this.log.error('userAccessError');
          this.log.error(userAccessError);
          return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
        } else if (!userAccess?.length) {
          this.log.info('!userAccess?.length');
        }

        this.log.info('userAccess');
        this.log.info(userAccess);
      }

      return {
        response_code: ResponseCodes.SUCCESS,
        data: userDetails,
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchUserByFilter(
    data: FetchUserByFilter,
  ): Promise<InterfaceList.MethodResponse> {
    if (!data.mobile_number) {
      return { response_code: ResponseCodes.BAD_REQUEST };
    }
    try {
      const [userError, user]: any[] = await executePromise(
        this.findOne({
          id: data.id,
          mobile_number: data.mobile_number,
          email: data.email,
        }),
      );
      if (userError) {
        this.log.error('fetchUserFromMobileNumber.userError');
        this.log.error(userError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (
        !user ||
        user?.mobile_number != data.mobile_number ||
        user?.id != data.id ||
        user?.email != data.email
      ) {
        this.log.info('fetchUserFromMobileNumber.!user');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }

      this.log.info('fetchUserFromMobileNumber.user');
      this.log.info(user);
      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { ...user },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async validateOtp(
    req: ValidateOtp,
  ): Promise<InterfaceList.MethodResponse> {
    if (!req.otp || !req.is_portal_user || !req.mobile_number) {
      return { response_code: ResponseCodes.BAD_REQUEST };
    }
    try {
      const [userError, user]: any[] = await executePromise(
        this.findOne({
          mobile_number: req.mobile_number,
          is_portal_user: req.is_portal_user,
        }),
      );

      if (userError) {
        this.log.error('validateOtp.userError');
        this.log.error(userError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!user) {
        this.log.info('validateOtp.!user');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('validateOtp.user');
      this.log.info(user);

      const isMatch: boolean = await comparePassword(req.otp, user.password);
      this.log.info('isMatch.resp');
      this.log.info(isMatch);

      return {
        response_code: ResponseCodes.SUCCESS,
        data: { isMatch },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async completeRegistration(
    req: CompleteRegistration,
  ): Promise<InterfaceList.MethodResponse> {
    if (!req?.mobile_number || !req?.update_obj) {
      return { response_code: ResponseCodes.BAD_REQUEST };
    }
    try {
      const [userError, user]: any[] = await executePromise(
        this.findOne({
          mobile_number: req.mobile_number,
        }),
      );
      if (userError) {
        this.log.error('completeRegistration.userError');
        this.log.error(userError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!user) {
        this.log.info('completeRegistration.!user');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('completeRegistration.user');
      this.log.info(user);

      if (user.status != Status.Pending) {
        return { response_code: ResponseCodes.EXISTING_USER };
      }

      const filter = { id: user.id };
      const updateObj = { ...req.update_obj, status: Status.Active };
      const [updateError, updateUser]: any[] = await executePromise(
        this.update(filter, updateObj),
      );
      if (updateError) {
        this.log.error('completeRegistration.updateError');
        this.log.error(updateError);
      }
      this.log.info('completeRegistration.updateUser');
      this.log.info(updateUser);

      return {
        response_code: ResponseCodes.USER_REGISTERED,
        data: updateUser,
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async login(email: string, password: string) {
    const user = await this.findOneWithPassword(email);

    if (user) {
      this.log.info('Attempting to login user');
      this.log.info(user.email);
      // Check if the account is locked
      if (user.is_locked) {
        this.log.warn('Users tried to log into locked account');
        return {
          success: false,
          status_code: 400,
          response_code: 400,
          message: new UnauthorizedException(
            'This account is locked, please contact the system administrator for assistance',
          ),
          data: {},
        };
      }

      // Verify the password
      if (await comparePassword(password, user.password)) {
        // Password correct, create JWT token
        const jwtToken = await signAsync(
          { email: user.email },
          this.dotenvService.get('APP_KEY'),
          { expiresIn: '12h' },
        );

        const filter = { id: user.id };
        const updateObj = { login_attempts: user.login_attempts + 1 };
        const [updateUserError, updateUser]: any[] = await executePromise(
          this.update(filter, updateObj),
        );
        if (updateUserError) {
          this.log.error('---updateUserError---');
          this.log.error(updateUserError);
        }
        this.log.info('---updateUser---');
        this.log.info(updateUser);

        const userServiceFilter = {
          user_id: user.id,
          status: Status.Active,
        };
        const [userAccessError, userAccess]: any[] = await executePromise(
          this.userAccessService.findAll(userServiceFilter),
        );
        if (userAccessError) {
          this.log.error('---userAccessError---');
          this.log.error(userAccessError);
          return {
            success: false,
            status_code: 500,
            response_code: 500,
            message: 'Internal server error',
            data: {},
          };
        }
        this.log.info('---userAccess---');
        this.log.info(userAccess);
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'User logged in',
          data: {
            userAccess,
            token: jwtToken,
            parentUser: user.parent_user,
            IsAdmin: user.is_admin ? user.is_admin : false,
            IsPortalUser: user.is_portal_user ? user.is_portal_user : false,
          },
        };
      } else {
        // Invalid password given, add the bad login attempt to the database
        await this.update(
          { id: user.id },
          { login_attempts: user.login_attempts + 1 },
        );
        this.log.warn('Invalid password attempt');

        if (user.login_attempts >= 5) {
          await this.update({ id: user.id }, { is_locked: true });
          this.log.error('Account now locked from too many login attempts');

          return {
            success: false,
            status_code: 400,
            response_code: 400,
            message:
              'Account is locked due to too many login attempts, please contact system administrator for assistance.',
            data: {},
          };
        } else {
          return {
            success: false,
            status_code: 400,
            response_code: 400,
            message: new UnauthorizedException(
              'Invalid email and/or password. Upon 5 incorrect logins the account will be locked',
            ),
            data: {},
          };
        }
      }
    } else {
      this.log.error('Login attempt unsuccessful, user not found:');
      this.log.error(email);
      return {
        success: false,
        status_code: 400,
        response_code: 400,
        message: new UnauthorizedException(
          'Invalid email and/or password. Upon 5 incorrect logins the account will be locked',
        ),
        data: {},
      };
    }
  }

  public async changePassword(
    email: string,
    currentPass: string,
    newPass: string,
  ) {
    const user = await this.findOneWithPassword(email);

    if (await comparePassword(currentPass, user.password)) {
      // Check for password minimums
      const passTestResult = owasp.test(newPass);
      if (!passTestResult.strong) {
        this.log.error('Invalid new password entered:');
        this.log.error(user.email);
        this.log.error(passTestResult.errors);
        return {
          success: false,
          status_code: 400,
          response_code: 400,
          message: new BadRequestException(
            `Invalid new password: ${passTestResult.errors}`,
          ),
          data: {},
        };
      }

      // If the user provided the correct password, and their new password meets the
      // minimum requirements, update their user record with the new password
      await this.update(
        { id: user.id },
        { password: await hashPassword(newPass) },
      );

      return {
        success: true,
        status_code: 200,
        response_code: 200,
        message: 'Password successfully changed',
        data: {},
      };
    } else {
      this.log.warn('Incorrect password given during password change');
      return {
        success: false,
        status_code: 400,
        response_code: 400,
        message: new BadRequestException('Incorrect password'),
        data: {},
      };
    }
  }

  public async generatePasswordResetToken(emailAddress: string) {
    const user = await this.findOne({ email: emailAddress });

    if (!user) {
      this.log.warn(
        `Forgotten password request - Could not find user: ${emailAddress}`,
      );
      // We want to return status of 200 to not let the client know if
      // the email exists or not
      return;
    }

    // Generate the random reset token
    const token = randToken.generate(32);

    // Set the user database entry with the token and the expiration date-time
    await this.update(
      { id: user.id },
      {
        password_reset_token: token,
        password_reset_token_ttl: fetchFormattedTimestamp(
          addCalculatedTimestamp(fetchCurrentTimestamp(), 4, Hours),
          Timestamp,
        ),
      },
    );

    // Send the user reset email
    await this.emailService.sendEmail({
      templateName: 'passwordReset',
      templateParams: [token],
      subject: '[INSERT TITLE HERE] Password Reset',
      isInternal: false,
      userEmail: emailAddress,
      title: 'Password Reset',
    });

    return;
  }

  // Handles a forgotten password reset request
  public async resetPassword(
    token: string,
    NewPassword: string,
    NewPasswordDuplicate: string,
  ) {
    this.log.info('Resetting password for user');
    // Find the user with the associated token
    const user = await this.findOne({ password_reset_token: token });

    if (!user) {
      this.log.error(`Could not find user with given token: ${token}`);
      throw new BadRequestException('Invalid token');
    }

    // Check if the token is still valid
    const timeDiff = moment
      .utc(user.password_reset_token_ttl)
      .local()
      .diff(moment(), 'seconds');
    if (timeDiff < 0) {
      this.log.error(
        `Expired token for password reset used: ${token}, expired datetime: ${moment(
          user.password_reset_token_ttl,
        ).format('L - LTS')}`,
      );
      throw new BadRequestException('Invalid token');
    }

    // Check if the passwords match
    if (NewPassword !== NewPasswordDuplicate) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check new password strength
    const passTestResult = owasp.test(NewPassword);
    if (!passTestResult.strong) {
      this.log.error(
        `Invalid new password entered: ${user.email}, errors: ${passTestResult.errors}`,
      );
      throw new BadRequestException(
        `Invalid new password. Errors: ${passTestResult.errors}`,
      );
    }

    // Update the user's password
    // Also remove the reset token and the token's expiration date
    await this.update(
      { id: user.id },
      {
        password: await hashPassword(NewPassword),
        password_reset_token: null,
        password_reset_token_ttl: null,
      },
    );

    await this.emailService.sendEmail({
      templateName: 'passwordChangeNotification',
      templateParams: [],
      userEmail: user.email,
      subject: 'Kryptowire EMM Portal - Password Reset',
      isInternal: false,
      title: 'Password Change',
    });

    return { success: true };
  }

  // Delete a user
  public async deleteUser(userId: string) {
    await this.delete({ id: userId });
    await this.userAccessService.delete({ user_id: userId });

    this.log.info(`Deleted user, id: ${userId}`);
    return true;
  }

  public async findGroupUsers(group: string) {
    return this.userRepo
      .createQueryBuilder('users')
      .select(['users.id', 'users.email', 'users.locked'])
      .leftJoin('users.access', 'access')
      .where('users.group = :group', { group })
      .getMany();
  }

  public async findUserRiskProfileInfo(userId: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.riskProfile', 'riskProfile')
      .leftJoinAndSelect('riskProfile.riskProfileItems', 'riskProfileItems')
      .leftJoinAndSelect('riskProfileItems.reportItem', 'reportItem')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  public async findOneWithPassword(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .select(['user.id', 'user.email', 'user.is_admin', 'user.is_portal_user'])
      .leftJoinAndSelect('user.parent_user', 'parent_user')
      .leftJoinAndSelect('user.child_users', 'child_users')
      .addSelect('user.password')
      .getOne();
  }
}
