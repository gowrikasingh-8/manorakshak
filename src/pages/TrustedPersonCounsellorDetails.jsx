import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Clock, ShieldCheck, MessageSquare } from "lucide-react";
import { assignedCounsellor } from "../data/trustedPersonMock";

export default function TrustedPersonCounsellorDetails() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Message to care team:", message);
    setSent(true);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-teal-400 mb-6">Assigned Counsellor</h1>

        <Card className="mb-6">
          <p className="text-xl font-semibold text-white">{assignedCounsellor.name}</p>
          <p className="text-slate-400 text-sm mb-4">{assignedCounsellor.role}</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Assigned since {assignedCounsellor.assignedSince}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Available: {assignedCounsellor.availability}</span>
            </div>
          </div>
        </Card>

        <Card className="mb-6 bg-slate-800/60 border border-slate-700">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-300">{assignedCounsellor.contactNote}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            Send a message to the care team
          </h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="e.g. I'm a bit worried this week, could someone check in?"
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 mb-3"
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            Send
          </Button>
          {sent && (
            <p className="text-teal-400 text-xs mt-2">
              Message sent. The care team will follow up with you directly.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}