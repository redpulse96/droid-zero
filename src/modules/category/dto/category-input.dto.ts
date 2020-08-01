export interface CreateCategoryDto {
  name: string;
  description: string;
  code?: string;
  image_path?: string;
}

export interface FetchCategoryDto {
  name?: string;
  id?: string;
  code?: string;
}

export interface UpdateCategoryDto {
  id: string;
  update_obj: {
    name?: string;
    description?: string;
    status: string;
  };
}

export interface RegisterUserDto {
  name: string;
  mobile_number: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
  is_portal_user?: boolean;
  primary_address?: any;
  secondary_address?: any;
  userAccess?: string[];
}

export interface FetchUserByFilter {
  id?: string;
  mobile_number?: string;
  email?: string;
}

export interface ValidateOtp {
  mobile_number: string;
  otp: string;
  is_portal_user: boolean;
}

export interface CompleteRegistration {
  mobile_number: string;
  update_obj: object;
}
