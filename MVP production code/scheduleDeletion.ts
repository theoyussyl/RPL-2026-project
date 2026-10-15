export interface ScheduleRecord {
  Id: number;
}

export interface CareLogRecord {
  Id: number;
  ScheduleId: number;
}

export interface CascadeDeleteResult {
  Schedules: ScheduleRecord[];
  CareLogs: CareLogRecord[];
  DeletedCareLogCount: number;
}

// Aturan bisnis: pengguna boleh menghapus jadwal kapan saja (misalnya karena
// salah input), termasuk saat jadwal sudah punya riwayat (CareLog). Saat itu
// terjadi, seluruh CareLog milik jadwal tersebut ikut dihapus supaya tidak ada
// riwayat "yatim" yang menunjuk ke jadwal yang sudah tidak ada.
export function RemoveScheduleAndLogs(
  Schedules: ScheduleRecord[],
  CareLogs: CareLogRecord[],
  ScheduleId: number
): CascadeDeleteResult {
  const RemainingCareLogs = CareLogs.filter((Log) => Log.ScheduleId !== ScheduleId);
  const DeletedCareLogCount = CareLogs.length - RemainingCareLogs.length;

  return {
    Schedules: Schedules.filter((Schedule) => Schedule.Id !== ScheduleId),
    CareLogs: RemainingCareLogs,
    DeletedCareLogCount,
  };
}
