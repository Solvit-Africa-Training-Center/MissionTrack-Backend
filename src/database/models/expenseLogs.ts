import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "..";

interface ExpenseLogAttributes {
  id: string;
  userId:string;
  missionId: string;
  date: Date;
  accommodationFile: string | null;
  mealsFile: string | null;
  transportFile: string | null;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface ExpenseLogCreationAttributes extends Optional<ExpenseLogAttributes, 'id' | 'accommodationFile' | 'mealsFile' | 'transportFile' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

class ExpenseLog extends Model<ExpenseLogAttributes, ExpenseLogCreationAttributes> implements ExpenseLogAttributes {
  public id!: string;
  public userId!:string;
  public missionId!: string;
  public date!: Date;
  public accommodationFile!: string | null;
  public mealsFile!: string | null;
  public transportFile!: string | null;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

ExpenseLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId:{
      type: DataTypes.UUID,
      allowNull:false,
      references:{
          model:"users",
          key:"id"
      }
    },
    missionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'missions',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    accommodationFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mealsFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transportFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    },
  },
  {
    sequelize,
    tableName: 'expenseLogs',
    modelName: 'expenseLog',
    paranoid: false,
    timestamps: true,
  }
);

export default ExpenseLog;