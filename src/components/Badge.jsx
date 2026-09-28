export default function Badge({ children, color = "teal" }) {
  const colors = {
    teal: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    red: "bg-red-500/20 text-red-300 border-red-500/40",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    slate: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${colors[color]}`}
    >
      {children}
    </span>
  );
}