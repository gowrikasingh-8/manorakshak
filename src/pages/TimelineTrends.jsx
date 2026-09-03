import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Globe, TrendingUp, TrendingDown, Minus, AlertTriangle, CalendarX } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/BadgeDI';

// ----- Fake check-in history, per language --------------------------------
// type: 'checkin' | 'missed' | 'alert'
// Swap this for a real API response later — the chart/cards don't need to change.
const HISTORY_BY_LANG = {
  en: [
    { date: 'Aug 10', score: 41, band: 'low', type: 'checkin', note: 'Felt calm after the weekend, slept well.' },
    { date: 'Aug 12', score: 45, band: 'low', type: 'checkin', note: 'Mentioned a stressful call with a relative.' },
    { date: 'Aug 14', score: null, band: null, type: 'missed', note: 'Check-in reminder was not completed.' },
    { date: 'Aug 16', score: 52, band: 'moderate', type: 'checkin', note: 'Reported trouble focusing at work.' },
    { date: 'Aug 18', score: 58, band: 'moderate', type: 'checkin', note: 'Sleep disruption mentioned again.' },
    { date: 'Aug 20', score: 63, band: 'moderate', type: 'alert', note: 'Escalation offered after a difficult check-in.' },
    { date: 'Aug 22', score: 60, band: 'moderate', type: 'checkin', note: 'Talked to a counsellor, felt somewhat better.' },
    { date: 'Aug 24', score: 55, band: 'moderate', type: 'checkin', note: 'Tried the suggested grounding exercise.' },
    { date: 'Aug 26', score: 49, band: 'low', type: 'checkin', note: 'Reported a calmer few days.' },
    { date: 'Aug 29', score: 62, band: 'moderate', type: 'checkin', note: 'Work stress increased again this week.' },
  ],
  hi: [
    { date: '10 अग॰', score: 41, band: 'low', type: 'checkin', note: 'सप्ताहांत के बाद शांत महसूस हुआ, अच्छी नींद आई।' },
    { date: '12 अग॰', score: 45, band: 'low', type: 'checkin', note: 'एक रिश्तेदार के साथ तनावपूर्ण बातचीत का ज़िक्र किया।' },
    { date: '14 अग॰', score: null, band: null, type: 'missed', note: 'चेक-इन रिमाइंडर पूरा नहीं हुआ।' },
    { date: '16 अग॰', score: 52, band: 'moderate', type: 'checkin', note: 'काम पर ध्यान केंद्रित करने में परेशानी बताई।' },
    { date: '18 अग॰', score: 58, band: 'moderate', type: 'checkin', note: 'फिर से नींद में गड़बड़ी का ज़िक्र हुआ।' },
    { date: '20 अग॰', score: 63, band: 'moderate', type: 'alert', note: 'एक मुश्किल चेक-इन के बाद एस्केलेशन का सुझाव दिया गया।' },
    { date: '22 अग॰', score: 60, band: 'moderate', type: 'checkin', note: 'काउंसलर से बात की, कुछ बेहतर महसूस हुआ।' },
    { date: '24 अग॰', score: 55, band: 'moderate', type: 'checkin', note: 'सुझाई गई ग्राउंडिंग एक्सरसाइज़ आज़माई।' },
    { date: '26 अग॰', score: 49, band: 'low', type: 'checkin', note: 'कुछ शांत दिनों की जानकारी दी।' },
    { date: '29 अग॰', score: 62, band: 'moderate', type: 'checkin', note: 'इस हफ्ते फिर से काम का तनाव बढ़ा।' },
  ],
};

const FILTERS = [
  { key: '5', labelEn: 'Last 5', labelHi: 'पिछले 5' },
  { key: '10', labelEn: 'Last 10', labelHi: 'पिछले 10' },
  { key: 'all', labelEn: 'All time', labelHi: 'सभी' },
];

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
];

const COPY = {
  en: {
    title: 'Your Trend Over Time',
    subtitle: 'A view of your support signal across recent check-ins',
    summaryUp: (delta, missed) =>
      `Your signal has trended upward by ${delta} points over this period${
        missed ? `, including ${missed} missed check-in${missed > 1 ? 's' : ''}` : ''
      }. This can happen during a harder stretch — it doesn't mean something is wrong.`,
    summaryDown: (delta, missed) =>
      `Your signal has trended downward by ${Math.abs(delta)} points over this period${
        missed ? `, including ${missed} missed check-in${missed > 1 ? 's' : ''}` : ''
      } — a positive change.`,
    summaryStable: 'Your signal has stayed roughly stable over this period.',
    compareLabel: 'vs previous period',
    checkInsTitle: 'Check-in history',
    missedLabel: 'Missed check-in',
    alertLabel: 'Escalation offered',
    noScore: 'No score recorded',
  },
  hi: {
    title: 'समय के साथ आपका रुझान',
    subtitle: 'हाल के चेक-इन में आपके सपोर्ट सिग्नल का दृश्य',
    summaryUp: (delta, missed) =>
      `इस अवधि में आपका सिग्नल ${delta} अंकों तक बढ़ा है${
        missed ? `, जिसमें ${missed} छूटे हुए चेक-इन शामिल हैं` : ''
      }। ऐसा किसी कठिन दौर में हो सकता है — इसका मतलब यह नहीं कि कुछ गलत है।`,
    summaryDown: (delta, missed) =>
      `इस अवधि में आपका सिग्नल ${Math.abs(delta)} अंकों तक घटा है${
        missed ? `, जिसमें ${missed} छूटे हुए चेक-इन शामिल हैं` : ''
      } — यह एक सकारात्मक बदलाव है।`,
    summaryStable: 'इस अवधि में आपका सिग्नल लगभग स्थिर रहा है।',
    compareLabel: 'पिछली अवधि की तुलना में',
    checkInsTitle: 'चेक-इन इतिहास',
    missedLabel: 'चेक-इन छूट गया',
    alertLabel: 'एस्केलेशन सुझाया गया',
    noScore: 'कोई स्कोर दर्ज नहीं',
  },
};

