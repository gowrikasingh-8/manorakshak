export default function Button({ children, onClick, type = "button", disabled = false, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium
        hover:bg-teal-500 hover:-translate-y-0.5
        hover:shadow-[0_0_20px_rgba(45,212,191,0.5)]
        active:translate-y-0 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
        ${className}`}
    >
      {children}
    </button>
  );
}