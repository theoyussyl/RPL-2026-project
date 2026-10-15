export interface ScheduleInputLike {
  Type?: unknown;
  FrequencyDays?: unknown;
}

const ValidCareTypes = ["WATERING", "FERTILIZING"];

export function ValidateScheduleInput(Input: ScheduleInputLike): string | null {
  if (typeof Input.Type !== "string" || !ValidCareTypes.includes(Input.Type)) {
    return "Tipe jadwal harus Penyiraman (WATERING) atau Pemupukan (FERTILIZING)";
  }

  const FrequencyDaysNumber = Number(Input.FrequencyDays);
  if (!Number.isInteger(FrequencyDaysNumber) || FrequencyDaysNumber <= 0) {
    return "Frekuensi harus berupa bilangan bulat positif (minimal 1 hari sekali)";
  }

  return null;
}
