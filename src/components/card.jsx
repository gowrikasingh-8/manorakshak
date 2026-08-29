export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-800/60 border border-slate-700 rounded-xl p-5 shadow-sm backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}