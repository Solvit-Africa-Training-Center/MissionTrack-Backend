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
    is_active?:boolean;
    role:UserRole;
    department?:string;
    createdAt?:Date;
    updatedAt?:Date;
}
export type AddUserInterface = Omit<userInterface, 'id' | 'createdAt' | 'updatedAt'>;
