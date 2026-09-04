import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useLanguage } from "../LanguageContext";

export default function Landing({ onContinue }) {
  const { language, setLanguage, t } = useLanguage();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textLarge, setTextLarge] = useState(false);

  const steps = [
    { title: "Check In", desc: "A few quick questions, text or voice, whenever suits you." },
    { title: "We Listen", desc: "Your responses are reviewed with care and full privacy." },
    { title: "Get Support", desc: "Receive the right help, from counselling to legal aid." },
  ];

  const channels = [
    { name: "Chatbot", desc: "Talk anytime through our support chat." },
    { name: "SMS", desc: "Prefer texting? Check in over SMS." },
    { name: "Mobile / Web App", desc: "Full experience on any device." },
    { name: "Helpline", desc: "Speak to a real person when you need to." },
  ];

  const textSizeClass = textLarge ? "text-lg" : "text-base";

  return (
    <div className={`min-h-screen bg-slate-900 text-white relative overflow-hidden ${textSizeClass}`}>
      {/* Subtle animated background (skipped if reduced motion is on) */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute w-72 h-72 bg-teal-500 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
        </div>
      )}
      {reducedMotion && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
      )}

      {/* Top bar: language + accessibility controls */}
      <div className="relative z-10 flex flex-wrap justify-end items-center gap-3 px-6 pt-6">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm"
          aria-label="Select language"
        >
          <option>English</option>
          <option>हिंदी</option>
          <option>தமிழ்</option>
          <option>বাংলা</option>
        </select>

        <button
          onClick={() => setTextLarge((v) => !v)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm hover:bg-slate-700"
          aria-pressed={textLarge}
        >
          {textLarge ? "A- Normal Text" : "A+ Larger Text"}
        </button>

        <button
          onClick={() => setReducedMotion((v) => !v)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm hover:bg-slate-700"
          aria-pressed={reducedMotion}
        >
          {reducedMotion ? "Motion: Off" : "Reduce Motion"}
        </button>
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-16 pb-16">
        <h1 className="text-5xl font-bold text-teal-400 mb-4">{t("heroTitle")}</h1>
        <p className="text-slate-300 mb-8">{t("heroSubtitle")}</p>
        <Button onClick={onContinue}>{t("loginContinue")}</Button>
      </section>

      {/* Problem -> Solution */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-slate-400 text-sm uppercase mb-2">{t("problemTitle")}</h3>
          <p className="text-slate-200">{t("problemText")}</p>
        </Card>
        <Card>
          <h3 className="text-teal-400 text-sm uppercase mb-2">{t("solutionTitle")}</h3>
          <p className="text-slate-200">{t("solutionText")}</p>
        </Card>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">{t("howItWorks")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card key={i}>
              <div className="text-teal-400 text-3xl font-bold mb-2">{i + 1}</div>
              <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
              <p className="text-slate-300 text-sm">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Support channels */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">{t("reachUs")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {channels.map((ch, i) => (
            <Card key={i}>
              <h3 className="text-teal-400 font-semibold mb-1">{ch.name}</h3>
              <p className="text-slate-300 text-sm">{ch.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Privacy strip */}
      <section className="relative z-10 bg-slate-800/60 border-t border-slate-700 py-8 px-6 text-center">
        <p className="text-slate-300 text-sm max-w-2xl mx-auto">{t("privacyText")}</p>
      </section>
    </div>
  );
}