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

import Badge from '../components/BadgeDI';
import { useLanguage } from '../LanguageContext'; // adjust path if your file is elsewhere

const BAND_BADGE_COLOR = { low: 'teal', moderate: 'amber', high: 'red' };



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
  const { t } = useLanguage();

  // Mock AI insight data. Text comes from locales/AIInsightCenter.js via t()
  const data = {
    current: { score: 62, band: 'moderate', label: t('ai_bandModerate') },
    previous: { score: 47, band: 'low', label: t('ai_bandLow') },
    trend: 'up',
    confidence: t('ai_confidenceMedium'),
    contextNote: t('ai_contextNote'),
    positiveSignals: [t('ai_pos1'), t('ai_pos2'), t('ai_pos3')],
    negativeSignals: [t('ai_neg1'), t('ai_neg2'), t('ai_neg3'), t('ai_neg4')],
    whyChanged: t('ai_whyChanged'),
    dataContributed: t('ai_dataContributed'),
    recommendedAction: t('ai_recommendedAction'),
    limitations: t('ai_limitations'),
  };

  const TrendIcon =
    data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    data.trend === 'up'
      ? 'text-amber-400'
      : data.trend === 'down'
      ? 'text-teal-400'
      : 'text-slate-400';
  const trendLabel =
    data.trend === 'up'
      ? t('ai_trendUp')
      : data.trend === 'down'
      ? t('ai_trendDown')
      : t('ai_trendStable');

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-teal-400">{t('ai_title')}</h1>
          <p className="mt-0.5 text-xs text-slate-500">{t('ai_subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Case Assignment Navigation Button */}
          <button
            type="button"
            onClick={() => navigate('/assign')}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors"
          >
            <UserCheck className="h-3.5 w-3.5" />
            {t('ai_assignButton')}
          </button>

          
        </div>
      </div>

      {/* Not-a-diagnosis disclaimer */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
        <Info className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden="true" />
        <span>{t('ai_notDiagnosis')}</span>
      </div>

      {/* Current vs Previous indicator */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium text-slate-500">{t('ai_previousLabel')}</p>
          <Badge color={BAND_BADGE_COLOR[data.previous.band]}>{data.previous.label}</Badge>
          <span className="text-3xl font-bold text-slate-400">{data.previous.score}</span>
        </Card>

        <Card className="flex flex-col gap-2 rounded-2xl border border-teal-700/40 bg-slate-900 p-4 ring-1 ring-teal-500/20">
          <p className="text-xs font-medium text-slate-400">{t('ai_currentLabel')}</p>
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
            <span className="font-medium text-slate-300">{t('ai_confidenceLabel')}:</span>{' '}
            {data.confidence}
          </span>
          <span>
            <span className="font-medium text-slate-300">{t('ai_contextLabel')}:</span>{' '}
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
            {t('ai_positiveTitle')}
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
            {t('ai_negativeTitle')}
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
        <h2 className="mb-2 text-sm font-semibold text-slate-200">{t('ai_actionTitle')}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{data.recommendedAction}</p>
      </Card>

      {/* Collapsible drawers */}
      <Drawer title={t('ai_whyTitle')} icon={TrendingUp}>
        {data.whyChanged}
      </Drawer>

      <Drawer title={t('ai_dataTitle')} icon={Brain}>
        {data.dataContributed}
      </Drawer>

      <Drawer title={t('ai_limitationsTitle')} icon={Info}>
        {data.limitations}
      </Drawer>
    </div>
  );
}