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
  is_portal_user?: boolean;
  primary_address?: any;
  secondary_address?: any;
  userAccess?: string[];
}
