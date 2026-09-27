import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleModal from "../components/ScheduleModal";

/**
 * CheckIn.jsx
 * Calm, accessible victim-support check-in UI.
 * Requires Tailwind CSS with darkMode: "class".
 */

const DEFAULT_QUESTIONS = [
  {
    id: "overall_emotional_state",
    title: "1. Overall Emotional State",
    description: "How would you rate your general emotional state or mood today?",
    type: "emotion",
    options: [
      { value: "calm", label: "Calm & Grounded", emoji: "😌" },
      { value: "okay", label: "Okay / Stable", emoji: "🙂" },
      { value: "uneasy", label: "Uneasy / Anxious", emoji: "😕" },
      { value: "overwhelmed", label: "Overwhelmed / Distressed", emoji: "😣" },
      { value: "prefer-not", label: "Prefer not to say", emoji: "—" },
    ],
  },
  {
    id: "distress_spikes",
    title: "2. Distress Spikes",
    description: "Did you experience any sharp spikes in anxiety, distress, or panic during the day?",
    type: "choice",
    options: [
      { value: "none", label: "No significant spikes" },
      { value: "mild", label: "Yes, mild or brief spikes" },
      { value: "severe", label: "Yes, intense or prolonged spikes" },
      { value: "prefer-not", label: "Prefer not to say" },
    ],
  },
  {
    id: "grounding_regulation",
    title: "3. Grounding & Regulation",
    description: "Were you able to use any grounding techniques or feel grounded when feeling overwhelmed?",
    type: "choice",
    options: [
      { value: "yes-effective", label: "Yes, and it helped" },
      { value: "tried-difficult", label: "Tried, but it was difficult" },
      { value: "no-couldnt", label: "No / Could not bring myself to" },
      { value: "not-needed", label: "Did not feel overwhelmed today" },
    ],
  },
  {
    id: "mental_clarity_fog",
    title: "4. Mental Clarity & Fog",
    description: "How clear was your mind today, or did you feel heavy mental fog / dissociation?",
    type: "choice",
    options: [
      { value: "clear", label: "Clear & Focused" },
      { value: "slight-fog", label: "Slight mental fog" },
      { value: "heavy-fog", label: "Heavy fog / Dissociation" },
      { value: "prefer-not", label: "Prefer not to say" },
    ],
  },
  {
    id: "sleep_quality",
    title: "5. Sleep Quality",
    description: "How restorative or peaceful was your sleep last night?",
    type: "choice",
    options: [
      { value: "restful", label: "Restful & Sufficient" },
      { value: "interrupted", label: "Interrupted / Restless" },
      { value: "insufficient", label: "Very little or no sleep" },
      { value: "nightmares", label: "Disturbed by nightmares / anxiety" },
    ],
  },
  {
    id: "basic_physical_care",
    title: "6. Basic Physical Care",
    description: "Were you able to meet your basic daily needs today (eating, hydrating, moving)?",
    type: "choice",
    multiple: true,
    options: [
      { value: "meals", label: "Ate regular meals" },
      { value: "hydration", label: "Stayed hydrated" },
      { value: "movement", label: "Got some physical movement / rest" },
      { value: "struggled", label: "Struggled with basic daily tasks today" },
    ],
  },
  {
    id: "coping_tool_effectiveness",
    title: "7. Coping Tool Effectiveness",
    description: "Did any self-soothing or coping strategies help ease your mind today?",
    type: "choice",
    multiple: true,
    options: [
      { value: "breathing", label: "Breathing or relaxation exercises" },
      { value: "journaling", label: "Writing or expressing thoughts" },
      { value: "distraction", label: "Distraction (music, media, walks)" },
      { value: "none-worked", label: "Nothing seemed to help today" },
    ],
  },
  {
    id: "social_connection",
    title: "8. Social Connection",
    description: "Did you feel safe, connected, or supported by anyone in your environment today?",
    type: "choice",
    options: [
      { value: "connected", label: "Yes, felt supported and safe" },
      { value: "somewhat", label: "Somewhat connected" },
      { value: "isolated", label: "Felt isolated or unsupported" },
      { value: "prefer-alone", label: "Preferred to be alone" },
    ],
  },
  {
    id: "support_needs",
    title: "9. Support Needs",
    description: "Do you feel like you need extra guidance, professional legal/counseling aid, or immediate intervention right now?",
    type: "choice",
    multiple: true,
    options: [
      { value: "counseling", label: "Counseling or mental health guidance" },
      { value: "legal-aid", label: "Legal or formal support aid" },
      { value: "checkin-call", label: "A follow-up call from support team" },
      { value: "none-now", label: "I am okay for now" },
    ],
  },
  {
    id: "outlook_tomorrow",
    title: "10. Outlook for Tomorrow",
    description: "How hopeful or manageable does tomorrow feel to you right now? Feel free to add any thoughts below.",
    type: "text",
    placeholder: "Share how tomorrow feels or anything else you'd like your support team to know...",
    maxLength: 1000,
  },
];

