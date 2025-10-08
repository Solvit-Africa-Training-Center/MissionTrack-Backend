import { Model } from "sequelize";
import { Mission } from "../database/models/mission";
import { MissionAction } from "../database/models/missionActions";
import { MissDoc } from "../database/models/missionDocuments";
import { MissionPayload, MissionUpdatePayload } from "../types/missionInfoInterface";
import { User } from "../database/models/users";

export class MissionService {
 async createMission(payload: MissionPayload): Promise<any> {
  const mission = await Mission.create(payload);

  if (payload.documents && payload.documents.length > 0) {
    await Promise.all(
      payload.documents.map((doc) =>
        MissDoc.create({
          missionId: mission.id,
          ...doc,
        })
      )
    );
  }

  const createdMission = await Mission.findByPk(mission.id, {
    include: [
      {
        model: MissDoc,
        as: "documents",
        attributes: ["id", "documentName", "documentUrl"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email"],
      },
    ],
  });

  return createdMission ? createdMission.get({ plain: true }) : null;
}


  async updateMission(id: string, payload: MissionUpdatePayload) {
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
        const documentPromises = payload.documents.map(doc =>
          MissDoc.create({
            missionId: id,
            documentName: doc.documentName,
            documentUrl: doc.documentUrl
          })
        );
        await Promise.all(documentPromises);
      }
    }

    return await Mission.findByPk(id, {
      include: [
        { model: MissDoc, as: 'documents' }
      ]
    });
  }

  async getMissionById(id: string): Promise<Mission | null> {
    const mission = await Mission.findOne({
      where: { id },
      include: [{
        model: MissDoc, as: "documents",
        attributes: ["id", "documentName", "documentUrl"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email"],
      },
      ]
    });
    if (!mission) return null;
    return mission;
  }

  async getAllMissionsbyEmployee(userId: string) {
    const missions = await Mission.findAll({
      where: { userId },
      include: [{
        model: MissDoc, as: "documents",
        attributes: ["id", "documentName", "documentUrl"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email"],
      },
      ]
    });
   return missions.map((mission) => mission.get({ plain: true }));
  }

  async getAllMissionsByManager(companyId: string){
    const missions = await Mission.findAll({
      where: {
        companyId
      },
      include: [{
        model: MissDoc, as: "documents",
        attributes: ["id", "documentName", "documentUrl"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email"],
      },
      ]
    });
    return missions.map((mission) => mission.get({ plain: true }));
  }

  async getAllMissionsByFinance_manager(companyId: string) {
    const missions = await Mission.findAll({
      where: {
        companyId,
        status: "manager_approved",
      },
      include: [{
        model: MissDoc, as: "documents",
        attributes: ["id", "documentName", "documentUrl"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email"],
      },
      ],

    }
    );
    return missions.map((mission) => mission.get({ plain: true }));
  }

  async deleteMission(id: string): Promise<void> {
    const mission = await Mission.findByPk(id, { include: ['documents'] });
    if (!mission) {
      throw new Error("Mission not found");
    }
    await MissionAction.destroy({ where: { missionId: id } });
    await MissDoc.destroy({ where: { missionId: id } });
    await mission.destroy();
  }
}

