const enumStatus={
    PENDING:"pending",
    REJECTED:"rejected",
    MANAGER_APPROVED:"manager_approved",
    FINANCIAL_APPROVED:"financial_approved",
    COMPLETED:"completed"
} as const;

export type MissionStatus=typeof enumStatus[keyof typeof enumStatus];

export interface missionInterfaces{
    id:string;
    title:string;
    description:string;
    location:string;
    jobPosition:string;
    status:MissionStatus;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date|null;
}

export interface MissionPayload{
    title:string;
    description:string;
    location:string;
    jobPosition:string;
    status:MissionStatus;

    budget:{
        estimatedTransportCost:number;
        estimatedAccommodationCost:number;
        estimatedMealCost:number;
        totalAmount:number;
    };

    documents:{
        documentName:string;
        documentUrl:string;
    }[];

}

export interface MissionUpdatePayload{
    title?:string;
    description?:string;
    location?:string;
    jobPosition?:string;
    status?:MissionStatus;

    budget?:{
        estimatedTransportCost:number;
        estimatedAccommodationCost:number;
        estimatedMealCost:number;
        totalAmount:number;
    };

    documents?:{
        documentName:string;
        documentUrl:string;
    }[];

}