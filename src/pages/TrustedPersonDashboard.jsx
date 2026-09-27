import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { linkedVictim, assignedCounsellor, generalTips, counsellorAsks } from "../data/trustedPersonMock";

export default function TrustedPersonDashboard() {
  const navigate = useNavigate();
  const activeAsk = counsellorAsks[0];
  const fallbackTip = generalTips[Math.floor(Math.random() * generalTips.length)];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-teal-400">
            Supporting {linkedVictim.displayName}
          </h1>
          <p className="text-slate-400 text-sm">A general overview — not the full case record.</p>
        </div>
        <Badge color="teal">Privacy: Limited View</Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <h2 className="text-sm text-slate-400 mb-1">Current status</h2>
          <div className="text-3xl font-bold text-teal-400 mb-1">{linkedVictim.statusLabel}</div>
          <p className="text-slate-400 text-xs mb-4">This is a general status, not a score or diagnosis.</p>
          <p className="text-slate-300 text-sm">Last check-in: {linkedVictim.lastCheckIn}</p>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-2">
            {activeAsk ? "From the counsellor" : "Tip for today"}
          </h2>
          <p className="text-white text-sm leading-relaxed">
            {activeAsk ? activeAsk.message : fallbackTip}
          </p>
          {activeAsk && <p className="text-slate-500 text-xs mt-2">{activeAsk.time}</p>}
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-sm text-slate-400 mb-2">Assigned counsellor</h2>
          <p className="text-white font-medium">{assignedCounsellor.name}</p>
          <p className="text-slate-400 text-sm mb-4">{assignedCounsellor.role}</p>
          <Button className="text-xs" onClick={() => navigate("/trusted-counsellor")}>
            View details
          </Button>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-3">What would you like to do?</h2>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate("/trends")}>
              View Their Trends
            </Button>
            <Button className="w-full" onClick={() => navigate("/support")}>
              Support Hub
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}