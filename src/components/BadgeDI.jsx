const COLOR_STYLES = {
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export default function Badge({ children, color = 'slate', className = '', ...props }) {
  const colorClasses = COLOR_STYLES[color] || COLOR_STYLES.slate;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
