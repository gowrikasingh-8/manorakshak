import { useEffect, useMemo, useState } from 'react';
import {
  Globe,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CalendarX,
  Phone,
  MessageSquare,
  StickyNote,
  User,
  Loader2,
  SearchX,
} from 'lucide-react';
import Card from './components/Card';
import Button from './components/Button';
import Badge from './components/BadgeDI';

// ----- Fake case record store, per language --------------------------------
// Keyed by caseId. Swap getCaseById() for a real API call later — the UI
// below doesn't need to change, it just needs { data, isLoading, notFound }.
const CASES_BY_LANG = {
  en: {
    'C-10432': {
      maskedName: 'V*** K.',
      riskBand: 'moderate',
      score: 62,
      previousScore: 54,
      lastActive: 'Aug 29, 2026',
      assignedTo: 'You',
      contributingFactors: [
        'More stress-related language in recent check-ins',
        'Sleep disruption mentioned twice this week',
        'One check-in skipped since the last review',
        'Lower engagement with suggested exercises',
      ],
      timeline: [
        { date: 'Aug 20', type: 'alert', note: 'Escalation offered after a difficult check-in.' },
        { date: 'Aug 18', type: 'checkin', note: 'Sleep disruption mentioned again.' },
        { date: 'Aug 16', type: 'checkin', note: 'Reported trouble focusing at work.' },
        { date: 'Aug 14', type: 'missed', note: 'Check-in reminder was not completed.' },
        { date: 'Aug 12', type: 'checkin', note: 'Mentioned a stressful call with a relative.' },
        { date: 'Aug 10', type: 'checkin', note: 'Felt calm after the weekend, slept well.' },
      ],
      interactions: [
        { date: 'Aug 22', type: 'call', summary: 'Follow-up call, discussed coping strategies.' },
        { date: 'Aug 20', type: 'escalation', summary: 'Auto-escalation triggered, routed to you.' },
        { date: 'Aug 20', type: 'chat', summary: 'Support chat session, 12 messages.' },
        { date: 'Aug 16', type: 'note', summary: 'Internal note: flag for closer monitoring.' },
      ],
      interventionStatus: 'in_progress',
      notes: [{ date: 'Aug 22', text: 'Discussed workload stress; suggested a grounding exercise and scheduled a follow-up in one week.' }],
      nextActions: [
        'Schedule a follow-up check-in call',
        'Review sleep-related signals over the next week',
        'Consider a referral to counselling services',
      ],
      explanation:
        "This risk score is generated from patterns across recent check-ins — language cues, missed check-ins, and self-reported stress. It is a support signal to guide prioritisation, not a clinical diagnosis. Always use professional judgment alongside this indicator.",
    },
  },
  hi: {
    'C-10432': {
      maskedName: 'V*** क.',
      riskBand: 'moderate',
      score: 62,
      previousScore: 54,
      lastActive: '29 अग॰ 2026',
      assignedTo: 'आप',
      contributingFactors: [
        'हाल के चेक-इन में तनाव से जुड़ी भाषा अधिक दिखी',
        'इस हफ्ते दो बार नींद में गड़बड़ी का ज़िक्र हुआ',
        'पिछली समीक्षा के बाद एक चेक-इन छूट गया',
        'सुझाई गई एक्सरसाइज़ में कम भागीदारी',
      ],
      timeline: [
        { date: '20 अग॰', type: 'alert', note: 'एक मुश्किल चेक-इन के बाद एस्केलेशन का सुझाव दिया गया।' },
        { date: '18 अग॰', type: 'checkin', note: 'फिर से नींद में गड़बड़ी का ज़िक्र हुआ।' },
        { date: '16 अग॰', type: 'checkin', note: 'काम पर ध्यान केंद्रित करने में परेशानी बताई।' },
        { date: '14 अग॰', type: 'missed', note: 'चेक-इन रिमाइंडर पूरा नहीं हुआ।' },
        { date: '12 अग॰', type: 'checkin', note: 'एक रिश्तेदार के साथ तनावपूर्ण बातचीत का ज़िक्र किया।' },
        { date: '10 अग॰', type: 'checkin', note: 'सप्ताहांत के बाद शांत महसूस हुआ, अच्छी नींद आई।' },
      ],
      interactions: [
        { date: '22 अग॰', type: 'call', summary: 'फॉलो-अप कॉल, सामना करने की रणनीतियों पर चर्चा हुई।' },
        { date: '20 अग॰', type: 'escalation', summary: 'ऑटो-एस्केलेशन ट्रिगर हुआ, आपको भेजा गया।' },
        { date: '20 अग॰', type: 'chat', summary: 'सहायता चैट सत्र, 12 संदेश।' },
        { date: '16 अग॰', type: 'note', summary: 'आंतरिक नोट: करीबी निगरानी के लिए फ़्लैग करें।' },
      ],
      interventionStatus: 'in_progress',
      notes: [{ date: '22 अग॰', text: 'कार्यभार तनाव पर चर्चा की; एक ग्राउंडिंग एक्सरसाइज़ सुझाई और एक हफ्ते में फॉलो-अप तय किया।' }],
      nextActions: [
        'फॉलो-अप चेक-इन कॉल शेड्यूल करें',
        'अगले हफ्ते नींद से जुड़े संकेतों की समीक्षा करें',
        'काउंसलिंग सेवाओं के लिए रेफ़रल पर विचार करें',
      ],
      explanation:
        'यह जोखिम स्कोर हाल के चेक-इन में मौजूद पैटर्न — भाषा के संकेत, छूटे हुए चेक-इन और स्व-रिपोर्ट किए गए तनाव — से बनाया गया है। यह प्राथमिकता तय करने के लिए एक सहायता संकेत है, कोई क्लिनिकल निदान नहीं। हमेशा इस संकेत के साथ अपने व्यावसायिक निर्णय का भी उपयोग करें।',
    },
  },
};

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
];

