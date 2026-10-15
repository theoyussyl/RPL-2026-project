import { DetermineCareStatus } from "./careLogic";

export interface ScheduleLite {
  NextDueAt: Date;
}

export interface PlantLite {
  Id: number;
  Name: string;
  Schedules: ScheduleLite[];
}

export interface GardenLite {
  Name: string;
  Plants: PlantLite[];
}

export interface DashboardSummaryResult {
  TotalGardens: number;
  TotalPlants: number;
  SchedulesDueToday: number;
  OverdueSchedules: number;
  PlantsWithoutSchedule: number;
}

export interface PlantCareStatusRow {
  PlantId: number;
  PlantName: string;
  GardenName: string;
  NextDueAt: Date | null;
  CareStatus: string;
}

export interface DashboardResult {
  Summary: DashboardSummaryResult;
  Plants: PlantCareStatusRow[];
}

export function BuildDashboardResult(Gardens: GardenLite[], Now: Date = new Date()): DashboardResult {
  const TotalGardens = Gardens.length;
  const AllPlants = Gardens.flatMap((Garden) => Garden.Plants);
  const TotalPlants = AllPlants.length;

  const TodayEnd = new Date(Now);
  TodayEnd.setHours(23, 59, 59, 999);

  let SchedulesDueToday = 0;
  let OverdueSchedules = 0;
  let PlantsWithoutSchedule = 0;

  const Plants: PlantCareStatusRow[] = Gardens.flatMap((Garden) =>
    Garden.Plants.map((Plant) => {
      if (Plant.Schedules.length === 0) {
        PlantsWithoutSchedule += 1;
        return {
          PlantId: Plant.Id,
          PlantName: Plant.Name,
          GardenName: Garden.Name,
          NextDueAt: null,
          CareStatus: DetermineCareStatus(null, Now),
        };
      }

      const NearestSchedule = Plant.Schedules.reduce((a, b) => (a.NextDueAt < b.NextDueAt ? a : b));
      const Status = DetermineCareStatus(NearestSchedule.NextDueAt, Now);

      if (Status === "OVERDUE") OverdueSchedules += 1;
      if (NearestSchedule.NextDueAt >= Now && NearestSchedule.NextDueAt <= TodayEnd) {
        SchedulesDueToday += 1;
      }

      return {
        PlantId: Plant.Id,
        PlantName: Plant.Name,
        GardenName: Garden.Name,
        NextDueAt: NearestSchedule.NextDueAt,
        CareStatus: Status,
      };
    })
  );

  return {
    Summary: { TotalGardens, TotalPlants, SchedulesDueToday, OverdueSchedules, PlantsWithoutSchedule },
    Plants,
  };
}
