import { Router } from "express";
import { CalculateNextDueAt } from "../lib/careLogic";
import { prisma } from "../lib/prisma";
import { ValidateRequiredText } from "../lib/validation";
import { AsyncHandler } from "../lib/asyncHandler";

export const PlantRouter = Router();

PlantRouter.get("/:Id", AsyncHandler(async (req, res) => {
  const Plant = await prisma.plant.findUnique({
    where: { Id: Number(req.params.Id) },
    include: { Garden: true },
  });
  if (!Plant) return res.status(404).json({ Message: "Tanaman tidak ditemukan" });
  res.json(Plant);
}));

PlantRouter.put("/:Id", AsyncHandler(async (req, res) => {
  const { Name, Species, PlantedDate } = req.body;
  const ValidationError = ValidateRequiredText(Name, "Nama tanaman");
  if (ValidationError) return res.status(400).json({ Message: ValidationError });
  const Plant = await prisma.plant.update({
    where: { Id: Number(req.params.Id) },
    data: { Name, Species, PlantedDate: PlantedDate ? new Date(PlantedDate) : null },
  });
  res.json(Plant);
}));

PlantRouter.delete("/:Id", AsyncHandler(async (req, res) => {
  try {
    await prisma.plant.delete({ where: { Id: Number(req.params.Id) } });
    res.status(204).send();
  } catch (Error: any) {
    if (Error?.code === "P2003") {
      return res.status(400).json({
        Message: "Tanaman ini tidak bisa dihapus karena masih memiliki jadwal perawatan atau riwayat terkait.",
      });
    }
    if (Error?.code === "P2025") {
      return res.status(404).json({ Message: "Tanaman tidak ditemukan" });
    }
    throw Error;
  }
}));

PlantRouter.get("/:Id/schedules", AsyncHandler(async (req, res) => {
  const Schedules = await prisma.careSchedule.findMany({
    where: { PlantId: Number(req.params.Id) },
    orderBy: { NextDueAt: "asc" },
  });
  res.json(Schedules);
}));

PlantRouter.post("/:Id/schedules", AsyncHandler(async (req, res) => {
  const { Type, FrequencyDays } = req.body;
  if (!Type || !FrequencyDays) {
    return res.status(400).json({ Message: "Tipe dan frekuensi wajib diisi" });
  }
  const NextDueAt = CalculateNextDueAt(Number(FrequencyDays));
  const Schedule = await prisma.careSchedule.create({
    data: { PlantId: Number(req.params.Id), Type, FrequencyDays: Number(FrequencyDays), NextDueAt },
  });
  res.status(201).json(Schedule);
}));