const COPY = {
  en: {
    caseLabel: 'Case',
    lastActive: 'Last active',
    assignedTo: 'Assigned to',
    riskHistory: 'Risk history',
    sinceLast: 'since last check-in',
    factorsTitle: 'Contributing factors',
    timelineTitle: 'Timeline',
    showMore: 'Show full timeline',
    showLess: 'Show less',
    interactionsTitle: 'Interaction history',
    statusTitle: 'Intervention status',
    statusOptions: {
      unassigned: 'Unassigned',
      in_progress: 'In progress',
      scheduled: 'Follow-up scheduled',
      resolved: 'Resolved',
    },
    notesTitle: 'Notes',
    notePlaceholder: 'Add a case note…',
    addNote: 'Add note',
    nextActionsTitle: 'Next actions',
    explanationTitle: 'Explanation — why this score?',
    missedLabel: 'Missed check-in',
    alertLabel: 'Escalation',
    loading: 'Loading case…',
    notFoundTitle: 'Case not found',
    notFoundBody: "No case matches this ID in the current mock data. Try the demo case instead.",
    viewDemo: 'View demo case (C-10432)',
  },
  hi: {
    caseLabel: 'केस',
    lastActive: 'अंतिम सक्रियता',
    assignedTo: 'सौंपा गया',
    riskHistory: 'जोखिम इतिहास',
    sinceLast: 'पिछले चेक-इन की तुलना में',
    factorsTitle: 'योगदान देने वाले कारक',
    timelineTitle: 'टाइमलाइन',
    showMore: 'पूरी टाइमलाइन देखें',
    showLess: 'कम दिखाएं',
    interactionsTitle: 'इंटरैक्शन इतिहास',
    statusTitle: 'हस्तक्षेप स्थिति',
    statusOptions: {
      unassigned: 'असाइन नहीं',
      in_progress: 'प्रगति में',
      scheduled: 'फॉलो-अप तय',
      resolved: 'सुलझाया गया',
    },
    notesTitle: 'नोट्स',
    notePlaceholder: 'केस नोट जोड़ें…',
    addNote: 'नोट जोड़ें',
    nextActionsTitle: 'अगले कदम',
    explanationTitle: 'व्याख्या — यह स्कोर क्यों?',
    missedLabel: 'चेक-इन छूट गया',
    alertLabel: 'एस्केलेशन',
    loading: 'केस लोड हो रहा है…',
    notFoundTitle: 'केस नहीं मिला',
    notFoundBody: 'मौजूदा मॉक डेटा में इस ID से मेल खाता कोई केस नहीं है। डेमो केस आज़माएं।',
    viewDemo: 'डेमो केस देखें (C-10432)',
  },
};

const BAND_BADGE_COLOR = { low: 'teal', moderate: 'amber', high: 'red' };
const INTERACTION_ICON = { call: Phone, chat: MessageSquare, note: StickyNote, escalation: AlertTriangle };

// Mock "fetch" — swap this for a real API call later.
function useCaseRecord(caseId, language) {
  const [state, setState] = useState({ isLoading: true, data: null });

  useEffect(() => {
    setState({ isLoading: true, data: null });
    const timer = setTimeout(() => {
      const record = CASES_BY_LANG[language][caseId] ?? null;
      setState({ isLoading: false, data: record });
    }, 500);
    return () => clearTimeout(timer);
  }, [caseId, language]);

  return state;
}

