export default function ErrorState({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl mb-1">
        !
      </div>
      <p className="text-white font-medium">Something went wrong</p>
      <p className="text-slate-400 text-sm max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-teal-400 text-sm hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}