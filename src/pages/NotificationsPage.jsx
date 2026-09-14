import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";

const CATEGORY_META = {
  reminder: { label: "Reminder", badgeVariant: "info" },
  appointment: { label: "Appointment", badgeVariant: "warning" },
  checkin: { label: "Check-in", badgeVariant: "success" },
  staff: { label: "Staff follow-up", badgeVariant: "default" },
};

const initialNotifications = [
  {
    id: 1,
    category: "checkin",
    title: "Weekly check-in due",
    description: "Your scheduled check-in is due today. Takes about 5 minutes.",
    time: "2h ago",
    unread: true,
    action: "Start check-in",
  },
  {
    id: 2,
    category: "appointment",
    title: "Appointment rescheduled",
    description: "Your appointment with counsellor R. Sharma moved to 3:00 PM, Thu.",
    time: "5h ago",
    unread: true,
    action: "View appointment",
  },
  {
    id: 3,
    category: "staff",
    title: "Follow-up task assigned",
    description: "A staff member requested additional info on your last submission.",
    time: "Yesterday",
    unread: true,
    action: "View task",
  },
  {
    id: 4,
    category: "reminder",
    title: "Medication reminder",
    description: "Reminder to log today's medication as taken.",
    time: "Yesterday",
    unread: false,
    action: "Log now",
  },
  {
    id: 5,
    category: "appointment",
    title: "Upcoming appointment",
    description: "You have an appointment scheduled for Monday, 10:00 AM.",
    time: "2 days ago",
    unread: false,
    action: "View appointment",
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "reminder", label: "Reminders" },
  { key: "appointment", label: "Appointments" },
  { key: "checkin", label: "Check-ins" },
  { key: "staff", label: "Staff follow-ups" },
];

function MiniToggle({ on, onClick, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full border-0 p-0 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
        on ? "bg-teal-400" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-150 ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function NotificationsPage({ onCheckInClick }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");

  const [prefs, setPrefs] = useState({
    reminder: true,
    appointment: true,
    checkin: true,
    staff: true,
  });
  const [channel, setChannel] = useState({
    reminder: "Push",
    appointment: "Push + Email",
    checkin: "Push",
    staff: "Push + Email",
  });

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const visibleNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }

  function dismiss(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function togglePref(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-teal-400 m-0 mb-1">
              Notifications &amp; follow-ups
            </h1>
            <p className="text-slate-300 m-0">
              Reminders, appointment changes and staff follow-up tasks, all in one place.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {/* NOTIFICATION CENTER */}
        <Card className="bg-slate-800 border border-slate-700 mb-8">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-teal-400 m-0 flex items-center gap-2">
                Notification center
                {unreadCount > 0 && (
                  <Badge variant="danger">{unreadCount} unread</Badge>
                )}
              </h2>
            </div>

            {/* CATEGORY FILTER TABS */}
            <div className="flex flex-wrap gap-2 mb-5">
              {FILTERS.map((f) => (
                <Button
                  key={f.key}
                  variant={activeFilter === f.key ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* NOTIFICATION LIST */}
            {visibleNotifications.length === 0 ? (
              <p className="text-slate-400 text-sm py-6 text-center m-0">
                No notifications in this category.
              </p>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {visibleNotifications.map((n) => {
                  const meta = CATEGORY_META[n.category];
                  return (
                    <li
                      key={n.id}
                      className={`rounded-xl border p-4 ${
                        n.unread
                          ? "bg-slate-900 border-teal-400/40"
                          : "bg-slate-900/60 border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {n.unread && (
                            <span
                              className="mt-1.5 w-2 h-2 rounded-full bg-teal-400 shrink-0"
                              aria-label="Unread"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p
                                className={`m-0 ${
                                  n.unread
                                    ? "font-semibold text-white"
                                    : "font-medium text-slate-300"
                                }`}
                              >
                                {n.title}
                              </p>
                              <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
                            </div>
                            <p className="text-sm text-slate-300 m-0 mb-1">
                              {n.description}
                            </p>
                            <p className="text-xs text-slate-400 m-0">{n.time}</p>
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-wrap gap-2 mt-3 ml-5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            if (n.category === "checkin" && onCheckInClick) {
                              onCheckInClick(n);
                            } else {
                              console.log("Clicked action:", n.action);
                            }
                          }}
                        >
                          {n.action}
                        </Button>
                        {n.unread && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(n.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismiss(n.id)}
                        >
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

        {/* NOTIFICATION PREFERENCES */}
        <Card className="bg-slate-800 border border-slate-700 mb-8">
          <div className="p-5">
            <h2 className="text-lg font-medium text-teal-400 m-0 mb-1">
              Reminder preferences
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Choose what you get notified about, and how.
            </p>

            <div className="flex flex-col divide-y divide-slate-700">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium text-white m-0">{meta.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 mb-0">
                      {prefs[key] ? `Delivered via ${channel[key]}` : "Turned off"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {prefs[key] && (
                      <select
                        value={channel[key]}
                        onChange={(e) =>
                          setChannel((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option>Push</option>
                        <option>Email</option>
                        <option>SMS</option>
                        <option>Push + Email</option>
                      </select>
                    )}
                    <MiniToggle
                      on={prefs[key]}
                      onClick={() => togglePref(key)}
                      label={`Toggle ${meta.label} notifications`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* QUIET HOURS */}
        <Card className="bg-slate-800 border border-slate-700 mb-8">
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium text-teal-400 m-0">Quiet hours</h2>
              <MiniToggle
                on={quietHoursEnabled}
                onClick={() => setQuietHoursEnabled((v) => !v)}
                label="Toggle quiet hours"
              />
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Pause non-urgent notifications during set hours. Urgent staff
              follow-ups are always delivered.
            </p>

            {quietHoursEnabled && (
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  From
                  <input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  To
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </label>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}