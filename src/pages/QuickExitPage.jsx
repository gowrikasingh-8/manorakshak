// QuickExitPage — shown after Quick Exit is triggered.
// Looks like a neutral weather/news page to anyone glancing at the screen.
// In a real deployment this would redirect to an external site entirely.

export default function QuickExitPage() {
  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 font-sans">
      {/* Fake browser-style top bar */}
      <div className="bg-slate-200 border-b border-slate-300 px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 block" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
          <span className="w-3 h-3 rounded-full bg-green-400 block" />
        </div>
        <div className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-1 text-xs text-slate-500">
          weather.com
        </div>
      </div>

      {/* Fake weather page */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-sky-700 mb-1">Today's Weather</h1>
        <p className="text-slate-500 text-sm mb-8">New Delhi, India · Updated just now</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { day: "Today", icon: "☀️", temp: "34°C", desc: "Sunny" },
            { day: "Tomorrow", icon: "⛅", temp: "31°C", desc: "Partly Cloudy" },
            { day: "Wednesday", icon: "🌧️", temp: "27°C", desc: "Light Rain" },
          ].map((w) => (
            <div key={w.day} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{w.day}</p>
              <p className="text-4xl mb-1">{w.icon}</p>
              <p className="text-2xl font-bold text-slate-700">{w.temp}</p>
              <p className="text-sm text-slate-500 mt-1">{w.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Hourly Forecast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM"].map((h, i) => (
              <div key={h} className="flex flex-col items-center gap-1 min-w-[48px]">
                <span className="text-xs text-slate-400">{h}</span>
                <span className="text-xl">{i < 3 ? "☀️" : i < 6 ? "⛅" : "🌤️"}</span>
                <span className="text-sm font-semibold text-slate-700">{34 - i}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
