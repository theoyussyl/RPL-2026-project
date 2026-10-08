import { CareStatus } from "../enums/CareStatus";

export interface DashboardSummary {
  TotalGardens: number;
  TotalPlants: number;
  SchedulesDueToday: number;
  OverdueSchedules: number;
  PlantsWithoutSchedule: number;
}

export interface PlantCareStatus {
  PlantId: number;
  PlantName: string;
  GardenName: string;
  NextDueAt: string | null;
  DaysUntilDue: number | null;
  CareStatus: CareStatus;
}

export interface DashboardResponse {
  Summary: DashboardSummary;
  Plants: PlantCareStatus[];
}
