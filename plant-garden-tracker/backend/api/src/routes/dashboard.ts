import { Router } from "express";
import { prisma } from "../lib/prisma";

export const DashboardRouter = Router();

DashboardRouter.get("/", async (req, res) => {
  const Now = new Date();
  const TodayEnd = new Date(Now);
  TodayEnd.setHours(23, 59, 59, 999);
  const SoonThreshold = new Date(Now);
  SoonThreshold.setDate(SoonThreshold.getDate() + 2);

  const Gardens = await prisma.garden.findMany({
    include: { Plants: { include: { Schedules: true } } },
  });

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
          PlantId: Plant.Id,
          PlantName: Plant.Name,
          GardenName: Garden.Name,
          NextDueAt: null,
          DaysUntilDue: null,
          CareStatus: "NO_SCHEDULE",
        };
      }

      const NearestSchedule = ActiveSchedules.reduce((a, b) => (a.NextDueAt < b.NextDueAt ? a : b));
      const DiffMs = NearestSchedule.NextDueAt.getTime() - Now.getTime();
      const DaysUntilDue = Math.ceil(DiffMs / (1000 * 60 * 60 * 24));

      let Status = "OK";
      if (NearestSchedule.NextDueAt < Now) {
        Status = "OVERDUE";
        OverdueSchedules += 1;
      } else if (NearestSchedule.NextDueAt <= SoonThreshold) {
        Status = "DUE_SOON";
      }
      if (NearestSchedule.NextDueAt <= TodayEnd && NearestSchedule.NextDueAt >= Now) {
        SchedulesDueToday += 1;
      }

      return {
        PlantId: Plant.Id,
        PlantName: Plant.Name,
        GardenName: Garden.Name,
        NextDueAt: NearestSchedule.NextDueAt,
        DaysUntilDue,
        CareStatus: Status,
      };
    })
  );

  res.json({
    Summary: { TotalGardens, TotalPlants, SchedulesDueToday, OverdueSchedules, PlantsWithoutSchedule },
    Plants: PlantRows,
  });
});
