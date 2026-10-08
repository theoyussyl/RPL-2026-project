import { CareType } from "../enums/CareType";

export interface MarkCareDoneResult {
  ScheduleId: number;
  PlantId: number;
  Type: CareType;
  DoneAt: string;
  NextDueAt: string;
  Message: string;
}
