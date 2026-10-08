import { CareType } from "../enums/CareType";

export interface CareLog {
  Id: number;
  PlantId: number;
  ScheduleId: number;
  Type: CareType;
  DoneAt: string;
  CreatedAt: string;
}
