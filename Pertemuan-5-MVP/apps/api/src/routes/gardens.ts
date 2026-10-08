import { Router } from "express";
import { prisma } from "../lib/prisma";
import { ValidateRequiredText } from "../lib/validation";
import { AsyncHandler } from "../lib/asyncHandler";

export const GardenRouter = Router();

GardenRouter.get("/", AsyncHandler(async (req, res) => {
  const Gardens = await prisma.garden.findMany({ orderBy: { CreatedAt: "desc" } });
  res.json(Gardens);
}));

GardenRouter.post("/", AsyncHandler(async (req, res) => {
  const { Name, Location } = req.body;
  const ValidationError = ValidateRequiredText(Name, "Nama kebun");
  if (ValidationError) return res.status(400).json({ Message: ValidationError });
  const Garden = await prisma.garden.create({ data: { Name, Location } });
  res.status(201).json(Garden);
}));

GardenRouter.get("/:Id", AsyncHandler(async (req, res) => {
  const Garden = await prisma.garden.findUnique({ where: { Id: Number(req.params.Id) } });
  if (!Garden) return res.status(404).json({ Message: "Kebun tidak ditemukan" });
  res.json(Garden);
}));

GardenRouter.put("/:Id", AsyncHandler(async (req, res) => {
  const { Name, Location } = req.body;
  const ValidationError = ValidateRequiredText(Name, "Nama kebun");
  if (ValidationError) return res.status(400).json({ Message: ValidationError });
  const Garden = await prisma.garden.update({ where: { Id: Number(req.params.Id) }, data: { Name, Location } });
  res.json(Garden);
}));

GardenRouter.delete("/:Id", AsyncHandler(async (req, res) => {
  try {
    await prisma.garden.delete({ where: { Id: Number(req.params.Id) } });
    res.status(204).send();
  } catch (Error: any) {
    if (Error?.code === "P2003") {
      return res.status(400).json({
        Message: "Kebun ini tidak bisa dihapus karena masih memiliki tanaman di dalamnya. Hapus semua tanamannya terlebih dahulu.",
      });
    }
    if (Error?.code === "P2025") {
      return res.status(404).json({ Message: "Kebun tidak ditemukan" });
    }
    throw Error;
  }
}));

GardenRouter.get("/:GardenId/plants", AsyncHandler(async (req, res) => {
  const Plants = await prisma.plant.findMany({
    where: { GardenId: Number(req.params.GardenId) },
    orderBy: { CreatedAt: "desc" },
  });
  res.json(Plants);
}));

GardenRouter.post("/:GardenId/plants", AsyncHandler(async (req, res) => {
  const { Name, Species, PlantedDate } = req.body;
  const ValidationError = ValidateRequiredText(Name, "Nama tanaman");
  if (ValidationError) return res.status(400).json({ Message: ValidationError });
  const Plant = await prisma.plant.create({
    data: {
      GardenId: Number(req.params.GardenId),
      Name,
      Species,
      PlantedDate: PlantedDate ? new Date(PlantedDate) : null,
    },
  });
  res.status(201).json(Plant);
}));
