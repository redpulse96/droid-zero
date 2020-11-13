export interface UserInputDto {
  id: string;
  group: string;
  subGroups: string[];
  locked: boolean;
}
export interface RegisterUserDto {
  name: string;
  mobile_number: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
  user_type?: string;
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
  user_type: string;
}
export interface CompleteRegistration {
  mobile_number: string;
  update_obj: object;
}
