export interface IDailyReport {
  id?: string;
  userId:string;
  missionId: string;
  date: Date;
  dailyActivity: string;
  documents?: string | null;
  filePath?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DailyReportCreate {
  userId:string;
  missionId: string;
  date: Date;
  dailyActivity: string;
  documents?: string | null;
  filePath?: string | null;
  description?: string | null;
}

export interface DailyReportUpdate {
  date?: Date;
  dailyActivity?: string;
  documents?: string | null;
  filePath?: string | null;
  description?: string | null;
}