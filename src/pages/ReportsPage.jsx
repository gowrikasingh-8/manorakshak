import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";

/**
 * NOTE on assumed component APIs (adjust if your actual components differ):
 * <Button variant="primary" | "secondary" | "ghost" | "outline" size="sm" | "md" onClick disabled>
 * <Card className children>
 * <Badge variant="info" | "success" | "warning" | "danger" | "default">{label}</Badge>
 */

const DATE_PRESETS = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "custom", label: "Custom" },
];

const GEOGRAPHIES = [
  "All regions",
  "North zone",
  "South zone",
  "East zone",
  "West zone",
];

const TREND_SUMMARY = [
  { label: "Active cases", value: "1,284", delta: "+4.2%", direction: "up", tone: "warning" },
  { label: "Check-ins completed", value: "8,932", delta: "+11.6%", direction: "up", tone: "success" },
  { label: "Follow-ups overdue", value: "63", delta: "-8.1%", direction: "down", tone: "success" },
  { label: "Avg. response time", value: "3.4h", delta: "+0.6h", direction: "up", tone: "danger" },
];

const INTERVENTION_METRICS = [
  { type: "Counselling sessions", count: 2140, completionRate: "91%", status: "success" },
  { type: "Medical referrals", count: 486, completionRate: "78%", status: "warning" },
  { type: "Emergency escalations", count: 34, completionRate: "100%", status: "success" },
  { type: "Follow-up calls", count: 3312, completionRate: "84%", status: "warning" },
  { type: "Home visits", count: 210, completionRate: "62%", status: "danger" },
];

const REPORT_HISTORY = [
  { id: 1, name: "Monthly summary — July 2026", range: "01 Jul – 31 Jul 2026", generated: "01 Aug 2026", status: "Ready" },
  { id: 2, name: "Regional intervention report", range: "01 Jun – 30 Jun 2026", generated: "02 Jul 2026", status: "Ready" },
  { id: 3, name: "Quarterly trend analysis", range: "01 Apr – 30 Jun 2026", generated: "05 Jul 2026", status: "Expired" },
  { id: 4, name: "Monthly summary — June 2026", range: "01 Jun – 30 Jun 2026", generated: "01 Jul 2026", status: "Ready" },
];

function statusBadgeVariant(status) {
  if (status === "Ready") return "success";
  if (status === "Expired") return "default";
  return "default";
}

function toneBadgeVariant(tone) {
  return tone; // "success" | "warning" | "danger" map directly if your Badge supports these
}

export default function ReportsPage() {
  const [datePreset, setDatePreset] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [geography, setGeography] = useState("All regions");

  const [exportFormat, setExportFormat] = useState("PDF");
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [downloadState, setDownloadState] = useState("idle"); // idle | generating | ready
  const [printState, setPrintState] = useState("idle"); // idle | preparing | ready

  function handleGeneratePreview() {
    setPreviewLoading(true);
    setPreviewGenerated(false);
    setTimeout(() => {
      setPreviewLoading(false);
      setPreviewGenerated(true);
    }, 900);
  }

  function handleDownload() {
    setDownloadState("generating");
    setTimeout(() => setDownloadState("ready"), 1000);
  }

  function handlePrint() {
    setPrintState("preparing");
    setTimeout(() => setPrintState("ready"), 700);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-teal-400 m-0 mb-1">
              Reports &amp; analytics
            </h1>
            <p className="text-slate-300 m-0">
              Filter, review and export program reports for decision-making.
            </p>
          </div>
          <Badge variant="info">Admin access</Badge>
        </div>

        {/* FILTERS */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-4">Filters</h2>

            <div className="mb-4">
              <p className="text-sm text-slate-300 mb-2">Date range</p>
              <div className="flex flex-wrap gap-2">
                {DATE_PRESETS.map((p) => (
                  <Button
                    key={p.key}
                    variant={datePreset === p.key ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setDatePreset(p.key)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              {datePreset === "custom" && (
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    From
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    To
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                Geography
                <select
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {GEOGRAPHIES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
              <Button variant="primary" size="sm">
                Apply filters
              </Button>
            </div>
          </div>
        </Card>

        {/* TREND SUMMARY */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-1">
              Trend summary
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              {geography} · {datePreset === "custom" ? "Custom range" : DATE_PRESETS.find((p) => p.key === datePreset)?.label}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TREND_SUMMARY.map((m) => (
                <div
                  key={m.label}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                >
                  <p className="text-xs text-slate-400 m-0 mb-1">{m.label}</p>
                  <p className="text-xl font-semibold text-white m-0 mb-1">
                    {m.value}
                  </p>
                  <Badge variant={toneBadgeVariant(m.tone)}>
                    {m.direction === "up" ? "▲" : "▼"} {m.delta}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* INTERVENTION METRICS */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-4">
              Intervention metrics
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="py-2 pr-4 font-medium">Intervention type</th>
                    <th className="py-2 pr-4 font-medium">Count</th>
                    <th className="py-2 pr-4 font-medium">Completion rate</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INTERVENTION_METRICS.map((row) => (
                    <tr
                      key={row.type}
                      className="border-b border-slate-700 last:border-b-0"
                    >
                      <td className="py-3 pr-4 text-slate-200">{row.type}</td>
                      <td className="py-3 pr-4 text-slate-200">{row.count.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-slate-200">{row.completionRate}</td>
                      <td className="py-3">
                        <Badge variant={row.status}>
                          {row.status === "success"
                            ? "On track"
                            : row.status === "warning"
                            ? "Needs attention"
                            : "Critical"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* EXPORT PREVIEW */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-4">
              Export preview
            </h2>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                Format
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option>PDF</option>
                  <option>CSV</option>
                </select>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePreview}
                disabled={previewLoading}
              >
                {previewLoading ? "Generating preview…" : "Generate preview"}
              </Button>
            </div>

            {previewLoading && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center text-sm text-slate-400">
                Preparing {exportFormat} preview…
              </div>
            )}

            {previewGenerated && !previewLoading && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-300 m-0">
                    {exportFormat} preview — {geography},{" "}
                    {datePreset === "custom"
                      ? "custom range"
                      : DATE_PRESETS.find((p) => p.key === datePreset)?.label}
                  </p>
                  <Badge variant="info">Preview</Badge>
                </div>
                <ul className="text-sm text-slate-300 list-disc pl-5 m-0 space-y-1">
                  <li>Trend summary — 4 key metrics</li>
                  <li>Intervention metrics — {INTERVENTION_METRICS.length} rows</li>
                  <li>Filtered by: {geography}</li>
                </ul>
              </div>
            )}

            {/* DOWNLOAD / PRINT STATES */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                disabled={downloadState === "generating"}
              >
                {downloadState === "idle" && `Download ${exportFormat}`}
                {downloadState === "generating" && "Preparing download…"}
                {downloadState === "ready" && "Downloaded ✓"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                disabled={printState === "preparing"}
              >
                {printState === "idle" && "Print"}
                {printState === "preparing" && "Preparing print…"}
                {printState === "ready" && "Sent to printer ✓"}
              </Button>
            </div>
          </div>
        </Card>

        {/* REPORT HISTORY */}
        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-4">
              Report history
            </h2>

            <ul className="list-none m-0 p-0 flex flex-col divide-y divide-slate-700">
              {REPORT_HISTORY.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div>
                    <p className="text-slate-200 font-medium m-0">{r.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 mb-0">
                      {r.range} · Generated {r.generated}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusBadgeVariant(r.status)}>{r.status}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={r.status === "Expired"}
                    >
                      Download
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
