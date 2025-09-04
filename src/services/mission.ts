import { Budget, MissDoc } from "../database/models";
import { Mission } from "../database/models/mission";
import { MissionPayload, MissionUpdatePayload } from "../types/missionInfoInterface";

export class MissionService {
  async createMission(payload: MissionPayload): Promise<Mission> {
    const mission = await Mission.create(payload);
    if (payload.budget) {
      await Budget.create({
        missionId: mission.id,
        ...payload.budget
      });
    }
    if (payload.documents) {
      for (const doc of payload.documents) {
        await MissDoc.create({
          missionId: mission.id,
          ...doc
        })
      }
    }
    return mission
  }

async updateMission(id: string, payload: MissionUpdatePayload): Promise<Mission | null> {
    try {
        const mission = await Mission.findByPk(id);
        if (!mission) return null;
         await mission.update(payload);

         if (payload.budget !== undefined && payload.budget !== null) {
            const budget = await Budget.findOne({ where: { missionId: id } });
            if (budget) {
                await budget.update(payload.budget);
            } else {
                await Budget.create({ missionId: id, ...payload.budget });
            }
        }
        if (payload.documents !== undefined && payload.documents !== null) {
            await MissDoc.destroy({ where: { missionId: id } });

            if (payload.documents.length > 0) {
                for (const doc of payload.documents) {
                    await MissDoc.create({
                        missionId: id,
                        documentName: doc.documentName,
                        documentUrl: doc.documentUrl
                    });
                }
            }
        }
        
        return await Mission.findByPk(id, {
            include: [
                { model: Budget, as: 'budget' },
                { model: MissDoc, as: 'documents' }
            ]
        });
    } catch (error) {
        throw error;
    }
}

  async getMissionById(id: string): Promise<Mission | null> {
    const mission = await Mission.findByPk(id);
    if (!mission) return null;
    return mission;
  }
  async getAllMissions(): Promise<Mission[]> {
    const missions = await Mission.findAll();
    return missions;
  }

  async deleteMission(id: string): Promise<void> {
    const mission = await Mission.findByPk(id);
    if (!mission) {
      throw new Error("Mission not found");
    }
    await mission.destroy();
  }
}

