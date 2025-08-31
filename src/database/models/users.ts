import { Sequelize,Model,DataTypes } from "sequelize";
import { database } from "..";


interface userAttributes{
    id?:string;
    fullName:string;
    email:string;
    password:string;
    phoneNumber?:string;
    department?:string;
    role?:string;
    is_active?:boolean;
    createdAt?:Date;
    updatedAt?:Date;
    DeletedAt?:Date|null;
}

export interface userCreationAttributes extends Omit <userAttributes, "id"  | "createdAt"| "updatedAt">{
    id?:string;
    deletedAt?:null;
    createdAt?:Date;
    updatedAt?:Date;
}

export class User extends Model<userAttributes,userCreationAttributes> implements userAttributes{
    static find(arg0: (user: any) => boolean) {
        throw new Error("Method not implemented.");
    }
    public id!:string;
    public fullName!: string;
    public email!: string;
    public password!: string;
    public phoneNumber!: string | undefined;
    public role!:string;
    public is_active?: boolean | undefined;
    public department?: string | undefined;
    public createdAt?: Date;
    public updatedAt?: Date;
    public DeletedAt?: null | undefined;


    public toJSON(): object | userAttributes{
        return{
            id:this.id,
            fullName:this.fullName,
            email:this.email,
            phoneNumber:this.phoneNumber,
            department:this.department,
            role:this.role,
            is_active:this.is_active,
            createdAt:this.createdAt,
            updatedAt:this.updatedAt
        };
    }
}

export const userModel=(sequelize:Sequelize)=>{
User.init(
    {
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,
            allowNull:false,
        },
        fullName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate:{
                isEmail:true,
            }
        },
        password:{
            type:DataTypes.STRING,
        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        department:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        role:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:"employee",
        },
        is_active:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:true,
        },
        createdAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW,
        },
        updatedAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW,
        },
        DeletedAt:{
            type:DataTypes.DATE,
            allowNull:true,
        }
    },
    {
        sequelize:database,
        tableName:"users",
        paranoid:true,
        timestamps:true,
        // underscored:true,
        modelName:"User",
        indexes:[
            {
                unique:true,
                fields:["email","id"]
            }
        ]
    }
)
return User;
}

userModel(database); 