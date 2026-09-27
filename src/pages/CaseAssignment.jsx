import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

const initialCases = [
    {
        id: "CASE-101",
        title: "Atrocity Trauma & Crisis Response",
        priority: "Critical",
        dueDate: "2026-09-28",
        status: "Unassigned",
        reason: "Immediate crisis counseling & psychological stabilization needed",
    },
    {
        id: "CASE-102",
        title: "Gender-Based Violence Distress Care",
        priority: "High",
        dueDate: "2026-09-30",
        status: "Unassigned",
        reason: "Trauma therapy support & emotional recovery planning",
    },
    {
        id: "CASE-103",
        title: "Discrimination & Workplace Harassment Support",
        priority: "Medium",
        dueDate: "2026-10-04",
        status: "Unassigned",
        reason: "Ongoing psychological counseling & coping strategy guidance",
    },
];

const counsellors = [
    {
        id: 1,
        name: "Dr. Ananya Sharma",
        specialization: "Trauma & Acute Crisis Counseling",
        availability: "Available",
        workload: 4,
        capacity: 8,
    },
    {
        id: 2,
        name: "Rahul Mehta",
        specialization: "PTSD & Psychosocial Support",
        availability: "Available",
        workload: 6,
        capacity: 8,
    },
    {
        id: 3,
        name: "Priya Kapoor",
        specialization: "Community & Mental Health Rehabilitation",
        availability: "Busy",
        workload: 8,
        capacity: 8,
    },
];

