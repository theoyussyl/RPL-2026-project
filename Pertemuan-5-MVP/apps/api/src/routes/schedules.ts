import { Router } from "express";
import { prisma } from "../lib/prisma";
import { CalculateNextDueAt } from "../lib/careLogic";
import { AsyncHandler } from "../lib/asyncHandler";

export const ScheduleRouter = Router();

ScheduleRouter.delete("/:Id", AsyncHandler(async (req, res) => {
  try {
    await prisma.careSchedule.delete({ where: { Id: Number(req.params.Id) } });
    res.status(204).send();
  } catch (Error: any) {
    if (Error?.code === "P2003") {
      return res.status(400).json({
        Message:
          "Jadwal ini tidak bisa dihapus karena sudah memiliki riwayat perawatan (pernah ditandai 'Sudah Dilakukan').",
      });
    }
    if (Error?.code === "P2025") {
      return res.status(404).json({ Message: "Jadwal tidak ditemukan" });
    }
    throw Error;
  }
}));

ScheduleRouter.post("/:Id/done", AsyncHandler(async (req, res) => {
  const Schedule = await prisma.careSchedule.findUnique({ where: { Id: Number(req.params.Id) } });
  if (!Schedule) return res.status(404).json({ Message: "Jadwal tidak ditemukan" });

  const DoneAt = new Date();
  const NextDueAt = CalculateNextDueAt(Schedule.FrequencyDays, DoneAt);

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
}));
