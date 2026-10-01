import { Router } from "express";
import { prisma } from "../lib/prisma";

export const GardenRouter = Router();

GardenRouter.get("/", async (req, res) => {
  const Gardens = await prisma.garden.findMany({ orderBy: { CreatedAt: "desc" } });
  res.json(Gardens);
});

GardenRouter.post("/", async (req, res) => {
  const { Name, Location } = req.body;
  if (!Name) return res.status(400).json({ Message: "Nama kebun wajib diisi" });
  const Garden = await prisma.garden.create({ data: { Name, Location } });
  res.status(201).json(Garden);
});

GardenRouter.get("/:Id", async (req, res) => {
  const Garden = await prisma.garden.findUnique({ where: { Id: Number(req.params.Id) } });
  if (!Garden) return res.status(404).json({ Message: "Kebun tidak ditemukan" });
  res.json(Garden);
});

GardenRouter.put("/:Id", async (req, res) => {
  const { Name, Location } = req.body;
  const Garden = await prisma.garden.update({
    where: { Id: Number(req.params.Id) },
    data: { Name, Location },
  });
  res.json(Garden);
});

GardenRouter.delete("/:Id", async (req, res) => {
  await prisma.garden.delete({ where: { Id: Number(req.params.Id) } });
  res.status(204).send();
});

GardenRouter.get("/:GardenId/plants", async (req, res) => {
  const Plants = await prisma.plant.findMany({
    where: { GardenId: Number(req.params.GardenId) },
    orderBy: { CreatedAt: "desc" },
  });
  res.json(Plants);
});

GardenRouter.post("/:GardenId/plants", async (req, res) => {
  const { Name, Species, PlantedDate } = req.body;
  if (!Name) return res.status(400).json({ Message: "Nama tanaman wajib diisi" });
  const Plant = await prisma.plant.create({
    data: {
      GardenId: Number(req.params.GardenId),
      Name,
      Species,
      PlantedDate: PlantedDate ? new Date(PlantedDate) : null,
    },
  });
  res.status(201).json(Plant);
});
