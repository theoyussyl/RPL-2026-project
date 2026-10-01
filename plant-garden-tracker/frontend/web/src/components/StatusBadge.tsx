interface StatusBadgeProps {
  Status: string;
}

const ColorMap: Record<string, string> = {
  OK: "bg-green-100 text-green-700",
  DUE_SOON: "bg-orange-100 text-orange-700",
  OVERDUE: "bg-red-100 text-red-700",
  NO_SCHEDULE: "bg-gray-100 text-gray-600",
};

const LabelMap: Record<string, string> = {
  OK: "Baik",
  DUE_SOON: "Segera",
  OVERDUE: "Terlambat",
  NO_SCHEDULE: "Belum Ada Jadwal",
};

export function StatusBadge({ Status }: StatusBadgeProps) {
  const ColorClass = ColorMap[Status] ?? "bg-gray-100 text-gray-600";
  const Label = LabelMap[Status] ?? Status;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ColorClass}`}>{Label}</span>
  );
}
