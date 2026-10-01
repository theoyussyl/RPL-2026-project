import { PlantCondition } from "../enums/PlantCondition";

export interface GrowthLog {
  Id: number;
  PlantId: number;
  PhotoUrl: string;
  Note?: string | null;
  Condition: PlantCondition;
  LoggedAt: string;
  CreatedAt: string;
}
