import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import TopProgressBar from "./components/TopProgressBar";

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
  const location = useLocation();

  const handleLogin = (selectedRole) => {
    onLogin(selectedRole);
    navigate(selectedRole === "staff" ? "/counsellor" : "/dashboard");
  };

  if (!loggedIn) {
    return (
      <>
        <TopProgressBar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Landing onContinue={() => navigate("/login")} /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login onLogin={handleLogin} /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </>
    );
  }

  const links = role === "staff" ? staffLinks : victimLinks;

  return (
    <div className="min-h-screen bg-slate-900">
      <TopProgressBar />

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
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-teal-500/10 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.3)]"
                    : "text-slate-300 hover:text-teal-400 hover:bg-slate-700/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* APP ROUTES */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/dashboard" element={<PageTransition>{role === "victim" ? <Dashboard /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/consent" element={<PageTransition>{role === "victim" ? <ConsentPage /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/chat" element={<PageTransition>{role === "victim" ? <Chat /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/support" element={<PageTransition>{role === "victim" ? <Support /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/result" element={<PageTransition>{role === "victim" ? <DistressIndicator /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/trends" element={<PageTransition>{role === "victim" ? <TimelineTrends /> : <Navigate to="/counsellor" />}</PageTransition>} />

          <Route path="/counsellor" element={<PageTransition>{role === "staff" ? <CounsellorDashboard /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/national" element={<PageTransition>{role === "staff" ? <NationalDashboard /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/alerts" element={<PageTransition>{role === "staff" ? <Alerts /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/reports" element={<PageTransition>{role === "staff" ? <ReportsPage /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/escalate" element={<PageTransition>{role === "staff" ? <EscalationWorkflow /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/audit" element={<PageTransition>{role === "staff" ? <AuditTimelinePage /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/referrals" element={<PageTransition>{role === "staff" ? <ReferralTracking /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/library" element={<PageTransition>{role === "victim" ? <Library /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/system" element={<PageTransition>{role === "staff" ? <SystemStatus /> : <Navigate to="/dashboard" />}</PageTransition>} />

          <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />

          <Route path="*" element={<Navigate to={role === "staff" ? "/counsellor" : "/dashboard"} />} />
        </Routes>
      </AnimatePresence>
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