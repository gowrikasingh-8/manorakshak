import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  LifeBuoy,
  Globe,
  X,
  Info,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/BadgeDI';

const DATA_BY_LANG = {
  en: {
    caseId: 'C-10432',
    timestamp: 'Aug 29, 2026 · 9:03 PM',
    riskBand: 'moderate', // 'low' | 'moderate' | 'high'
    score: 62,
    previousScore: 54,
    trend: 'up', // 'up' | 'down' | 'stable'
    confidence: 'Medium confidence',
    contextNote: 'Based on your last 5 check-ins',
    contributingSignals: [
      'More stress-related language in recent check-ins',
      'Sleep disruption mentioned twice this week',
      'One check-in skipped since the last review',
      'Lower engagement with suggested exercises',
    ],
    explanation:
      "This signal reflects patterns in what you've shared during recent check-ins — it is not a clinical evaluation. A moderate score often means it could help to check in with a counsellor, but it doesn't mean something is wrong. Only you and your care team can decide what support is right for you.",
    recommendedActions: [
      'Try a short grounding exercise',
      'Talk to a counsellor about this week',
      'Review available support options',
      'Adjust your check-in reminder frequency',
    ],
  },
  hi: {
    caseId: 'C-10432',
    timestamp: '29 अग॰ 2026 · 9:03 PM',
    riskBand: 'moderate',
    score: 62,
    previousScore: 54,
    trend: 'up',
    confidence: 'मध्यम विश्वास स्तर',
    contextNote: 'आपके पिछले 5 चेक-इन के आधार पर',
    contributingSignals: [
      'हाल के चेक-इन में तनाव से जुड़ी भाषा अधिक दिखी',
      'इस हफ्ते दो बार नींद में गड़बड़ी का ज़िक्र हुआ',
      'पिछली समीक्षा के बाद एक चेक-इन छूट गया',
      'सुझाई गई एक्सरसाइज़ में कम भागीदारी',
    ],
    explanation:
      'यह संकेत आपके हाल के चेक-इन में साझा की गई बातों के पैटर्न को दर्शाता है — यह कोई क्लिनिकल मूल्यांकन नहीं है। मध्यम स्कोर का अक्सर मतलब होता है कि किसी काउंसलर से बात करना मददगार हो सकता है, पर इसका यह मतलब नहीं कि कुछ गलत है। सही सहायता क्या है, यह तय करना आप और आपकी केयर टीम पर निर्भर है।',
    recommendedActions: [
      'एक छोटा ग्राउंडिंग एक्सरसाइज़ आज़माएं',
      'इस हफ्ते के बारे में किसी काउंसलर से बात करें',
      'उपलब्ध सहायता विकल्प देखें',
      'अपने चेक-इन रिमाइंडर की आवृत्ति बदलें',
    ],
  },
};

const RISK_BAND_META = {
  low: { label: { en: 'Low concern', hi: 'कम चिंता' }, badgeColor: 'teal' },
  moderate: { label: { en: 'Moderate concern', hi: 'मध्यम चिंता' }, badgeColor: 'amber' },
  high: { label: { en: 'High concern', hi: 'अधिक चिंता' }, badgeColor: 'red' },
};

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
];

