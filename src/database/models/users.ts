import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";


interface userAttributes {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    department?: string;
    companyId: string;
    role?: string;
    is_active?: boolean;
    resetToken?:string;
    resetTokenExpiry?:Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export interface userCreationAttributes extends Omit<userAttributes, "id" | "createdAt" | "updatedAt"> {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

 class User extends Model<userAttributes, userCreationAttributes> implements userAttributes {
    static hashPassword: any;
   company: any;
    static find(arg0: (user: any) => boolean) {
        throw new Error("Method not implemented.");
    }
    public id!: string;
    public fullName!: string;
    public email!: string;
    public password!: string;
    public phoneNumber!: string | undefined;
    public companyId!: string;
    public role!: string;
    public is_active?: boolean | undefined;
    public resetToken?:string| undefined;
    public resetTokenExpiry?:Date| undefined;
    public department?: string | undefined;
    public createdAt?: Date;
    public updatedAt?: Date;
    public deletedAt?: null | undefined;


    public toJSON(): object | userAttributes {
        return {
            id: this.id,
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            department: this.department,
            role: this.role,
            is_active: this.is_active,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
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
            defaultValue: "employee",
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
