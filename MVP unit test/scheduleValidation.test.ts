import { describe, it, expect } from "vitest";
import { ValidateScheduleInput } from "./scheduleValidation";

describe("ValidateScheduleInput", () => {
  it("menolak Type yang bukan WATERING/FERTILIZING", () => {
    expect(ValidateScheduleInput({ Type: "RANDOM", FrequencyDays: 3 })).toBe(
      "Tipe jadwal harus Penyiraman (WATERING) atau Pemupukan (FERTILIZING)"
    );
  });

  it("menolak Type kosong", () => {
    expect(ValidateScheduleInput({ Type: "", FrequencyDays: 3 })).not.toBeNull();
  });

  it("menolak FrequencyDays 0 (bukan bilangan positif)", () => {
    expect(ValidateScheduleInput({ Type: "WATERING", FrequencyDays: 0 })).toBe(
      "Frekuensi harus berupa bilangan bulat positif (minimal 1 hari sekali)"
    );
  });

  it("menolak FrequencyDays negatif", () => {
    expect(ValidateScheduleInput({ Type: "WATERING", FrequencyDays: -2 })).not.toBeNull();
  });

  it("menolak FrequencyDays desimal (bukan bilangan bulat)", () => {
    expect(ValidateScheduleInput({ Type: "WATERING", FrequencyDays: 2.5 })).not.toBeNull();
  });

  it("menerima input valid (WATERING, 3 hari)", () => {
    expect(ValidateScheduleInput({ Type: "WATERING", FrequencyDays: 3 })).toBeNull();
  });

  it("menerima input valid (FERTILIZING, 7 hari)", () => {
    expect(ValidateScheduleInput({ Type: "FERTILIZING", FrequencyDays: 7 })).toBeNull();
  });
});
