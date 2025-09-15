import { Mission } from "../database/models/mission";
import { MissDoc } from "../database/models/missionDocuments";
import { MissionPayload, MissionUpdatePayload } from "../types/missionInfoInterface";

export class MissionService {
  async createMission(payload: MissionPayload): Promise<Mission> {
    const mission = await Mission.create(payload);
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

async updateMission(id: string, payload: MissionUpdatePayload){
        const mission = await Mission.findByPk(id);
        if (!mission) return null;
         if (payload.startDate) payload.startDate = new Date(payload.startDate);
         if (payload.endDate) payload.endDate = new Date(payload.endDate);
          Object.keys(payload).forEach(key => {
        if (payload[key as keyof MissionUpdatePayload] === "") {
            delete payload[key as keyof MissionUpdatePayload];
        }
    });
         await mission.update(payload);

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
                { model: MissDoc, as: 'documents' }
            ]
        });
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

