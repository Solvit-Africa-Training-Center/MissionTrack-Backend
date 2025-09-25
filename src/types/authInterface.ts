

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILogoutRequest{
  email:string;
}

export interface ResetPassPayload{
  email:string;
  confirmPassword:string;
  newPassword:string;
  resetToken:string;
}

export interface ForgotPasswordPayload{
  email:string;
}


export interface ChangePasswordData {
  email?:string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword:string;
}
