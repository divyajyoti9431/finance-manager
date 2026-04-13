import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import useFinanceStore from '../store/useFinanceStore'
import StatCard from '../components/StatCard'
import AlertBanner from '../components/AlertBanner'

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981']

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function generateMonthlyData(sipInvs, goldInvs, stockInvs) {
  const today = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1)
    const allInvs = [
      ...sipInvs.map((inv) => ({ ...inv, growth: 0.18 })),
      ...goldInvs.map((inv) => ({ ...inv, growth: 0.12 })),
      ...stockInvs.map((inv) => ({ ...inv, growth: 0.22 })),
    ]
    const invested = allInvs
      .filter((inv) => new Date(inv.date) <= d)
      .reduce((s, inv) => s + inv.amount, 0)
    const value = allInvs
      .filter((inv) => new Date(inv.date) <= d)
      .reduce((s, inv) => {
        const days = (d - new Date(inv.date)) / (1000 * 60 * 60 * 24)
        return s + inv.amount * Math.pow(1 + inv.growth, days / 365)
      }, 0)
    return {
      month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      invested: parseFloat(invested.toFixed(0)),
      value: parseFloat(value.toFixed(0)),
    }
  })
}

export default function Dashboard({ onNavigate }) {
  const {
    sipInvestments,
    goldInvestments,
    stockInvestments,
    getPortfolioSummary,
    getGoldAlerts,
  } = useFinanceStore()

  const summary = getPortfolioSummary()
  const alerts = getGoldAlerts()
  const monthlyData = useMemo(
    () => generateMonthlyData(sipInvestments, goldInvestments, stockInvestments),
    [sipInvestments, goldInvestments, stockInvestments]
  )

  const pieData = [
    { name: 'SIP Funds', value: summary.sipCurrentValue || 0 },
    { name: 'Gold ETF', value: summary.goldCurrentValue || 0 },
    { name: 'Stocks', value: summary.stockCurrentValue || 0 },
  ].filter((d) => d.value > 0)

  const hasInvestments = summary.totalInvested > 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Portfolio Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <AlertBanner alerts={alerts} />

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Invested"
          value={fmt(summary.totalInvested)}
          subtitle="Across all categories"
          colorClass="bg-blue-50 text-blue-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Current Value"
          value={fmt(summary.totalCurrentValue)}
          subtitle="Portfolio market value"
          colorClass="bg-indigo-50 text-indigo-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="Total P&L"
          value={`${summary.totalPnL >= 0 ? '+' : ''}${fmt(summary.totalPnL)}`}
          subtitle="Unrealized gain/loss"
          trend={summary.pnlPct}
          colorClass={summary.totalPnL >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Active Investments"
          value={sipInvestments.length + goldInvestments.length + stockInvestments.length}
          subtitle={`${sipInvestments.length} SIP · ${goldInvestments.length} Gold · ${stockInvestments.length} Stocks`}
          colorClass="bg-purple-50 text-purple-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      {hasInvestments ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Area Chart - Portfolio Growth */}
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Portfolio Growth (12 Months)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(v) => [fmt(v)]}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Legend />
                <Area type="monotone" dataKey="invested" name="Invested" stroke="#10b981" fill="url(#colorInvested)" strokeWidth={2} />
                <Area type="monotone" dataKey="value" name="Current Value" stroke="#3b82f6" fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Allocation */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Allocation</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={85}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [fmt(v)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data yet</div>
            )}
          </div>
        </div>
      ) : null}

      {/* Category Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'SIP Funds', invested: summary.sipTotal, current: summary.sipCurrentValue, color: 'blue', page: 'sip', icon: '📈' },
          { label: 'Gold ETF', invested: summary.goldTotal, current: summary.goldCurrentValue, color: 'amber', page: 'gold', icon: '🥇' },
          { label: 'Stocks', invested: summary.stockTotal, current: summary.stockCurrentValue, color: 'green', page: 'stocks', icon: '📊' },
        ].map((cat) => {
          const pnl = cat.current - cat.invested
          const pct = cat.invested > 0 ? (pnl / cat.invested) * 100 : 0
          return (
            <div key={cat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <button
                  onClick={() => onNavigate(cat.page)}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  View →
                </button>
              </div>
              <div className="text-base font-semibold text-slate-700">{cat.label}</div>
              <div className="text-xl font-bold text-slate-800 mt-1">{fmt(cat.current)}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">Invested: {fmt(cat.invested)}</span>
                {cat.invested > 0 && (
                  <span className={`text-xs font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pnl >= 0 ? '+' : ''}{pct.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {!hasInvestments && (
        <div className="mt-8 text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="text-5xl mb-4">💼</div>
          <div className="text-lg font-semibold text-slate-700 mb-2">Your portfolio is empty</div>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Start investing in SIP funds, Gold ETFs, or Stocks using the navigation on the left.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('sip')} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Start SIP
            </button>
            <button onClick={() => onNavigate('gold')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
              Buy Gold ETF
            </button>
            <button onClick={() => onNavigate('stocks')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
              Pick Stocks
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
