import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Phone, Sparkles } from "lucide-react";
import Card from "./Card";

const slides = [
  { type: "quote", icon: Heart, text: "Healing is not linear, and every small step forward counts." },
  { type: "helpline", icon: Phone, text: "KIRAN Mental Health Helpline: 1800-599-0019 — free, confidential, available 24/7 across India." },
  { type: "feature", icon: Sparkles, text: "Every support signal on this platform comes with a clear explanation — never a diagnosis, always a next step." },
  { type: "quote", icon: Heart, text: "You don't have to carry this alone. Support is always within reach." },
  { type: "feature", icon: Sparkles, text: "Available in 10 Indian languages, so support speaks your language." },
  { type: "helpline", icon: Phone, text: "In immediate danger? Dial 112 for India's national emergency helpline." },
];

const typeLabel = {
  quote: "A gentle reminder",
  helpline: "Helpline",
  feature: "About this platform",
};

export default function InfoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goTo = (i) => setIndex(i);

  const slide = slides[index];
  const Icon = slide.icon;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative flex items-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous"
          className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-teal-600 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-teal-400" />
                  <span className="text-xs uppercase tracking-wide text-teal-400 font-medium">
                    {typeLabel[slide.type]}
                  </span>
                </div>
                <p className="text-slate-200 text-sm">{slide.text}</p>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          aria-label="Next"
          className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-teal-600 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* DOT INDICATORS */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-teal-400" : "w-1.5 bg-slate-600 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}