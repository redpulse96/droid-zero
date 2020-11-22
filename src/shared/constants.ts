export const roles = {
  ADMIN: 'ADMIN',
};

export const NEST_NAMESPACE = 'nest-namespace';
export const REQUEST_ID = 'requestId';
export const SESSION_USER = 'sessionUser';

export const TOKEN_EXPIRES_IN = '24h';

export const WAITING_FOR_SUBMISSION = 0;
export const SUBMITTED = 1;
export const ANALYSIS_COMPLETE = 2;
export const BINARY_MISSING = 50;
export const PROCESSING_TOO_LONG = 55;
export const IGNORED_NO_APP_INFO = 80;
export const IGNORED_ERROR_WITH_SUBMISSION = 81;
export const GENERAL_IGNORED = 82;

export namespace MomentFormat {
  export const Date: string = 'YYYY-MM-DD';
  export const Time: string = 'HH:mm:ssZ';
  export const Timestamp: string = 'YYYY-MM-DD HH:mm:ssZ';
  export const Day: string = 'days';
  export const Hours: string = 'hours';
}

export namespace Status {
  export const Active: string = 'active';
  export const Inactive: string = 'inactive';
  export const Pending: string = 'pending';
  export const Completed: string = 'completed';
}

export namespace ResponseCodes {
  export const SUCCESS: string = 'success';
  export const FAILURE: string = 'failure';
  export const SUCCESSFUL_FETCH: string = 'successful_fetch';
  export const USER_CREATED: string = 'user_created';
  export const USER_REGISTERED: string = 'user_registered';
  export const BAD_REQUEST: string = 'bad_request';
  export const SERVICE_UNAVAILABLE: string = 'service_unavailable';
  export const SERVER_ERROR: string = 'server_error';
  export const EXISTING_USER: string = 'existing_user';
  export const EMPTY_RESPONSE: string = 'empty_response';
  export const INVALID_USER: string = 'invalid_user';
  export const USER_LOCKED: string = 'user_locked';
  export const LOGIN_SUCCESSFUL: string = 'login_successful';
  export const INVALID_CREDENTIALS: string = 'invalid_credentials';
  export const UPDATE_SUCCESSFUL: string = 'update_successful';
}

export namespace InterfaceList {
  export interface MethodResponse {
    response_code: string;
    data?: any;
  }
  export interface BooleanResponse {
    success: boolean;
    data?: any;
  }
  export interface FinalResponse {
    success?: boolean;
    status_code?: number;
    response_code?: number;
    message?: string;
    data?: any;
  }
}

export namespace UserConfigs {
  export const AppConfigs = {
    AuthorizationType: 'Bearer_app',
  };
  export const PortalConfigs = {
    AuthorizationType: 'Bearer_portal',
  };
}
export namespace ImagesPath {
  export const Category: string = '';
  export const SubCategory: string = '';
  export const Brands: string = '';
  export const Products: string = '';
  export const Cart: string = '';
}
export namespace TaxType {
  export const Percentage: string = 'tax_percentage';
  export const Absolute: string = 'tax_absolute';
  export const DiscountPercentage: string = 'discount_percentage';
  export const Discount: string = 'discount_absolute';
}
export const COMPONENT_CODES = {
  CATEGORY: 'CAT_',
  BRAND: 'BRND_',
  PRODUCT: 'PROD_',
};
export namespace PaymentModes {
  export const CASH: string = 'cash';
  export const ONLINE: string = 'online';
}
