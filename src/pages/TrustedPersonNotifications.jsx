import { useState } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { counsellorAsks, generalTips } from "../data/trustedPersonMock";

const initialNotifications = [
  ...counsellorAsks.map((ask) => ({
    id: ask.id,
    category: "counsellor-ask",
    title: "A request from the care team",
    description: ask.message,
    time: ask.time,
    unread: true,
  })),
  {
    id: "sys-1",
    category: "system",
    title: "You were added as a support contact",
    description: "You now have limited visibility into how things are going.",
    time: "5 days ago",
    unread: false,
  },
];

const CATEGORY_META = {
  "counsellor-ask": { label: "Care team request", variant: "warning" },
  system: { label: "System", variant: "default" },
};

export default function TrustedPersonNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const tip = generalTips[Math.floor(Math.random() * generalTips.length)];

  const markAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const dismiss = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-teal-400 mb-1">Notifications</h1>
        <p className="text-slate-300 mb-8">Requests from the care team, and general updates.</p>

        <Card className="bg-slate-800 border border-slate-700 mb-6">
          <div className="p-5">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-sm py-6 text-center">No notifications right now.</p>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {notifications.map((n) => {
                  const meta = CATEGORY_META[n.category];
                  return (
                    <li
                      key={n.id}
                      className={`rounded-xl border p-4 ${
                        n.unread ? "bg-slate-900 border-teal-400/40" : "bg-slate-900/60 border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className={`m-0 ${n.unread ? "font-semibold text-white" : "font-medium text-slate-300"}`}>
                          {n.title}
                        </p>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{n.description}</p>
                      <p className="text-xs text-slate-400 mb-3">{n.time}</p>
                      <div className="flex gap-2">
                        {n.unread && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}>
                            Mark as read
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => dismiss(n.id)}>
                          Dismiss
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card className="bg-slate-800 border border-slate-700">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 mb-2">Tip for today</h2>
            <p className="text-sm text-slate-300">{tip}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
