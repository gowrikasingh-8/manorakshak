import { useState } from "react";
import Button from "../components/button";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";

const initialAlerts = [
    {
        id: "ALT-1042",
        priority: "Critical",
        type: "Risk Threshold",
        timestamp: "Today, 10:30 AM",
        reason: "Risk score crossed the critical threshold.",
        owner: "Unassigned",
        status: "New",
        timeline: [
            { label: "Alert created", time: "10:30 AM", done: true },
            { label: "Acknowledged", time: "", done: false },
            { label: "Assigned", time: "", done: false },
            { label: "Escalated", time: "", done: false },
        ],
    },
    {
        id: "ALT-1087",
        priority: "High",
        type: "Behaviour Change",
        timestamp: "Today, 9:15 AM",
        reason: "A significant change was detected in the latest assessment.",
        owner: "Counsellor Team",
        status: "Assigned",
        timeline: [
            { label: "Alert created", time: "9:15 AM", done: true },
            { label: "Acknowledged", time: "9:20 AM", done: true },
            { label: "Assigned", time: "9:25 AM", done: true },
            { label: "Escalated", time: "", done: false },
        ],
    },
    {
        id: "ALT-1103",
        priority: "Medium",
        type: "Follow-up Due",
        timestamp: "Yesterday, 4:40 PM",
        reason: "Scheduled follow-up has reached its due time.",
        owner: "Counsellor Team",
        status: "Acknowledged",
        timeline: [
            { label: "Alert created", time: "4:40 PM", done: true },
            { label: "Acknowledged", time: "4:45 PM", done: true },
            { label: "Assigned", time: "", done: false },
            { label: "Escalated", time: "", done: false },
        ],
    },
    {
        id: "ALT-1121",
        priority: "High",
        type: "Risk Threshold",
        timestamp: "Yesterday, 2:10 PM",
        reason: "Multiple risk indicators crossed the warning threshold.",
        owner: "Unassigned",
        status: "New",
        timeline: [
            { label: "Alert created", time: "2:10 PM", done: true },
            { label: "Acknowledged", time: "", done: false },
            { label: "Assigned", time: "", done: false },
            { label: "Escalated", time: "", done: false },
        ],
    },
];

function Alerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState(initialAlerts);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const updateAlert = (id, action) => {
        setAlerts((currentAlerts) =>
            currentAlerts.map((alert) => {
                if (alert.id !== id) return alert;

                if (action === "acknowledge") {
                    return {
                        ...alert,
                        status: "Acknowledged",
                        timeline: alert.timeline.map((step, index) =>
                            index === 1
                                ? {
                                    ...step,
                                    done: true,
                                    time: "Now",
                                }
                                : step
                        ),
                    };
                }

                if (action === "assign") {
                    return {
                        ...alert,
                        owner: "Counsellor Team",
                        status: "Assigned",
                        timeline: alert.timeline.map((step, index) =>
                            index === 1
                                ? {
                                    ...step,
                                    done: true,
                                    time: step.time || "Now",
                                }
                                : index === 2
                                    ? {
                                        ...step,
                                        done: true,
                                        time: "Now",
                                    }
                                    : step
                        ),
                    };
                }

                if (action === "escalate") {
                    return {
                        ...alert,
                        owner: "Senior Counsellor",
                        status: "Escalated",
                        timeline: alert.timeline.map((step, index) =>
                            index <= 2
                                ? {
                                    ...step,
                                    done: true,
                                    time: step.time || "Now",
                                }
                                : index === 3
                                    ? {
                                        ...step,
                                        done: true,
                                        time: "Now",
                                    }
                                    : step
                        ),
                    };
                }

                return alert;
            })
        );
    };

    const handleEscalate = (alert) => {
        updateAlert(alert.id, "escalate");
        navigate("/escalate", { state: { alertId: alert.id, alertType: alert.type, alertReason: alert.reason } });
    };

    const filteredAlerts = alerts.filter((alert) => {
        const matchesFilter =
            filter === "All" || alert.priority === filter;

        const searchText = search.toLowerCase();

        const matchesSearch =
            alert.id.toLowerCase().includes(searchText) ||
            alert.type.toLowerCase().includes(searchText) ||
            alert.reason.toLowerCase().includes(searchText);

        return matchesFilter && matchesSearch;
    });

    const priorityClass = (priority) => {
        if (priority === "Critical") {
            return "border-red-500/40 bg-red-500/10 text-red-300";
        }

        if (priority === "High") {
            return "border-orange-500/40 bg-orange-500/10 text-orange-300";
        }

        return "border-yellow-500/40 bg-yellow-500/10 text-yellow-300";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            {/* HEADER */}
            <header className="border-b border-slate-800 bg-slate-900">
                <div className="mx-auto max-w-7xl px-6 py-5">

                    <p className="text-sm text-teal-400">
                        Binary Brains • Alert Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-white">
                        Alerts & Escalation Center
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Central queue for threshold-crossing alerts and
                        escalation actions.
                    </p>

                </div>
            </header>

            {/* MAIN */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* SUMMARY */}
                <section className="grid gap-4 md:grid-cols-3">

                    <Card>
                        <p className="text-sm text-slate-400">
                            Total Alerts
                        </p>

                        <p className="mt-2 text-3xl font-bold text-teal-400">
                            {alerts.length}
                        </p>
                    </Card>

                    <Card>
                        <p className="text-sm text-slate-400">
                            Critical / High
                        </p>

                        <p className="mt-2 text-3xl font-bold text-orange-300">
                            {
                                alerts.filter(
                                    (alert) =>
                                        alert.priority === "Critical" ||
                                        alert.priority === "High"
                                ).length
                            }
                        </p>
                    </Card>

                    <Card>
                        <p className="text-sm text-slate-400">
                            Unassigned
                        </p>

                        <p className="mt-2 text-3xl font-bold text-yellow-300">
                            {
                                alerts.filter(
                                    (alert) => alert.owner === "Unassigned"
                                ).length
                            }
                        </p>
                    </Card>

                </section>

                {/* FILTER AREA */}
                <section className="mt-10">

                    <h2 className="text-xl font-bold text-white">
                        Priority Queue
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Review alerts, assign ownership and manage escalation.
                    </p>

                    <input
                        type="text"
                        placeholder="Search alerts..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-teal-400 md:w-96"
                    />

                    <div className="mt-4 flex flex-wrap gap-2">

                        {["All", "Critical", "High", "Medium"].map(
                            (option) => (
                                <Button
                                    key={option}
                                    onClick={() => setFilter(option)}
                                    variant={
                                        filter === option
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {option}
                                </Button>
                            )
                        )}

                    </div>

                </section>

                {/* ALERT QUEUE */}
                <section className="mt-6 space-y-5">

                    {filteredAlerts.length === 0 ? (

                        <Card>
                            <div className="py-8 text-center">
                                <p className="font-semibold text-white">
                                    No alerts found
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Try changing your search or filter.
                                </p>
                            </div>
                        </Card>

                    ) : (

                        filteredAlerts.map((alert) => (

                            <Card key={alert.id}>

                                {/* ALERT HEADER */}
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                    <div>

                                        <div className="flex flex-wrap items-center gap-2">

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass(
                                                    alert.priority
                                                )}`}
                                            >
                                                {alert.priority}
                                            </span>

                                            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                                {alert.type}
                                            </span>

                                        </div>

                                        <h3 className="mt-3 text-xl font-bold text-white">
                                            {alert.id}
                                        </h3>

                                    </div>

                                    <div className="text-left lg:text-right">

                                        <p className="text-sm text-slate-400">
                                            Status
                                        </p>

                                        <p className="font-semibold text-teal-300">
                                            {alert.status}
                                        </p>

                                    </div>

                                </div>

                                {/* DETAILS */}
                                <div className="mt-6 grid gap-5 md:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            Alert Type
                                        </p>

                                        <p className="mt-1 font-medium text-slate-200">
                                            {alert.type}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            Timestamp
                                        </p>

                                        <p className="mt-1 font-medium text-slate-200">
                                            {alert.timestamp}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            Owner
                                        </p>

                                        <p className="mt-1 font-medium text-slate-200">
                                            {alert.owner}
                                        </p>
                                    </div>

                                </div>

                                {/* REASON */}
                                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">

                                    <p className="text-sm font-semibold text-teal-400">
                                        Why was this alert triggered?
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        {alert.reason}
                                    </p>

                                </div>

                                {/* TIMELINE */}
                                <div className="mt-6">

                                    <p className="text-sm font-semibold text-white">
                                        Status Timeline
                                    </p>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                        {alert.timeline.map((step) => (

                                            <div
                                                key={step.label}
                                                className={`rounded-xl border p-3 ${step.done
                                                        ? "border-teal-500/40 bg-teal-500/10"
                                                        : "border-slate-700 bg-slate-900"
                                                    }`}
                                            >

                                                <div className="flex items-center justify-between gap-2">

                                                    <span className="text-sm font-medium text-slate-200">
                                                        {step.label}
                                                    </span>

                                                    <span
                                                        className={
                                                            step.done
                                                                ? "text-teal-400"
                                                                : "text-slate-600"
                                                        }
                                                    >
                                                        {step.done ? "●" : "○"}
                                                    </span>

                                                </div>

                                                {step.time && (
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {step.time}
                                                    </p>
                                                )}

                                            </div>

                                        ))}

                                    </div>

                                </div>

                                {/* ACTIONS */}
                                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-5">

                                    <Button
                                        onClick={() =>
                                            updateAlert(alert.id, "acknowledge")
                                        }
                                    >
                                        Acknowledge
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            updateAlert(alert.id, "assign")
                                        }
                                    >
                                        Assign
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleEscalate(alert)}
                                    >
                                        Escalate
                                    </Button>

                                </div>

                            </Card>

                        ))

                    )}

                </section>

            </main>

        </div>
    );
}

export default Alerts;