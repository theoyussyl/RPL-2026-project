import { describe, it, expect } from "vitest";
import { CalculateNextDueAt, DetermineCareStatus } from "./careLogic";

describe("CalculateNextDueAt", () => {
  it("menambahkan FrequencyDays ke tanggal acuan dengan benar", () => {
    const From = new Date("2026-01-01T00:00:00Z");
    const Result = CalculateNextDueAt(3, From);
    expect(Result.toISOString().slice(0, 10)).toBe("2026-01-04");
  });
});

describe("DetermineCareStatus", () => {
  const Now = new Date("2026-01-10T00:00:00Z");

  it("mengembalikan NO_SCHEDULE jika tidak ada jadwal", () => {
    expect(DetermineCareStatus(null, Now)).toBe("NO_SCHEDULE");
  });

  it("mengembalikan OVERDUE jika NextDueAt sudah lewat", () => {
    const NextDueAt = new Date("2026-01-09T00:00:00Z");
    expect(DetermineCareStatus(NextDueAt, Now)).toBe("OVERDUE");
  });

  it("mengembalikan DUE_SOON jika NextDueAt dalam 2 hari ke depan", () => {
    const NextDueAt = new Date("2026-01-11T00:00:00Z");
    expect(DetermineCareStatus(NextDueAt, Now)).toBe("DUE_SOON");
  });

  it("mengembalikan OK jika NextDueAt lebih dari 2 hari ke depan", () => {
    const NextDueAt = new Date("2026-01-20T00:00:00Z");
    expect(DetermineCareStatus(NextDueAt, Now)).toBe("OK");
  });
});
