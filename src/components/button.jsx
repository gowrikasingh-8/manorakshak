export default function Button({ children, onClick, type = "button", disabled = false, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg bg-slate-800 text-white font-medium
        hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/20
        active:translate-y-0 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900
        ${className}`}
    >
      {children}
    </button>
  );
}