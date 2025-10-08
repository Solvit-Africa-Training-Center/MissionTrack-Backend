
export interface userAttributes {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    department?: string;
    companyId: string;
    role?: 'admin' | 'employee' | 'manager' | 'finance_manager';
    profilePhoto?:string;
    bankAccount?:string;
    is_active?: boolean;
    resetToken?:string;
    resetTokenExpiry?:Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
export interface userUpateInterface{
    department?:string,
    role?: 'admin' | 'employee' | 'manager' | 'finance_manager';
    fullName?:string
}
export type AddUserInterface = Omit<userAttributes, 'id' | 'createdAt' | 'updatedAt'>;
