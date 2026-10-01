import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiGet, ApiPost, ApiDelete } from "../api/client";
import type { Garden } from "@plant-garden-tracker/shared";

export function Gardens() {
  const [GardenList, setGardenList] = useState<Garden[]>([]);
  const [Name, setName] = useState("");
  const [Location, setLocation] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    LoadGardens();
  }, []);

  async function LoadGardens() {
    const Result = await ApiGet<Garden[]>("/gardens");
    setGardenList(Result);
  }

  async function HandleCreate(Event: React.FormEvent) {
    Event.preventDefault();
    setErrorMessage("");
    if (!Name.trim()) {
      setErrorMessage("Nama kebun wajib diisi");
      return;
    }
    try {
      await ApiPost("/gardens", { Name, Location });
      setName("");
      setLocation("");
      LoadGardens();
    } catch {
      setErrorMessage("Gagal menyimpan kebun");
    }
  }

  async function HandleDelete(Id: number) {
    if (!confirm("Hapus kebun ini beserta seluruh tanamannya?")) return;
    await ApiDelete(`/gardens/${Id}`);
    LoadGardens();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Kebun Saya</h1>

      <form onSubmit={HandleCreate} className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3">
        <input
          className="border rounded-lg px-3 py-2 flex-1 min-w-[160px]"
          placeholder="Nama kebun"
          value={Name}
          onChange={(Event) => setName(Event.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 flex-1 min-w-[160px]"
          placeholder="Lokasi (opsional)"
          value={Location}
          onChange={(Event) => setLocation(Event.target.value)}
        />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg">
          Tambah Kebun
        </button>
      </form>
      {ErrorMessage && <p className="text-red-600 text-sm">{ErrorMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GardenList.length === 0 && <p className="text-gray-400">Belum ada kebun</p>}
        {GardenList.map((Garden) => (
          <div key={Garden.Id} className="bg-white rounded-xl shadow p-4 space-y-2">
            <p className="font-semibold text-gray-800">{Garden.Name}</p>
            <p className="text-sm text-gray-500">{Garden.Location || "Lokasi belum diisi"}</p>
            <div className="flex justify-between items-center pt-2">
              <Link to={`/gardens/${Garden.Id}`} className="text-green-700 text-sm hover:underline">
                Lihat Tanaman
              </Link>
              <button
                onClick={() => HandleDelete(Garden.Id)}
                className="text-red-600 text-sm hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
