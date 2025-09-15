import { Mission } from "../database/models/mission";
import {MissionAction} from "../database/models/missionActions";
import { User } from "../database/models/users";
import { CreateMissionActionParams, UpdateMissionActionParams } from "../types/managerMissionActions";

class MissionActionService {

 async createActionAndUpdateMission(data: CreateMissionActionParams) {
    const mission = await Mission.findByPk(data.missionId);
    const user = await User.findByPk(data.actorId);

    if (!mission) throw new Error("Mission not found");
    if (!user) throw new Error("User not found");

    const action = await MissionAction.create(data);
    
    let missionStatus = mission.status;
    switch (data.action) {
        case 'Approve':
            missionStatus='manager_approved';
            // if (mission.status === 'pending') {

            //     missionStatus = 'manager_approved';
            // } else if (mission.status === 'manager_approved') {
            //     missionStatus = 'financial_approved';
            // }
            break;
        case 'Reject':
            missionStatus = 'rejected';
            break;
        case 'Complete':
            missionStatus = 'completed';
            break;
        case 'Update':
            missionStatus = mission.status;
            break;
        case 'Cancel':
            missionStatus = 'canceled';
            break;
    }
    await Mission.update({ status: missionStatus }, { where: { id: data.missionId } });
    
    return action;
}
    async updateAction(actionId: string, data: UpdateMissionActionParams) {
        const action = await MissionAction.findByPk(actionId);
        if (!action) throw new Error("action not found");
        await action.update(data);
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