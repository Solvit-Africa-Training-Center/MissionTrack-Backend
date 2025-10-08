import { Model, DataTypes, Association } from "sequelize";
import { sequelize } from "..";
import { Company } from "./company";
import { userAttributes } from "../../types/userInterface";

export interface userCreationAttributes extends Omit<userAttributes,"id" | "createdAt" | "updatedAt" | "deletedAt" | "is_active" | "role"> {
    id?: string;
    role?:string
    createdAt?: Date;
    updatedAt?: Date;
}

 class User extends Model<userAttributes, userCreationAttributes> implements userAttributes {
    static hashPassword: any;
//    company: any;
    static find(arg0: (user: any) => boolean) {
        throw new Error("Method not implemented.");
    }
    public id!: string;
    public fullName!: string;
    public email!: string;
    public password!: string;
    public phoneNumber!: string | undefined;
    public companyId!: string;
    public role!: 'admin' | 'employee' | 'manager' | 'finance_manager';
    public is_active?: boolean | undefined;
    public profilePhoto?:string| undefined;
    public bankAccount?:string| undefined;
    public resetToken?:string| undefined;
    public resetTokenExpiry?:Date| undefined;
    public department?: string | undefined;
    public createdAt?: Date;
    public updatedAt?: Date;
    public deletedAt?: null | undefined;

    
    
    public static associations: {
    company: Association<User, Company>;
  };
    public company?: Company;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
         companyId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'companies',
                key: "id"
            }
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
       
        role: {
            type: DataTypes.STRING,
            allowNull: false,     
           },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        bankAccount:{
            type:DataTypes.STRING,
            allowNull:true
        },
        profilePhoto:{
            type:DataTypes.STRING,
            allowNull:true
        },
        resetToken:{
            type:DataTypes.STRING,
            allowNull:true
        },
        resetTokenExpiry:{
            type:DataTypes.DATE,
            allowNull:true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: "users",
        paranoid: false,
        timestamps: true,
        modelName: "User",
    }

)

export { User };
