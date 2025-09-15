
const enumStatus={
    PENDING:"pending",
    REJECTED:"rejected",
    MANAGER_APPROVED:"manager_approved",
    FINANCIAL_APPROVED:"financial_approved",
    COMPLETED:"completed",
    CANCELLED:"canceled"
} as const;

export type MissionStatus=typeof enumStatus[keyof typeof enumStatus];

export interface missionInterfaces{
    id:string;
    userId:string;
    missionTitle:string;
    fullName:string;
    jobPosition:string;
    location:string;
    startDate:Date;
    endDate:Date;
    status:MissionStatus;
    missionDescription:string;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date|null;
}

export interface MissionPayload{
    id:string;
    userId:string;
    missionTitle:string;
    fullName:string;
    jobPosition:string;
    location:string;
    startDate:Date;
    endDate:Date;
    missionDescription:string;
    status:MissionStatus;

    documents:{
        documentName:string;
        documentUrl:string;
    }[];

}

export interface MissionUpdatePayload {
    
    missionTitle?: string;
    missionDescription?: string;
    location?: string;
    jobPosition?: string;
    status?: MissionStatus;
    startDate?: Date;
    endDate?: Date;
    documents?: {
        documentName: string;
        documentUrl: string;
    }[];
}
