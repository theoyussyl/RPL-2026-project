import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiGet } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import type { DashboardResponse } from "@plant-garden-tracker/shared";

export function Dashboard() {
  const [Data, setData] = useState<DashboardResponse | null>(null);
  const [Loading, setLoading] = useState(true);
  const [ErrorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    LoadData();
  }, []);

  async function LoadData() {
    setLoading(true);
    setErrorMessage("");
    try {
      const Result = await ApiGet<DashboardResponse>("/dashboard");
      setData(Result);
    } catch {
      setErrorMessage("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (Loading) return <p className="p-6 text-gray-500">Memuat data...</p>;
  if (ErrorMessage) return <p className="p-6 text-red-600">{ErrorMessage}</p>;
  if (!Data) return null;

  const Cards = [
    { Label: "Total Kebun", Value: Data.Summary.TotalGardens },
    { Label: "Total Tanaman", Value: Data.Summary.TotalPlants },
    { Label: "Perlu Perawatan Hari Ini", Value: Data.Summary.SchedulesDueToday },
    { Label: "Terlambat Dirawat", Value: Data.Summary.OverdueSchedules },
    { Label: "Belum Ada Jadwal", Value: Data.Summary.PlantsWithoutSchedule },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Cards.map((Card) => (
          <div key={Card.Label} className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">{Card.Label}</p>
            <p className="text-2xl font-semibold text-green-700">{Card.Value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Tanaman</th>
              <th className="p-3">Kebun</th>
              <th className="p-3">Jadwal Berikutnya</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {Data.Plants.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Belum ada data tanaman
                </td>
              </tr>
            )}
            {Data.Plants.map((Row) => (
              <tr key={Row.PlantId} className="border-b last:border-0">
                <td className="p-3 font-medium text-gray-800">{Row.PlantName}</td>
                <td className="p-3 text-gray-600">{Row.GardenName}</td>
                <td className="p-3 text-gray-600">
                  {Row.NextDueAt ? new Date(Row.NextDueAt).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="p-3">
                  <StatusBadge Status={Row.CareStatus} />
                </td>
                <td className="p-3">
                  <Link to={`/plants/${Row.PlantId}`} className="text-green-700 hover:underline">
                    Lihat Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
