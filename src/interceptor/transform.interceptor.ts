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
  intercept(
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

  fetchResponse(
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
          message: 'Transaction successfully executed',
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
          success: true,
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
