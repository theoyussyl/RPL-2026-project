import { Routes, Route, NavLink } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Gardens } from "./pages/Gardens";
import { GardenPlants } from "./pages/GardenPlants";
import { PlantDetail } from "./pages/PlantDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg">Plant Garden Tracker</span>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "underline" : "")}>Dashboard</NavLink>
            <NavLink to="/gardens" className={({ isActive }) => (isActive ? "underline" : "")}>Kebun Saya</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gardens" element={<Gardens />} />
          <Route path="/gardens/:GardenId" element={<GardenPlants />} />
          <Route path="/plants/:Id" element={<PlantDetail />} />
        </Routes>
      </main>
    </div>
  );
}
