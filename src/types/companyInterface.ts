export interface ICompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  state?: string;
  proofDocument: string;
  province: string;
  district: string;
  sector: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CompanyAttributes {
  id: string;
  companyName: string;
  companyEmail: string;
  companyContact: string;
  proofDocument: string;
  approveComment:string;
  blockUnblockComment:string;
  status?: 'pending' | 'approved' | 'rejected';
  state?: 'active' | 'trial'|'blocked';
  province: string;
  district: string;
  sector: string;
  profileLogo: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CompanyManager {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  companyId?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
export interface ApproveRejectData{
  comment?:string;
  status:'approved'|'rejected';
}

export interface BlockUnblockCompany{
  state:'active'|'trial'|'blocked';
  comment?:string;
}