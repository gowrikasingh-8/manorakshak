import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import ParticleField from "../components/ParticleField";
import InfoCarousel from "../components/InfoCarousel";
import FadeIn from "../components/FadeIn";
import { useTheme } from "../ThemeContext";

// ── All translations live here — no LanguageContext needed ─────────────────
const TRANSLATIONS = {
  English: {
    heroTitle: "You Are Not Alone. We Are Here to Support You.",
    heroSubtitle:
      "A calm, private space that understands your situation over time and connects you with the right help — never a diagnosis, always a next step.",
    loginContinue: "Login / Continue",
    problemTitle: "The Problem",
    problemText:
      "Victims and complainants often face prolonged psychological distress during investigations and legal processes, with no continuous well-being support available.",
    solutionTitle: "Our Solution",
    solutionText:
      "A continuous, compassionate monitoring system that tracks well-being over time, surfaces early warning signs, and connects people with real human support.",
    howItWorks: "How It Works",
    reachUs: "Reach Us However You're Comfortable",
    privacyText:
      "Your privacy is paramount. All check-ins are confidential, encrypted, and shared only with authorised support staff.",
    steps: [
      { title: "Check In", desc: "A few quick questions, text or voice, whenever suits you." },
      { title: "We Listen", desc: "Your responses are reviewed with care and full privacy." },
      { title: "Get Support", desc: "Receive the right help, from counselling to legal aid." },
    ],
    channels: [
      { name: "Chatbot", desc: "Talk anytime through our support chat." },
      { name: "SMS", desc: "Prefer texting? Check in over SMS." },
      { name: "Mobile / Web App", desc: "Full experience on any device." },
      { name: "Helpline", desc: "Speak to a real person when you need to." },
    ],
    motionOff: "Motion: Off",
    reduceMotion: "Reduce Motion",
  },
  हिंदी: {
    heroTitle: "आप अकेले नहीं हैं। हम आपकी सहायता के लिए यहाँ हैं।",
    heroSubtitle:
      "एक शांत, निजी स्थान जो समय के साथ आपकी स्थिति जानता है और आपको सही सहायता से जोड़ता है — यह कभी निदान नहीं, हमेशा अगला कदम है।",
    loginContinue: "लॉगिन / जारी रखें",
    problemTitle: "समस्या",
    problemText:
      "पीड़ितों को जांच और कानूनी प्रक्रियाओं के दौरान लंबे समय तक मनोवैज्ञानिक तनाव का सामना करना पड़ता है, बिना किसी निरंतर सहायता के।",
    solutionTitle: "हमारा समाधान",
    solutionText:
      "एक निरंतर, दयालु निगरानी प्रणाली जो समय के साथ कल्याण को ट्रैक करती है और लोगों को वास्तविक मानवीय सहायता से जोड़ती है।",
    howItWorks: "यह कैसे काम करता है",
    reachUs: "जिस तरह से आप सहज हों, हमसे संपर्क करें",
    privacyText:
      "आपकी गोपनीयता सर्वोपरि है। सभी चेक-इन गोपनीय, एन्क्रिप्टेड हैं, और केवल अधिकृत सहायता कर्मियों के साथ साझा किए जाते हैं।",
    steps: [
      { title: "चेक इन करें", desc: "कुछ त्वरित प्रश्न, टेक्स्ट या आवाज़ में, जब भी आपको सुविधा हो।" },
      { title: "हम सुनते हैं", desc: "आपकी प्रतिक्रियाओं की देखभाल और पूर्ण गोपनीयता के साथ समीक्षा की जाती है।" },
      { title: "सहायता पाएं", desc: "परामर्श से लेकर कानूनी सहायता तक सही मदद प्राप्त करें।" },
    ],
    channels: [
      { name: "चैटबॉट", desc: "हमारी सहायता चैट के माध्यम से कभी भी बात करें।" },
      { name: "SMS", desc: "टेक्स्ट पसंद है? SMS पर चेक इन करें।" },
      { name: "मोबाइल / वेब ऐप", desc: "किसी भी डिवाइस पर पूरा अनुभव।" },
      { name: "हेल्पलाइन", desc: "जब जरूरत हो, किसी वास्तविक व्यक्ति से बात करें।" },
    ],
    motionOff: "मोशन: बंद",
    reduceMotion: "मोशन कम करें",
  },
  தமிழ்: {
    heroTitle: "நீங்கள் தனியாக இல்லை. நாங்கள் உங்களுக்கு உதவ இங்கே இருக்கிறோம்.",
    heroSubtitle: "உங்கள் நிலைமையை புரிந்துகொண்டு சரியான உதவியுடன் இணைக்கும் ஒரு அமைதியான, தனிப்பட்ட இடம்.",
    loginContinue: "உள்நுழைய / தொடர",
    problemTitle: "சிக்கல்",
    problemText: "பாதிக்கப்பட்டவர்கள் விசாரணைகளின் போது நீடித்த மன அழுத்தத்தை எதிர்கொள்கின்றனர், தொடர்ச்சியான ஆதரவு இல்லாமல்.",
    solutionTitle: "எங்கள் தீர்வு",
    solutionText: "நேரத்துடன் நலனை கண்காணித்து, ஆரம்ப எச்சரிக்கை அறிகுறிகளை கண்டறிந்து, மனித ஆதரவுடன் இணைக்கும் அமைப்பு.",
    howItWorks: "இது எவ்வாறு செயல்படுகிறது",
    reachUs: "உங்களுக்கு வசதியான வழியில் எங்களை அணுகுங்கள்",
    privacyText: "உங்கள் தனியுரிமை மிக முக்கியம். அனைத்து செக்-இன்களும் இரகசியமானவை மற்றும் மறைகுறியாக்கப்பட்டவை.",
    steps: [
      { title: "செக் இன்", desc: "சில விரைவான கேள்விகள், உரை அல்லது குரல், உங்களுக்கு வசதியான நேரத்தில்." },
      { title: "நாங்கள் கேட்கிறோம்", desc: "உங்கள் பதில்கள் கவனமாகவும் முழு தனியுரிமையுடனும் மதிப்பாய்வு செய்யப்படுகின்றன." },
      { title: "ஆதரவு பெறுங்கள்", desc: "ஆலோசனை முதல் சட்ட உதவி வரை சரியான உதவியைப் பெறுங்கள்." },
    ],
    channels: [
      { name: "சாட்பாட்", desc: "எங்கள் ஆதரவு அரட்டை மூலம் எந்த நேரத்திலும் பேசுங்கள்." },
      { name: "SMS", desc: "SMS மூலம் செக் இன் செய்யுங்கள்." },
      { name: "மொபைல் / வெப் ஆப்", desc: "எந்த சாதனத்திலும் முழு அனுபவம்." },
      { name: "ஹெல்ப்லைன்", desc: "தேவைப்படும் போது ஒரு உண்மையான நபரிடம் பேசுங்கள்." },
    ],
    motionOff: "இயக்கம்: முடக்கு",
    reduceMotion: "இயக்கம் குறைக்க",
  },
  বাংলা: {
    heroTitle: "আপনি একা নন। আমরা আপনার পাশে আছি।",
    heroSubtitle: "একটি শান্ত, ব্যক্তিগত জায়গা যা সময়ের সাথে আপনার পরিস্থিতি বোঝে এবং সঠিক সহায়তার সাথে সংযুক্ত করে।",
    loginContinue: "লগইন / চালিয়ে যান",
    problemTitle: "সমস্যা",
    problemText: "ভুক্তভোগীরা তদন্তের সময় দীর্ঘস্থায়ী মানসিক চাপের মুখোমুখি হন, ক্রমাগত সহায়তা ছাড়াই।",
    solutionTitle: "আমাদের সমাধান",
    solutionText: "একটি ক্রমাগত, সহানুভূতিশীল পর্যবেক্ষণ ব্যবস্থা যা সময়ের সাথে সুস্থতা ট্র্যাক করে এবং মানুষকে সত্যিকারের মানবিক সহায়তার সাথে সংযুক্ত করে।",
    howItWorks: "এটি কীভাবে কাজ করে",
    reachUs: "আপনি যেভাবে স্বাচ্ছন্দ্য বোধ করেন সেভাবে আমাদের সাথে যোগাযোগ করুন",
    privacyText: "আপনার গোপনীয়তা সর্বোচ্চ। সমস্ত চেক-ইন গোপনীয় এবং এনক্রিপ্টেড।",
    steps: [
      { title: "চেক ইন করুন", desc: "কয়েকটি দ্রুত প্রশ্ন, টেক্সট বা ভয়েস, যখন আপনার সুবিধা হয়।" },
      { title: "আমরা শুনি", desc: "আপনার প্রতিক্রিয়া যত্ন সহকারে এবং সম্পূর্ণ গোপনীয়তার সাথে পর্যালোচনা করা হয়।" },
      { title: "সহায়তা পান", desc: "পরামর্শ থেকে আইনি সহায়তা পর্যন্ত সঠিক সাহায্য পান।" },
    ],
    channels: [
      { name: "চ্যাটবট", desc: "আমাদের সহায়তা চ্যাটের মাধ্যমে যেকোনো সময় কথা বলুন।" },
      { name: "SMS", desc: "SMS-এ চেক ইন করুন।" },
      { name: "মোবাইল / ওয়েব অ্যাপ", desc: "যেকোনো ডিভাইসে সম্পূর্ণ অভিজ্ঞতা।" },
      { name: "হেল্পলাইন", desc: "প্রয়োজনে একজন বাস্তব ব্যক্তির সাথে কথা বলুন।" },
    ],
    motionOff: "মোশন: বন্ধ",
    reduceMotion: "মোশন কমান",
  },
  తెలుగు: { heroTitle: "మీరు ఒంటరిగా లేరు. మేము మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాము.", loginContinue: "లాగిన్ / కొనసాగించు" },
  मराठी: { heroTitle: "तुम्ही एकटे नाही. आम्ही तुमच्या मदतीसाठी येथे आहोत.", loginContinue: "लॉगिन / सुरू ठेवा" },
  ગુજરાતી: { heroTitle: "તમે એકલા નથી. અમે તમારી મદદ માટે અહીં છીએ.", loginContinue: "લૉગિન / ચાલુ રાખો" },
  ಕನ್ನಡ: { heroTitle: "ನೀವು ಒಂಟಿಯಲ್ಲ. ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ.", loginContinue: "ಲಾಗಿನ್ / ಮುಂದುವರಿಸಿ" },
  മലയാളം: { heroTitle: "നിങ്ങൾ ഒറ്റയ്ക്കല്ല. ഞങ്ങൾ നിങ്ങളെ സഹായിക്കാൻ ഇവിടെ ഉണ്ട്.", loginContinue: "ലോഗിൻ / തുടരുക" },
  ਪੰਜਾਬੀ: { heroTitle: "ਤੁਸੀਂ ਇਕੱਲੇ ਨਹੀਂ ਹੋ। ਅਸੀਂ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ।", loginContinue: "ਲੌਗਇਨ / ਜਾਰੀ ਰੱਖੋ" },
};

