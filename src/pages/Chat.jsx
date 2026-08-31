import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Globe, Trash2, LifeBuoy, X } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
const MESSAGES_BY_LANG = {
  en: [
    {
      id: 'm1',
      sender: 'bot',
      text: "Hi, I'm glad you're here. How are you feeling today?",
      time: '9:01 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Honestly kind of overwhelmed. Work has been a lot this week.',
      time: '9:02 AM',
    },
    {
      id: 'm3',
      sender: 'bot',
      text: "That sounds heavy to carry. Overwhelm often builds up when there's too much coming at once \u2014 do you want to talk through what's been the hardest part, or would a quick grounding exercise help first?",
      time: '9:02 AM',
    },
    {
      id: 'm4',
      sender: 'user',
      text: "Maybe the grounding exercise. I can't really focus enough to explain everything right now.",
      time: '9:03 AM',
    },
    {
      id: 'm5',
      sender: 'bot',
      text: "That's okay, we don't need the full picture right now. Let's try a simple one: name 3 things you can see around you.",
      time: '9:03 AM',
    },
  ],
  hi: [
    {
      id: 'm1',
      sender: 'bot',
      text: '\u0928\u092e\u0938\u094d\u0924\u0947, \u092e\u0941\u091d\u0947 \u0916\u0941\u0936\u0940 \u0939\u0948 \u0915\u093f \u0906\u092a \u092f\u0939\u093e\u0902 \u0939\u0948\u0902\u0964 \u0906\u091c \u0906\u092a \u0915\u0948\u0938\u093e \u092e\u0939\u0938\u0942\u0938 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?',
      time: '9:01 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: '\u0938\u091a \u0915\u0939\u0942\u0902 \u0924\u094b \u0925\u094b\u0921\u093c\u093e \u0905\u092d\u093f\u092d\u0942\u0924 \u092e\u0939\u0938\u0942\u0938 \u0915\u0930 \u0930\u0939\u093e \u0939\u0942\u0902\u0964 \u0907\u0938 \u0939\u092b\u094d\u0924\u0947 \u0915\u093e\u092e \u092c\u0939\u0941\u0924 \u091c\u094d\u092f\u093e\u0926\u093e \u0930\u0939\u093e \u0939\u0948\u0964',
      time: '9:02 AM',
    },
    {
      id: 'm3',
      sender: 'bot',
      text: '\u092f\u0939 \u0938\u0941\u0928\u0915\u0930 \u0932\u0917\u0924\u093e \u0939\u0948 \u0915\u093f \u0906\u092a \u092a\u0930 \u0915\u093e\u092b\u0940 \u092c\u094b\u091d \u0939\u0948\u0964 \u091c\u092c \u090f\u0915 \u0938\u093e\u0925 \u092c\u0939\u0941\u0924 \u0915\u0941\u091b \u0939\u094b \u091c\u093e\u090f \u0924\u094b \u0905\u092d\u093f\u092d\u0942\u0924 \u092e\u0939\u0938\u0942\u0938 \u0939\u094b\u0928\u093e \u0906\u092e \u092c\u093e\u0924 \u0939\u0948 \u2014 \u0915\u094d\u092f\u093e \u0906\u092a \u092c\u0924\u093e\u0928\u093e \u091a\u093e\u0939\u0947\u0902\u0917\u0947 \u0915\u093f \u0938\u092c\u0938\u0947 \u092e\u0941\u0936\u094d\u0915\u093f\u0932 \u0939\u093f\u0938\u094d\u0938\u093e \u0915\u094d\u092f\u093e \u0930\u0939\u093e, \u092f\u093e \u092a\u0939\u0932\u0947 \u090f\u0915 \u091b\u094b\u091f\u093e \u0917\u094d\u0930\u093e\u0909\u0902\u0921\u093f\u0902\u0917 \u090f\u0915\u094d\u0938\u0930\u0938\u093e\u0907\u091c\u093c \u0915\u0930\u0928\u093e \u091a\u093e\u0939\u0947\u0902\u0917\u0947?',
      time: '9:02 AM',
    },
    {
      id: 'm4',
      sender: 'user',
      text: '\u0936\u093e\u092f\u0926 \u0917\u094d\u0930\u093e\u0909\u0902\u0921\u093f\u0902\u0917 \u090f\u0915\u094d\u0938\u0930\u0938\u093e\u0907\u091c\u093c \u0920\u0940\u0915 \u0930\u0939\u0947\u0917\u093e\u0964 \u0905\u092d\u0940 \u092e\u0948\u0902 \u0907\u0924\u0928\u093e \u0927\u094d\u092f\u093e\u0928 \u0915\u0947\u0902\u0926\u094d\u0930\u093f\u0924 \u0928\u0939\u0940\u0902 \u0915\u0930 \u092a\u093e \u0930\u0939\u093e \u0915\u093f \u0938\u092c \u0915\u0941\u091b \u0938\u092e\u091d\u093e \u0938\u0915\u0942\u0902\u0964',
      time: '9:03 AM',
    },
    {
      id: 'm5',
      sender: 'bot',
      text: '\u0915\u094b\u0908 \u092c\u093e\u0924 \u0928\u0939\u0940\u0902, \u0905\u092d\u0940 \u092a\u0942\u0930\u0940 \u092c\u093e\u0924 \u091c\u093e\u0928\u0928\u0947 \u0915\u0940 \u091c\u093c\u0930\u0942\u0930\u0924 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u090f\u0915 \u0906\u0938\u093e\u0928 \u0924\u0930\u0940\u0915\u093e \u0906\u091c\u093c\u092e\u093e\u0924\u0947 \u0939\u0948\u0902: \u0905\u092a\u0928\u0947 \u0906\u0938\u092a\u093e\u0938 \u0926\u093f\u0916\u0928\u0947 \u0935\u093e\u0932\u0940 3 \u091a\u0940\u091c\u093c\u094b\u0902 \u0915\u0947 \u0928\u093e\u092e \u092c\u0924\u093e\u0907\u090f\u0964',
      time: '9:03 AM',
    },
  ],
};

