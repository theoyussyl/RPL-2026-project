import { describe, it, expect } from "vitest";
import { RemoveScheduleAndLogs } from "./scheduleDeletion";

describe("RemoveScheduleAndLogs", () => {
  it("menghapus jadwal yang ditarget beserta seluruh CareLog miliknya", () => {
    const Schedules = [{ Id: 1 }, { Id: 2 }];
    const CareLogs = [
      { Id: 100, ScheduleId: 1 },
      { Id: 101, ScheduleId: 1 },
      { Id: 102, ScheduleId: 2 },
    ];

    const Result = RemoveScheduleAndLogs(Schedules, CareLogs, 1);

    expect(Result.Schedules.map((S) => S.Id)).toEqual([2]);
    expect(Result.CareLogs.map((L) => L.Id)).toEqual([102]);
    expect(Result.DeletedCareLogCount).toBe(2);
  });

  it("tidak memengaruhi jadwal dan riwayat lain yang tidak ditarget", () => {
    const Schedules = [{ Id: 1 }, { Id: 2 }];
    const CareLogs = [{ Id: 102, ScheduleId: 2 }];

    const Result = RemoveScheduleAndLogs(Schedules, CareLogs, 1);

    expect(Result.Schedules).toHaveLength(1);
    expect(Result.Schedules[0].Id).toBe(2);
    expect(Result.CareLogs).toHaveLength(1);
    expect(Result.CareLogs[0].ScheduleId).toBe(2);
  });

  it("tetap berjalan normal (tanpa error) jika jadwal belum punya riwayat sama sekali", () => {
    const Schedules = [{ Id: 1 }];
    const CareLogs: { Id: number; ScheduleId: number }[] = [];

    const Result = RemoveScheduleAndLogs(Schedules, CareLogs, 1);

    expect(Result.Schedules).toHaveLength(0);
    expect(Result.DeletedCareLogCount).toBe(0);
  });

  it("tidak menghapus apapun jika ScheduleId yang ditarget tidak ditemukan", () => {
    const Schedules = [{ Id: 1 }];
    const CareLogs = [{ Id: 100, ScheduleId: 1 }];

    const Result = RemoveScheduleAndLogs(Schedules, CareLogs, 999);

    expect(Result.Schedules).toHaveLength(1);
    expect(Result.CareLogs).toHaveLength(1);
    expect(Result.DeletedCareLogCount).toBe(0);
  });
});
