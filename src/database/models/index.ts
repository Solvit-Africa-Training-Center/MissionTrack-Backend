import { Mission, missionModel } from "./mission";
import { Budget, BudgetModel } from "./estimatedMissionBudget";
import { MissDoc, MissionDocumentModel } from "./missionDocuments";
import { database } from "..";

BudgetModel(database);
MissionDocumentModel(database);
missionModel(database);

Budget.belongsTo(Mission, { foreignKey: "missionId", as: "mission" });
MissDoc.belongsTo(Mission, { foreignKey: "missionId", as: "mission" });
Mission.hasOne(Budget, { foreignKey: "missionId", as: "budget" });
Mission.hasMany(MissDoc, { foreignKey: "missionId", as: "documents" });

export { Mission, Budget, MissDoc };