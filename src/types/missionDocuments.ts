export interface missionDocuments{
    id:string;
    missionId:string;
    documentName:string;
    documentUrl:string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    deletedAt?: null | undefined;
}