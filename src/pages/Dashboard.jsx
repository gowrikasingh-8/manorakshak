import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import ScheduleModal from "../components/ScheduleModal";
import { useLanguage } from "../LanguageContext";


export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scheduleOpen, setScheduleOpen] = useState(false);

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
          <h1 className="text-2xl font-bold text-teal-400">{t("dash_welcome")}</h1>
          <p className="text-slate-400 text-sm">{t("dash_subtitle")}</p>
        </div>
        <Badge color="teal">{t("dash_privacy")}</Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">{t("dash_checkinTitle")}</h2>
          <p className="text-slate-300 text-sm mb-4">
            {t("dash_checkinText")}
          </p>
          <Button onClick={() => navigate("/checkin")}>{t("dash_startCheckin")}</Button>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-1">{t("dash_signalTitle")}</h2>
          <div className="text-4xl font-bold text-teal-400 mb-1">{t("dash_signalValue")}</div>
          <p className="text-slate-400 text-xs">
           {t("dash_signalNote")}
          </p>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">{t("dash_trendTitle")}</h2>
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
           {t("dash_viewTrends")}
          </Button>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-2">{t("dash_followupTitle")}</h2>
          <p className="text-white font-medium">{t("dash_followupName")}</p>
          <p className="text-slate-400 text-sm mb-3">{t("dash_followupTime")}</p>
          <Button className="w-full text-xs" onClick={() => setScheduleOpen(true)}>
            {t("dash_scheduleNew")}
          </Button>
        </Card>

        <Card>
          <h2 className="text-sm text-slate-400 mb-3">{t("dash_shortcuts")}</h2>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate("/chat")}>{t("dash_chatbot")}</Button>
            <Button className="w-full" onClick={() => navigate("/support")}>{t("dash_supportOptions")}</Button>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-slate-400">{t("dash_notifications")}</h2>
            <Button onClick={() => navigate("/notifications")} className="text-xs px-3 py-1.5">
              {t("dash_viewAll")}
            </Button>
          </div>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="text-sm text-slate-200 border-b border-slate-700 pb-2">
                {n.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={(data) => console.log("Scheduled:", data)}
      />
    </div>
  );
}