import { useState } from "react";
import Button from "./Button";

export default function ScheduleModal({ open, onClose, onConfirm }) {
  const [service, setService] = useState("counselling");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;

  const handleConfirm = () => {
    if (!date || !time) return;
    setConfirmed(true);
    onConfirm?.({ service, date, time });
  };

  const handleClose = () => {
    setConfirmed(false);
    setDate("");
    setTime("");
    setService("counselling");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose}></div>

      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        {!confirmed ? (
          <>
            <h2 className="text-lg font-semibold text-teal-400 mb-1">Schedule a Follow-up</h2>
            <p className="text-slate-400 text-sm mb-5">
              Pick a service, date, and time that works for you.
            </p>

            <div className="mb-4">
              <label className="text-sm text-slate-300 block mb-1">Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
              >
                <option value="counselling">Counselling</option>
                <option value="medical">Medical Support</option>
                <option value="legal">Legal Aid</option>
                <option value="general">General Check-in Call</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-sm text-slate-300 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ colorScheme: "dark", color: "#ffffff" }}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm text-slate-300 block mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ colorScheme: "dark" , color: "#ffffff" }}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleConfirm} disabled={!date || !time}>
                Confirm
              </Button>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl mx-auto mb-3">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Follow-up Scheduled</h2>
            <p className="text-slate-400 text-sm mb-5">
              {service.charAt(0).toUpperCase() + service.slice(1)} on {date} at {time}
            </p>
            <Button onClick={handleClose}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}