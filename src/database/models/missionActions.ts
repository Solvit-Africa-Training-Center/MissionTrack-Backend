import { Model, DataTypes, Sequelize } from "sequelize";
import { database } from "..";

interface MissionActionAttributes {
    id: string;
    missionId: string;
    actorId: string;
    action: 'Approve' | 'Reject' | 'Update' | 'Cancel'| 'Complete';
    comment?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface MissionActionCreationAttributes extends Omit<MissionActionAttributes, 'id' | 'comment' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}
class MissionAction extends Model<MissionActionAttributes, MissionActionCreationAttributes> implements MissionActionAttributes {
    public id!: string;
    public missionId!: string;
    public actorId!: string;
    public action!: 'Approve' | 'Reject' | 'Update' | 'Cancel'|'Complete';
    public comment?: string | null;
    public createdAt?: Date;
    public updatedAt?: Date;
    public deletedAt?: Date | null;
}

MissionAction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    missionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "missions",
            key: "id"
        }
    },
    actorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    action: {
        type: DataTypes.ENUM("Approve", "Reject", "Update", "Cancel","Complete"),
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:null
    }
}, {
    tableName: "missionActions",
    sequelize: database,
    paranoid: false,
    timestamps: true,
    modelName: "missionAction"
}
)
export { MissionAction };


