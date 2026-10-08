import express from "express";
import cors from "cors";
import path from "path";
import { GardenRouter } from "./routes/gardens";
import { PlantRouter } from "./routes/plants";
import { ScheduleRouter } from "./routes/schedules";
import { DashboardRouter } from "./routes/dashboard";

export const App = express();

App.use(cors());
App.use(express.json());
App.use("/uploads", express.static(path.join(__dirname, "../uploads")));

App.use("/api/gardens", GardenRouter);
App.use("/api/plants", PlantRouter);
App.use("/api/schedules", ScheduleRouter);
App.use("/api/dashboard", DashboardRouter);

App.use((Error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", Error);
  if (res.headersSent) return next(Error);
  res.status(500).json({ Message: "Terjadi kesalahan tak terduga di server" });
});
