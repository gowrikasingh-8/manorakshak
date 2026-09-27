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

// Pages
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
import TrustedPersonDashboard from "./pages/TrustedPersonDashboard";
import TrustedPersonCounsellorDetails from "./pages/TrustedPersonCounsellorDetails";
import TrustedPersonNotifications from "./pages/TrustedPersonNotifications";
import { Sun, Moon, Bell } from "lucide-react";

// 1. Victim / Individual Seeking Support Links
const victimLinks = [
  { to: "/dashboard", label: "My Dashboard" },
  { to: "/consent", label: "Consent" },
  { to: "/checkin", label: "Check-in" },
  { to: "/chat", label: "Chat Support" },
  { to: "/support", label: "Support Hub" },
  { to: "/result", label: "My Result" },
  { to: "/trends", label: "My Trends" },
  { to: "/library", label: "Resource Library" },
  { to: "/profile", label: "Profile & Privacy" },
];

// 2. Trusted Person (Family or Friend) Links — role key stays "family" internally
const trustedPersonLinks = [
  { to: "/trusted-dashboard", label: "Overview" },
  { to: "/trends", label: "Their Trends" },
  { to: "/support", label: "Support Hub" },
  { to: "/trusted-counsellor", label: "Counsellor" },
  { to: "/library", label: "Guidance Library" },
  { to: "/trusted-notifications", label: "Updates & Alerts" },
  { to: "/profile", label: "Account & Preferences" },
];

// 3. Counsellor Links (Day-to-day Case Work)
const counsellorLinks = [
  { to: "/counsellor", label: "Counsellor Dashboard" },
  { to: "/alerts", label: "Alerts & Escalations" },
  { to: "/escalate", label: "Escalation Workflow" },
  { to: "/case-detail", label: "Case Detail" },
  { to: "/insights", label: "AI Insight Center" },
  { to: "/referrals", label: "Referral Tracking" },
];

// 4. Admin / DM Links (Oversight & Governance)
const adminLinks = [
  { to: "/national", label: "National Dashboard" },
  { to: "/assign", label: "Case Assignment Workspace" },
  { to: "/reports", label: "Reports & Analytics" },
  { to: "/system", label: "System & Integration Status" },
  { to: "/audit", label: "Audit & Activity Timeline" },
];

