import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Card from "../components/card";

function CounsellorDashboard() {
    const navigate = useNavigate();
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

    const filteredCases = useMemo(() => {
        return cases.filter((item) => {
            const matchesFilter =
                filter === "All" || item.trend === filter;

            const matchesSearch = item.id
                .toLowerCase()
                .includes(search.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    const followUpsToday = cases.filter(
        (item) => item.followUp === "Today"
    ).length;

    const activeAlerts = cases.reduce(
        (total, item) => total + item.alerts,
        0
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            {/* HEADER */}
            <header className="border-b border-slate-800 bg-slate-900">
                <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                        <p className="text-sm text-teal-400">
                            Binary Brains • Counsellor Portal
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-white">
                            Counsellor Dashboard
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/assign")}
                        >
                            Assign Cases
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/referrals")}
                        >
                            Track Referrals
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/audit")}
                        >
                            View Activity Log
                        </Button>
                    </div>

                </div>
            </header>

            {/* MAIN */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* INTRO */}
                <section className="mb-8">

                    <p className="text-sm text-slate-400">
                        Counsellor workspace
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-white">
                        Cases needing your attention
                    </h2>

                    <p className="mt-2 max-w-2xl text-slate-400">
                        Review recent changes, upcoming follow-ups
                        and support alerts from assigned cases.
                    </p>

                </section>

                {/* SUMMARY CARDS */}
                <section className="grid gap-4 md:grid-cols-3">

                    <Card>
                        <p className="text-sm text-slate-400">
                            Assigned Cases
                        </p>

                        <p className="mt-2 text-3xl font-bold text-teal-400">
                            {cases.length}
                        </p>
                    </Card>

                    <Card>
                        <p className="text-sm text-slate-400">
                            Follow-ups Today
                        </p>

                        <p className="mt-2 text-3xl font-bold text-teal-400">
                            {followUpsToday}
                        </p>
                    </Card>

                    <Card>
                        <p className="text-sm text-slate-400">
                            Active Alerts
                        </p>

                        <p className="mt-2 text-3xl font-bold text-teal-400">
                            {activeAlerts}
                        </p>
                    </Card>

                </section>

                {/* QUEUE */}
                <section className="mt-10">

                    <h2 className="text-xl font-bold text-white">
                        Risk-change Queue
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Filter and search your assigned cases.
                    </p>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search case ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-teal-400 md:w-96"
                    />

                    {/* FILTER BUTTONS */}
                    <div className="mt-4 flex flex-wrap gap-2">

                        {["All", "Worsening", "Stable", "Improving"].map(
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

                    {/* CASES */}
                    <div className="mt-6 space-y-4">

                        {filteredCases.length === 0 ? (

                            <Card>
                                <p className="text-center text-slate-400">
                                    No cases found.
                                </p>
                            </Card>

                        ) : (

                            filteredCases.map((item) => (

                                <Card key={item.id}>

                                    {/* CASE HEADER */}
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                        <div>

                                            <p className="text-sm text-slate-400">
                                                Case ID
                                            </p>

                                            <h3 className="text-xl font-bold text-white">
                                                {item.id}
                                            </h3>

                                        </div>

                                        <div className="rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300">

                                            {item.risk} • {item.trend}

                                        </div>

                                    </div>

                                    {/* INFORMATION */}
                                    <div className="mt-6 grid gap-5 md:grid-cols-3">

                                        <div>
                                            <p className="text-sm text-slate-400">
                                                Last Interaction
                                            </p>

                                            <p className="mt-1 font-medium text-slate-200">
                                                {item.lastInteraction}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-400">
                                                Follow-up
                                            </p>

                                            <p className="mt-1 font-medium text-slate-200">
                                                {item.followUp}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-400">
                                                Alerts
                                            </p>

                                            <p className="mt-1 font-medium text-slate-200">
                                                {item.alerts}
                                            </p>
                                        </div>

                                    </div>

                                    {/* CONTACT BUTTON */}
                                    <div className="mt-6 flex justify-end">

                                        <Button
                                            onClick={() =>
                                                alert(`Contacting ${item.id}`)
                                            }
                                        >
                                            Quick Contact
                                        </Button>

                                    </div>

                                </Card>

                            ))

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default CounsellorDashboard;