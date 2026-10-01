import { Router } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../lib/prisma";

const Storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const Upload = multer({ storage: Storage });

export const GrowthLogRouter = Router();

GrowthLogRouter.post("/:PlantId", Upload.single("Photo"), async (req, res) => {
  const { Note, Condition } = req.body;
  if (!req.file) return res.status(400).json({ Message: "Foto wajib diunggah" });
  const GrowthLog = await prisma.growthLog.create({
    data: {
      PlantId: Number(req.params.PlantId),
      PhotoUrl: `/uploads/${req.file.filename}`,
      Note,
      Condition,
    },
  });
  res.status(201).json(GrowthLog);
});

GrowthLogRouter.delete("/:Id", async (req, res) => {
  await prisma.growthLog.delete({ where: { Id: Number(req.params.Id) } });
  res.status(204).send();
});
