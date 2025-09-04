export interface MissionBudgetInterface{
    id:string;
    missionId:string;
    estimatedTransportCost:number;
    estimatedAccommodationCost:number;
    estimatedMealCost:number;
    totalAmount:number;
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:null;
}

