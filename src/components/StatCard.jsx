export default function StatCard({ title, value, subtitle, icon, trend, colorClass = 'bg-blue-50 text-blue-600' }) {
  const isPositive = trend > 0
  const isNegative = trend < 0

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
        {trend !== undefined && trend !== null && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-green-50 text-green-600'
                : isNegative
                ? 'bg-red-50 text-red-600'
                : 'bg-slate-50 text-slate-500'
            }`}
          >
            {isPositive ? '+' : ''}{typeof trend === 'number' ? trend.toFixed(2) : trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  )
}
