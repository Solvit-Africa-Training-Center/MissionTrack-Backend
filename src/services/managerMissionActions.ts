import { Mission } from "../database/models/mission";
import { MissionAction } from "../database/models/missionActions";
import { User } from "../database/models/users";
import { Mailer } from "../utils/mailer";
import { CreateMissionActionParams, UpdateMissionActionParams } from "../types/managerMissionActions";

class MissionActionService {

    async createActionAndUpdateMission(data: CreateMissionActionParams, actorId: string) {
        const mission = await Mission.findByPk(data.missionId);
        if (!mission) throw new Error("Mission not found");
        const action = await MissionAction.create({
            ...data, actorId
        });
        let missionStatus = mission.status;

        switch (data.action) {
            case "Approve":
                missionStatus = "manager_approved";
                break;
            case "Reject":
                missionStatus = "rejected";
                break;
            case "Cancel":
                missionStatus = "canceled";
                break;
            case "Complete":
                missionStatus = "completed";
                break;
        }

        await Mission.update(
            { status: missionStatus },
            { where: { id: data.missionId } }
        );

        return action;
    }

    async financeManagerUpdateAction(actionId: string, data: UpdateMissionActionParams) {
        const action = await MissionAction.findByPk(actionId);
        if (!action) throw new Error("action not found");
        await action.update(data);
        const currentComment = data.comment?.trim() || "No comment provided";
        const mission = await Mission.findByPk(action.missionId);
        if (!mission) throw new Error("Mission not found");

        const creator = await User.findByPk(mission.userId);
        if (!creator) throw new Error("Mission creator not found");

        const financeManager = await User.findByPk(action.actorId);
        if (!financeManager) throw new Error("Finance manager not found");

        const dailyAllowanceAmount = data.dailyAllowanceAmount ?? 0;
        const transportAmount = data.transportAmount ?? 0;
        const accommodationAmount = data.accommodationAmount ?? 0;
        const totalAmount = dailyAllowanceAmount + transportAmount + accommodationAmount;

        let missionStatus = mission.status;
        let subject = "";
        let message = "";
        switch (data.action) {
            case "Approve":
                missionStatus = "financial_approved";
                subject = `Mission to ${mission.location} has been Approved by Finance 👍`;
                message = `The mission "<strong>${mission.missionTitle}</strong>" has been approved by <strong>${financeManager.role}</strong>. Thank you!`;
                break;
            case "Reject":
                missionStatus = "rejected";
                subject = `Mission to ${mission.location} has been Rejected 👎`;
                message = `The mission "<strong>${mission.missionTitle}</strong>" has been rejected by <strong>${financeManager.role}</strong>.`;
                break;
            case "Complete":
                missionStatus = "completed";
                subject = `Mission to ${mission.location} has been Completed 🎉`;
                message = `The mission "<strong>${mission.missionTitle}</strong>" has been completed by <strong>${financeManager.role}</strong>.`;
                break;
            case "Cancel":
                missionStatus = "canceled";
                subject = `Mission to ${mission.location} has been Canceled ❌`;
                message = `The mission "<strong>${mission.missionTitle}</strong>" has been canceled by <strong>${financeManager.role}</strong>.`;
                break;
        }
        await Mission.update({ status: missionStatus, totalAmount: totalAmount, accommodationAmount: accommodationAmount, transportAmount: transportAmount, dailyAllowanceAmount: dailyAllowanceAmount }, { where: { id: action.missionId } });
        await Mailer.notifyEmpAboutMission(creator.email, creator.fullName, subject, message, currentComment);
        return action;

    }
    async getActionByMissionId(missionId: string) {
        const action = await MissionAction.findAll({
            where: { missionId },
            include: [{ model: User, as: 'actor', attributes: ['id', 'fullName', 'email'] },
            { model: Mission, as: 'mission', attributes: ['id', 'missionTitle', 'location'] }
            ]
        });
        if (!action) throw new Error("Action not found");
        return action;
    }

    async getAllActions() {
        const actions = await MissionAction.findAll({
            include: [{ model: User, as: 'actor', attributes: ['id', 'fullName', 'email'] },
            { model: Mission, as: 'mission', attributes: ['id', 'missionTitle', 'location'] }
            ]
        });
        return actions
    }

    async deleteAction(actionId: string) {
        const action = await MissionAction.findByPk(actionId);
        if (!action) throw new Error("Action not found");
        await action.destroy();
    }
    async getActionById(actionId: string) {
        const action = await MissionAction.findByPk(actionId);
        if (!action) throw new Error("Action not found");
        return action;
    }
}
export default MissionActionService;