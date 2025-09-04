import { DataTypes, Model, Sequelize } from "sequelize";
import { MissionBudgetInterface } from "../../types/missionBudgetInterface";
import { Mission } from "./mission";
import { database } from "..";

export interface estimatedBudget extends Omit<MissionBudgetInterface, "id" | "createdAt" | "updatedAt"> {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Budget extends Model<MissionBudgetInterface, estimatedBudget> implements MissionBudgetInterface {
    public id!: string;
    public missionId!: string;
    public estimatedAccommodationCost!: number;
    public estimatedTransportCost!: number;
    public estimatedMealCost!: number;
    public totalAmount!: number;
    public createdAt?: Date | undefined;
    public updatedAt?: Date | undefined;
    public deletedAt?: null | undefined;

    public toJSON(): object | MissionBudgetInterface{
       return{
        id:this.id,
        missionId:this.missionId,
        estimatedAccommodationCost:this.estimatedAccommodationCost,
        estimatedMealCost:this.estimatedMealCost,
        estimatedTransportCost:this.estimatedTransportCost,
        totalAmount:this.totalAmount,
        createdAt:this.createdAt,
        updatedAt:this.updatedAt,
        deletedAt:this.deletedAt
       };
    }
    static associate(models:{Mission:typeof Mission}) {
        Budget.belongsTo(models.Mission, {
            foreignKey: "missionId",
            as: "mission",
        });
    }
}

export const BudgetModel=(sequelize:Sequelize)=>{
    Budget.init(
        {
            id:{
                type:DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4,
                primaryKey:true
            },
            missionId:{
                type:DataTypes.UUID,
                allowNull:false,
                references:{
                    model:"missions",
                    key:"id"
                }
            },
            estimatedAccommodationCost:{
                type:DataTypes.FLOAT,
                allowNull:true
            },
            estimatedMealCost:{
                type:DataTypes.FLOAT,
                allowNull:true
            },
            estimatedTransportCost:{
                type:DataTypes.FLOAT,
                allowNull:true
            },
            totalAmount:{
                type:DataTypes.FLOAT,
                allowNull:true
            }
        },{
            sequelize:database,
            tableName:"estBudget",
            timestamps:true,
            paranoid:true,
            modelName:"Budget"
        },
    );
    return Budget;
};
