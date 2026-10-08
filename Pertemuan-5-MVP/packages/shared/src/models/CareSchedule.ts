import { CareType } from "../enums/CareType";

export interface CareSchedule {
  Id: number;
  PlantId: number;
  Type: CareType;
  FrequencyDays: number;
  LastDoneAt?: string | null;
  NextDueAt: string;
  CreatedAt: string;
}
