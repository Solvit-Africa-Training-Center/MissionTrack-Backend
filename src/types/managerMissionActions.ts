export interface CreateMissionActionParams {
  missionId: string;
  actorId: string;
  action: 'Approve' | 'Reject' | 'Update' | 'Cancel' | 'Complete';
  comment?: string;
}

export interface UpdateMissionActionParams {
  action?: 'Approve' | 'Reject' | 'Update' | 'Cancel' | 'Complete';
  comment?: string;
}
