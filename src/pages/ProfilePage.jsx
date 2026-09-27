import { useState } from "react";

const consentHistory = [
  { label: "Consented to periodic check-ins", date: "12 Aug 2026" },
  { label: "Updated data-sharing preference", date: "03 Jul 2026" },
  { label: "Initial consent given at onboarding", date: "18 Jun 2026" },
];

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
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

export default function ProfilePage({
  userConsentData,
  onUpdateConsent,
  onLogout,
}) {
  // --- Profile & Preferences State ---
  const [displayName, setDisplayName] = useState("Anonymous User");
  const [language, setLanguage] = useState(
    userConsentData?.language || "English"
  );
  const [textSize, setTextSize] = useState("md");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [checkinReminders, setCheckinReminders] = useState(true);
  const [followupUpdates, setFollowupUpdates] = useState(true);
  const [confirmingSignout, setConfirmingSignout] = useState(false);

  // --- Trusted Contact / Relative State ---
  const [trustedRelative, setTrustedRelative] = useState(
    userConsentData?.trustedRelative || null
  );
  const [isEditingRelative, setIsEditingRelative] = useState(false);
  const [relativeForm, setRelativeForm] = useState({
    name: trustedRelative?.name || "",
    relationship: trustedRelative?.relationship || "",
    contactMethod: trustedRelative?.contactMethod || "phone",
    contactInfo: trustedRelative?.contactInfo || "",
  });

  // --- Handlers ---
  const handleSaveRelative = () => {
    const updatedRelative = { ...relativeForm };
    setTrustedRelative(updatedRelative);
    setIsEditingRelative(false);
    onUpdateConsent?.({
      ...userConsentData,
      language,
      trustedRelative: updatedRelative,
    });
  };

  const handleRemoveRelative = () => {
    setTrustedRelative(null);
    setRelativeForm({
      name: "",
      relationship: "",
      contactMethod: "phone",
      contactInfo: "",
    });
    setIsEditingRelative(false);
    onUpdateConsent?.({
      ...userConsentData,
      language,
      trustedRelative: null,
    });
  };

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
          Manage your identity, language, accessibility, trusted contacts, and privacy settings.
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
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                onUpdateConsent?.({
                  ...userConsentData,
                  language: newLang,
                });
              }}
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {[
                "English",
                "Hindi",
                "Marathi",
                "Tamil",
                "Bengali",
                "Telugu",
              ].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Row>
        </Section>

        {/* TRUSTED CONTACT / RELATIVE */}
        <Section title="🤝 Trusted Contact Access">
          <p className="text-sm text-slate-400 mb-4">
            Manage or revoke access for a trusted relative or contact who receives safety notifications.
          </p>

          {!trustedRelative && !isEditingRelative ? (
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center space-y-3">
              <p className="text-sm text-slate-400 m-0">No trusted contact is currently linked.</p>
              <button
                type="button"
                onClick={() => setIsEditingRelative(true)}
                className="px-3.5 py-1.5 text-xs font-medium text-teal-400 border border-teal-500/40 hover:border-teal-400 bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                + Add Trusted Contact
              </button>
            </div>
          ) : isEditingRelative ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Sharma"
                  value={relativeForm.name}
                  onChange={(e) =>
                    setRelativeForm({ ...relativeForm, name: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Sister, Friend, Parent"
                  value={relativeForm.relationship}
                  onChange={(e) =>
                    setRelativeForm({ ...relativeForm, relationship: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact Method</label>
                <div className="flex gap-2 mb-2">
                  {[
                    { id: "phone", label: "Phone / SMS" },
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "email", label: "Email" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setRelativeForm({ ...relativeForm, contactMethod: m.id })
                      }
                      className={`px-2.5 py-1 rounded-md text-xs border cursor-pointer transition-colors ${
                        relativeForm.contactMethod === m.id
                          ? "bg-teal-500/20 border-teal-400 text-teal-300 font-medium"
                          : "bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <input
                  type={relativeForm.contactMethod === "email" ? "email" : "tel"}
                  placeholder={
                    relativeForm.contactMethod === "email"
                      ? "relative@example.com"
                      : "+91 98765 43210"
                  }
                  value={relativeForm.contactInfo}
                  onChange={(e) =>
                    setRelativeForm({ ...relativeForm, contactInfo: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingRelative(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRelative}
                  className="px-4 py-1.5 text-xs font-medium bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-lg transition-colors cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Active Access
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 m-0">Name</p>
                  <p className="font-medium text-slate-100 m-0">{trustedRelative.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 m-0">Relationship</p>
                  <p className="font-medium text-slate-100 m-0">{trustedRelative.relationship || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 m-0">Method</p>
                  <p className="font-medium text-slate-100 capitalize m-0">{trustedRelative.contactMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 m-0">Contact Info</p>
                  <p className="font-medium text-slate-100 m-0">{trustedRelative.contactInfo || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-700/60 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingRelative(true)}
                  className="text-xs text-teal-400 hover:underline font-medium cursor-pointer"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={handleRemoveRelative}
                  className="text-xs text-rose-400 hover:underline font-medium cursor-pointer"
                >
                  Remove Access
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* ACCESSIBILITY */}
        <Section title="Accessibility">
          <Row icon="A" title="Text size" desc="Applies across the whole app">
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              {["sm", "md", "lg"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTextSize(size)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
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
              type="button"
              onClick={() => setConfirmingSignout(true)}
              className="w-full bg-transparent border-0 text-red-400 py-2.5 rounded-lg cursor-pointer text-sm hover:bg-red-900/25 transition-colors"
            >
              ← Sign out
            </button>
          ) : (
            <div className="flex justify-between items-center gap-3">
              <p className="m-0 text-sm text-slate-300">Sign out of this device?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingSignout(false)}
                  className="border-0 rounded-lg px-3 py-1.5 text-sm cursor-pointer bg-transparent text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingSignout(false);
                    onLogout?.();
                  }}
                  className="border-0 rounded-lg px-3 py-1.5 text-sm cursor-pointer bg-red-400 text-white hover:bg-red-500 transition-colors"
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