const STORAGE_KEY = "victim-support-checkin-draft";

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export default function CheckIn({
  questions = DEFAULT_QUESTIONS,
  onSubmit,
  onSave,
  storageKey = STORAGE_KEY,
}) {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveText, setSaveText] = useState("Autosaved locally");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const recognitionRef = useRef(null);
  const saveTimer = useRef(null);
  const navigate = useNavigate();
  const current = questions[step];
  const total = questions.length;
  const progress = Math.round(((step + 1) / total) * 100);

  const answeredCount = useMemo(
    () => questions.filter((q) => hasValue(answers[q.id])).length,
    [answers, questions]
  );

  // Restore draft.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;

      const draft = JSON.parse(saved);

      if (draft.answers) setAnswers(draft.answers);
      if (
        Number.isInteger(draft.step) &&
        draft.step >= 0 &&
        draft.step < questions.length
      ) {
        setStep(draft.step);
      }
      if (draft.skipped) setSkipped(draft.skipped);
    } catch {
      // Ignore invalid or unavailable local storage.
    }

    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, [storageKey, questions.length]);

  // Autosave whenever the form changes.
  useEffect(() => {
    if (submitted) return;

    setIsSaving(true);
    clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      const draft = {
        version: 1,
        savedAt: new Date().toISOString(),
        step,
        answers,
        skipped,
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
        setSaveText("Autosaved locally");
        onSave?.(draft);
      } catch {
        setSaveText("Autosave unavailable");
      }

      setIsSaving(false);
    }, 400);

    return () => clearTimeout(saveTimer.current);
  }, [answers, step, skipped, submitted, storageKey, onSave]);

  useEffect(() => {
    return () => {
      clearTimeout(saveTimer.current);
      recognitionRef.current?.stop?.();
    };
  }, []);

  const updateAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    setSkipped((prev) => ({ ...prev, [current.id]: false }));
    setError("");
  };

  const selectChoice = (value) => {
    if (!current.multiple) {
      updateAnswer(value);
      return;
    }

    const existing = Array.isArray(answers[current.id])
      ? answers[current.id]
      : [];

    const next = existing.includes(value)
      ? existing.filter((item) => item !== value)
      : [...existing, value];

    updateAnswer(next);
  };

  const skipQuestion = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[current.id];
      return next;
    });

    setSkipped((prev) => ({ ...prev, [current.id]: true }));
    setError("");

    if (step < total - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const previous = () => {
    setError("");
    setStep((prev) => Math.max(0, prev - 1));
  };

  const next = () => {
    setError("");

    if (step < total - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    submit();
  };

  const startVoiceInput = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setError(
        "Voice input is not available in this browser. You can type your response instead."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      updateAnswer(transcript.trim());
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Voice input could not be used. You can continue by typing.");
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop?.();
    setListening(false);
  };

  const submit = () => {
    const payload = {
      submittedAt: new Date().toISOString(),
      completedSteps: answeredCount,
      totalSteps: total,
      responses: questions.map((question) => ({
        questionId: question.id,
        status: hasValue(answers[question.id]) ? "answered" : "skipped",
        value: hasValue(answers[question.id]) ? answers[question.id] : null,
      })),
      interpretationNotice:
        "These responses are support check-in information only and must not be treated as a medical diagnosis.",
    };

    try {
      localStorage.setItem(
        `${storageKey}-last-submission`,
        JSON.stringify(payload)
      );
      localStorage.removeItem(storageKey);
    } catch {
      // Submission should still work if local storage is unavailable.
    }

    setSubmitted(true);
    setSaveText("Check-in submitted");
    onSubmit?.(payload);
  };

  const restart = () => {
    setAnswers({});
    setSkipped({});
    setStep(0);
    setSubmitted(false);
    setError("");
    setSaveText("Starting a new check-in");

    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage errors.
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-8 text-slate-900 dark:text-slate-100">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <section className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-xl text-emerald-700 dark:text-emerald-400">
              ✓
            </div>

            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Thank you for checking in
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Your responses have been saved as support information. They are
              not a medical diagnosis. Authorized support staff can use the
              information according to your organization&apos;s privacy and
              safeguarding procedures.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 text-left text-sm leading-6 text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">
                You are in control.
              </strong>{" "}
              You can choose what to share during a check-in, and you never
              need to disclose sensitive details just to use this experience.
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/result")}
                className="w-full rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-500"
              >
                View My Result
              </button>
              <button
                type="button"
                onClick={() => navigate("/trends")}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                View My Trends
              </button>
              <button
                type="button"
                onClick={() => navigate("/support")}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Explore Support Options
              </button>
              <button
                type="button"
                onClick={() => setScheduleOpen(true)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Schedule a Follow-up
              </button>
              <button
                type="button"
                onClick={restart}
                className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Start another check-in
              </button>
            </div>
          </section>
        </div>

        <ScheduleModal
          open={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          onConfirm={(data) => console.log("Scheduled:", data)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Support check-in
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                How are you doing today?
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                A short, optional check-in to help your support team understand
                what kind of support may be useful.
              </p>
            </div>

            <div
              className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
              aria-live="polite"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isSaving ? "animate-pulse bg-amber-400" : "bg-emerald-500"
                }`}
                aria-hidden="true"
              />
              {isSaving ? "Saving…" : saveText}
            </div>
          </div>
        </header>

        {/* Privacy notice */}
        <div
          role="note"
          className="mb-6 flex gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm"
        >
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-sm"
          >
            🔒
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Share only what feels safe
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
              Every question can be skipped. This check-in supports human
              decision-making and does not diagnose a medical or mental-health
              condition.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <nav
          aria-label="Check-in progress"
          className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">
              Step {step + 1} of {total}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {progress}% complete
            </span>
          </div>

          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-slate-700 dark:bg-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= step ||
                  hasValue(answers[question.id]) ||
                  skipped[question.id]
                    ? "bg-slate-700 dark:bg-teal-500"
                    : "bg-slate-100 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </nav>

        {/* Question */}
        <section
          aria-labelledby={`question-${current.id}`}
          className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm sm:p-8"
        >
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Optional question
            </p>

            <h2
              id={`question-${current.id}`}
              className="mt-2 text-xl font-bold leading-8 sm:text-2xl"
            >
              {current.title}
            </h2>

            {current.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                {current.description}
              </p>
            )}
          </div>

          {/* Emotion chips */}
          {current.type === "emotion" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {current.options.map((option) => {
                const selected = answers[current.id] === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateAnswer(option.value)}
                    aria-pressed={selected}
                    className={`min-h-[88px] rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 ${
                      selected
                        ? "border-slate-700 dark:border-teal-500 bg-slate-100 dark:bg-slate-700 ring-2 ring-slate-700 dark:ring-teal-500"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span className="mt-2 block text-sm font-semibold">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Choice options */}
          {current.type === "choice" && (
            <div className="space-y-3">
              {current.options.map((option) => {
                const selected = current.multiple
                  ? Array.isArray(answers[current.id]) &&
                    answers[current.id].includes(option.value)
                  : answers[current.id] === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectChoice(option.value)}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 ${
                      selected
                        ? "border-slate-700 dark:border-teal-500 bg-slate-50 dark:bg-slate-700"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-sm font-medium">{option.label}</span>

                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                        selected
                          ? "border-slate-700 dark:border-teal-500 bg-slate-700 dark:bg-teal-500 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Text input */}
          {current.type === "text" && (
            <div>
              <textarea
                value={answers[current.id] || ""}
                onChange={(event) =>
                  updateAnswer(
                    event.target.value.slice(0, current.maxLength || 1000)
                  )
                }
                placeholder={current.placeholder}
                maxLength={current.maxLength || 1000}
                rows={7}
                className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-4 text-sm leading-6 text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700"
                aria-label="Your response"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {String(answers[current.id] || "").length}/
                  {current.maxLength || 1000}
                </span>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={listening ? stopVoiceInput : startVoiceInput}
                    aria-pressed={listening}
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 ${
                      listening
                        ? "border-slate-700 dark:border-teal-500 bg-slate-800 dark:bg-teal-600 text-white"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span aria-hidden="true">{listening ? "■" : "🎙"}</span>
                    {listening ? "Stop voice input" : "Optional voice input"}
                  </button>
                )}
              </div>

              {listening && (
                <p
                  className="mt-3 text-xs text-slate-500 dark:text-slate-400"
                  aria-live="polite"
                >
                  Listening… speak when you are ready. You can stop at any
                  time.
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-300"
            >
              {error}
            </p>
          )}

          {/* Controls */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-slate-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={skipQuestion}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 underline-offset-4 hover:bg-slate-50 dark:hover:bg-slate-700 hover:underline focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700"
            >
              Skip / decline
            </button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={previous}
                disabled={step === 0}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700"
              >
                Back
              </button>

              <button
                type="button"
                onClick={next}
                className="rounded-xl bg-slate-900 dark:bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700"
              >
                {step === total - 1 ? "Save & submit" : "Save & continue"}
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
          <p>
            Your responses are intended to support human review. They should
            not be presented as an AI diagnosis or medical assessment.
          </p>
          <p className="mt-1">
            Autosave stores the current draft locally on this device.
          </p>
        </footer>
      </div>
    </main>
  );
}