import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function SystemStatus() {
    const [mockData, setMockData] = useState(true);

    const services = [
        {
            name: "API Gateway",
            status: "Operational",
            detail: "All demo API endpoints responding normally.",
        },
        {
            name: "Notification Service",
            status: "Operational",
            detail: "Notifications are ready for demo delivery.",
        },
        {
            name: "Map Service",
            status: "Operational",
            detail: "Map data is available in demo mode.",
        },
        {
            name: "AI Service",
            status: "Placeholder",
            detail: "AI integration is not connected in this frontend demo.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-teal-400 text-sm font-medium">
                        Binary Brains • Demo Admin
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        System / Integration Status
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Monitor integration readiness and frontend service status for the
                        demo environment.
                    </p>
                </div>

                {/* Demo mode + sync */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    <Card>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">Data Mode</p>
                                <h2 className="text-xl font-semibold mt-1">
                                    {mockData ? "Mock Data Mode" : "Live Data Mode"}
                                </h2>
                                <p className="text-slate-400 text-sm mt-2">
                                    Frontend demo is currently using simulated data.
                                </p>
                            </div>

                            <Button onClick={() => setMockData((value) => !value)}>
                                {mockData ? "Disable" : "Enable"}
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <p className="text-slate-400 text-sm">Last Sync</p>
                        <h2 className="text-xl font-semibold mt-1">
                            31 Aug 2026, 21:15
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Demo synchronization timestamp
                        </p>
                    </Card>

                </div>

                {/* Service status cards */}
                <h2 className="text-xl font-semibold mb-4">
                    Service Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <Card key={service.name}>
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {service.name}
                                    </h3>

                                    <p className="text-slate-400 text-sm mt-2">
                                        {service.detail}
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === "Operational"
                                            ? "bg-teal-500/20 text-teal-300"
                                            : "bg-indigo-500/20 text-indigo-300"
                                        }`}
                                >
                                    {service.status}
                                </span>

                            </div>
                        </Card>
                    ))}
                </div>

                {/* Error states */}
                <div className="mt-8">
                    <Card>
                        <h2 className="text-xl font-semibold mb-2">
                            Error States
                        </h2>

                        <p className="text-slate-400 text-sm mb-4">
                            Example integration failures that the admin/demo layer can
                            display.
                        </p>

                        <div className="space-y-3">

                            <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-4">
                                <p className="text-red-300 font-medium">
                                    API connection unavailable
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Showing mock data while the API is unavailable.
                                </p>
                            </div>

                            <div className="border border-amber-500/30 bg-amber-500/10 rounded-lg p-4">
                                <p className="text-amber-300 font-medium">
                                    Notification service delayed
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Notifications may appear after a short delay.
                                </p>
                            </div>

                        </div>
                    </Card>
                </div>

                {/* Demo note */}
                <div className="mt-6 text-center">
                    <p className="text-slate-500 text-xs">
                        Frontend-only integration monitor • No backend implementation
                    </p>
                </div>

            </div>
        </div>
    );
}