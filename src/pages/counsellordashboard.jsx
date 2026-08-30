import { useState } from "react";

function CounsellorDashboard() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const cases = [
        {
            id: "CASE-1042",
            risk: "Elevated",
            trend: "Worsening",
            followUp: "Today",
            alerts: 2,
            lastInteraction: "Today, 10:30 AM",
        },
        {
            id: "CASE-1087",
            risk: "Stable",
            trend: "Stable",
            followUp: "Tomorrow",
            alerts: 0,
            lastInteraction: "Yesterday, 4:20 PM",
        },
        {
            id: "CASE-1103",
            risk: "Moderate",
            trend: "Improving",
            followUp: "Today",
            alerts: 1,
            lastInteraction: "Yesterday, 11:15 AM",
        },
        {
            id: "CASE-1121",
            risk: "Elevated",
            trend: "Worsening",
            followUp: "Today",
            alerts: 3,
            lastInteraction: "Today, 8:45 AM",
        },
    ];

    const filteredCases = cases.filter((item) => {
        const matchesFilter =
            filter === "All" || item.trend === filter;

        const matchesSearch =
            item.id.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* HEADER */}
            <header className="border-b bg-white px-6 py-5">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm text-slate-500">
                        Binary Brains • Counsellor Portal
                    </p>

                    <h1 className="mt-1 text-2xl font-bold">
                        Counsellor Dashboard
                    </h1>
                </div>
            </header>

            {/* MAIN */}
            <main className="mx-auto max-w-7xl p-6">

                {/* INTRO */}
                <section className="mb-8">
                    <p className="text-sm text-slate-500">
                        Counsellor workspace
                    </p>

                    <h2 className="mt-1 text-3xl font-bold">
                        Cases needing your attention
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Review recent changes, upcoming follow-ups
                        and support alerts from assigned cases.
                    </p>
                </section>

                {/* SUMMARY CARDS */}
                <section className="grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Assigned Cases
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {cases.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Follow-ups Today
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {cases.filter((item) => item.followUp === "Today").length}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Active Alerts
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {cases.reduce(
                                (total, item) => total + item.alerts,
                                0
                            )}
                        </p>
                    </div>

                </section>

                {/* QUEUE */}
                <section className="mt-10">

                    <h2 className="text-xl font-bold">
                        Risk-change Queue
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Filter and search your assigned cases.
                    </p>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search case ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mt-5 w-full rounded-xl border bg-white px-4 py-3 outline-none md:w-96"
                    />

                    {/* FILTER BUTTONS */}
                    <div className="mt-4 flex flex-wrap gap-2">

                        {["All", "Worsening", "Stable", "Improving"].map(
                            (option) => (
                                <button
                                    key={option}
                                    onClick={() => setFilter(option)}
                                    className={`rounded-xl px-4 py-2 text-sm font-medium ${filter === option
                                            ? "bg-slate-900 text-white"
                                            : "bg-white text-slate-600 border"
                                        }`}
                                >
                                    {option}
                                </button>
                            )
                        )}

                    </div>

                    {/* CASE CARDS */}
                    <div className="mt-6 space-y-4">

                        {filteredCases.map((item) => (

                            <div
                                key={item.id}
                                className="rounded-2xl border bg-white p-6 shadow-sm"
                            >

                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Case ID
                                        </p>

                                        <h3 className="text-xl font-bold">
                                            {item.id}
                                        </h3>
                                    </div>

                                    <div className="rounded-full border px-4 py-2 text-sm font-medium">
                                        {item.risk} • {item.trend}
                                    </div>

                                </div>

                                {/* INFORMATION */}
                                <div className="mt-6 grid gap-5 md:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Last Interaction
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {item.lastInteraction}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Follow-up
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {item.followUp}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Alerts
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {item.alerts}
                                        </p>
                                    </div>

                                </div>

                                {/* BUTTON */}
                                <div className="mt-6 flex justify-end">

                                    <button
                                        onClick={() =>
                                            alert(`Contacting ${item.id}`)
                                        }
                                        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                                    >
                                        Quick Contact
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default CounsellorDashboard;