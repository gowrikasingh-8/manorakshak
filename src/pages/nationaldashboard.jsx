import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function NationalDashboard() {
  const navigate = useNavigate();
  const kpis = [
    { label: "Active Cases", value: "1,284" },
    { label: "High Risk Cases", value: "97" },
    { label: "Interventions This Month", value: "412" },
    { label: "Avg. Response Time", value: "3.2 hrs" },
  ];

  const trendData = [
    { month: "Jan", score: 55 },
    { month: "Feb", score: 52 },
    { month: "Mar", score: 58 },
    { month: "Apr", score: 50 },
    { month: "May", score: 47 },
    { month: "Jun", score: 45 },
  ];

  const districtData = [
    { district: "District A", cases: 320 },
    { district: "District B", cases: 210 },
    { district: "District C", cases: 180 },
    { district: "District D", cases: 260 },
  ];

  const riskBands = [
    { name: "Low", value: 620, color: "#2dd4bf" },
    { name: "Moderate", value: 480, color: "#facc15" },
    { name: "High", value: 184, color: "#f87171" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-400">National Dashboard</h1>
          <p className="text-slate-400 text-sm">Aggregated, anonymized overview across all districts.</p>
        </div>
        <Button onClick={() => navigate("/reports")}>
          View Full Reports
        </Button>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <p className="text-slate-400 text-xs mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-teal-400">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Trend chart */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">National Trend (6 Months)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
                <Line type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk band distribution */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Risk Band Distribution</h2>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskBands} dataKey="value" nameKey="name" outerRadius={80}>
                  {riskBands.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 justify-center mt-2 text-xs">
            {riskBands.map((r, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                {r.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* District comparison */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">District Comparison</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
                <Bar dataKey="cases" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Map placeholder */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Geographic Overview</h2>
          <div className="h-56 flex items-center justify-center bg-slate-900/60 border border-dashed border-slate-700 rounded-lg">
            <p className="text-slate-500 text-sm">Map view placeholder — district heat overlay</p>
          </div>
        </Card>
      </div>

      {/* Intervention completion + drill-down */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-3">Intervention Completion</h2>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
            <div className="bg-teal-400 h-3 rounded-full" style={{ width: "68%" }} />
          </div>
          <p className="text-slate-400 text-sm">68% of recommended interventions completed this month</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-3">Drill-down</h2>
          <p className="text-slate-300 text-sm mb-3">View detailed data by administrative level:</p>
          <div className="flex gap-2 flex-wrap">
            <Badge color="teal">National</Badge>
            <Badge color="slate">State</Badge>
            <Badge color="slate">District</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}