export default function CaseAssignment() {
    const navigate = useNavigate();
    const [cases, setCases] = useState(initialCases);
    const [selectedCase, setSelectedCase] = useState(null);
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [assigned, setAssigned] = useState(false);
    const [followUp, setFollowUp] = useState(false);
    const [history, setHistory] = useState([]);

    const handleSelectCase = (caseItem) => {
        setSelectedCase(caseItem);
        setPriority(caseItem.priority);
        setDueDate(caseItem.dueDate);
        setSelectedCounsellor(null);
        setAssigned(false);
        setFollowUp(false);
    };

    const handleAssign = () => {
        if (!selectedCase || !selectedCounsellor) {
            return;
        }

        setCases((currentCases) =>
            currentCases.map((item) =>
                item.id === selectedCase.id
                    ? {
                        ...item,
                        status: "Assigned",
                        priority,
                        dueDate,
                        counsellor: selectedCounsellor.name,
                    }
                    : item
            )
        );

        setHistory((currentHistory) => [
            {
                caseId: selectedCase.id,
                counsellor: selectedCounsellor.name,
                priority,
                date: new Date().toLocaleDateString(),
            },
            ...currentHistory,
        ]);

        setAssigned(true);
    };

    const handleFollowUp = () => {
        setFollowUp(true);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-teal-400 font-medium mb-2">
                            MENTAL HEALTH CASE MANAGEMENT
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold">
                            Counsellor Assignment Workspace
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Distribute reported atrocity distress cases based on mental health counsellor availability, trauma workload, and psychological urgency.
                        </p>
                    </div>

                    <Button variant="outline" onClick={() => navigate("/referrals")}>
                        Track Referrals
                    </Button>
                </div>

                {/* Workflow */}
                <Card className="mb-6">
                    <h2 className="text-lg font-semibold mb-5">
                        Assignment Workflow
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        {[
                            "Unassigned Cases",
                            "Select Incident",
                            "Select Counsellor",
                            "Set Priority & Care Level",
                            "Assign Case",
                            "Follow-up Scheduled",
                        ].map((step, index) => {
                            const active =
                                (index === 0 && !selectedCase) ||
                                (index === 1 && selectedCase && !selectedCounsellor) ||
                                (index === 2 && selectedCounsellor && !assigned) ||
                                (index === 3 && selectedCounsellor && !assigned) ||
                                (index === 4 && assigned && !followUp) ||
                                (index === 5 && followUp);

                            return (
                                <div
                                    key={step}
                                    className={`p-3 rounded-lg border text-sm ${active
                                        ? "border-teal-400 bg-teal-400/10 text-teal-300"
                                        : "border-slate-700 bg-slate-900 text-slate-400"
                                        }`}
                                >
                                    <span className="font-bold mr-2">
                                        {index + 1}.
                                    </span>
                                    {step}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Unassigned Cases */}
                    <Card>
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-semibold">
                                Reported Incidents
                            </h2>

                            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full">
                                {cases.filter((item) => item.status === "Unassigned").length}{" "}
                                pending
                            </span>
                        </div>

                        <div className="space-y-3">
                            {cases
                                .filter((item) => item.status === "Unassigned")
                                .map((caseItem) => (
                                    <div
                                        key={caseItem.id}
                                        className={`border rounded-xl p-4 ${selectedCase?.id === caseItem.id
                                            ? "border-teal-400 bg-teal-400/5"
                                            : "border-slate-700 bg-slate-900"
                                            }`}
                                    >
                                        <div className="flex justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-teal-300">
                                                    {caseItem.id}
                                                </p>

                                                <p className="text-sm text-slate-300 mt-1">
                                                    {caseItem.title}
                                                </p>
                                            </div>

                                            <span className={`text-xs px-2 py-1 rounded h-fit font-semibold ${
                                                caseItem.priority === "Critical" 
                                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                                                    : "bg-slate-800 text-slate-300"
                                            }`}>
                                                {caseItem.priority}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 mt-3">
                                            Target Session Date: {caseItem.dueDate}
                                        </p>

                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                className="flex-1"
                                                onClick={() => handleSelectCase(caseItem)}
                                            >
                                                Select Case
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    navigate("/case-detail", { state: { caseId: caseItem.id } })
                                                }
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                            {cases.filter((item) => item.status === "Unassigned")
                                .length === 0 && (
                                    <p className="text-slate-500 text-sm">
                                        No unassigned mental health cases remaining.
                                    </p>
                                )}
                        </div>
                    </Card>

                    {/* Case Details */}
                    <Card>
                        <h2 className="text-xl font-semibold mb-5">
                            Incident Details
                        </h2>

                        {!selectedCase ? (
                            <div className="text-center py-12 text-slate-500">
                                Select an incident to begin mental health counsellor assignment.
                            </div>
                        ) : (
                            <div className="space-y-5">

                                <div>
                                    <p className="text-xs text-slate-500">CASE ID</p>
                                    <p className="font-semibold mt-1">
                                        {selectedCase.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">DISTRESS CATEGORY</p>
                                    <p className="mt-1">{selectedCase.title}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        ASSIGNMENT REASON & PSYCHOLOGICAL NEED
                                    </p>
                                    <p className="text-sm text-slate-300 mt-1">
                                        {selectedCase.reason}
                                    </p>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="text-sm text-slate-400">
                                        Distress Priority Level
                                    </label>

                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="text-sm text-slate-400">
                                        Counseling Session Target Date
                                    </label>

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                                    />
                                </div>

                            </div>
                        )}
                    </Card>

                    {/* Mental Health Counsellors */}
                    <Card>
                        <h2 className="text-xl font-semibold mb-5">
                            Counsellor Availability & Roster
                        </h2>

                        <div className="space-y-3">
                            {counsellors.map((counsellor) => (
                                <button
                                    key={counsellor.id}
                                    onClick={() => setSelectedCounsellor(counsellor)}
                                    disabled={counsellor.availability === "Busy"}
                                    className={`w-full text-left p-4 rounded-xl border transition ${selectedCounsellor?.id === counsellor.id
                                        ? "border-teal-400 bg-teal-400/10"
                                        : "border-slate-700 bg-slate-900"
                                        } ${counsellor.availability === "Busy"
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:border-teal-500"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-semibold block">
                                                {counsellor.name}
                                            </span>
                                            <span className="text-xs text-teal-400 block mt-0.5">
                                                {counsellor.specialization}
                                            </span>
                                        </div>

                                        <span className="text-xs">
                                            {counsellor.availability}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-sm text-slate-400">
                                        Active trauma caseload:{" "}
                                        <span className="text-white">
                                            {counsellor.workload}/{counsellor.capacity}
                                        </span>
                                    </div>

                                    <div className="w-full bg-slate-700 h-2 rounded-full mt-2">
                                        <div
                                            className="bg-teal-500 h-2 rounded-full"
                                            style={{
                                                width: `${(counsellor.workload /
                                                    counsellor.capacity) *
                                                    100
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Assignment Action */}
                <Card className="mt-6">
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Assignment Summary
                            </h2>

                            <div className="text-sm text-slate-400 mt-3 space-y-1">
                                <p>
                                    Incident Case:{" "}
                                    <span className="text-white">
                                        {selectedCase?.id || "Not selected"}
                                    </span>
                                </p>

                                <p>
                                    Assigned Mental Health Counsellor:{" "}
                                    <span className="text-white">
                                        {selectedCounsellor?.name || "Not selected"}
                                    </span>
                                </p>

                                <p>
                                    Distress Priority:{" "}
                                    <span className="text-white">
                                        {selectedCase ? priority : "Not set"}
                                    </span>
                                </p>

                                <p>
                                    Target Counseling Date:{" "}
                                    <span className="text-white">
                                        {dueDate || "Not set"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:w-64">
                            <Button
                                onClick={handleAssign}
                                disabled={!selectedCase || !selectedCounsellor || assigned}
                            >
                                {assigned ? "Case Assigned" : "Assign Case"}
                            </Button>

                            {assigned && (
                                <Button onClick={handleFollowUp}>
                                    {followUp
                                        ? "Follow-up Session Scheduled"
                                        : "Schedule Counseling Follow-up"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {followUp && (
                        <div className="mt-5 p-4 rounded-lg border border-teal-400/40 bg-teal-400/10">
                            <p className="font-semibold text-teal-300">
                                ✓ Mental health follow-up session scheduled successfully
                            </p>

                            <p className="text-sm text-slate-400 mt-1">
                                The assigned mental health counsellor can now initiate psychological support and trauma recovery care.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Assignment History */}
                <Card className="mt-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Assignment History & Audit Log
                    </h2>

                    {history.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            No counseling assignments have been made in this session.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-700">
                                        <th className="py-3">Incident Case</th>
                                        <th className="py-3">Mental Health Counsellor</th>
                                        <th className="py-3">Distress Level</th>
                                        <th className="py-3">Date Assigned</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {history.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-800"
                                        >
                                            <td className="py-3 font-mono text-teal-400">{item.caseId}</td>
                                            <td className="py-3">{item.counsellor}</td>
                                            <td className="py-3">{item.priority}</td>
                                            <td className="py-3">{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Reassignment */}
                <Card className="mt-6">
                    <h2 className="text-xl font-semibold">
                        Reassignment Options
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                        Assigned cases can be reassigned when counsellor availability, trauma caseload, or psychological distress levels change.
                    </p>

                    <div className="mt-4 grid md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="font-medium">Caseload Relief</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Rebalance active cases from overburdened mental health professionals.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="font-medium">Specialized Care</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Reassign to specialists focused on acute PTSD, severe distress, or grief.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="font-medium">Crisis Escalation</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Redirect high-urgency distress cases to available crisis intervention therapists.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Mock Data Notice */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    Demo workspace • Counsellor availability, trauma specialization, and incident distress metrics are mock data.
                </p>
            </div>
        </div>
    );
}