const SUGGESTED_REPLIES_BY_LANG = {
  en: [
    "I'm feeling anxious",
    'I just need to vent',
    'Can we try a breathing exercise?',
    "I'm okay, just checking in",
  ],
  hi: [
    '\u092e\u0941\u091d\u0947 \u091a\u093f\u0902\u0924\u093e \u0939\u094b \u0930\u0939\u0940 \u0939\u0948',
    '\u092e\u0941\u091d\u0947 \u092c\u0938 \u092e\u0928 \u0939\u0932\u094d\u0915\u093e \u0915\u0930\u0928\u093e \u0939\u0948',
    '\u0915\u094d\u092f\u093e \u0939\u092e \u0938\u093e\u0902\u0938 \u0932\u0947\u0928\u0947 \u0915\u0940 \u090f\u0915\u094d\u0938\u0930\u0938\u093e\u0907\u091c\u093c \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902?',
    '\u092e\u0948\u0902 \u0920\u0940\u0915 \u0939\u0942\u0902, \u092c\u0938 \u0939\u093e\u0932\u091a\u093e\u0932 \u092c\u0924\u093e\u0928\u0947 \u0906\u092f\u093e \u0939\u0942\u0902',
  ],
};

const AUTO_REPLY_BY_LANG = {
  en: "Thanks for sharing that. I'm listening \u2014 tell me more whenever you're ready.",
  hi: '\u0907\u0938\u0947 \u0938\u093e\u091d\u093e \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0927\u0928\u094d\u092f\u0935\u093e\u0926\u0964 \u092e\u0948\u0902 \u0938\u0941\u0928 \u0930\u0939\u093e \u0939\u0942\u0902 \u2014 \u091c\u092c \u092d\u0940 \u0924\u0948\u092f\u093e\u0930 \u0939\u094b\u0902, \u0914\u0930 \u092c\u0924\u093e\u0907\u090f\u0964',
};

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: '\u0939\u093f\u0902' },
];

