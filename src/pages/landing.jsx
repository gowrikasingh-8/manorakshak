import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useLanguage } from "../LanguageContext";
import ParticleField from "../components/ParticleField";
import InfoCarousel from "../components/InfoCarousel";
import { useTheme } from "../ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Landing({ onContinue }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textSize, setTextSize] = useState("normal"); // "small" | "normal" | "large"
  const cycleTextSize = () => {
  setTextSize((s) => (s === "small" ? "normal" : s === "normal" ? "large" : "small"));
};

  const steps = [
  { title: t("step1Title"), desc: t("step1Desc") },
  { title: t("step2Title"), desc: t("step2Desc") },
  { title: t("step3Title"), desc: t("step3Desc") },
];

const channels = [
  { name: t("channel1Name"), desc: t("channel1Desc") },
  { name: t("channel2Name"), desc: t("channel2Desc") },
  { name: t("channel3Name"), desc: t("channel3Desc") },
  { name: t("channel4Name"), desc: t("channel4Desc") },
];

 const textSizeClass = textSize === "large" ? "text-lg" : textSize === "small" ? "text-sm" : "text-base";

  return (
    <div className={`min-h-screen bg-slate-900 text-white relative overflow-hidden ${textSizeClass}`}>
      {/* Subtle animated background (skipped if reduced motion is on) */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute w-72 h-72 bg-teal-500 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
        </div>
      )}
      {!reducedMotion && (
  <div className="absolute inset-0 pointer-events-none opacity-40">
    <ParticleField />
  </div>
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
          <option>తెలుగు</option>
          <option>मराठी</option>
          <option>ગુજરાતી</option>
          <option>ಕನ್ನಡ</option>
          <option>മലയാളം</option>
          <option>ਪੰਜਾਬੀ</option>
        </select>

        <button onClick={cycleTextSize} className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm hover:bg-slate-700">
          {textSize === "small" ? "A Normal" : textSize === "normal" ? "A+ Larger" : "A- Smaller"}
        </button>

        <button
          onClick={() => setReducedMotion((v) => !v)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm hover:bg-slate-700"
          aria-pressed={reducedMotion}
        >
          {reducedMotion ? "Motion: Off" : "Reduce Motion"}
        </button>
        <button onClick={toggleTheme} className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm hover:bg-slate-700 flex items-center gap-1">
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-16 pb-16">
        <h1 className="text-5xl font-bold text-teal-400 mb-4">{t("heroTitle")}</h1>
        <p className="text-slate-300 mb-8">{t("heroSubtitle")}</p>
        <Button onClick={onContinue}>{t("loginContinue")}</Button>
      </section>
      
      <section className="relative z-10 px-6 pb-16">
        <InfoCarousel />
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