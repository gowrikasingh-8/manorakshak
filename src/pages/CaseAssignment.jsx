import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const initialCases = [
    {
        id: "CASE-101",
        title: "Student Support Case",
        priority: "High",
        dueDate: "2026-09-08",
        status: "Unassigned",
        reason: "Immediate counselling support required",
    },
    {
        id: "CASE-102",
        title: "Academic Stress Case",
        priority: "Medium",
        dueDate: "2026-09-10",
        status: "Unassigned",
        reason: "Student reporting academic pressure",
    },
    {
        id: "CASE-103",
        title: "Wellbeing Follow-up",
        priority: "Low",
        dueDate: "2026-09-14",
        status: "Unassigned",
        reason: "Routine wellbeing follow-up",
    },
];

const counsellors = [
    {
        id: 1,
        name: "Dr. Ananya Sharma",
        availability: "Available",
        workload: 4,
        capacity: 8,
    },
    {
        id: 2,
        name: "Rahul Mehta",
        availability: "Available",
        workload: 6,
        capacity: 8,
    },
    {
        id: 3,
        name: "Priya Kapoor",
        availability: "Busy",
        workload: 8,
        capacity: 8,
    },
];

export default function CaseAssignment() {
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
                <div className="mb-8">
                    <p className="text-teal-400 font-medium mb-2">
                        P25 • CASE MANAGEMENT
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold">
                        Case Assignment Workspace
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Distribute cases based on counsellor availability, workload and
                        case priority.
                    </p>
                </div>

                {/* Workflow */}
                <Card className="mb-6">
                    <h2 className="text-lg font-semibold mb-5">
                        Assignment Workflow
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        {[
                            "Unassigned Cases",
                            "Select Case",
                            "Select Counsellor",
                            "Set Priority",
                            "Assign",
                            "Follow-up Scheduled",
                        ].map((step, index) => {
                            const active =
                                index === 0 && !selectedCase ||
                                index === 1 && selectedCase && !selectedCounsellor ||
                                index === 2 && selectedCounsellor && !assigned ||
                                index === 3 && selectedCounsellor && !assigned ||
                                index === 4 && assigned && !followUp ||
                                index === 5 && followUp;

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
                                Unassigned Cases
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
                                                <p className="font-semibold">
                                                    {caseItem.id}
                                                </p>

                                                <p className="text-sm text-slate-300 mt-1">
                                                    {caseItem.title}
                                                </p>
                                            </div>

                                            <span className="text-xs px-2 py-1 rounded bg-slate-800 h-fit">
                                                {caseItem.priority}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 mt-3">
                                            Due: {caseItem.dueDate}
                                        </p>

                                        <Button
                                            className="w-full mt-4"
                                            onClick={() => handleSelectCase(caseItem)}
                                        >
                                            Select Case
                                        </Button>
                                    </div>
                                ))}

                            {cases.filter((item) => item.status === "Unassigned")
                                .length === 0 && (
                                    <p className="text-slate-500 text-sm">
                                        No unassigned cases remaining.
                                    </p>
                                )}
                        </div>
                    </Card>

                    {/* Case Details */}
                    <Card>
                        <h2 className="text-xl font-semibold mb-5">
                            Case Details
                        </h2>

                        {!selectedCase ? (
                            <div className="text-center py-12 text-slate-500">
                                Select a case to begin assignment.
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
                                    <p className="text-xs text-slate-500">CASE TYPE</p>
                                    <p className="mt-1">{selectedCase.title}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        ASSIGNMENT REASON
                                    </p>
                                    <p className="text-sm text-slate-300 mt-1">
                                        {selectedCase.reason}
                                    </p>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="text-sm text-slate-400">
                                        Case Priority
                                    </label>

                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
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
                                        Due Date
                                    </label>

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                    />
                                </div>

                            </div>
                        )}
                    </Card>

                    {/* Counsellors */}
                    <Card>
                        <h2 className="text-xl font-semibold mb-5">
                            Counsellor Availability
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
                                    <div className="flex justify-between">
                                        <span className="font-semibold">
                                            {counsellor.name}
                                        </span>

                                        <span className="text-xs">
                                            {counsellor.availability}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-sm text-slate-400">
                                        Current workload:{" "}
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
                                    Case:{" "}
                                    <span className="text-white">
                                        {selectedCase?.id || "Not selected"}
                                    </span>
                                </p>

                                <p>
                                    Counsellor:{" "}
                                    <span className="text-white">
                                        {selectedCounsellor?.name || "Not selected"}
                                    </span>
                                </p>

                                <p>
                                    Priority:{" "}
                                    <span className="text-white">
                                        {selectedCase ? priority : "Not set"}
                                    </span>
                                </p>

                                <p>
                                    Due Date:{" "}
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
                                        ? "Follow-up Scheduled"
                                        : "Schedule Follow-up"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {followUp && (
                        <div className="mt-5 p-4 rounded-lg border border-teal-400/40 bg-teal-400/10">
                            <p className="font-semibold text-teal-300">
                                ✓ Follow-up scheduled successfully
                            </p>

                            <p className="text-sm text-slate-400 mt-1">
                                The assigned counsellor can now continue the case workflow.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Assignment History */}
                <Card className="mt-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Assignment History
                    </h2>

                    {history.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            No assignments have been made in this session.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-700">
                                        <th className="py-3">Case</th>
                                        <th className="py-3">Counsellor</th>
                                        <th className="py-3">Priority</th>
                                        <th className="py-3">Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {history.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-800"
                                        >
                                            <td className="py-3">{item.caseId}</td>
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
                        Assigned cases can be reassigned when counsellor availability,
                        workload or case priority changes.
                    </p>

                    <div className="mt-4 grid md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="font-medium">Workload Based</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Move cases from overloaded counsellors.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="font-medium">Availability Based</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Reassign when a counsellor becomes unavailable.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="font-medium">Priority Based</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Redirect urgent cases to available staff.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Mock Data Notice */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    Demo workspace • Counsellor availability and workload are mock data.
                </p>
            </div>
        </div>
    );
}