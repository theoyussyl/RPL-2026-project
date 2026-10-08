import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiGet, ApiPost, ApiDelete } from "../api/client";
import type { CareSchedule } from "@plant-garden-tracker/shared";

interface PlantDetailData {
  Id: number; Name: string; Species?: string | null;
  Garden: { Id: number; Name: string }; Schedules?: CareSchedule[];
}

export function PlantDetail() {
  const { Id } = useParams();
  const [Plant, setPlant] = useState<PlantDetailData | null>(null);
  const [Schedules, setSchedules] = useState<CareSchedule[]>([]);
  const [ScheduleType, setScheduleType] = useState("WATERING");
  const [FrequencyDays, setFrequencyDays] = useState(3);
  const [Message, setMessage] = useState("");
  const [IsError, setIsError] = useState(false);

  useEffect(() => { LoadAll(); }, [Id]);

  async function LoadAll() {
    const PlantResult = await ApiGet<PlantDetailData>(`/plants/${Id}`);
    setPlant(PlantResult);
    const ScheduleResult = await ApiGet<CareSchedule[]>(`/plants/${Id}/schedules`);
    setSchedules(ScheduleResult);
  }

  async function HandleAddSchedule(Event: React.FormEvent) {
    Event.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      await ApiPost(`/plants/${Id}/schedules`, { Type: ScheduleType, FrequencyDays });
      LoadAll();
    } catch (Error) {
      setIsError(true);
      setMessage(Error instanceof Error ? Error.message : "Gagal menambah jadwal");
    }
  }

  async function HandleMarkDone(ScheduleId: number) {
    setMessage("");
    setIsError(false);
    try {
      const Result = await ApiPost<{ Message: string }>(`/schedules/${ScheduleId}/done`, {});
      setMessage(Result.Message);
      LoadAll();
    } catch (Error) {
      setIsError(true);
      setMessage(Error instanceof Error ? Error.message : "Gagal mencatat perawatan");
    }
  }

  async function HandleDeleteSchedule(ScheduleId: number) {
    if (!confirm("Hapus jadwal ini?")) return;
    setMessage("");
    setIsError(false);
    try {
      await ApiDelete(`/schedules/${ScheduleId}`);
      LoadAll();
    } catch (Error) {
      setIsError(true);
      setMessage(Error instanceof Error ? Error.message : "Gagal menghapus jadwal");
    }
  }

  if (!Plant) return <p className="p-6 text-gray-500">Memuat data...</p>;

  return (
    <div className="p-6 space-y-6">
      <Link to={`/gardens/${Plant.Garden.Id}`} className="text-sm text-green-700 hover:underline">&larr; Kembali ke {Plant.Garden.Name}</Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{Plant.Name}</h1>
        <p className="text-gray-500">{Plant.Species || "Spesies belum diisi"}</p>
      </div>
      {Message && <p className={`text-sm ${IsError ? "text-red-600" : "text-green-700"}`}>{Message}</p>}

      <section className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="font-semibold text-gray-800">Jadwal Perawatan</h2>
        <form onSubmit={HandleAddSchedule} className="flex flex-wrap gap-3">
          <select className="border rounded-lg px-3 py-2" value={ScheduleType} onChange={(Event) => setScheduleType(Event.target.value)}>
            <option value="WATERING">Penyiraman</option>
            <option value="FERTILIZING">Pemupukan</option>
          </select>
          <input type="number" min={1} className="border rounded-lg px-3 py-2 w-32"
            value={FrequencyDays} onChange={(Event) => setFrequencyDays(Number(Event.target.value))} />
          <span className="self-center text-sm text-gray-500">hari sekali</span>
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg">Tambah Jadwal</button>
        </form>
        <div className="space-y-2">
          {Schedules.length === 0 && <p className="text-gray-400 text-sm">Belum ada jadwal</p>}
          {Schedules.map((Schedule) => (
            <div key={Schedule.Id} className="flex flex-wrap items-center justify-between border rounded-lg p-3 gap-2">
              <div>
                <p className="font-medium text-gray-800">
                  {Schedule.Type === "WATERING" ? "Penyiraman" : "Pemupukan"} — setiap {Schedule.FrequencyDays} hari
                </p>
                <p className="text-sm text-gray-500">Jadwal berikutnya: {new Date(Schedule.NextDueAt).toLocaleDateString("id-ID")}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => HandleMarkDone(Schedule.Id)} className="text-green-700 text-sm hover:underline">Tandai Sudah Dilakukan</button>
                <button onClick={() => HandleDeleteSchedule(Schedule.Id)} className="text-red-600 text-sm hover:underline">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
