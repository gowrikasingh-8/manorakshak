import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";

/**
 * NOTE on assumed component APIs (adjust if your actual components differ):
 * <Button variant="primary" | "secondary" | "ghost" | "outline" size="sm" | "md" onClick disabled>
 * <Card className children>
 * <Badge variant="info" | "success" | "warning" | "danger" | "default">{label}</Badge>
 *
 * No spec was pasted for P28, so this covers the standard shape of an
 * audit/activity trail: actor + action + date filters, a search box,
 * a chronological timeline grouped by day, expandable entry detail,
 * and an export/download flow (consistent with the Reports page).
 * Tell me if the real P28 spec differs and I'll adjust.
 */

const ACTION_TYPES = [
  "All actions",
  "Login",
  "Consent updated",
  "Record viewed",
  "Record edited",
  "Report exported",
  "Notification sent",
  "Permission changed",
];

const ACTORS = ["All users", "Anil Kumar", "R. Sharma", "System", "Priya M."];

const ACTIVITY_LOG = [
  {
    id: 1,
    date: "03 Sep 2026",
    time: "10:42 AM",
    actor: "Anil Kumar",
    action: "Record edited",
    target: "Patient record #4821",
    severity: "default",
    detail: "Updated contact number and preferred language field.",
    meta: { ip: "10.24.3.18", device: "Chrome / Windows" },
  },
  {
    id: 2,
    date: "03 Sep 2026",
    time: "09:15 AM",
    actor: "System",
    action: "Notification sent",
    target: "Check-in reminder batch (312 recipients)",
    severity: "info",
    detail: "Scheduled weekly check-in reminders dispatched via push + email.",
    meta: { ip: "internal", device: "Scheduled job" },
  },
  {
    id: 3,
    date: "02 Sep 2026",
    time: "6:03 PM",
    actor: "R. Sharma",
    action: "Permission changed",
    target: "User role: Priya M.",
    severity: "warning",
    detail: "Elevated role from 'Viewer' to 'Case manager'.",
    meta: { ip: "172.16.9.4", device: "Firefox / macOS" },
  },
  {
    id: 4,
    date: "02 Sep 2026",
    time: "3:47 PM",
    actor: "Priya M.",
    action: "Report exported",
    target: "Monthly summary — August 2026",
    severity: "info",
    detail: "Exported as PDF, filtered to North zone.",
    meta: { ip: "172.16.9.20", device: "Chrome / Windows" },
  },
  {
    id: 5,
    date: "01 Sep 2026",
    time: "11:29 AM",
    actor: "Anil Kumar",
    action: "Consent updated",
    target: "Patient record #4821",
    severity: "success",
    detail: "Data-sharing consent renewed for periodic check-ins.",
    meta: { ip: "10.24.3.18", device: "Chrome / Windows" },
  },
  {
    id: 6,
    date: "01 Sep 2026",
    time: "8:02 AM",
    actor: "System",
    action: "Login",
    target: "Failed login attempt — unknown device",
    severity: "danger",
    detail: "3 failed attempts for account 'r.sharma@example.org' before lockout.",
    meta: { ip: "203.0.113.55", device: "Unknown" },
  },
];

function severityLabel(sev) {
  if (sev === "danger") return "Security";
  if (sev === "warning") return "Elevated";
  if (sev === "success") return "Consent";
  if (sev === "info") return "System";
  return "Standard";
}

// group entries by date, preserving log order
function groupByDate(entries) {
  const groups = [];
  const byDate = {};
  for (const entry of entries) {
    if (!byDate[entry.date]) {
      byDate[entry.date] = [];
      groups.push(entry.date);
    }
    byDate[entry.date].push(entry);
  }
  return groups.map((date) => ({ date, entries: byDate[date] }));
}

export default function AuditTimelinePage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All actions");
  const [actorFilter, setActorFilter] = useState("All users");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [downloadState, setDownloadState] = useState("idle"); // idle | generating | ready

  const filtered = ACTIVITY_LOG.filter((e) => {
    if (actionFilter !== "All actions" && e.action !== actionFilter) return false;
    if (actorFilter !== "All users" && e.actor !== actorFilter) return false;
    if (
      search &&
      !`${e.actor} ${e.action} ${e.target} ${e.detail}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const grouped = groupByDate(filtered);

  function handleExport() {
    setDownloadState("generating");
    setTimeout(() => setDownloadState("ready"), 1000);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-teal-400 m-0 mb-1">
              Audit &amp; activity timeline
            </h1>
            <p className="text-slate-300 m-0">
              Track who did what, when — across records, consent and access.
            </p>
          </div>
          <Badge variant="info">Admin access</Badge>
        </div>

        {/* FILTERS */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-4">Filters</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search actions, records, actors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                Action type
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {ACTION_TYPES.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-300">
                Actor
                <select
                  value={actorFilter}
                  onChange={(e) => setActorFilter(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {ACTORS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                From
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                To
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </label>
              <Button variant="primary" size="sm">
                Apply filters
              </Button>
            </div>
          </div>
        </Card>

        {/* TIMELINE */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-teal-400 m-0">
                Activity log
              </h2>
              <p className="text-xs text-slate-400 m-0">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </p>
            </div>

            {grouped.length === 0 ? (
              <p className="text-slate-400 text-sm py-6 text-center m-0">
                No activity matches these filters.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {grouped.map((group) => (
                  <div key={group.date}>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                      {group.date}
                    </p>
                    <ul className="list-none m-0 p-0 border-l border-slate-700 pl-4 flex flex-col gap-4">
                      {group.entries.map((e) => {
                        const isExpanded = expandedId === e.id;
                        return (
                          <li key={e.id} className="relative">
                            <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-400" />
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <p className="text-slate-100 font-medium m-0">
                                    {e.actor}
                                  </p>
                                  <Badge variant={e.severity}>
                                    {severityLabel(e.severity)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-300 m-0">
                                  {e.action} — {e.target}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 mb-0">
                                  {e.time}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : e.id)
                                }
                              >
                                {isExpanded ? "Hide details" : "View details"}
                              </Button>
                            </div>

                            {isExpanded && (
                              <div className="mt-3 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                                <p className="m-0 mb-2">{e.detail}</p>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
                                  <span>IP: {e.meta.ip}</span>
                                  <span>Device: {e.meta.device}</span>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* EXPORT */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-medium text-teal-400 m-0 mb-1">
                  Export audit log
                </h2>
                <p className="text-sm text-slate-400 m-0">
                  Download the filtered log for compliance records.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
                disabled={downloadState === "generating"}
              >
                {downloadState === "idle" && "Download CSV"}
                {downloadState === "generating" && "Preparing download…"}
                {downloadState === "ready" && "Downloaded ✓"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
