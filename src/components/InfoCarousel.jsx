import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Phone, Sparkles } from "lucide-react";
import Card from "./Card";
import { useLanguage } from "../LanguageContext";

const SLIDES_BY_LANG = {
  English: [
    { type: "quote", icon: Heart, text: "Healing is not linear, and every small step forward counts." },
    { type: "helpline", icon: Phone, text: "KIRAN Mental Health Helpline: 1800-599-0019 — free, confidential, available 24/7 across India." },
    { type: "feature", icon: Sparkles, text: "Every support signal on this platform comes with a clear explanation — never a diagnosis, always a next step." },
    { type: "quote", icon: Heart, text: "You don't have to carry this alone. Support is always within reach." },
    { type: "feature", icon: Sparkles, text: "Available in 10 Indian languages, so support speaks your language." },
    { type: "helpline", icon: Phone, text: "In immediate danger? Dial 112 for India's national emergency helpline." },
  ],
  "हिंदी": [
    { type: "quote", icon: Heart, text: "उपचार की राह सरल नहीं होती, और हर छोटा कदम मायने रखता है।" },
    { type: "helpline", icon: Phone, text: "किरण मानसिक स्वास्थ्य हेल्पलाइन: 1800-599-0019 — निःशुल्क, गोपनीय, 24/7 उपलब्ध।" },
    { type: "feature", icon: Sparkles, text: "इस प्लेटफ़ॉर्म पर हर सहायता संकेत एक स्पष्ट व्याख्या के साथ आता है — कभी निदान नहीं, हमेशा अगला कदम।" },
    { type: "quote", icon: Heart, text: "आपको यह अकेले नहीं उठाना है। सहायता हमेशा पास में है।" },
    { type: "feature", icon: Sparkles, text: "10 भारतीय भाषाओं में उपलब्ध, ताकि सहायता आपकी भाषा में मिले।" },
    { type: "helpline", icon: Phone, text: "तत्काल खतरे में हैं? भारत की राष्ट्रीय आपातकालीन हेल्पलाइन के लिए 112 डायल करें।" },
  ],
  "தமிழ்": [
    { type: "quote", icon: Heart, text: "குணமடைவது நேரடியானதல்ல, ஒவ்வொரு சிறிய முன்னேற்றமும் முக்கியமானது." },
    { type: "helpline", icon: Phone, text: "KIRAN மனநல உதவி எண்: 1800-599-0019 — இலவசம், இரகசியம், 24/7 கிடைக்கும்." },
    { type: "feature", icon: Sparkles, text: "இந்த தளத்தில் ஒவ்வொரு ஆதரவு சமிக்ஞையும் தெளிவான விளக்கத்துடன் வருகிறது." },
    { type: "quote", icon: Heart, text: "இதை தனியாக சுமக்க வேண்டியதில்லை. ஆதரவு எப்போதும் அருகில் உள்ளது." },
    { type: "feature", icon: Sparkles, text: "10 இந்திய மொழிகளில் கிடைக்கும், உங்கள் மொழியில் ஆதரவு பெறுங்கள்." },
    { type: "helpline", icon: Phone, text: "உடனடி ஆபத்தில் இருக்கிறீர்களா? 112 ஐ அழைக்கவும்." },
  ],
  "বাংলা": [
    { type: "quote", icon: Heart, text: "সুস্থ হওয়া সরলরৈখিক নয়, প্রতিটি ছোট পদক্ষেপ গুরুত্বপূর্ণ।" },
    { type: "helpline", icon: Phone, text: "KIRAN মানসিক স্বাস্থ্য হেল্পলাইন: 1800-599-0019 — বিনামূল্যে, গোপনীয়, ২৪/৭ উপলব্ধ।" },
    { type: "feature", icon: Sparkles, text: "এই প্ল্যাটফর্মে প্রতিটি সহায়তা সংকেত একটি স্পষ্ট ব্যাখ্যা সহ আসে।" },
    { type: "quote", icon: Heart, text: "এটি একা বহন করতে হবে না। সহায়তা সবসময় নাগালের মধ্যে আছে।" },
    { type: "feature", icon: Sparkles, text: "১০টি ভারতীয় ভাষায় উপলব্ধ।" },
    { type: "helpline", icon: Phone, text: "তাৎক্ষণিক বিপদে? ১১২ ডায়াল করুন।" },
  ],
  "తెలుగు": [
    { type: "quote", icon: Heart, text: "స్వస్థత రేఖాత్మకంగా ఉండదు, ప్రతి చిన్న అడుగు ముఖ్యమైనది." },
    { type: "helpline", icon: Phone, text: "KIRAN మానసిక ఆరోగ్య హెల్ప్‌లైన్: 1800-599-0019 — ఉచితం, రహస్యం, 24/7 అందుబాటులో." },
    { type: "feature", icon: Sparkles, text: "ఈ వేదికలో ప్రతి మద్దతు సంకేతం స్పష్టమైన వివరణతో వస్తుంది." },
    { type: "quote", icon: Heart, text: "దీన్ని ఒంటరిగా మోయాల్సిన అవసరం లేదు. మద్దతు ఎల్లప్పుడూ అందుబాటులో ఉంటుంది." },
    { type: "feature", icon: Sparkles, text: "10 భారతీయ భాషల్లో అందుబాటులో ఉంది." },
    { type: "helpline", icon: Phone, text: "తక్షణ ప్రమాదంలో ఉన్నారా? 112 డయల్ చేయండి." },
  ],
  "मराठी": [
    { type: "quote", icon: Heart, text: "बरे होणे सरळ नसते, आणि प्रत्येक छोटी पायरी महत्त्वाची असते." },
    { type: "helpline", icon: Phone, text: "किरण मानसिक आरोग्य हेल्पलाइन: 1800-599-0019 — मोफत, गोपनीय, 24/7 उपलब्ध." },
    { type: "feature", icon: Sparkles, text: "या प्लॅटफॉर्मवर प्रत्येक सहाय्य संकेत स्पष्ट स्पष्टीकरणासह येतो." },
    { type: "quote", icon: Heart, text: "हे एकट्याने सहन करण्याची गरज नाही. मदत नेहमी जवळ आहे." },
    { type: "feature", icon: Sparkles, text: "10 भारतीय भाषांमध्ये उपलब्ध." },
    { type: "helpline", icon: Phone, text: "तातडीच्या धोक्यात आहात? 112 डायल करा." },
  ],
  "ગુજરાતી": [
    { type: "quote", icon: Heart, text: "સ્વસ્થ થવું સીધી રેખામાં નથી, અને દરેક નાનું પગલું મહત્વનું છે." },
    { type: "helpline", icon: Phone, text: "KIRAN માનસિક સ્વાસ્થ્ય હેલ્પલાઇન: 1800-599-0019 — મફત, ગોપનીય, 24/7 ઉપલબ્ધ." },
    { type: "feature", icon: Sparkles, text: "આ પ્લેટફોર્મ પર દરેક સહાય સંકેત સ્પષ્ટ સ્પષ્ટીકરણ સાથે આવે છે." },
    { type: "quote", icon: Heart, text: "આ એકલા સહન કરવાની જરૂર નથી. મદદ હંમેશા નજીક છે." },
    { type: "feature", icon: Sparkles, text: "10 ભારતીય ભાષાઓમાં ઉપલબ્ધ." },
    { type: "helpline", icon: Phone, text: "તાત્કાલિક ખતરામાં છો? 112 ડાયલ કરો." },
  ],
  "ಕನ್ನಡ": [
    { type: "quote", icon: Heart, text: "ಗುಣಮುಖವಾಗುವುದು ನೇರವಾಗಿಲ್ಲ, ಮತ್ತು ಪ್ರತಿ ಸಣ್ಣ ಹೆಜ್ಜೆ ಮುಖ್ಯವಾಗಿದೆ." },
    { type: "helpline", icon: Phone, text: "KIRAN ಮಾನಸಿಕ ಆರೋಗ್ಯ ಹೆಲ್ಪ್‌ಲೈನ್: 1800-599-0019 — ಉಚಿತ, ಗೌಪ್ಯ, 24/7 ಲಭ್ಯ." },
    { type: "feature", icon: Sparkles, text: "ಈ ವೇದಿಕೆಯಲ್ಲಿ ಪ್ರತಿ ಬೆಂಬಲ ಸಂಕೇತವು ಸ್ಪಷ್ಟ ವಿವರಣೆಯೊಂದಿಗೆ ಬರುತ್ತದೆ." },
    { type: "quote", icon: Heart, text: "ಇದನ್ನು ಒಂಟಿಯಾಗಿ ಹೊರಬೇಕಾಗಿಲ್ಲ. ಬೆಂಬಲ ಯಾವಾಗಲೂ ಹತ್ತಿರದಲ್ಲಿದೆ." },
    { type: "feature", icon: Sparkles, text: "10 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ." },
    { type: "helpline", icon: Phone, text: "ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿದ್ದೀರಾ? 112 ಡಯಲ್ ಮಾಡಿ." },
  ],
  "മലയാളം": [
    { type: "quote", icon: Heart, text: "സുഖപ്പെടൽ നേർരേഖയിലല്ല, ഓരോ ചെറിയ ചുവടും പ്രധാനമാണ്." },
    { type: "helpline", icon: Phone, text: "KIRAN മാനസികാരോഗ്യ ഹെൽപ്‌ലൈൻ: 1800-599-0019 — സൗജന്യം, രഹസ്യം, 24/7 ലഭ്യം." },
    { type: "feature", icon: Sparkles, text: "ഈ പ്ലാറ്റ്ഫോമിൽ ഓരോ പിന്തുണ സൂചകവും വ്യക്തമായ വിശദീകരണത്തോടെ വരുന്നു." },
    { type: "quote", icon: Heart, text: "ഇത് ഒറ്റയ്ക്ക് വഹിക്കേണ്ടതില്ല. പിന്തുണ എപ്പോഴും അടുത്തുണ്ട്." },
    { type: "feature", icon: Sparkles, text: "10 ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യം." },
    { type: "helpline", icon: Phone, text: "ഉടനടി അപകടത്തിലാണോ? 112 ഡയൽ ചെയ്യുക." },
  ],
  "ਪੰਜਾਬੀ": [
    { type: "quote", icon: Heart, text: "ਠੀਕ ਹੋਣਾ ਸਿੱਧਾ ਨਹੀਂ ਹੁੰਦਾ, ਅਤੇ ਹਰ ਛੋਟਾ ਕਦਮ ਮਹੱਤਵਪੂਰਨ ਹੈ।" },
    { type: "helpline", icon: Phone, text: "ਕਿਰਨ ਮਾਨਸਿਕ ਸਿਹਤ ਹੈਲਪਲਾਈਨ: 1800-599-0019 — ਮੁਫ਼ਤ, ਗੁਪਤ, 24/7 ਉਪਲਬਧ." },
    { type: "feature", icon: Sparkles, text: "ਇਸ ਪਲੇਟਫਾਰਮ 'ਤੇ ਹਰ ਸਹਾਇਤਾ ਸੰਕੇਤ ਸਪੱਸ਼ਟ ਵਿਆਖਿਆ ਨਾਲ ਆਉਂਦਾ ਹੈ।" },
    { type: "quote", icon: Heart, text: "ਇਸਨੂੰ ਇਕੱਲੇ ਚੁੱਕਣ ਦੀ ਜ਼ਰੂਰਤ ਨਹੀਂ। ਸਹਾਇਤਾ ਹਮੇਸ਼ਾ ਨੇੜੇ ਹੈ।" },
    { type: "feature", icon: Sparkles, text: "10 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ।" },
    { type: "helpline", icon: Phone, text: "ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੋ? 112 ਡਾਇਲ ਕਰੋ।" },
  ],
};

