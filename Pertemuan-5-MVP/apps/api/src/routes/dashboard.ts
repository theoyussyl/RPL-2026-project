import { Router } from "express";
import { prisma } from "../lib/prisma";
import { DetermineCareStatus } from "../lib/careLogic";
import { AsyncHandler } from "../lib/asyncHandler";

export const DashboardRouter = Router();

DashboardRouter.get("/", AsyncHandler(async (req, res) => {
  const Now = new Date();
  const Gardens = await prisma.garden.findMany({ include: { Plants: { include: { Schedules: true } } } });

  const TotalGardens = Gardens.length;
  const AllPlants = Gardens.flatMap((Garden) => Garden.Plants);
  const TotalPlants = AllPlants.length;

  let SchedulesDueToday = 0;
  let OverdueSchedules = 0;
  let PlantsWithoutSchedule = 0;

  const PlantRows = Gardens.flatMap((Garden) =>
    Garden.Plants.map((Plant) => {
      const ActiveSchedules = Plant.Schedules;
      if (ActiveSchedules.length === 0) {
        PlantsWithoutSchedule += 1;
        return {
          PlantId: Plant.Id, PlantName: Plant.Name, GardenName: Garden.Name,
          NextDueAt: null, CareStatus: DetermineCareStatus(null, Now),
        };
      }
      const NearestSchedule = ActiveSchedules.reduce((a, b) => (a.NextDueAt < b.NextDueAt ? a : b));
      const Status = DetermineCareStatus(NearestSchedule.NextDueAt, Now);
      if (Status === "OVERDUE") OverdueSchedules += 1;

      const TodayEnd = new Date(Now); TodayEnd.setHours(23, 59, 59, 999);
      if (NearestSchedule.NextDueAt >= Now && NearestSchedule.NextDueAt <= TodayEnd) SchedulesDueToday += 1;

      return {
        PlantId: Plant.Id, PlantName: Plant.Name, GardenName: Garden.Name,
        NextDueAt: NearestSchedule.NextDueAt, CareStatus: Status,
      };
    })
  );

  res.json({
    Summary: { TotalGardens, TotalPlants, SchedulesDueToday, OverdueSchedules, PlantsWithoutSchedule },
    Plants: PlantRows,
  });
}));
