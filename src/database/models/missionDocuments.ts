import { Sequelize, Model, DataTypes } from "sequelize";
import { missionDocuments } from "../../types/missionDocuments";
import { Mission } from "./mission";
import { database } from "..";


export interface missionDoc extends Omit<missionDocuments, "id" | "createdAt" | "updatedAt"> {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class MissDoc extends Model<missionDocuments, missionDoc> implements missionDocuments {
    public id!: string;
    public missionId!: string;
    public documentName !: string;
    public documentUrl!: string;
    public createdAt?: Date | undefined;
    public updatedAt?: Date | undefined;
    public deletedAt?: null | undefined;

    public toJSON(): object | missionDocuments {
        return {
            id: this.id,
            missionId: this.missionId,
            documentName: this.documentName,
            documentUrl: this.documentUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        };
    }
    static associate(models: { Mission: typeof Mission }) {
        MissDoc.belongsTo(models.Mission, {
            foreignKey: "missionId",
            as: "mission"
        })
    }
}

export const MissionDocumentModel = (sequelize: Sequelize) => {
    MissDoc.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            missionId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "missions",
                    key: "id"
                }
            },
            documentName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            documentUrl: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            deletedAt: {
                type: DataTypes.DATE,
                defaultValue: null
            }
        }, {
        sequelize:database,
        tableName: "missionDocuments",
        timestamps: true,
        paranoid: true
    }
    );
    return MissDoc;
}