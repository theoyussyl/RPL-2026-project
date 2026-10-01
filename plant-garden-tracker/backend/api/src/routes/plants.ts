import { Router } from "express";
import { prisma } from "../lib/prisma";

export const PlantRouter = Router();

PlantRouter.get("/:Id", async (req, res) => {
  const Plant = await prisma.plant.findUnique({
    where: { Id: Number(req.params.Id) },
    include: { Garden: true, Schedules: true, GrowthLogs: { orderBy: { LoggedAt: "desc" } } },
  });
  if (!Plant) return res.status(404).json({ Message: "Tanaman tidak ditemukan" });
  res.json(Plant);
});

PlantRouter.put("/:Id", async (req, res) => {
  const { Name, Species, PlantedDate } = req.body;
  const Plant = await prisma.plant.update({
    where: { Id: Number(req.params.Id) },
    data: { Name, Species, PlantedDate: PlantedDate ? new Date(PlantedDate) : null },
  });
  res.json(Plant);
});

PlantRouter.delete("/:Id", async (req, res) => {
  await prisma.plant.delete({ where: { Id: Number(req.params.Id) } });
  res.status(204).send();
});

PlantRouter.get("/:Id/schedules", async (req, res) => {
  const Schedules = await prisma.careSchedule.findMany({
    where: { PlantId: Number(req.params.Id) },
    orderBy: { NextDueAt: "asc" },
  });
  res.json(Schedules);
});

PlantRouter.post("/:Id/schedules", async (req, res) => {
  const { Type, FrequencyDays } = req.body;
  if (!Type || !FrequencyDays) {
    return res.status(400).json({ Message: "Tipe dan frekuensi wajib diisi" });
  }
  const NextDueAt = new Date();
  NextDueAt.setDate(NextDueAt.getDate() + Number(FrequencyDays));
  const Schedule = await prisma.careSchedule.create({
    data: { PlantId: Number(req.params.Id), Type, FrequencyDays: Number(FrequencyDays), NextDueAt },
  });
  res.status(201).json(Schedule);
});

PlantRouter.get("/:Id/growth-logs", async (req, res) => {
  const GrowthLogs = await prisma.growthLog.findMany({
    where: { PlantId: Number(req.params.Id) },
    orderBy: { LoggedAt: "desc" },
  });
  res.json(GrowthLogs);
});
