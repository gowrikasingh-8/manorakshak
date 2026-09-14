import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Brain,
  UserCheck,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/BadgeDI';

// ----- Mock AI insight data, per language ---------------------------------
const DATA_BY_LANG = {
  en: {
    caseId: 'C-10432',
    timestamp: 'Aug 29, 2026 · 9:03 PM',
    current: { score: 62, band: 'moderate', label: 'Moderate' },
    previous: { score: 47, band: 'low', label: 'Low' },
    trend: 'up',
    confidence: 'Medium',
    contextNote: 'Based on 5 check-ins over 10 days',
    positiveSignals: [
      'Engaged with grounding exercise on Aug 24',
      'Completed 4 out of 5 check-ins this period',
      'Reported calmer days on Aug 26',
    ],
    negativeSignals: [
      'Stress-related language increased across last 3 check-ins',
      'Sleep disruption mentioned twice this week',
      'One check-in skipped since the last review',
      'Lower engagement with suggested exercises',
    ],
    whyChanged:
      'The indicator moved from Low to Moderate primarily because stress-related language appeared in 3 consecutive check-ins, and a check-in was missed. Previous periods showed consistent engagement and calmer self-reporting — the shift in both language tone and missed interaction drove the change.',
    dataContributed:
      'This indicator was generated from: self-reported mood and stress levels during check-ins, frequency and completeness of check-in responses, language pattern analysis from chat sessions, and engagement with suggested support activities. No external data sources were used.',
    recommendedAction:
      'A counsellor follow-up is recommended within 48 hours. The shift from Low to Moderate over a short period warrants a direct conversation rather than automated support alone.',
    limitations:
      'This is a frontend simulation — not a deployed ML model or clinical assessment. Scores are generated from mock patterns and are intended to demonstrate how AI-assisted monitoring could work. They must not be used for real decisions.',
  },
  hi: {
    caseId: 'C-10432',
    timestamp: '29 अग॰ 2026 · 9:03 PM',
    current: { score: 62, band: 'moderate', label: 'मध्यम' },
    previous: { score: 47, band: 'low', label: 'कम' },
    trend: 'up',
    confidence: 'मध्यम',
    contextNote: '10 दिनों में 5 चेक-इन के आधार पर',
    positiveSignals: [
      '24 अग॰ को ग्राउंडिंग एक्सरसाइज़ में भाग लिया',
      'इस अवधि में 5 में से 4 चेक-इन पूरे किए',
      '26 अग॰ को शांत दिनों की जानकारी दी',
    ],
    negativeSignals: [
      'पिछले 3 चेक-इन में तनाव से जुड़ी भाषा बढ़ी',
      'इस हफ्ते दो बार नींद में गड़बड़ी का ज़िक्र हुआ',
      'पिछली समीक्षा के बाद एक चेक-इन छूट गया',
      'सुझाई गई एक्सरसाइज़ में कम भागीदारी',
    ],
    whyChanged:
      'संकेतक मुख्य रूप से इसलिए "कम" से "मध्यम" हो गया क्योंकि 3 लगातार चेक-इन में तनाव से जुड़ी भाषा दिखी और एक चेक-इन छूट गया। पिछली अवधियों में लगातार भागीदारी और शांत स्व-रिपोर्टिंग थी — भाषा के स्वर और छूटी हुई बातचीत दोनों में बदलाव से यह परिवर्तन आया।',
    dataContributed:
      'यह संकेतक इन स्रोतों से बनाया गया: चेक-इन के दौरान स्व-रिपोर्ट किया गया मूड और तनाव स्तर, चेक-इन प्रतिक्रियाओं की आवृत्ति और पूर्णता, चैट सत्रों से भाषा पैटर्न विश्लेषण, और सुझाई गई सहायता गतिविधियों में भागीदारी। कोई बाहरी डेटा स्रोत उपयोग नहीं किया गया।',
    recommendedAction:
      '48 घंटों के भीतर काउंसलर फॉलो-अप की सिफारिश की जाती है। कम समय में "कम" से "मध्यम" में बदलाव के लिए केवल स्वचालित सहायता के बजाय सीधी बातचीत की आवश्यकता है।',
    limitations:
      'यह एक फ्रंटएंड सिमुलेशन है — न कोई तैनात ML मॉडल और न कोई क्लिनिकल मूल्यांकन। स्कोर मॉक पैटर्न से बनाए गए हैं और यह दिखाने के लिए हैं कि AI-सहायता प्राप्त निगरानी कैसे काम कर सकती है। इन्हें वास्तविक निर्णयों के लिए उपयोग नहीं किया जाना चाहिए।',
  },
};

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
];

const BAND_BADGE_COLOR = { low: 'teal', moderate: 'amber', high: 'red' };