export default function CaseDetail({ caseId = 'C-10432' }) {
  const [language, setLanguage] = useState('en');
  const [activeCaseId, setActiveCaseId] = useState(caseId);
  const { isLoading, data } = useCaseRecord(activeCaseId, language);

  const [status, setStatus] = useState('in_progress');
  const [notes, setNotes] = useState([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [completedActions, setCompletedActions] = useState({});
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const t = COPY[language];

  useEffect(() => {
    if (data) {
      setStatus(data.interventionStatus);
      setNotes(data.notes);
    }
  }, [data]);

  const trendDelta = data ? data.score - data.previousScore : 0;
  const TrendIcon = trendDelta > 0 ? TrendingUp : trendDelta < 0 ? TrendingDown : Minus;
  const trendColor = trendDelta > 0 ? 'text-amber-400' : trendDelta < 0 ? 'text-teal-400' : 'text-slate-400';

  const visibleTimeline = useMemo(() => {
    if (!data) return [];
    return showFullTimeline ? data.timeline : data.timeline.slice(0, 3);
  }, [data, showFullTimeline]);

  const handleAddNote = () => {
    const trimmed = noteDraft.trim();
    if (!trimmed) return;
    setNotes((prev) => [{ date: language === 'en' ? 'Just now' : 'अभी', text: trimmed }, ...prev]);
    setNoteDraft('');
  };

  const toggleAction = (index) => {
    setCompletedActions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      {/* Language switch (always visible, even during loading/not-found) */}
      <div className="flex justify-end">
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

      {/* Loading state */}
      {isLoading && (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" aria-hidden="true" />
          <p className="text-sm">{t.loading}</p>
        </Card>
      )}

      {/* Not-found / empty state */}
      {!isLoading && !data && (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <SearchX className="h-6 w-6 text-slate-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-slate-200">{t.notFoundTitle}</h2>
          <p className="max-w-xs text-sm text-slate-500">{t.notFoundBody}</p>
          <Button
            type="button"
            onClick={() => setActiveCaseId('C-10432')}
            className="mt-1 rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400"
          >
            {t.viewDemo}
          </Button>
        </Card>
      )}

      {/* Loaded case */}
      {!isLoading && data && (
        <>
          {/* Case header */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                  <User className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {t.caseLabel} {activeCaseId} · {data.maskedName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.lastActive}: {data.lastActive} · {t.assignedTo}: {data.assignedTo}
                  </p>
                </div>
              </div>
              <Badge color={BAND_BADGE_COLOR[data.riskBand]}>{data.riskBand}</Badge>
            </div>
          </Card>

          {/* Risk history (compact) */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.riskHistory}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-100">{data.score}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${trendColor}`}>
                <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {trendDelta >= 0 ? '+' : ''}
                  {trendDelta} {t.sinceLast}
                </span>
              </div>
            </div>
          </Card>

          {/* Contributing factors */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.factorsTitle}</h2>
            <ul className="space-y-2">
              {data.contributingFactors.map((factor) => (
                <li key={factor} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Timeline (progressive disclosure) */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.timelineTitle}</h2>
            <ul className="space-y-2">
              {visibleTimeline.map((entry) => (
                <li
                  key={entry.date + entry.note}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5"
                >
                  {entry.type === 'missed' ? (
                    <CalendarX className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                  ) : entry.type === 'alert' ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                  ) : (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">{entry.date}</span>
                      {entry.type === 'missed' && <Badge color="slate">{t.missedLabel}</Badge>}
                      {entry.type === 'alert' && <Badge color="red">{t.alertLabel}</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{entry.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            {data.timeline.length > 3 && (
              <button
                type="button"
                onClick={() => setShowFullTimeline((prev) => !prev)}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300"
              >
                {showFullTimeline ? t.showLess : t.showMore}
                {showFullTimeline ? (
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            )}
          </Card>

          {/* Interaction history (collapsible) */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-0">
            <button
              type="button"
              onClick={() => setShowInteractions((prev) => !prev)}
              aria-expanded={showInteractions}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-200"
            >
              <span>{t.interactionsTitle}</span>
              {showInteractions ? (
                <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
              )}
            </button>
            {showInteractions && (
              <ul className="space-y-2 border-t border-slate-800 px-5 pb-5 pt-4">
                {data.interactions.map((item, i) => {
                  const Icon = INTERACTION_ICON[item.type] || MessageSquare;
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                      <div>
                        <span className="text-xs font-medium text-slate-500">{item.date}</span>
                        <p>{item.summary}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Intervention status */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.statusTitle}</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {Object.entries(t.statusOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Card>

          {/* Notes */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.notesTitle}</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder={t.notePlaceholder}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <Button
                type="button"
                onClick={handleAddNote}
                disabled={!noteDraft.trim()}
                className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
              >
                {t.addNote}
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {notes.map((note, i) => (
                <li key={i} className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300">
                  <span className="mb-1 block text-xs font-medium text-slate-500">{note.date}</span>
                  {note.text}
                </li>
              ))}
            </ul>
          </Card>

          {/* Next actions */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.nextActionsTitle}</h2>
            <ul className="space-y-2">
              {data.nextActions.map((action, i) => (
                <li key={action}>
                  <button
                    type="button"
                    onClick={() => toggleAction(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      completedActions[i]
                        ? 'border-teal-700 bg-teal-500/10 text-slate-400 line-through'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        completedActions[i] ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-600'
                      }`}
                    >
                      {completedActions[i] && '✓'}
                    </span>
                    {action}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Explanation drawer */}
          <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-0">
            <button
              type="button"
              onClick={() => setShowExplanation((prev) => !prev)}
              aria-expanded={showExplanation}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-200"
            >
              <span>{t.explanationTitle}</span>
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
        </>
      )}
    </div>
  );
}
