import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function EscalationWorkflow() {
    const stages = [
        "Alert",
        "Review",
        "Acknowledge",
        "Assign",
        "Escalate",
        "Human Follow-up",
        "Resolve",
    ];

    const [activeStage, setActiveStage] = useState(0);

    const stageInfo = [
        {
            status: "Alert generated",
            description: "AI alert has identified a case that requires human attention.",
        },
        {
            status: "Under review",
            description: "The alert is being reviewed by the responsible officer.",
        },
        {
            status: "Acknowledged",
            description: "The responsible officer has acknowledged the alert.",
        },
        {
            status: "Officer assigned",
            description: "A responsible officer has been assigned to the case.",
        },
        {
            status: "Escalated",
            description: "The case has been escalated because additional intervention is required.",
        },
        {
            status: "Human follow-up",
            description: "A human support officer is following up with the case.",
        },
        {
            status: "Resolved",
            description: "The escalation has been addressed and the case is resolved.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-teal-400 text-sm font-medium">
                        Manorakshak • Escalation Management
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        Escalation Workflow
                    </h1>

                    <p className="text-slate-400 mt-2 max-w-3xl">
                        Follow an alert from initial detection through human review,
                        escalation, follow-up, and final resolution.
                    </p>
                </div>

                {/* Workflow */}
                <Card>
                    <h2 className="text-xl font-semibold mb-6">
                        Escalation Journey
                    </h2>

                    <div className="overflow-x-auto pb-4">
                        <div className="flex items-center min-w-max">
                            {stages.map((stage, index) => (
                                <div key={stage} className="flex items-center">

                                    <button
                                        onClick={() => setActiveStage(index)}
                                        className="flex flex-col items-center group"
                                    >
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center border-2 font-semibold transition ${index === activeStage
                                                    ? "bg-teal-500 border-teal-400 text-slate-900"
                                                    : index < activeStage
                                                        ? "bg-teal-500/20 border-teal-500 text-teal-300"
                                                        : "bg-slate-800 border-slate-600 text-slate-400"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>

                                        <span
                                            className={`text-xs mt-2 text-center w-24 ${index === activeStage
                                                    ? "text-teal-400 font-semibold"
                                                    : "text-slate-400"
                                                }`}
                                        >
                                            {stage}
                                        </span>
                                    </button>

                                    {index < stages.length - 1 && (
                                        <div
                                            className={`w-12 md:w-20 h-0.5 mx-2 ${index < activeStage
                                                    ? "bg-teal-500"
                                                    : "bg-slate-700"
                                                }`}
                                        />
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Current stage */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm">
                                        Current stage
                                    </p>

                                    <h2 className="text-2xl font-bold text-teal-400 mt-1">
                                        {stages[activeStage]}
                                    </h2>
                                </div>

                                <span className="px-3 py-1 rounded-full text-xs bg-teal-500/20 text-teal-300">
                                    {stageInfo[activeStage].status}
                                </span>
                            </div>

                            <p className="text-slate-300 mb-6">
                                {stageInfo[activeStage].description}
                            </p>

                            <div className="flex gap-3">
                                {activeStage > 0 && (
                                    <Button
                                        onClick={() => setActiveStage(activeStage - 1)}
                                    >
                                        Previous
                                    </Button>
                                )}

                                {activeStage < stages.length - 1 && (
                                    <Button
                                        onClick={() => setActiveStage(activeStage + 1)}
                                    >
                                        Move to Next Stage
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Case status */}
                    <Card>
                        <p className="text-slate-400 text-sm">
                            Case Priority
                        </p>

                        <p className="text-amber-300 font-semibold mt-1">
                            High
                        </p>

                        <div className="border-t border-slate-700 my-4" />

                        <p className="text-slate-400 text-sm">
                            Responsible Officer
                        </p>

                        <p className="text-slate-200 mt-1">
                            Priya Sharma
                        </p>

                        <div className="border-t border-slate-700 my-4" />

                        <p className="text-slate-400 text-sm">
                            Status
                        </p>

                        <p className="text-teal-300 mt-1">
                            {stageInfo[activeStage].status}
                        </p>
                    </Card>
                </div>

                {/* Case details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <Card>
                        <h2 className="text-lg font-semibold mb-4">
                            Escalation Details
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Escalation Reason
                                </p>
                                <p className="text-slate-200 mt-1">
                                    Repeated high-risk alert requires human intervention.
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Timeline
                                </p>
                                <p className="text-slate-200 mt-1">
                                    03 Sep 2026 • 20:45
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Notes
                                </p>
                                <p className="text-slate-200 mt-1">
                                    Officer requested a priority follow-up and support review.
                                </p>
                            </div>

                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold mb-4">
                            Resolution Details
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Resolution Status
                                </p>
                                <p className="text-slate-200 mt-1">
                                    Pending human follow-up
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Follow-up Action
                                </p>
                                <p className="text-slate-200 mt-1">
                                    Direct contact and support assessment by assigned officer.
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Final Resolution
                                </p>
                                <p className="text-slate-500 mt-1">
                                    To be recorded after the case is resolved.
                                </p>
                            </div>

                        </div>
                    </Card>

                </div>

                {/* Blueprint connection */}
                <div className="mt-6">
                    <Card>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-teal-400 mt-2" />

                            <div>
                                <h2 className="font-semibold">
                                    Human Follow-up Principle
                                </h2>

                                <p className="text-slate-400 text-sm mt-1">
                                    AI alerts initiate this workflow, but escalation is handled
                                    through human review, assignment, follow-up, and resolution.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}