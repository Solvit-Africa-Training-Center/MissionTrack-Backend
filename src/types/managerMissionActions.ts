export interface CreateMissionActionParams {
  missionId: string;
  action: 'Approve' | 'Reject' | 'Update' | 'Cancel' | 'Complete';
}

export interface UpdateMissionActionParams {
  action?: 'Approve' | 'Reject' | 'Update' | 'Cancel' | 'Complete';
  accommodationAmount?: number;
  transportAmount?: number;
  dailyAllowanceAmount?: number;
  comment?: string;
}
