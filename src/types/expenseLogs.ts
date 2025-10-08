
export interface ExpenseLogCreate {
  userId:string;
  missionId: string;
  date: Date;
  accommodationFile?: string | null;
  mealsFile?: string | null;
  transportFile?: string | null;
  description?: string | null;
  accommodationAmount?:number;
  mealsAmount?:number;
  transportAmount?:number;
  totalAmount?:number;
  status:"pending" | "accepted" | "rejected";
  statusChangeComment?: string | null;
}

export interface ExpenseLogUpdate {
  missionId?: string;
  date?: Date;
  accommodationFile?: string | null;
  mealsFile?: string | null;
  transportFile?: string | null;
  description?: string | null;
  accommodationAmount?:number;
  mealsAmount?:number;
  transportAmount?:number;
  totalAmount?:number;
  status?:"pending" | "accepted" | "rejected";
  statusChangeComment?: string | null;
}