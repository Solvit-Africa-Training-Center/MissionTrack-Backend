
import { Company } from './models/company';
import DailyReport from './models/dailyReport';
import ExpenseLog from './models/expenseLogs';
import { Mission } from './models/mission';
import { MissionAction } from './models/missionActions';
import { MissDoc } from './models/missionDocuments';
import { User } from './models/users';

export const setupAssociations = () => {
    Company.hasMany(User, {foreignKey: 'companyId',as: 'users',onDelete: 'CASCADE',onUpdate: 'CASCADE'});

    User.belongsTo(Company, {
        foreignKey: 'companyId',
        as: 'company',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Company.hasOne(User, {
        foreignKey: 'companyId',
        as: 'manager',
        scope: {
            role: 'manager'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    MissDoc.belongsTo(Mission, {
        foreignKey: "missionId",
        as: "mission",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Mission.hasMany(MissDoc, {
        foreignKey: "missionId",
        as: "documents",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    Mission.hasMany(MissionAction, { foreignKey: "missionId", as: "actions", onDelete: "CASCADE", onUpdate: "CASCADE" });
    User.hasMany(MissionAction, { foreignKey: "actorId", as: "actionTaken", onDelete: "CASCADE", onUpdate: "CASCADE" });
    MissionAction.belongsTo(Mission, { foreignKey: "missionId", as: "mission", onDelete: "CASCADE", onUpdate: "CASCADE" });
    MissionAction.belongsTo(User, { foreignKey: "actorId", as: "actor", onDelete: "CASCADE", onUpdate: "CASCADE" });

    Mission.hasMany(DailyReport, { foreignKey: "missionId", as: "dailyReports", onDelete: "CASCADE", onUpdate: "CASCADE" });
    DailyReport.belongsTo(Mission, { foreignKey: "missionId", as: "mission", onDelete: "CASCADE", onUpdate: "CASCADE" });
    User.hasMany(DailyReport, { foreignKey: "userId", as: "reports", onDelete: "CASCADE", onUpdate: "CASCADE" });
    DailyReport.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });

    Mission.hasMany(ExpenseLog, { foreignKey: "missionId", as: "expenseLogs", onDelete: "CASCADE", onUpdate: "CASCADE" });
    ExpenseLog.belongsTo(Mission, { foreignKey: "missionId", as: "mission", onDelete: "CASCADE", onUpdate: "CASCADE" });
    User.hasMany(ExpenseLog, { foreignKey: "userId", as: "expenses", onDelete: "CASCADE", onUpdate: "CASCADE" });
    ExpenseLog.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });
}

