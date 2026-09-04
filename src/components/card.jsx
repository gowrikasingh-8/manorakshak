export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-800/60 border border-slate-700 rounded-xl p-5 shadow-sm backdrop-blur-sm
        hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5
        transition-all duration-300
        ${className}`}
    >
      {children}
    </div>
  );
}