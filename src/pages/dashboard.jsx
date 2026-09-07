import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function Dashboard() {
  const navigate = useNavigate();

  const trendData = [
    { day: "Mon", score: 62 },
    { day: "Tue", score: 58 },
    { day: "Wed", score: 55 },
    { day: "Thu", score: 60 },
    { day: "Fri", score: 50 },
    { day: "Sat", score: 47 },
    { day: "Sun", score: 45 },
  ];

  const [notifications] = useState([
    { id: 1, text: "Your next check-in is due tomorrow." },
    { id: 2, text: "Counsellor Priya sent you a message." },
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-teal-400">Welcome back</h1>
          <p className="text-slate-400 text-sm">Here's how things are looking today.</p>
        </div>
        <Badge color="teal">Privacy: Protected</Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Today's Check-in</h2>
          <p className="text-slate-300 text-sm mb-4">
            A quick 2-minute check-in helps us understand how you're doing.
          </p>
          <Button onClick={() => navigate("/checkin")}>Start Check-in</Button>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-1">Current Support Signal</h2>
          <div className="text-4xl font-bold text-teal-400 mb-1">Moderate</div>
          <p className="text-slate-400 text-xs">
            This is a support signal, not a diagnosis.
          </p>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Your Trend This Week</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
                <Line type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Button className="w-full mt-4" onClick={() => navigate("/trends")}>
            View Full Trends
          </Button>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-2">Upcoming Follow-up</h2>
          <p className="text-white font-medium">Counsellor Call</p>
          <p className="text-slate-400 text-sm">Tomorrow, 4:00 PM</p>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-3">Support Shortcuts</h2>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate("/chat")}>Talk to Chatbot</Button>
            <Button className="w-full" onClick={() => navigate("/support")}>View Support Options</Button>
          </div>
        </Card>

        <Card
          className="md:col-span-2 cursor-pointer hover:border-teal-500/60"
          onClick={() => navigate("/notifications")}
        >
          <h2 className="text-sm text-slate-400 mb-3">Notifications</h2>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="text-sm text-slate-200 border-b border-slate-700 pb-2">
                {n.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}