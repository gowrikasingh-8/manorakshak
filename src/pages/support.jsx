import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import {
  HeartHandshake,
  Stethoscope,
  Scale,
  ShieldCheck,
  HandCoins,
  PhoneCall,
  Clock,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const urgencyStyles = {
  High: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Low: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
};

const supportOptions = [
  {
    id: "counselling",
    icon: HeartHandshake,
    title: "Counselling Support",
    description:
      "Connect with a licensed counsellor for one-on-one emotional guidance and coping strategies.",
    reason:
      "Recommended based on recent patterns suggesting ongoing emotional strain.",
    urgency: "Medium",
    availability: "Mon–Fri, 9 AM – 6 PM",
    responseTime: "Within 24 hours",
    contactLabel: "Talk to a Counsellor",
  },
  {
    id: "medical",
    icon: Stethoscope,
    title: "Medical Support",
    description:
      "Access confidential medical consultation, examinations, or referrals to trusted healthcare providers.",
    reason:
      "Flagged when indicators suggest a possible physical health concern requiring attention.",
    urgency: "High",
    availability: "24/7 Helpline",
    responseTime: "Immediate",
    contactLabel: "Request Medical Help",
  },
  {
    id: "legal",
    icon: Scale,
    title: "Legal Aid",
    description:
      "Get guidance from legal advisors on rights, protective orders, and formal reporting processes.",
    reason:
      "Suggested when a situation may involve rights violations or require formal documentation.",
    urgency: "Medium",
    availability: "Mon–Sat, 10 AM – 5 PM",
    responseTime: "Within 48 hours",
    contactLabel: "Consult Legal Aid",
  },
  {
    id: "protection",
    icon: ShieldCheck,
    title: "Protection & Relocation",
    description:
      "Confidential support for safety planning, emergency shelter, and relocation assistance.",
    reason:
      "Escalated when indicators point to an immediate safety risk.",
    urgency: "High",
    availability: "24/7 Emergency Line",
    responseTime: "Immediate",
    contactLabel: "Get Emergency Support",
  },
  {
    id: "financial",
    icon: HandCoins,
    title: "Financial & Rehabilitation",
    description:
      "Access financial assistance programs, skill rehabilitation, and long-term reintegration support.",
    reason:
      "Offered when recovery may be supported by financial stability or skill-building resources.",
    urgency: "Low",
    availability: "Mon–Fri, 9 AM – 5 PM",
    responseTime: "Within 3–5 days",
    contactLabel: "Explore Programs",
  },
];

function UrgencyBadge({ level }) {
  return (
    <Badge className={`text-xs px-2 py-1 rounded-full ${urgencyStyles[level]}`}>
      <AlertCircle className="inline w-3 h-3 mr-1 -mt-0.5" />
      {level} urgency
    </Badge>
  );
}

function SupportCard({ option }) {
  const Icon = option.icon;

  return (
    <Card className="flex flex-col h-full bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-teal-500/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">{option.title}</h2>
        </div>
        <UrgencyBadge level={option.urgency} />
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">
        {option.description}
      </p>

      <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60">
        <p className="text-xs text-slate-400">
          <span className="text-teal-400 font-medium">Why this is shown: </span>
          {option.reason}
        </p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Available: {option.availability}</span>
        </div>
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-slate-500" />
          <span>Response time: {option.responseTime}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium">
          {option.contactLabel}
        </Button>
        <Button className="px-3 bg-slate-700 hover:bg-slate-600 text-white">
          <PhoneCall className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function support() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <header className="max-w-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-400">
            Support &amp; Intervention Hub
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            These are suggested support options, not a diagnosis. Every
            recommendation includes the reason it was shown, its urgency, and a
            way to reach a real person.
          </p>
        </div>
        <Button
          onClick={() => navigate("/library")}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white whitespace-nowrap"
        >
          <BookOpen className="w-4 h-4" />
          View Resource Library
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {supportOptions.map((option) => (
          <SupportCard key={option.id} option={option} />
        ))}
      </div>

      {/* Booking / human contact CTA */}
      <Card className="mt-10 bg-gradient-to-r from-indigo-900/40 to-teal-900/30 border border-indigo-700/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Prefer to talk to someone directly?
          </h3>
          <p className="text-slate-300 text-sm mt-1">
            Book a confidential session or call our helpline — available
            anytime, no diagnosis required.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium px-5">
            Book a Session
          </Button>
          <Button className="bg-slate-700 hover:bg-slate-600 text-white px-5">
            Call Helpline
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default support;