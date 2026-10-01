import { Router } from "express";
import { prisma } from "../lib/prisma";

export const ScheduleRouter = Router();

ScheduleRouter.put("/:Id", async (req, res) => {
  const { FrequencyDays } = req.body;
  const Schedule = await prisma.careSchedule.update({
    where: { Id: Number(req.params.Id) },
    data: { FrequencyDays: Number(FrequencyDays) },
  });
  res.json(Schedule);
});

ScheduleRouter.delete("/:Id", async (req, res) => {
  await prisma.careSchedule.delete({ where: { Id: Number(req.params.Id) } });
  res.status(204).send();
});

ScheduleRouter.post("/:Id/done", async (req, res) => {
  const Schedule = await prisma.careSchedule.findUnique({ where: { Id: Number(req.params.Id) } });
  if (!Schedule) return res.status(404).json({ Message: "Jadwal tidak ditemukan" });

  const DoneAt = new Date();
  const NextDueAt = new Date(DoneAt);
  NextDueAt.setDate(NextDueAt.getDate() + Schedule.FrequencyDays);

  await prisma.careLog.create({
    data: { PlantId: Schedule.PlantId, ScheduleId: Schedule.Id, Type: Schedule.Type, DoneAt },
  });

  const Updated = await prisma.careSchedule.update({
    where: { Id: Schedule.Id },
    data: { LastDoneAt: DoneAt, NextDueAt },
  });

  res.json({
    ScheduleId: Updated.Id,
    PlantId: Updated.PlantId,
    Type: Updated.Type,
    DoneAt,
    NextDueAt: Updated.NextDueAt,
    Message: "Perawatan berhasil dicatat",
  });
});
