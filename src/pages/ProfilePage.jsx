import { useState } from "react";

const consentHistory = [
  { label: "Consented to periodic check-ins", date: "12 Aug 2026" },
  { label: "Updated data-sharing preference", date: "03 Jul 2026" },
  { label: "Initial consent given at onboarding", date: "18 Jun 2026" },
];

function Toggle({ on, onClick, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full border-0 p-0 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
        on ? "bg-teal-400" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-150 ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Row({ icon, title, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-800 last:border-b-0">
      <div className="flex gap-3">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center text-lg">
          {icon}
        </div>
        <div>
          <p className="font-medium m-0">{title}</p>
          {desc && <p className="text-sm text-slate-400 mt-0.5 mb-0">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
      <h2 className="text-base font-medium text-slate-200 flex items-center gap-2 mb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("Anonymous User");
  const [language, setLanguage] = useState("English");
  const [textSize, setTextSize] = useState("md");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [checkinReminders, setCheckinReminders] = useState(true);
  const [followupUpdates, setFollowupUpdates] = useState(true);
  const [confirmingSignout, setConfirmingSignout] = useState(false);

  const textSizeClass =
    textSize === "sm" ? "text-sm" : textSize === "lg" ? "text-lg" : "text-base";

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 font-sans ${textSizeClass} ${
        highContrast ? "contrast-125" : ""
      } ${reducedMotion ? "[&_*]:!transition-none [&_*]:!animate-none" : ""}`}
    >
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold m-0 mb-1">Profile &amp; privacy</h1>
        <p className="text-slate-400 mb-8">
          Manage your identity, language, accessibility and privacy settings.
        </p>

        {/* PROFILE */}
        <Section title="Profile">
          <Row icon="👤" title="Display name" desc="Shown to counsellors only">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </Row>
          <Row icon="🌐" title="Preferred language">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {["English", "Hindi", "Marathi", "Tamil", "Bengali", "Telugu"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Row>
        </Section>

        {/* ACCESSIBILITY */}
        <Section title="Accessibility">
          <Row icon="A" title="Text size" desc="Applies across the whole app">
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              {["sm", "md", "lg"].map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    textSize === size
                      ? "bg-teal-400 text-slate-950"
                      : "bg-transparent text-slate-400"
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </Row>
          <Row icon="◐" title="High contrast" desc="Increases contrast for readability">
            <Toggle
              on={highContrast}
              onClick={() => setHighContrast((v) => !v)}
              label="Toggle high contrast"
            />
          </Row>
          <Row icon="⚡" title="Reduced motion" desc="Turns off animations and transitions">
            <Toggle
              on={reducedMotion}
              onClick={() => setReducedMotion((v) => !v)}
              label="Toggle reduced motion"
            />
          </Row>
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications">
          <Row icon="🔔" title="Check-in reminders" desc="Get reminded when a check-in is due">
            <Toggle
              on={checkinReminders}
              onClick={() => setCheckinReminders((v) => !v)}
              label="Toggle check-in reminders"
            />
          </Row>
          <Row icon="🔔" title="Follow-up updates" desc="Get notified about support follow-ups">
            <Toggle
              on={followupUpdates}
              onClick={() => setFollowupUpdates((v) => !v)}
              label="Toggle follow-up updates"
            />
          </Row>
        </Section>

        {/* CONSENT HISTORY */}
        <Section title={<>🔒 Consent history</>}>
          <ul className="list-none m-0 p-0">
            {consentHistory.map((item) => (
              <li
                key={item.label}
                className="flex justify-between text-sm py-2 text-slate-300"
              >
                <span>
                  <span className="text-teal-400 mr-1.5">✓</span>
                  {item.label}
                </span>
                <span className="text-slate-500">{item.date}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* SIGN OUT */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          {!confirmingSignout ? (
            <button
              onClick={() => setConfirmingSignout(true)}
              className="w-full bg-transparent border-0 text-red-400 py-2.5 rounded-lg cursor-pointer text-sm hover:bg-red-900/25"
            >
              ← Sign out
            </button>
          ) : (
            <div className="flex justify-between items-center gap-3">
              <p className="m-0 text-sm text-slate-300">Sign out of this device?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmingSignout(false)}
                  className="border-0 rounded-lg px-3 py-1.5 text-sm cursor-pointer bg-transparent text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Signed out (demo only)");
                    setConfirmingSignout(false);
                  }}
                  className="border-0 rounded-lg px-3 py-1.5 text-sm cursor-pointer bg-red-400 text-white hover:bg-red-500"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}