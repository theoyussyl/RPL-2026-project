export function CalculateNextDueAt(FrequencyDays: number, From: Date = new Date()): Date {
  const NextDueAt = new Date(From);
  NextDueAt.setDate(NextDueAt.getDate() + FrequencyDays);
  return NextDueAt;
}

export function DetermineCareStatus(NextDueAt: Date | null, Now: Date = new Date()): string {
  if (!NextDueAt) return "NO_SCHEDULE";

  const SoonThreshold = new Date(Now);
  SoonThreshold.setDate(SoonThreshold.getDate() + 2);

  if (NextDueAt.getTime() < Now.getTime()) return "OVERDUE";
  if (NextDueAt.getTime() <= SoonThreshold.getTime()) return "DUE_SOON";
  return "OK";
}
