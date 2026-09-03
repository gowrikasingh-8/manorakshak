import { useState } from "react";
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
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Building2,
} from "lucide-react";


const STATUS_STEPS = ["Requested", "Assigned", "Contacted", "In Progress", "Completed"];

const serviceIcons = {
  counselling: HeartHandshake,
  medical: Stethoscope,
  legal: Scale,
  protection: ShieldCheck,
  financial: HandCoins,
};

const statusStyles = {
  Requested: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  Assigned: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  Contacted: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  "In Progress": "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  Completed: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
};


const referrals = [
  {
    id: "REF-1042",
    service: "Counselling Support",
    serviceKey: "counselling",
    professional: "Dr. Anjali Menon — Mitra Wellness Collective",
    requestDate: "2026-08-28",
    expectedResponse: "Within 24 hours",
    status: "In Progress",
    nextAction: "Attend the scheduled video session on Sep 5, 10:00 AM.",
    contactLabel: "Message Counsellor",
  },
  {
    id: "REF-1039",
    service: "Medical Support",
    serviceKey: "medical",
    professional: "City Care Clinic — On-call Physician",
    requestDate: "2026-08-30",
    expectedResponse: "Immediate",
    status: "Contacted",
    nextAction: "Confirm the in-person appointment slot offered by the clinic.",
    contactLabel: "Call Clinic",
  },
  {
    id: "REF-1031",
    service: "Legal Aid",
    serviceKey: "legal",
    professional: "Nirbhaya Legal Aid Society",
    requestDate: "2026-08-24",
    expectedResponse: "Within 48 hours",
    status: "Assigned",
    nextAction: "Awaiting the assigned advisor's first call — no action needed yet.",
    contactLabel: "Contact Legal Aid",
  },
  {
    id: "REF-1018",
    service: "Protection & Relocation",
    serviceKey: "protection",
    professional: "SafeHouse Network — Regional Coordinator",
    requestDate: "2026-08-15",
    expectedResponse: "Immediate",
    status: "Completed",
    nextAction: "Case closed. Reopen anytime if support is needed again.",
    contactLabel: "Reopen Request",
  },
  {
    id: "REF-1002",
    service: "Financial & Rehabilitation",
    serviceKey: "financial",
    professional: "Unassigned — matching in progress",
    requestDate: "2026-09-01",
    expectedResponse: "Within 3–5 days",
    status: "Requested",
    nextAction: "A caseworker will be assigned shortly. No action needed yet.",
    contactLabel: "View Request",
  },
];

function StatusJourney({ status }) {
  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center w-full" aria-label={`Status: ${status}`}>
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              ) : active ? (
                <Circle className="w-5 h-5 text-teal-300 fill-teal-400/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
              <span
                className={`text-[11px] leading-tight text-center w-16 ${
                  active
                    ? "text-teal-300 font-medium"
                    : done
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1 mb-4 ${
                  i < currentIndex ? "bg-teal-400/60" : "bg-slate-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReferralCard({ referral }) {
  const Icon = serviceIcons[referral.serviceKey] ?? HeartHandshake;

  return (
    <Card className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-teal-500/40 transition-colors">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{referral.service}</h2>
            <p className="text-xs text-slate-500">{referral.id}</p>
          </div>
        </div>
        <Badge className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusStyles[referral.status]}`}>
          {referral.status}
        </Badge>
      </div>

      
      <div className="mb-5 px-1">
        <StatusJourney status={referral.status} />
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2 text-slate-300">
          <Building2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <span>{referral.professional}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-300">
          <CalendarDays className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <span>Requested {referral.requestDate}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-300 sm:col-span-2">
          <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <span>Expected response: {referral.expectedResponse}</span>
        </div>
      </div>

     
      <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60">
        <p className="text-xs text-slate-400">
          <span className="text-teal-400 font-medium">Next action: </span>
          {referral.nextAction}
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <Button className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium">
          {referral.contactLabel}
        </Button>
        <Button className="px-3 bg-slate-700 hover:bg-slate-600 text-white">
          <PhoneCall className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function referralTracking() {
  const [filter, setFilter] = useState("All");

  const filters = ["All", ...STATUS_STEPS];
  const visible =
    filter === "All" ? referrals : referrals.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <header className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-400">
          Referral Tracking
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Every support request is followed through to completion. Track
          where each referral stands, who it's with, and what happens next —
          nothing here is a diagnosis, just a clear record of the journey.
        </p>
      </header>

      
      <div className="flex flex-wrap gap-2 mt-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? "bg-teal-500 text-slate-900"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {visible.map((referral) => (
          <ReferralCard key={referral.id} referral={referral} />
        ))}
        {visible.length === 0 && (
          <p className="text-slate-500 text-sm col-span-full">
            No referrals with this status yet.
          </p>
        )}
      </div>

      
      <Card className="mt-10 bg-gradient-to-r from-indigo-900/40 to-teal-900/30 border border-indigo-700/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Don't see an update yet?
          </h3>
          <p className="text-slate-300 text-sm mt-1">
            Response times are estimates. You can always reach the assigned
            professional directly, or escalate to our helpline.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium px-5 flex items-center gap-2">
            Escalate <ArrowRight className="w-4 h-4" />
          </Button>
          <Button className="bg-slate-700 hover:bg-slate-600 text-white px-5">
            Call Helpline
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default referralTracking;