const COPY = {
  en: {
    title: 'Support Chat',
    subtitle: "You're in a safe, private space",
    placeholder: 'Type a message\u2026',
    escalate: 'Talk to someone now',
    clear: 'Clear chat',
    typing: 'Counselor is typing\u2026',
    escalateTitle: 'Need urgent support?',
    escalateBody:
      "If you're in immediate danger or crisis, please connect with a real person right away. This chat is not a substitute for emergency care.",
    escalateConfirm: 'Connect me now',
    escalateCancel: 'Not right now',
    emptyState: "No messages yet. Say whatever feels right \u2014 there's no wrong way to start.",
  },
  hi: {
    title: '\u0938\u0939\u093e\u092f\u0924\u093e \u091a\u0948\u091f',
    subtitle: '\u0906\u092a \u090f\u0915 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924, \u0928\u093f\u091c\u0940 \u0938\u094d\u0925\u093e\u0928 \u092e\u0947\u0902 \u0939\u0948\u0902',
    placeholder: '\u0938\u0902\u0926\u0947\u0936 \u0932\u093f\u0916\u0947\u0902\u2026',
    escalate: '\u0905\u092d\u0940 \u0915\u093f\u0938\u0940 \u0938\u0947 \u092c\u093e\u0924 \u0915\u0930\u0947\u0902',
    clear: '\u091a\u0948\u091f \u0938\u093e\u095e \u0915\u0930\u0947\u0902',
    typing: '\u0915\u093e\u0909\u0902\u0938\u0932\u0930 \u0932\u093f\u0916 \u0930\u0939\u093e \u0939\u0948\u2026',
    escalateTitle: '\u0924\u0924\u094d\u0915\u093e\u0932 \u0938\u0939\u093e\u092f\u0924\u093e \u091a\u093e\u0939\u093f\u090f?',
    escalateBody:
      '\u092f\u0926\u093f \u0906\u092a \u0924\u0924\u094d\u0915\u093e\u0932 \u0916\u0924\u0930\u0947 \u092e\u0947\u0902 \u0939\u0948\u0902 \u092f\u093e \u0938\u0902\u0915\u091f \u092e\u0947\u0902 \u0939\u0948\u0902, \u0924\u094b \u0915\u0943\u092a\u092f\u093e \u0924\u0941\u0930\u0902\u0924 \u0915\u093f\u0938\u0940 \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964 \u092f\u0939 \u091a\u0948\u091f \u0906\u092a\u093e\u0924\u0915\u093e\u0932\u0940\u0928 \u0926\u0947\u0916\u092d\u093e\u0932 \u0915\u093e \u0935\u093f\u0915\u0932\u094d\u092a \u0928\u0939\u0940\u0902 \u0939\u0948\u0964',
    escalateConfirm: '\u092e\u0941\u091d\u0947 \u0905\u092d\u0940 \u091c\u094b\u0921\u093c\u0947\u0902',
    escalateCancel: '\u0905\u092d\u0940 \u0928\u0939\u0940\u0902',
    emptyState: '\u0905\u092d\u0940 \u0915\u094b\u0908 \u0938\u0902\u0926\u0947\u0936 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u091c\u094b \u092d\u0940 \u0938\u0939\u0940 \u0932\u0917\u0947 \u0935\u0939 \u0932\u093f\u0916\u0947\u0902 \u2014 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0930\u0928\u0947 \u0915\u093e \u0915\u094b\u0908 \u0917\u0932\u0924 \u0924\u0930\u0940\u0915\u093e \u0928\u0939\u0940\u0902 \u0939\u0948\u0964',
  },
};

export default function Chat() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState(MESSAGES_BY_LANG.en);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const scrollRef = useRef(null);

  const t = COPY[language];
  const suggestedReplies = SUGGESTED_REPLIES_BY_LANG[language];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  // Switching language resets to that language's demo conversation.
  // In a real build, you'd instead re-fetch/translate the live conversation
  // from your backend rather than swapping to canned messages.
  const handleLanguageChange = (code) => {
    setLanguage(code);
    setMessages(MESSAGES_BY_LANG[code]);
    setIsTyping(false);
  };

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // --- Placeholder: replace with a real API call to your chat backend ---
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: AUTO_REPLY_BY_LANG[language],
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
    }, 1400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowEscalationModal(false);
  };

  const handleToggleRecording = () => {
    // --- Placeholder: wire up to real speech-to-text capture here ---
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="flex h-full min-h-[600px] w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/70 px-4 py-3">
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-slate-100">{t.title}</h1>
          <p className="text-xs text-slate-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language switch */}
          <div className="flex items-center overflow-hidden rounded-full border border-slate-700 bg-slate-800/70">
            <Globe className="ml-2 h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
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

          {/* Clear chat */}
          <Button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-teal-500 hover:text-teal-300"
            aria-label={t.clear}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t.clear}</span>
          </Button>

          {/* Escalation button */}
          <Button
            type="button"
            onClick={() => setShowEscalationModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-teal-900/40 hover:bg-teal-400"
          >
            <LifeBuoy className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t.escalate}</span>
          </Button>
        </div>
      </div>

      {/* Message list */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500">{t.emptyState}</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'rounded-br-sm bg-teal-600 text-slate-950'
                  : 'rounded-bl-sm border border-slate-800 bg-slate-900 text-slate-100'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`mt-1 block text-[10px] ${
                  msg.sender === 'user' ? 'text-slate-950/60' : 'text-slate-500'
                }`}
              >
                {msg.time}
              </span>
            </Card>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start" aria-live="polite">
            <Card className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="sr-only">{t.typing}</span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-400" />
            </Card>
          </div>
        )}
      </div>

      {/* Suggested replies */}
      <div className="flex flex-wrap gap-2 border-t border-slate-800 bg-slate-900/40 px-4 py-3">
        {suggestedReplies.map((reply) => (
          <Button
            key={reply}
            type="button"
            onClick={() => sendMessage(reply)}
            className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-teal-500 hover:text-teal-300"
          >
            {reply}
          </Button>
        ))}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-800 bg-slate-900/70 px-4 py-3">
        <Button
          type="button"
          onClick={handleToggleRecording}
          aria-pressed={isRecording}
          aria-label={isRecording ? 'Stop recording' : 'Start voice message'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isRecording
              ? 'border-teal-400 bg-teal-500/20 text-teal-300 animate-pulse'
              : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-teal-500 hover:text-teal-300'
          }`}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />

        <Button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-slate-950 transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

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
                onClick={() => {
                  // --- Placeholder: route to your real crisis/escalation flow ---
                  setShowEscalationModal(false);
                }}
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
