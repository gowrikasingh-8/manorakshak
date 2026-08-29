import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NationalDashboard from "./pages/NationalDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex gap-6 text-sm">
        <Link to="/" className="text-teal-400 hover:underline">Landing</Link>
        <Link to="/dashboard" className="text-teal-400 hover:underline">Dashboard</Link>
        <Link to="/national" className="text-teal-400 hover:underline">National</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/national" element={<NationalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}