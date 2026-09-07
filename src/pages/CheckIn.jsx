import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * CheckIn.jsx
 * Calm, accessible victim-support check-in UI.
 * Requires Tailwind CSS.
 *
 * Features:
 * - One question at a time
 * - Step indicator + progress
 * - Skip / decline
 * - Emotion chips
 * - Text input
 * - Optional microphone / browser speech recognition
 * - Autosave to localStorage
 * - Save & continue
 * - Final submit
 * - No diagnosis or clinical scoring
 */

const DEFAULT_QUESTIONS = [
  {
    id: "overall",
    title: "How are things feeling for you right now?",
    description:
      "Choose an option that feels comfortable. You do not need to explain why.",
    type: "emotion",
    options: [
      { value: "calm", label: "Calm", emoji: "😌" },
      { value: "okay", label: "Okay", emoji: "🙂" },
      { value: "uneasy", label: "Uneasy", emoji: "😕" },
      { value: "overwhelmed", label: "Overwhelmed", emoji: "😣" },
      { value: "prefer-not", label: "Prefer not to say", emoji: "—" },
    ],
  },
  {
    id: "support",
    title: "What would feel most helpful today?",
    description:
      "Select anything that sounds useful. You can choose more than one.",
    type: "choice",
    multiple: true,
    options: [
      { value: "someone-listen", label: "Someone to listen" },
      { value: "practical-help", label: "Practical support" },
      { value: "resources", label: "Information or resources" },
      { value: "follow-up", label: "A follow-up from my support team" },
      { value: "quiet", label: "Some quiet time" },
    ],
  },
  {
    id: "checkin",
    title: "Is there anything you would like your support team to know?",
    description:
      "Share only what you are comfortable sharing. You can keep your response general.",
    type: "text",
    placeholder: "You can write a short note here...",
    maxLength: 1000,
  },
  {
    id: "followup",
    title: "Would you like someone from your support team to check in with you?",
    description:
      "This is optional. It does not replace emergency or medical services.",
    type: "choice",
    options: [
      { value: "yes", label: "Yes, please" },
      { value: "later", label: "Maybe later" },
      { value: "no", label: "No, thank you" },
      { value: "prefer-not", label: "Prefer not to say" },
    ],
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

  const recognitionRef = useRef(null);
  const saveTimer = useRef(null);

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
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <section className="w-full rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-700">
              ✓
            </div>

            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Thank you for checking in
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Your responses have been saved as support information. They are
              not a medical diagnosis. Authorized support staff can use the
              information according to your organization&apos;s privacy and
              safeguarding procedures.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600">
              <strong className="text-slate-800">You are in control.</strong>{" "}
              You can choose what to share during a check-in, and you never
              need to disclose sensitive details just to use this experience.
            </div>

            <button
              type="button"
              onClick={restart}
              className="mt-7 w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Start another check-in
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Support check-in
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                How are you doing today?
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A short, optional check-in to help your support team understand
                what kind of support may be useful.
              </p>
            </div>

            <div
              className="flex items-center gap-2 text-xs text-slate-500"
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
          className="mb-6 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm"
          >
            🔒
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Share only what feels safe
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Every question can be skipped. This check-in supports human
              decision-making and does not diagnose a medical or mental-health
              condition.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <nav
          aria-label="Check-in progress"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">
              Step {step + 1} of {total}
            </span>
            <span className="text-sm text-slate-500">
              {progress}% complete
            </span>
          </div>

          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-slate-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= step || hasValue(answers[question.id]) || skipped[question.id]
                    ? "bg-slate-700"
                    : "bg-slate-100"
                }`}
              />
            ))}
          </div>
        </nav>

        {/* Question */}
        <section
          aria-labelledby={`question-${current.id}`}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Optional question
            </p>

            <h2
              id={`question-${current.id}`}
              className="mt-2 text-xl font-bold leading-8 sm:text-2xl"
            >
              {current.title}
            </h2>

            {current.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
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
                    className={`min-h-[88px] rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-slate-200 ${
                      selected
                        ? "border-slate-700 bg-slate-100 ring-2 ring-slate-700"
                        : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
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
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-slate-200 ${
                      selected
                        ? "border-slate-700 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {option.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                        selected
                          ? "border-slate-700 bg-slate-700 text-white"
                          : "border-slate-300 bg-white text-transparent"
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
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-100"
                aria-label="Your response"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-slate-400">
                  {String(answers[current.id] || "").length}/
                  {current.maxLength || 1000}
                </span>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={listening ? stopVoiceInput : startVoiceInput}
                    aria-pressed={listening}
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-200 ${
                      listening
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span aria-hidden="true">{listening ? "■" : "🎙"}</span>
                    {listening ? "Stop voice input" : "Optional voice input"}
                  </button>
                )}
              </div>

              {listening && (
                <p
                  className="mt-3 text-xs text-slate-500"
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
              className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              {error}
            </p>
          )}

          {/* Controls */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={skipQuestion}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 underline-offset-4 hover:bg-slate-50 hover:underline focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              Skip / decline
            </button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={previous}
                disabled={step === 0}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Back
              </button>

              <button
                type="button"
                onClick={next}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                {step === total - 1 ? "Save & submit" : "Save & continue"}
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs leading-5 text-slate-500">
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