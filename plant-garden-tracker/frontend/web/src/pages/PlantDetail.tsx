import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiGet, ApiPost, ApiUpload, ApiDelete } from "../api/client";
import type { CareSchedule, GrowthLog } from "@plant-garden-tracker/shared";

interface PlantDetailData {
  Id: number;
  Name: string;
  Species?: string | null;
  Garden: { Id: number; Name: string };
  Schedules: CareSchedule[];
  GrowthLogs: GrowthLog[];
}

const ConditionLabel: Record<string, string> = {
  HEALTHY: "Sehat",
  WILTED: "Layu",
  FLOWERING: "Berbunga",
  FRUITING: "Berbuah",
  DISEASED: "Sakit",
};

export function PlantDetail() {
  const { Id } = useParams();
  const [Plant, setPlant] = useState<PlantDetailData | null>(null);
  const [ScheduleType, setScheduleType] = useState("WATERING");
  const [FrequencyDays, setFrequencyDays] = useState(3);
  const [Note, setNote] = useState("");
  const [Condition, setCondition] = useState("HEALTHY");
  const [Photo, setPhoto] = useState<File | null>(null);
  const [Message, setMessage] = useState("");

  useEffect(() => {
    LoadPlant();
  }, [Id]);

  async function LoadPlant() {
    const Result = await ApiGet<PlantDetailData>(`/plants/${Id}`);
    setPlant(Result);
  }

  async function HandleAddSchedule(Event: React.FormEvent) {
    Event.preventDefault();
    await ApiPost(`/plants/${Id}/schedules`, { Type: ScheduleType, FrequencyDays });
    LoadPlant();
  }

  async function HandleMarkDone(ScheduleId: number) {
    const Result = await ApiPost<{ Message: string }>(`/schedules/${ScheduleId}/done`, {});
    setMessage(Result.Message);
    LoadPlant();
  }

  async function HandleDeleteSchedule(ScheduleId: number) {
    if (!confirm("Hapus jadwal ini?")) return;
    await ApiDelete(`/schedules/${ScheduleId}`);
    LoadPlant();
  }

  async function HandleUploadGrowthLog(Event: React.FormEvent) {
    Event.preventDefault();
    if (!Photo) {
      setMessage("Foto wajib diunggah");
      return;
    }
    const FormData_ = new FormData();
    FormData_.append("Photo", Photo);
    FormData_.append("Note", Note);
    FormData_.append("Condition", Condition);
    await ApiUpload(`/growth-logs/${Id}`, FormData_);
    setNote("");
    setPhoto(null);
    LoadPlant();
  }

  async function HandleDeleteGrowthLog(GrowthLogId: number) {
    if (!confirm("Hapus catatan pertumbuhan ini?")) return;
    await ApiDelete(`/growth-logs/${GrowthLogId}`);
    LoadPlant();
  }

  if (!Plant) return <p className="p-6 text-gray-500">Memuat data...</p>;

  return (
    <div className="p-6 space-y-8">
      <Link to={`/gardens/${Plant.Garden.Id}`} className="text-sm text-green-700 hover:underline">
        &larr; Kembali ke {Plant.Garden.Name}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">{Plant.Name}</h1>
        <p className="text-gray-500">{Plant.Species || "Spesies belum diisi"}</p>
      </div>

      {Message && <p className="text-green-700 text-sm">{Message}</p>}

      <section className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="font-semibold text-gray-800">Jadwal Perawatan</h2>

        <form onSubmit={HandleAddSchedule} className="flex flex-wrap gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={ScheduleType}
            onChange={(Event) => setScheduleType(Event.target.value)}
          >
            <option value="WATERING">Penyiraman</option>
            <option value="FERTILIZING">Pemupukan</option>
          </select>
          <input
            type="number"
            min={1}
            className="border rounded-lg px-3 py-2 w-32"
            value={FrequencyDays}
            onChange={(Event) => setFrequencyDays(Number(Event.target.value))}
          />
          <span className="self-center text-sm text-gray-500">hari sekali</span>
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg">
            Tambah Jadwal
          </button>
        </form>

        <div className="space-y-2">
          {Plant.Schedules.length === 0 && <p className="text-gray-400 text-sm">Belum ada jadwal</p>}
          {Plant.Schedules.map((Schedule) => (
            <div
              key={Schedule.Id}
              className="flex flex-wrap items-center justify-between border rounded-lg p-3 gap-2"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {Schedule.Type === "WATERING" ? "Penyiraman" : "Pemupukan"} — setiap{" "}
                  {Schedule.FrequencyDays} hari
                </p>
                <p className="text-sm text-gray-500">
                  Jadwal berikutnya: {new Date(Schedule.NextDueAt).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => HandleMarkDone(Schedule.Id)}
                  className="text-green-700 text-sm hover:underline"
                >
                  Tandai Sudah Dilakukan
                </button>
                <button
                  onClick={() => HandleDeleteSchedule(Schedule.Id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="font-semibold text-gray-800">Catatan Pertumbuhan</h2>

        <form onSubmit={HandleUploadGrowthLog} className="flex flex-wrap gap-3 items-start">
          <input
            type="file"
            accept="image/*"
            onChange={(Event) => setPhoto(Event.target.files?.[0] ?? null)}
            className="border rounded-lg px-3 py-2"
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={Condition}
            onChange={(Event) => setCondition(Event.target.value)}
          >
            {Object.entries(ConditionLabel).map(([Value, Label]) => (
              <option key={Value} value={Value}>
                {Label}
              </option>
            ))}
          </select>
          <input
            className="border rounded-lg px-3 py-2 flex-1 min-w-[160px]"
            placeholder="Catatan (opsional)"
            value={Note}
            onChange={(Event) => setNote(Event.target.value)}
          />
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg">
            Unggah
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Plant.GrowthLogs.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full">Belum ada catatan pertumbuhan</p>
          )}
          {Plant.GrowthLogs.map((Log) => (
            <div key={Log.Id} className="border rounded-lg overflow-hidden">
              <img
                src={`http://localhost:4000${Log.PhotoUrl}`}
                alt={Log.Note ?? "Foto tanaman"}
                className="w-full h-32 object-cover"
              />
              <div className="p-2 space-y-1">
                <p className="text-xs text-gray-500">
                  {new Date(Log.LoggedAt).toLocaleDateString("id-ID")}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {ConditionLabel[Log.Condition] ?? Log.Condition}
                </p>
                {Log.Note && <p className="text-xs text-gray-500">{Log.Note}</p>}
                <button
                  onClick={() => HandleDeleteGrowthLog(Log.Id)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
