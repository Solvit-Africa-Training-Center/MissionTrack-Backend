export interface IExpenseLog {
  id?: string;
  missionId: string;
  userId:string;
  date: Date;
  accommodationFile?: string | null;
  mealsFile?: string | null;
  transportFile?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ExpenseLogCreate {
  userId:string;
  missionId: string;
  date: Date;
  accommodationFile?: string | null;
  mealsFile?: string | null;
  transportFile?: string | null;
  description?: string | null;
}

export interface ExpenseLogUpdate {
  missionId?: string;
  date?: Date;
  accommodationFile?: string | null;
  mealsFile?: string | null;
  transportFile?: string | null;
  description?: string | null;
}