const COPY = {
  en: {
    title: 'Your Support Signal',
    disclaimer: 'This is a support signal, not a diagnosis',
    trendUp: 'since last check-in',
    trendDown: 'since last check-in',
    trendStable: 'No change since last check-in',
    signalsTitle: 'What contributed to this',
    whatThisMeans: 'What this means',
    nextStepsTitle: 'Recommended next steps',
    escalate: 'Talk to a counsellor',
    escalateTitle: 'Connect with a counsellor?',
    escalateBody:
      "This will route you to a real, authorized member of your support team — not an automated decision. You're always in control of what you share.",
    escalateConfirm: 'Connect me',
    escalateCancel: 'Not right now',
  },
  hi: {
    title: 'आपका सपोर्ट सिग्नल',
    disclaimer: 'यह एक सहायता संकेत है, निदान नहीं',
    trendUp: 'पिछले चेक-इन की तुलना में',
    trendDown: 'पिछले चेक-इन की तुलना में',
    trendStable: 'पिछले चेक-इन से कोई बदलाव नहीं',
    signalsTitle: 'इसमें किन बातों का योगदान रहा',
    whatThisMeans: 'इसका क्या मतलब है',
    nextStepsTitle: 'सुझाए गए अगले कदम',
    escalate: 'काउंसलर से बात करें',
    escalateTitle: 'काउंसलर से जुड़ना चाहते हैं?',
    escalateBody:
      'यह आपको आपकी सहायता टीम के एक वास्तविक, अधिकृत सदस्य से जोड़ेगा — यह कोई स्वचालित निर्णय नहीं है। आप हमेशा तय कर सकते हैं कि क्या साझा करना है।',
    escalateConfirm: 'मुझे जोड़ें',
    escalateCancel: 'अभी नहीं',
  },
};

export default function DistressIndicator() {
  const [language, setLanguage] = useState('en');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);

  const t = COPY[language];
  const data = DATA_BY_LANG[language];
  const band = RISK_BAND_META[data.riskBand];
  const scoreDelta = data.score - data.previousScore;

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendLabel =
    data.trend === 'up'
      ? `+${scoreDelta} ${t.trendUp}`
      : data.trend === 'down'
      ? `${scoreDelta} ${t.trendDown}`
      : t.trendStable;
  const trendColor =
    data.trend === 'up' ? 'text-amber-400' : data.trend === 'down' ? 'text-teal-400' : 'text-slate-400';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">{t.title}</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            {data.caseId} · {data.timestamp}
          </p>
        </div>

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

      {/* Not-a-diagnosis disclaimer */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
        <Info className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden="true" />
        <span>{t.disclaimer}</span>
      </div>

      {/* Score card */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge color={band.badgeColor}>{band.label[language]}</Badge>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-slate-100">{data.score}</span>
              <span className="text-sm text-slate-500">/ 100</span>
            </div>
            <div className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${trendColor}`}>
              <TrendIcon className="h-4 w-4" aria-hidden="true" />
              <span>{trendLabel}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-right text-xs text-slate-400">
            <p>{data.confidence}</p>
            <p className="mt-0.5">{data.contextNote}</p>
          </div>
        </div>
      </Card>

      {/* Contributing signals */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.signalsTitle}</h2>
        <ul className="space-y-2">
          {data.contributingSignals.map((signal) => (
            <li key={signal} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* What this means — collapsible drawer */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-0">
        <button
          type="button"
          onClick={() => setShowExplanation((prev) => !prev)}
          aria-expanded={showExplanation}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-200"
        >
          <span>{t.whatThisMeans}</span>
          {showExplanation ? (
            <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
          )}
        </button>
        {showExplanation && (
          <p className="border-t border-slate-800 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-400">
            {data.explanation}
          </p>
        )}
      </Card>

      {/* Recommended next steps */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.nextStepsTitle}</h2>
        <ul className="space-y-2">
          {data.recommendedActions.map((action, i) => (
            <li
              key={action}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-xs font-semibold text-teal-300">
                {i + 1}
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Human-support CTA */}
      <Button
        type="button"
        onClick={() => setShowEscalationModal(true)}
        className="flex items-center justify-center gap-2 rounded-full bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-teal-900/40 hover:bg-teal-400"
      >
        <LifeBuoy className="h-4 w-4" aria-hidden="true" />
        {t.escalate}
      </Button>

      {/* Escalation modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <Card className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-teal-400" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-slate-100">{t.escalateTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEscalationModal(false)}
                aria-label="Close"
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-slate-400">{t.escalateBody}</p>
            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <Button
                type="button"
                onClick={() => setShowEscalationModal(false)}
                className="flex-1 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400"
              >
                {t.escalateConfirm}
              </Button>
              <Button
                type="button"
                onClick={() => setShowEscalationModal(false)}
                className="flex-1 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
              >
                {t.escalateCancel}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
