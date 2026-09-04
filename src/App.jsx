import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { LanguageProvider } from "./LanguageContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AuditTimelinePage from "./pages/AuditTimelinePage";
import EscalationWorkflow from "./pages/EscalationWorkflow";
import Library from "./pages/Library";
import ReferralTracking from "./pages/ReferralTracking";
import Dashboard from "./pages/Dashboard";
import NationalDashboard from "./pages/NationalDashboard";
import CounsellorDashboard from "./pages/counsellordashboard";
import Chat from "./pages/Chat";
import ConsentPage from "./pages/ConsentPage";
import Support from "./pages/Support";
import Alerts from "./pages/Alerts";
import DistressIndicator from "./pages/DistressIndicator";
import NotificationsPage from "./pages/NotificationsPage";
import ReportsPage from "./pages/ReportsPage";
import SystemStatus from "./pages/SystemStatus";
import TimelineTrends from "./pages/TimelineTrends";

const victimLinks = [
  { to: "/dashboard", label: "My Dashboard" },
  { to: "/consent", label: "Consent" },
  { to: "/chat", label: "Chat Support" },
  { to: "/support", label: "Support Hub" },
  { to: "/result", label: "My Result" },
  { to: "/trends", label: "My Trends" },
  { to: "/notifications", label: "Notifications" },
];

const staffLinks = [
  { to: "/counsellor", label: "Counsellor Dashboard" },
  { to: "/national", label: "National Dashboard" },
  { to: "/alerts", label: "Alerts" },
  { to: "/reports", label: "Reports" },
  { to: "/system", label: "System Status" },
  { to: "/notifications", label: "Notifications" },
];

function AppRoutes({ loggedIn, role, onLogin, onLogout, menuOpen, setMenuOpen }) {
  const navigate = useNavigate();

  const handleLogin = (selectedRole) => {
    onLogin(selectedRole);
    navigate(selectedRole === "staff" ? "/counsellor" : "/dashboard");
  };

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Landing onContinue={() => navigate("/login")} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const links = role === "staff" ? staffLinks : victimLinks;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* TOP BAR */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="flex flex-col gap-1.5 p-2">
          <span className="w-6 h-0.5 bg-white block"></span>
          <span className="w-6 h-0.5 bg-white block"></span>
          <span className="w-6 h-0.5 bg-white block"></span>
        </button>
        <span className="text-teal-400 font-semibold text-sm">
          {role === "staff" ? "Staff Portal" : "Support Space"}
        </span>
        <button onClick={onLogout} className="text-slate-400 text-xs hover:text-white">
          Logout
        </button>
      </div>

      {/* SIDE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-4">
            <button onClick={() => setMenuOpen(false)} className="self-end text-slate-400 text-sm mb-4">
              ✕ Close
            </button>
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="text-teal-400 hover:underline text-sm">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* APP ROUTES */}
      <Routes>
        <Route path="/dashboard" element={role === "victim" ? <Dashboard /> : <Navigate to="/counsellor" />} />
        <Route path="/consent" element={role === "victim" ? <ConsentPage /> : <Navigate to="/counsellor" />} />
        <Route path="/chat" element={role === "victim" ? <Chat /> : <Navigate to="/counsellor" />} />
        <Route path="/support" element={role === "victim" ? <Support /> : <Navigate to="/counsellor" />} />
        <Route path="/result" element={role === "victim" ? <DistressIndicator /> : <Navigate to="/counsellor" />} />
        <Route path="/trends" element={role === "victim" ? <TimelineTrends /> : <Navigate to="/counsellor" />} />

        <Route path="/counsellor" element={role === "staff" ? <CounsellorDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/national" element={role === "staff" ? <NationalDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/alerts" element={role === "staff" ? <Alerts /> : <Navigate to="/dashboard" />} />
        <Route path="/reports" element={role === "staff" ? <ReportsPage /> : <Navigate to="/dashboard" />} />
        <Route path="/escalate" element={role === "staff" ? <EscalationWorkflow /> : <Navigate to="/dashboard" />} />
        <Route path="/audit" element={role === "staff" ? <AuditTimelinePage /> : <Navigate to="/dashboard" />} />
        <Route path="/referrals" element={role === "staff" ? <ReferralTracking /> : <Navigate to="/dashboard" />} />
        <Route path="/library" element={role === "victim" ? <Library /> : <Navigate to="/counsellor" />} />
        <Route path="/system" element={role === "staff" ? <SystemStatus /> : <Navigate to="/dashboard" />} />

        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="*" element={<Navigate to={role === "staff" ? "/counsellor" : "/dashboard"} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole(null);
    setMenuOpen(false);
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes
          loggedIn={loggedIn}
          role={role}
          onLogin={handleLogin}
          onLogout={handleLogout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </BrowserRouter>
    </LanguageProvider>
  );
}