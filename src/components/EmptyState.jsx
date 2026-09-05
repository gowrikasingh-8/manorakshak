export default function EmptyState({ title = "Nothing here yet", message = "There's no data to show right now." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl mb-2">
        ○
      </div>
      <p className="text-white font-medium">{title}</p>
      <p className="text-slate-400 text-sm max-w-sm">{message}</p>
    </div>
  );
}