const COPY = {
  en: {
    title: 'AI Insight Center',
    subtitle: 'Explainable support signal — not a diagnosis',
    caseLabel: 'Case',
    currentLabel: 'Current indicator',
    previousLabel: 'Previous indicator',
    trendUp: 'Worsening trend',
    trendDown: 'Improving trend',
    trendStable: 'Stable',
    confidenceLabel: 'Confidence',
    contextLabel: 'Context',
    positiveTitle: 'Positive signals',
    negativeTitle: 'Worsening signals',
    whyTitle: 'Why did this change?',
    dataTitle: 'What data contributed?',
    actionTitle: 'Recommended human action',
    limitationsTitle: 'AI limitations',
    notDiagnosis: 'This is a support indicator, not a clinical diagnosis',
    assignButton: 'Case Assignment',
  },
  hi: {
    title: 'AI इनसाइट सेंटर',
    subtitle: 'व्याख्या योग्य सहायता संकेत — यह निदान नहीं है',
    caseLabel: 'केस',
    currentLabel: 'वर्तमान संकेतक',
    previousLabel: 'पिछला संकेतक',
    trendUp: 'बिगड़ता रुझान',
    trendDown: 'सुधरता रुझान',
    trendStable: 'स्थिर',
    confidenceLabel: 'विश्वास स्तर',
    contextLabel: 'संदर्भ',
    positiveTitle: 'सकारात्मक संकेत',
    negativeTitle: 'बिगड़ते संकेत',
    whyTitle: 'यह क्यों बदला?',
    dataTitle: 'किन डेटा का योगदान रहा?',
    actionTitle: 'सुझाई गई मानवीय कार्रवाई',
    limitationsTitle: 'AI की सीमाएं',
    notDiagnosis: 'यह एक सहायता संकेतक है, क्लिनिकल निदान नहीं',
    assignButton: 'केस असाइनमेंट',
  },
};

function Drawer({ title, children, icon: Icon }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-200"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-teal-400" aria-hidden="true" />}
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="border-t border-slate-800 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-400">
          {children}
        </div>
      )}
    </Card>
  );
}

export default function AIInsightCenter() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const t = COPY[language];
  const data = DATA_BY_LANG[language];

  const TrendIcon =
    data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    data.trend === 'up'
      ? 'text-amber-400'
      : data.trend === 'down'
      ? 'text-teal-400'
      : 'text-slate-400';
  const trendLabel =
    data.trend === 'up' ? t.trendUp : data.trend === 'down' ? t.trendDown : t.trendStable;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-teal-400">{t.title}</h1>
          <p className="mt-0.5 text-xs text-slate-500">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Case Assignment Navigation Button */}
          <button
            type="button"
            onClick={() => navigate('/assign')}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors"
          >
            <UserCheck className="h-3.5 w-3.5" />
            {t.assignButton}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center overflow-hidden rounded-full border border-slate-700 bg-slate-800/70">
            <Globe className="ml-2 h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-pressed={language === lang.code}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  language === lang.code
                    ? 'bg-teal-500 text-slate-950'
                    : 'text-slate-300 hover:text-teal-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Not-a-diagnosis disclaimer */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
        <Info className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden="true" />
        <span>{t.notDiagnosis}</span>
      </div>

      {/* Current vs Previous indicator */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium text-slate-500">{t.previousLabel}</p>
          <Badge color={BAND_BADGE_COLOR[data.previous.band]}>{data.previous.label}</Badge>
          <span className="text-3xl font-bold text-slate-400">{data.previous.score}</span>
        </Card>

        <Card className="flex flex-col gap-2 rounded-2xl border border-teal-700/40 bg-slate-900 p-4 ring-1 ring-teal-500/20">
          <p className="text-xs font-medium text-slate-400">{t.currentLabel}</p>
          <Badge color={BAND_BADGE_COLOR[data.current.band]}>{data.current.label}</Badge>
          <span className="text-3xl font-bold text-slate-100">{data.current.score}</span>
        </Card>
      </div>

      {/* Trend + confidence row */}
      <Card className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
        <div className={`flex items-center gap-1.5 text-sm font-medium ${trendColor}`}>
          <TrendIcon className="h-4 w-4" aria-hidden="true" />
          <span>{trendLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
          <span className="text-slate-400 font-normal text-xs">
            {data.previous.score} → {data.current.score}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            <span className="font-medium text-slate-300">{t.confidenceLabel}:</span>{' '}
            {data.confidence}
          </span>
          <span>
            <span className="font-medium text-slate-300">{t.contextLabel}:</span>{' '}
            {data.contextNote}
          </span>
        </div>
      </Card>

      {/* Positive vs Negative signals */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Positive */}
        <Card className="rounded-2xl border border-teal-800/40 bg-slate-900 p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-teal-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {t.positiveTitle}
          </h2>
          <ul className="space-y-2">
            {data.positiveSignals.map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* Negative */}
        <Card className="rounded-2xl border border-amber-800/40 bg-slate-900 p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-amber-300">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {t.negativeTitle}
          </h2>
          <ul className="space-y-2">
            {data.negativeSignals.map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recommended human action */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">{t.actionTitle}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{data.recommendedAction}</p>
      </Card>

      {/* Collapsible drawers */}
      <Drawer title={t.whyTitle} icon={TrendingUp}>
        {data.whyChanged}
      </Drawer>

      <Drawer title={t.dataTitle} icon={Brain}>
        {data.dataContributed}
      </Drawer>

      <Drawer title={t.limitationsTitle} icon={Info}>
        {data.limitations}
      </Drawer>
    </div>
  );
}