const TYPE_LABELS = {
  English: { quote: "A gentle reminder", helpline: "Helpline", feature: "About this platform" },
  "हिंदी": { quote: "एक सौम्य अनुस्मारक", helpline: "हेल्पलाइन", feature: "इस प्लेटफ़ॉर्म के बारे में" },
  "தமிழ்": { quote: "ஒரு மென்மையான நினைவூட்டல்", helpline: "உதவி எண்", feature: "இந்த தளத்தைப் பற்றி" },
  "বাংলা": { quote: "একটি মৃদু অনুস্মারক", helpline: "হেল্পলাইন", feature: "এই প্ল্যাটফর্ম সম্পর্কে" },
  "తెలుగు": { quote: "ఒక సౌమ్య స్మారిక", helpline: "హెల్ప్‌లైన్", feature: "ఈ వేదిక గురించి" },
  "मराठी": { quote: "एक सौम्य स्मरण", helpline: "हेल्पलाइन", feature: "या प्लॅटफॉर्मबद्दल" },
  "ગુજરાતી": { quote: "એક સૌમ્ય રીમાઇન્ડર", helpline: "હેલ્પલાઇન", feature: "આ પ્લેટફોર્મ વિશે" },
  "ಕನ್ನಡ": { quote: "ಒಂದು ಮೃದು ಜ್ಞಾಪನೆ", helpline: "ಹೆಲ್ಪ್‌ಲೈನ್", feature: "ಈ ವೇದಿಕೆಯ ಬಗ್ಗೆ" },
  "മലയാളം": { quote: "ഒരു സൗമ്യ ഓർമ്മപ്പെടുത്തൽ", helpline: "ഹെൽപ്‌ലൈൻ", feature: "ഈ പ്ലാറ്റ്ഫോമിനെ കുറിച്ച്" },
  "ਪੰਜਾਬੀ": { quote: "ਇੱਕ ਕੋਮਲ ਯਾਦ ਦਿਵਾਉਣਾ", helpline: "ਹੈਲਪਲਾਈਨ", feature: "ਇਸ ਪਲੇਟਫਾਰਮ ਬਾਰੇ" },
};

export default function InfoCarousel() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);

  const slides = SLIDES_BY_LANG[language] || SLIDES_BY_LANG["English"];
  const typeLabel = TYPE_LABELS[language] || TYPE_LABELS["English"];

  // Reset slide index when language changes so we never land on an out-of-range index
  const safeIndex = index >= slides.length ? 0 : index;

  useEffect(() => {
    setIndex(0);
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  const slide = slides[safeIndex];
  const Icon = slide.icon;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative flex items-center gap-3">
        <button onClick={prev} aria-label="Previous"
          className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-teal-600 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${language}-${safeIndex}`}
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

        <button onClick={next} aria-label="Next"
          className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-teal-600 transition-colors flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === safeIndex ? "w-6 bg-teal-400" : "w-1.5 bg-slate-600 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
