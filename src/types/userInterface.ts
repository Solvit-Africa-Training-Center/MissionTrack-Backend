const enumRole={
    ADMIN:"admin",
    EMPLOYEE:"employee",
    MANAGER:"manager",
    FINANCE:"finance_manager"
} as const;

export type UserRole = typeof enumRole[keyof typeof enumRole];

export interface userInterface{
    id:string;
    fullName:string;
    email:string;
    password:string;
    phoneNumber?:string;
    companyId:string;
    is_active?:boolean;
    role:UserRole;
    department?:string;
    createdAt?:Date;
    updatedAt?:Date;
}
export interface userUpateInterface{
    department?:string,
    role?:string,
    fullName?:string
}
export type AddUserInterface = Omit<userInterface, 'id' | 'createdAt' | 'updatedAt'>;
