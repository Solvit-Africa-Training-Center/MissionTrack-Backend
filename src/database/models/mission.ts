import { Sequelize,Model,DataTypes } from "sequelize";
import { database } from "..";
import { missionInterfaces, MissionStatus } from "../../types/missionInfoInterface";

export interface missionCreationAttributes extends Omit <missionInterfaces, "id" | "createdAt" | "updatedAt">{
    id?:string;
    createdAt?:Date;
    updatedAt?:Date;

}

export class Mission extends Model<missionInterfaces,missionCreationAttributes>implements missionInterfaces{
    id!:string;
    title!: string;
    description!: string;
    location!: string;
    jobPosition!: string;
    status!: MissionStatus;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!:Date| null;


   public toJSON(): object | missionInterfaces{
    return{
        id:this.id,
        title:this.title,
        description:this.description,
        location:this.location,
        jobPosition:this.jobPosition,
        status:this.status,
        createdAt:this.createdAt,
        updatedAt:this.updatedAt,
        deletedAt:this.deletedAt
    };
}
    }
   export const missionModel=(sequelize:Sequelize)=>{
    Mission.init(
        {
            id:{
                type:DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4,
                primaryKey:true
            },
            title:{
                type:DataTypes.STRING,
                allowNull:false
            },
            description:{
                type:DataTypes.TEXT,
                allowNull:false
            },
            location:{
                type:DataTypes.STRING,
                allowNull:false
            },
            jobPosition:{
                type:DataTypes.STRING,
                allowNull:false
            },
            status:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            createdAt:{
                type:DataTypes.DATE,
                allowNull:false,
            },
            updatedAt:{
                type:DataTypes.DATE,
                allowNull:false
            },
            deletedAt:{
                type:DataTypes.DATE,
                allowNull:true
            }
        },
        {
            sequelize:database,
            tableName:"missions",
            timestamps:true,
            paranoid:true,
            modelName:"Missions"
        }
    );    
    return Mission
   } 



