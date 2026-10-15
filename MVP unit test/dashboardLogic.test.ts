import { describe, it, expect } from "vitest";
import { BuildDashboardResult } from "./dashboardLogic";

const Now = new Date("2026-01-10T00:00:00Z");

describe("BuildDashboardResult", () => {
  it("mengembalikan ringkasan kosong jika tidak ada kebun", () => {
    const Result = BuildDashboardResult([], Now);
    expect(Result.Summary.TotalGardens).toBe(0);
    expect(Result.Summary.TotalPlants).toBe(0);
    expect(Result.Plants).toHaveLength(0);
  });

  it("menghitung TotalGardens dan TotalPlants dengan benar lintas beberapa kebun", () => {
    const Gardens = [
      { Name: "Kebun A", Plants: [{ Id: 1, Name: "Tomat", Schedules: [] }] },
      { Name: "Kebun B", Plants: [{ Id: 2, Name: "Cabai", Schedules: [] }, { Id: 3, Name: "Bayam", Schedules: [] }] },
    ];
    const Result = BuildDashboardResult(Gardens, Now);
    expect(Result.Summary.TotalGardens).toBe(2);
    expect(Result.Summary.TotalPlants).toBe(3);
  });

  it("menandai tanaman tanpa jadwal sebagai PlantsWithoutSchedule dan status NO_SCHEDULE", () => {
    const Gardens = [{ Name: "Kebun A", Plants: [{ Id: 1, Name: "Tomat", Schedules: [] }] }];
    const Result = BuildDashboardResult(Gardens, Now);
    expect(Result.Summary.PlantsWithoutSchedule).toBe(1);
    expect(Result.Plants[0].CareStatus).toBe("NO_SCHEDULE");
  });

  it("menghitung OverdueSchedules berdasarkan jadwal TERDEKAT tiap tanaman (bukan rata-rata semua jadwal)", () => {
    const Gardens = [
      {
        Name: "Kebun A",
        Plants: [
          {
            Id: 1,
            Name: "Tomat",
            Schedules: [
              { NextDueAt: new Date("2026-01-20T00:00:00Z") }, // jauh di depan (OK)
              { NextDueAt: new Date("2026-01-09T00:00:00Z") }, // sudah lewat (OVERDUE) <- ini yang terdekat
            ],
          },
        ],
      },
    ];
    const Result = BuildDashboardResult(Gardens, Now);
    expect(Result.Summary.OverdueSchedules).toBe(1);
    expect(Result.Plants[0].CareStatus).toBe("OVERDUE");
  });

  it("menghitung SchedulesDueToday hanya untuk jadwal yang jatuh tempo HARI INI (bukan besok/lusa)", () => {
    const TodayLater = new Date("2026-01-10T20:00:00Z");
    const Tomorrow = new Date("2026-01-11T08:00:00Z");
    const Gardens = [
      { Name: "Kebun A", Plants: [{ Id: 1, Name: "Tomat", Schedules: [{ NextDueAt: TodayLater }] }] },
      { Name: "Kebun A", Plants: [{ Id: 2, Name: "Cabai", Schedules: [{ NextDueAt: Tomorrow }] }] },
    ];
    const Result = BuildDashboardResult(Gardens, Now);
    expect(Result.Summary.SchedulesDueToday).toBe(1);
  });
});
