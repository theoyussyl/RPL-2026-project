import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiGet, ApiPost } from "../api/client";
import type { Plant } from "@plant-garden-tracker/shared";

export function GardenPlants() {
  const { GardenId } = useParams();
  const [PlantList, setPlantList] = useState<Plant[]>([]);
  const [Name, setName] = useState("");
  const [Species, setSpecies] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  useEffect(() => { LoadPlants(); }, [GardenId]);

  async function LoadPlants() {
    const Result = await ApiGet<Plant[]>(`/gardens/${GardenId}/plants`);
    setPlantList(Result);
  }

  async function HandleCreate(Event: React.FormEvent) {
    Event.preventDefault();
    setErrorMessage("");
    try {
      await ApiPost(`/gardens/${GardenId}/plants`, { Name, Species });
      setName(""); setSpecies("");
      LoadPlants();
    } catch {
      setErrorMessage("Nama tanaman wajib diisi");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Link to="/gardens" className="text-sm text-green-700 hover:underline">&larr; Kembali ke Kebun</Link>
      <h1 className="text-2xl font-bold text-gray-800">Daftar Tanaman</h1>
      <form onSubmit={HandleCreate} className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3">
        <input className="border rounded-lg px-3 py-2 flex-1 min-w-[160px]" placeholder="Nama tanaman"
          value={Name} onChange={(Event) => setName(Event.target.value)} />
        <input className="border rounded-lg px-3 py-2 flex-1 min-w-[160px]" placeholder="Spesies (opsional)"
          value={Species} onChange={(Event) => setSpecies(Event.target.value)} />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg">Tambah Tanaman</button>
      </form>
      {ErrorMessage && <p className="text-red-600 text-sm">{ErrorMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PlantList.length === 0 && <p className="text-gray-400">Belum ada tanaman</p>}
        {PlantList.map((Plant) => (
          <Link key={Plant.Id} to={`/plants/${Plant.Id}`} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
            <p className="font-semibold text-gray-800">{Plant.Name}</p>
            <p className="text-sm text-gray-500">{Plant.Species || "Spesies belum diisi"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
