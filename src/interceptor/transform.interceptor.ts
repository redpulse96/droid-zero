import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ServerResponse } from 'http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InterfaceList, ResponseCodes } from 'src/shared/constants';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, InterfaceList.FinalResponse> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<InterfaceList.FinalResponse> {
    return next.handle().pipe(
      map((data: InterfaceList.MethodResponse) => {
        const res: ServerResponse = context.getArgs()[1];
        const result: InterfaceList.FinalResponse = this.fetchResponse(data);
        res.statusCode = result.status_code;
        return result;
      }),
    );
  }

  public fetchResponse(
    handle: InterfaceList.MethodResponse,
  ): InterfaceList.FinalResponse {
    if (!handle?.response_code) {
      return {
        success: false,
        status_code: 500,
        response_code: 500,
        message: 'Internal server error',
        data: {},
      };
    }

    switch (handle.response_code) {
      case ResponseCodes.SUCCESS:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'Transaction successfully created',
          data: handle.data || {},
        };

      case ResponseCodes.FAILURE:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'Successfully executed',
          data: {},
        };

      case ResponseCodes.SUCCESSFUL_FETCH:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'Transactions successfully fetched',
          data: handle.data || {},
        };

      case ResponseCodes.BAD_REQUEST:
        return {
          success: false,
          status_code: 400,
          response_code: 400,
          message: 'Invalid request',
          data: handle.data || {},
        };

      case ResponseCodes.USER_CREATED:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message:
            'User Successfully created,\nkindly complete the registration from the application',
          data: handle.data || {},
        };

      case ResponseCodes.USER_REGISTERED:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message:
            'User Successfully registered,\nKindly login to the application',
          data: handle.data || {},
        };

      case ResponseCodes.EXISTING_USER:
        return {
          success: false,
          status_code: 200,
          response_code: 200,
          message: 'The user already exists,\nkindly change the mobile number',
          data: {},
        };

      case ResponseCodes.SERVER_ERROR:
        return {
          success: false,
          status_code: 500,
          response_code: 500,
          message: 'Internal server error',
          data: {},
        };

      case ResponseCodes.SERVICE_UNAVAILABLE:
        return {
          success: false,
          status_code: 503,
          response_code: 503,
          message: 'service unavailable,\nkindly try again after some time',
          data: {},
        };

      case ResponseCodes.EMPTY_RESPONSE:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'No desired records found',
          data: {},
        };

      case ResponseCodes.INVALID_USER:
        return {
          success: true,
          status_code: 400,
          response_code: 200,
          message:
            'Invalid mobile number and/or password. Upon 5 incorrect logins the account will be locked',
          data: {},
        };

      case ResponseCodes.USER_LOCKED:
        return {
          success: true,
          status_code: 400,
          response_code: 200,
          message:
            'Account is locked due to too many login attempts, please contact system administrator for assistance',
          data: {},
        };

      case ResponseCodes.LOGIN_SUCCESSFUL:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'User has successfully logged in',
          data: handle.data || {},
        };

      case ResponseCodes.INVALID_CREDENTIALS:
        return {
          success: false,
          status_code: 400,
          response_code: 200,
          message:
            'Invalid email and/or password. Upon 5 incorrect logins the account will be locked',
          data: {},
        };

      case ResponseCodes.UPDATE_SUCCESSFUL:
        return {
          success: true,
          status_code: 200,
          response_code: 200,
          message: 'Transaction instance updated successfully',
          data: handle.data || {},
        };

      default:
        return {
          success: false,
          status_code: 503,
          response_code: 503,
          message: 'service unavailable,\nkindly try again after some time',
          data: {},
        };
    }
  }
}
