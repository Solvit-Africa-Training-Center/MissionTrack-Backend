import { Sequelize, Model, DataTypes } from "sequelize";
import { sequelize } from "..";
import { missionInterfaces, MissionStatus } from "../../types/missionInfoInterface";

export interface missionCreationAttributes extends Omit<missionInterfaces, "id" | "createdAt" | "updatedAt"> {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;

}

 class Mission extends Model<missionInterfaces, missionCreationAttributes> implements missionInterfaces {
    missionTitle!: string;
    fullName!: string;
    startDate!: Date;
    endDate!: Date;
    missionDescription!: string;
    id!: string;
    userId!: string;
    location!: string;
    jobPosition!: string;
    status!: MissionStatus;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date | null;


    public toJSON(): object | missionInterfaces {
        return {
            id: this.id,
            missionTitle: this.missionTitle,
            missionDescription: this.missionDescription,
            location: this.location,
            fullName: this.fullName,
            startDate: this.startDate,
            endDate: this.endDate,
            jobPosition: this.jobPosition,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        };
    }
}

    Mission.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            userId:{
                type: DataTypes.UUID,
                allowNull:false,
                references:{
                    model:"users",
                    key:"id"
                }
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            missionTitle: {
                type: DataTypes.STRING,
                allowNull: false
            },

            missionDescription: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false
            },
            jobPosition: {
                type: DataTypes.STRING,
                allowNull: false
            },


            startDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('pending', 'Approved', 'Rejected', 'Updated', 'Cancelled', 'Completed'),
                defaultValue: 'pending',
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: "missions",
            timestamps: true,
            paranoid: false,
            modelName: "Missions"
        }
    );
export {Mission}