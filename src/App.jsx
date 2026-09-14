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
import QuickExit from "./components/QuickExit";
import QuickExitPage from "./pages/QuickExitPage";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AuditTimelinePage from "./pages/AuditTimelinePage";
import EscalationWorkflow from "./pages/EscalationWorkflow";
import Library from "./pages/Library";
import ReferralTracking from "./pages/ReferralTracking";
import Dashboard from "./pages/Dashboard";
import NationalDashboard from "./pages/NationalDashboard";
import CounsellorDashboard from "./pages/counsellordashboard";
import CaseAssignment from "./pages/CaseAssignment";
import Chat from "./pages/Chat";
import ConsentPage from "./pages/ConsentPage";
import Support from "./pages/support";
import Alerts from "./pages/Alerts";
import DistressIndicator from "./pages/DistressIndicator";
import NotificationsPage from "./pages/NotificationsPage";
import ReportsPage from "./pages/ReportsPage";
import SystemStatus from "./pages/SystemStatus";
import TimelineTrends from "./pages/TimelineTrends";
import CheckIn from "./pages/CheckIn";
import ProfilePage from "./pages/ProfilePage";
import CaseDetail from "./pages/CaseDetail";
import AIInsightCenter from "./pages/AIInsightCenter";
import { Sun, Moon, Bell } from "lucide-react";

const victimLinks = [
  { to: "/dashboard", label: "My Dashboard" },
  { to: "/consent", label: "Consent" },
  { to: "/checkin", label: "Check-in" },
  { to: "/profile", label: "Profile & Privacy" },
  { to: "/chat", label: "Chat Support" },
  { to: "/support", label: "Support Hub" },
  { to: "/result", label: "My Result" },
  { to: "/trends", label: "My Trends" },
  { to: "/library", label: "Library" },
  { to: "/notifications", label: "Notifications" },
];

const staffLinks = [
  { to: "/counsellor", label: "Counsellor Dashboard" },
  { to: "/case-detail", label: "Case Detail" },
  { to: "/insights", label: "AI Insight Center" },
  { to: "/national", label: "National Dashboard" },
  { to: "/alerts", label: "Alerts" },
  { to: "/reports", label: "Reports" },
  { to: "/assign", label: "Case Assignment" },
  { to: "/escalate", label: "Escalation Workflow" },
  { to: "/audit", label: "Audit Timeline" },
  { to: "/referrals", label: "Referral Tracking" },
  { to: "/system", label: "System Status" },
];

function AppRoutes({ loggedIn, role, hasConsented, onConsent, onLogin, onLogout, menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Quick exit route — must be reachable regardless of login state
  if (location.pathname === "/quick-exit") {
    return <QuickExitPage />;
  }

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

  // Force Consent flow for victims — every login until they agree
  if (role === "victim" && !hasConsented && location.pathname !== "/consent") {
    return <Navigate to="/consent" replace />;
  }

  const links = role === "staff" ? staffLinks : victimLinks;

  return (
    <div className="min-h-screen bg-slate-900">
      <TopProgressBar />

      {/* TOP BAR */}
      <div className="bg-teal-600 border-b border-teal-700 px-4 py-3 flex items-center justify-between relative">
        {/* Left — hamburger + profile circle */}
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="flex flex-col gap-1.5 p-2">
            <span className="w-6 h-0.5 bg-white block"></span>
            <span className="w-6 h-0.5 bg-white block"></span>
            <span className="w-6 h-0.5 bg-white block"></span>
          </button>
          {role === "victim" && (
            <button
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
              className="w-8 h-8 rounded-full bg-teal-800 border-2 border-teal-300 flex items-center justify-center text-white text-xs font-semibold hover:border-white transition-colors"
            >
              👤
            </button>
          )}
        </div>

        {/* Center — title, absolutely positioned so it's always truly centered */}
        <span className="absolute left-1/2 -translate-x-1/2 text-white font-semibold text-sm">
        Manorakshak {role === "staff" ? "· Staff Portal" : "· Support Space"}
          </span>

        {/* Right — notifications (only for victims/users) + theme toggle + quick exit + logout grouped together */}
        <div className="flex items-center gap-2">
          {role === "victim" && (
            <button
              onClick={() => navigate("/notifications")}
              className="p-2 rounded-full hover:bg-teal-700 text-white"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-teal-700 text-white" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {role === "victim" && <QuickExit onLogout={onLogout} />}
          <button onClick={onLogout} className="text-teal-100 text-xs hover:text-white px-2 py-1">
            Logout
          </button>
        </div>
      </div>

      {/* SIDE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-4 overflow-y-auto">
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
          <Route path="/consent" element={<PageTransition>{role === "victim" ? <ConsentPage onConsent={onConsent} /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/chat" element={<PageTransition>{role === "victim" ? <Chat /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/support" element={<PageTransition>{role === "victim" ? <Support /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/result" element={<PageTransition>{role === "victim" ? <DistressIndicator /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/trends" element={<PageTransition>{role === "victim" ? <TimelineTrends /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/counsellor" element={<PageTransition>{role === "staff" ? <CounsellorDashboard /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/national" element={<PageTransition>{role === "staff" ? <NationalDashboard /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/alerts" element={<PageTransition>{role === "staff" ? <Alerts /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/reports" element={<PageTransition>{role === "staff" ? <ReportsPage /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/assign" element={<PageTransition>{role === "staff" ? <CaseAssignment /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/escalate" element={<PageTransition>{role === "staff" ? <EscalationWorkflow /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/audit" element={<PageTransition>{role === "staff" ? <AuditTimelinePage /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/referrals" element={<PageTransition>{role === "staff" ? <ReferralTracking /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/library" element={<PageTransition>{role === "victim" ? <Library /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/system" element={<PageTransition>{role === "staff" ? <SystemStatus /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
          <Route path="/checkin" element={<PageTransition>{role === "victim" ? <CheckIn /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/profile" element={<PageTransition>{role === "victim" ? <ProfilePage onLogout={onLogout} /> : <Navigate to="/counsellor" />}</PageTransition>} />
          <Route path="/case-detail" element={<PageTransition>{role === "staff" ? <CaseDetail /> : <Navigate to="/dashboard" />}</PageTransition>} />
          <Route path="/insights" element={<PageTransition>{role === "staff" ? <AIInsightCenter /> : <Navigate to="/dashboard" />}</PageTransition>} />
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
  const [hasConsented, setHasConsented] = useState(false);

  const handleConsent = () => {
    setHasConsented(true);
  };

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setLoggedIn(true);
    setHasConsented(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole(null);
    setMenuOpen(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes
            loggedIn={loggedIn}
            role={role}
            hasConsented={hasConsented}
            onConsent={handleConsent}
            onLogin={handleLogin}
            onLogout={handleLogout}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}