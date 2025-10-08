export interface EmployeeUpdateProfileInterface {
    profilePhoto?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    bankAccount?:string;
}

export interface companyUpdateProfileInterface {
  profileLogo?: string;
  companyName?: string;
  companyEmail?: string;
  companyContact?: string;
  district?: string;
  province?: string;
  sector?: string;
  
}