const LANGUAGES = ["English","हिंदी","தமிழ்","বাংলা","తెలుగు","मराठी","ગુજરાતી","ಕನ್ನಡ","മലയാളം","ਪੰਜਾਬੀ"];
const BASE = TRANSLATIONS["English"];

export default function Landing({ onContinue }) {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("English");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [textSize, setTextSize] = useState("normal");

  // Merge: full translation if available, else English + language-specific overrides
  const t = { ...BASE, ...(TRANSLATIONS[language] || {}) };

  const textSizeClass = textSize === "large" ? "text-lg" : textSize === "small" ? "text-sm" : "text-base";
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen relative overflow-hidden ${textSizeClass} ${isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}>

      {/* Animated blur blobs */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute w-72 h-72 bg-teal-500 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
        </div>
      )}

      {/* ParticleField */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <ParticleField />
        </div>
      )}

      {/* Top bar */}
      <div className="relative z-10 flex flex-wrap justify-end items-center gap-2 px-6 pt-5">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`border rounded-md px-3 py-1.5 text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"}`}
          aria-label="Select language"
        >
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <button
          onClick={() => setTextSize((s) => s === "small" ? "normal" : s === "normal" ? "large" : "small")}
          className={`border rounded-md px-3 py-1.5 text-sm ${isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-100"}`}
        >
          {textSize === "small" ? "A Normal" : textSize === "normal" ? "A+ Larger" : "A- Smaller"}
        </button>

        <button
          onClick={() => setReducedMotion((v) => !v)}
          aria-pressed={reducedMotion}
          className={`border rounded-md px-3 py-1.5 text-sm ${isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-100"}`}
        >
          {reducedMotion ? t.motionOff : t.reduceMotion}
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`border rounded-md px-3 py-1.5 text-sm flex items-center gap-1 ${isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-100"}`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Hero */}
      <FadeIn>
        <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-16 pb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-teal-400 mb-4 leading-tight">{t.heroTitle}</h1>
          <p className={`mb-8 max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.heroSubtitle}</p>
          <Button onClick={onContinue}>{t.loginContinue}</Button>
        </section>
      </FadeIn>

      {/* InfoCarousel — uses its own internal slides (helpline, quotes, platform info) */}
      <FadeIn delay={0.1}>
        <section className="relative z-10 px-6 pb-16">
          <InfoCarousel />
        </section>
      </FadeIn>

      {/* Problem → Solution */}
      <FadeIn delay={0.15}>
        <section className="relative z-10 max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-slate-400 text-sm uppercase font-semibold mb-2">{t.problemTitle}</h3>
            <p className={isDark ? "text-slate-200" : "text-slate-700"}>{t.problemText}</p>
          </Card>
          <Card>
            <h3 className="text-teal-400 text-sm uppercase font-semibold mb-2">{t.solutionTitle}</h3>
            <p className={isDark ? "text-slate-200" : "text-slate-700"}>{t.solutionText}</p>
          </Card>
        </section>
      </FadeIn>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <FadeIn>
          <h2 className="text-2xl font-semibold text-center mb-10">{t.howItWorks}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Card>
                <div className="text-teal-400 text-3xl font-bold mb-2">{i + 1}</div>
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{step.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Support channels */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <FadeIn>
          <h2 className="text-2xl font-semibold text-center mb-10">{t.reachUs}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {t.channels.map((ch, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <Card>
                <h3 className="text-teal-400 font-semibold mb-1">{ch.name}</h3>
                <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{ch.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Privacy strip */}
      <FadeIn>
        <section className={`relative z-10 border-t py-8 px-6 text-center ${isDark ? "bg-slate-800/60 border-slate-700" : "bg-slate-200/60 border-slate-300"}`}>
          <p className={`text-sm max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.privacyText}</p>
        </section>
      </FadeIn>

    </div>
  );
}