const BAND_BADGE_COLOR = { low: 'teal', moderate: 'amber', high: 'red' };

export default function TimelineTrends() {
  const [language, setLanguage] = useState('en');
  const [filter, setFilter] = useState('10');

  const t = COPY[language];
  const fullHistory = HISTORY_BY_LANG[language];

  const visibleHistory = useMemo(() => {
    if (filter === 'all') return fullHistory;
    const n = Number(filter);
    return fullHistory.slice(-n);
  }, [fullHistory, filter]);

  const chartData = visibleHistory.map((entry) => ({ date: entry.date, score: entry.score }));

  const { trendDelta, missedCount, currentAvg, previousAvg } = useMemo(() => {
    const scored = visibleHistory.filter((e) => e.score != null);
    const missed = visibleHistory.filter((e) => e.type === 'missed').length;
    if (scored.length < 2) {
      return { trendDelta: 0, missedCount: missed, currentAvg: scored[0]?.score ?? 0, previousAvg: 0 };
    }
    const mid = Math.ceil(scored.length / 2);
    const firstHalf = scored.slice(0, mid);
    const secondHalf = scored.slice(mid);
    const avg = (arr) => Math.round(arr.reduce((sum, e) => sum + e.score, 0) / arr.length);
    const prevAvg = avg(firstHalf);
    const currAvg = secondHalf.length ? avg(secondHalf) : prevAvg;
    return {
      trendDelta: currAvg - prevAvg,
      missedCount: missed,
      currentAvg: currAvg,
      previousAvg: prevAvg,
    };
  }, [visibleHistory]);

  const TrendIcon = trendDelta > 0 ? TrendingUp : trendDelta < 0 ? TrendingDown : Minus;
  const trendColor = trendDelta > 0 ? 'text-amber-400' : trendDelta < 0 ? 'text-teal-400' : 'text-slate-400';
  const summaryText =
    trendDelta > 0
      ? t.summaryUp(trendDelta, missedCount)
      : trendDelta < 0
      ? t.summaryDown(trendDelta, missedCount)
      : t.summaryStable;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">{t.title}</h1>
          <p className="mt-0.5 text-xs text-slate-500">{t.subtitle}</p>
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

      {/* Plain-language trend summary */}
      <Card className="flex items-start gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <TrendIcon className={`mt-0.5 h-4 w-4 shrink-0 ${trendColor}`} aria-hidden="true" />
        <p className="text-sm leading-relaxed text-slate-300">{summaryText}</p>
      </Card>

      {/* Date range filter + compare period */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center overflow-hidden rounded-full border border-slate-700 bg-slate-800/70">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-slate-300 hover:text-teal-300'
              }`}
            >
              {language === 'en' ? f.labelEn : f.labelHi}
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-1.5 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {currentAvg} ({trendDelta >= 0 ? '+' : ''}
            {trendDelta}) {t.compareLabel}
          </span>
        </div>
      </div>

      {/* Chart */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#cbd5e1',
                }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2dd4bf"
                strokeWidth={2}
                dot={{ r: 3, fill: '#2dd4bf', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Check-in history / event markers / notes preview */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">{t.checkInsTitle}</h2>
        <ul className="space-y-2">
          {[...visibleHistory].reverse().map((entry) => (
            <li
              key={entry.date}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5"
            >
              {entry.type === 'missed' ? (
                <CalendarX className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              ) : entry.type === 'alert' ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              ) : (
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-400"
                  aria-hidden="true"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">{entry.date}</span>
                  {entry.band && <Badge color={BAND_BADGE_COLOR[entry.band]}>{entry.score}</Badge>}
                  {entry.type === 'missed' && (
                    <Badge color="slate">{t.missedLabel}</Badge>
                  )}
                  {entry.type === 'alert' && <Badge color="red">{t.alertLabel}</Badge>}
                </div>
                <p className="mt-1 truncate text-sm text-slate-300">{entry.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