function AppRoutes({ loggedIn, role, hasConsented, onConsent, onLogin, onLogout, menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  if (location.pathname === "/quick-exit") {
    return <QuickExitPage />;
  }

  const handleLogin = (selectedRole) => {
    onLogin(selectedRole);
    if (selectedRole === "admin") navigate("/national");
    else if (selectedRole === "counsellor") navigate("/counsellor");
    else if (selectedRole === "family") navigate("/trusted-dashboard");
    else navigate("/dashboard");
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

  if (role === "victim" && !hasConsented && location.pathname !== "/consent") {
    return <Navigate to="/consent" replace />;
  }

  const activeLinks =
    role === "admin"
      ? adminLinks
      : role === "counsellor"
      ? counsellorLinks
      : role === "family"
      ? trustedPersonLinks
      : victimLinks;

  const defaultRedirect =
    role === "admin"
      ? "/national"
      : role === "counsellor"
      ? "/counsellor"
      : role === "family"
      ? "/trusted-dashboard"
      : "/dashboard";

  const portalLabel =
    role === "admin"
      ? "Admin Governance"
      : role === "counsellor"
      ? "Counsellor Portal"
      : role === "family"
      ? "Trusted Circle"
      : "Support Space";

  const sidebarHeading =
    role === "admin"
      ? "🏛️ Admin Governance"
      : role === "counsellor"
      ? "🧑‍⚕️ Counsellor Workspace"
      : role === "family"
      ? "🫂 Trusted Circle"
      : "🌱 Personal Workspace";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <TopProgressBar />

      {/* TOP HEADER BAR */}
      <div className="bg-teal-600 border-b border-teal-700 px-4 py-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="flex flex-col gap-1.5 p-2">
            <span className="w-6 h-0.5 bg-white block"></span>
            <span className="w-6 h-0.5 bg-white block"></span>
            <span className="w-6 h-0.5 bg-white block"></span>
          </button>
          {(role === "victim" || role === "family") && (
            <button
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
              className="w-8 h-8 rounded-full bg-teal-800 border-2 border-teal-300 flex items-center justify-center text-white text-xs font-semibold hover:border-white transition-colors"
            >
              👤
            </button>
          )}
        </div>

        <span className="absolute left-1/2 -translate-x-1/2 text-white font-semibold text-sm">
          Manorakshak · {portalLabel}
        </span>

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
          {role === "family" && (
            <button
              onClick={() => navigate("/trusted-notifications")}
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

      {/* SIDEBAR NAVIGATION */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-3 overflow-y-auto">
            <button onClick={() => setMenuOpen(false)} className="self-end text-slate-400 text-sm mb-2">
              ✕ Close
            </button>

            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
              {sidebarHeading}
            </span>

            {activeLinks.map((link) => (
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

      {/* PROTECTED ROUTE DEFINITIONS */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Victim Routes */}
          <Route path="/dashboard" element={<PageTransition>{role === "victim" ? <Dashboard /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/consent" element={<PageTransition>{role === "victim" ? <ConsentPage onConsent={onConsent} /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/chat" element={<PageTransition>{role === "victim" ? <Chat /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/checkin" element={<PageTransition>{role === "victim" ? <CheckIn /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/result" element={<PageTransition>{role === "victim" ? <DistressIndicator /> : <Navigate to={defaultRedirect} />}</PageTransition>} />

          {/* Shared: Trends — victim sees full notes, trusted person sees pattern only */}
          <Route
            path="/trends"
            element={
              <PageTransition>
                {(role === "victim" || role === "family") ? (
                  <TimelineTrends role={role} />
                ) : (
                  <Navigate to={defaultRedirect} />
                )}
              </PageTransition>
            }
          />

          {/* Shared Victim & Trusted Person Routes */}
          <Route path="/support" element={<PageTransition>{(role === "victim" || role === "family") ? <Support /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/library" element={<PageTransition>{(role === "victim" || role === "family") ? <Library /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/profile" element={<PageTransition>{(role === "victim" || role === "family") ? <ProfilePage onLogout={onLogout} /> : <Navigate to={defaultRedirect} />}</PageTransition>} />

          {/* Trusted Person Routes */}
          <Route path="/trusted-dashboard" element={<PageTransition>{role === "family" ? <TrustedPersonDashboard /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/trusted-counsellor" element={<PageTransition>{role === "family" ? <TrustedPersonCounsellorDetails /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/trusted-notifications" element={<PageTransition>{role === "family" ? <TrustedPersonNotifications /> : <Navigate to={defaultRedirect} />}</PageTransition>} />

          {/* Counsellor Routes */}
          <Route path="/counsellor" element={<PageTransition>{role === "counsellor" ? <CounsellorDashboard /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/alerts" element={<PageTransition>{role === "counsellor" ? <Alerts /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/escalate" element={<PageTransition>{role === "counsellor" ? <EscalationWorkflow /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/case-detail" element={<PageTransition>{role === "counsellor" ? <CaseDetail /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/insights" element={<PageTransition>{role === "counsellor" ? <AIInsightCenter /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/referrals" element={<PageTransition>{role === "counsellor" ? <ReferralTracking /> : <Navigate to={defaultRedirect} />}</PageTransition>} />

          {/* Admin / Governance Routes */}
          <Route path="/national" element={<PageTransition>{role === "admin" ? <NationalDashboard /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/assign" element={<PageTransition>{role === "admin" ? <CaseAssignment /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/reports" element={<PageTransition>{role === "admin" ? <ReportsPage /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/system" element={<PageTransition>{role === "admin" ? <SystemStatus /> : <Navigate to={defaultRedirect} />}</PageTransition>} />
          <Route path="/audit" element={<PageTransition>{role === "admin" ? <AuditTimelinePage /> : <Navigate to={defaultRedirect} />}</PageTransition>} />

          {/* Victim-only Notifications */}
          <Route path="/notifications" element={<PageTransition>{role === "victim" ? <NotificationsPage /> : <Navigate to={defaultRedirect} />}</PageTransition>} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to={defaultRedirect} />} />
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

  const handleConsent = () => setHasConsented(true);

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