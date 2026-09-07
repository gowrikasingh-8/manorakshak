import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

const dataUsePoints = [
  { title: "What we collect", text: "Your check-in responses, mood/stress indicators, and preferred contact details — nothing beyond what you choose to share." },
  { title: "Who can see it", text: "Only authorized counsellors and staff directly assigned to your case. Never shared publicly or with unrelated parties." },
  { title: "How it's used", text: "To understand changes in your well-being over time and connect you with appropriate human support — never to make automated decisions about you." },
  { title: "Your control", text: "You can change these preferences anytime from your Profile page, and can withdraw consent for future check-ins at any point." },
];

export default function ConsentPage({ onConsent }) {
  const [agreed, setAgreed] = useState(false);
  const [language, setLanguage] = useState("English");
  const [contactPref, setContactPref] = useState("app");
  const [supportPref, setSupportPref] = useState("counselling");
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleContinue = () => {
    if (!agreed) return;
    onConsent?.();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">Before We Begin</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            This platform supports you over time through periodic, optional check-ins.
            Before we continue, please review how your information is handled.
          </p>
        </div>

        {/* CONSENT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <p className="text-teal-400 text-xs uppercase font-medium mb-1">Purpose</p>
            <p className="text-slate-300 text-sm">
              To notice changes in your well-being early and connect you with real human support.
            </p>
          </Card>
          <Card>
            <p className="text-teal-400 text-xs uppercase font-medium mb-1">Not a Diagnosis</p>
            <p className="text-slate-300 text-sm">
              Nothing here is a medical or clinical diagnosis — only a support signal for you and your care team.
            </p>
          </Card>
        </div>

        {/* DATA USE ACCORDION */}
        <Card className="mb-6">
          <button
            onClick={() => setAccordionOpen((v) => !v)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-white">How your data is used</span>
            <span className="text-teal-400 text-sm">{accordionOpen ? "Hide" : "Show details"}</span>
          </button>
          {accordionOpen && (
            <div className="mt-4 space-y-4 border-t border-slate-700 pt-4">
              {dataUsePoints.map((point, i) => (
                <div key={i}>
                  <p className="text-white text-sm font-medium mb-1">{point.title}</p>
                  <p className="text-slate-400 text-sm">{point.text}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* PREFERENCES */}
        <Card className="mb-6">
          <p className="font-medium text-white mb-4">Your preferences</p>

          <div className="mb-4">
            <label className="text-sm text-slate-400 block mb-1">Preferred language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
            >
              <option>English</option>
              <option>हिंदी</option>
              <option>தமிழ்</option>
              <option>বাংলা</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Optional — you can change this anytime.</p>
          </div>

          <div className="mb-4">
            <label className="text-sm text-slate-400 block mb-1">Preferred contact method</label>
            <div className="flex gap-2 flex-wrap">
              {["app", "sms", "call"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setContactPref(opt)}
                  className={`px-3 py-1.5 rounded-md text-sm border ${
                    contactPref === opt
                      ? "bg-teal-600 border-teal-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  {opt === "app" ? "In-app" : opt === "sms" ? "SMS" : "Phone call"}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">Optional — you can change this anytime.</p>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Support preference</label>
            <div className="flex gap-2 flex-wrap">
              {["counselling", "legal", "medical", "unsure"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSupportPref(opt)}
                  className={`px-3 py-1.5 rounded-md text-sm border ${
                    supportPref === opt
                      ? "bg-teal-600 border-teal-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  {opt === "unsure" ? "Not sure yet" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">Optional — helps us tailor initial suggestions.</p>
          </div>
        </Card>

        {/* CONSENT CHECKBOX */}
        <Card className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-teal-500"
            />
            <span className="text-sm text-slate-300">
              I understand how my information will be used, and I consent to periodic check-ins
              as described above. <span className="text-slate-500">(Required to continue)</span>
            </span>
          </label>
        </Card>

        <div className="flex justify-center">
          <Button onClick={handleContinue} disabled={!agreed}>
            Continue
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          You can review or change your consent anytime from your Profile page.
        </p>
      </div>
    </div>
  );
}