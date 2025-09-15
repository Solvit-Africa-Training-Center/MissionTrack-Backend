import { DataTypes, Model } from 'sequelize';
import { database } from '..';

interface DailyReportAttributes {
  id: string;
  userId:string;
  missionId: string;
  date: Date;
  dailyActivity: string;
  documents: string | null;
  filePath: string | null;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface DailyReportCreationAttributes extends Omit<DailyReportAttributes, 'id' | 'documents' | 'filePath' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

class DailyReport extends Model<DailyReportAttributes, DailyReportCreationAttributes> implements DailyReportAttributes {
  public id!: string;
  public missionId!: string;
  public userId!: string;
  public date!: Date;
  public dailyActivity!: string;
  public documents!: string | null;
  public filePath!: string | null;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

DailyReport.init(
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
    dailyActivity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    documents: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filePath: {
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
    sequelize:database,
    tableName: 'dailyReports', 
    modelName: 'dailyReports',
    paranoid: false,
    timestamps: true,
  }
);

export default DailyReport;