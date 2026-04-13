import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const fmtDec = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

function PnLBadge({ pnl, pct }) {
  const isPos = pnl >= 0
  return (
    <div className={`flex flex-col items-end ${isPos ? 'text-green-600' : 'text-red-600'}`}>
      <span className="text-sm font-semibold">
        {isPos ? '+' : ''}{fmt(pnl)}
      </span>
      <span className="text-xs">
        ({isPos ? '+' : ''}{pct.toFixed(2)}%)
      </span>
    </div>
  )
}

function EmptyState({ label, onNavigate, page }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">📭</div>
      <div className="text-slate-600 font-medium">No {label} investments yet</div>
      <button
        onClick={() => onNavigate(page)}
        className="mt-3 text-sm text-blue-500 hover:text-blue-700 font-medium"
      >
        Go add some →
      </button>
    </div>
  )
}

export default function Portfolio({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all')
  const {
    getEnrichedSIPInvestments,
    getEnrichedGoldInvestments,
    getEnrichedStockInvestments,
    getPortfolioSummary,
    removeSIPInvestment,
    removeGoldInvestment,
    removeStockInvestment,
  } = useFinanceStore()

  const sipInvs = getEnrichedSIPInvestments()
  const goldInvs = getEnrichedGoldInvestments()
  const stockInvs = getEnrichedStockInvestments()
  const summary = getPortfolioSummary()

  const tabs = [
    { id: 'all', label: 'All Investments', count: sipInvs.length + goldInvs.length + stockInvs.length },
    { id: 'sip', label: 'SIP Funds', count: sipInvs.length },
    { id: 'gold', label: 'Gold ETF', count: goldInvs.length },
    { id: 'stocks', label: 'Stocks', count: stockInvs.length },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Portfolio</h1>
        <p className="text-slate-500 text-sm mt-1">Track all your investments and P&L in one place</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Invested', value: fmt(summary.totalInvested), sub: '', color: 'text-slate-800' },
          { label: 'Current Value', value: fmt(summary.totalCurrentValue), sub: '', color: 'text-slate-800' },
          {
            label: 'Total P&L',
            value: `${summary.totalPnL >= 0 ? '+' : ''}${fmt(summary.totalPnL)}`,
            sub: `${summary.pnlPct >= 0 ? '+' : ''}${summary.pnlPct.toFixed(2)}%`,
            color: summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600',
          },
          {
            label: 'Investments',
            value: sipInvs.length + goldInvs.length + stockInvs.length,
            sub: `${sipInvs.length} SIP · ${goldInvs.length} Gold · ${stockInvs.length} Stocks`,
            color: 'text-slate-800',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="text-xs text-slate-500 mb-1">{s.label}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            {s.sub && <div className={`text-xs mt-0.5 ${s.color === 'text-slate-800' ? 'text-slate-400' : s.color}`}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-slate-100 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SIP Table */}
      {(activeTab === 'all' || activeTab === 'sip') && (
        <div className="mb-6">
          {activeTab === 'all' && (
            <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="text-blue-500">📈</span> SIP Mutual Funds
            </h2>
          )}
          {sipInvs.length === 0 ? (
            <EmptyState label="SIP" onNavigate={onNavigate} page="sip" />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Fund</th>
                    <th className="px-4 py-3 text-right">Category</th>
                    <th className="px-4 py-3 text-right">Invested</th>
                    <th className="px-4 py-3 text-right">Units</th>
                    <th className="px-4 py-3 text-right">Buy NAV</th>
                    <th className="px-4 py-3 text-right">Current Value</th>
                    <th className="px-4 py-3 text-right">P&L</th>
                    <th className="px-4 py-3 text-right">Date</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sipInvs.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 text-sm">{inv.fundName}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{inv.category}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-700">{fmt(inv.amount)}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">{inv.units}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">₹{inv.buyNAV}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">{fmt(inv.currentValue)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <PnLBadge pnl={inv.pnl} pct={(inv.pnl / inv.amount) * 100} />
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-400">
                        {new Date(inv.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => removeSIPInvestment(inv.id)}
                          className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
                          title="Remove investment"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-100">
                  <tr>
                    <td colSpan={2} className="px-4 py-2.5 text-xs font-semibold text-slate-600">Total SIP</td>
                    <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-700">{fmt(summary.sipTotal)}</td>
                    <td colSpan={2}></td>
                    <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-700">{fmt(summary.sipCurrentValue)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <PnLBadge pnl={summary.sipCurrentValue - summary.sipTotal} pct={summary.sipTotal > 0 ? ((summary.sipCurrentValue - summary.sipTotal) / summary.sipTotal) * 100 : 0} />
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Gold ETF Table */}
      {(activeTab === 'all' || activeTab === 'gold') && (
        <div className="mb-6">
          {activeTab === 'all' && (
            <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span>🥇</span> Gold ETF
            </h2>
          )}
          {goldInvs.length === 0 ? (
            <EmptyState label="Gold ETF" onNavigate={onNavigate} page="gold" />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">ETF</th>
                    <th className="px-4 py-3 text-right">Units</th>
                    <th className="px-4 py-3 text-right">Buy Price</th>
                    <th className="px-4 py-3 text-right">Current Price</th>
                    <th className="px-4 py-3 text-right">Invested</th>
                    <th className="px-4 py-3 text-right">Current Value</th>
                    <th className="px-4 py-3 text-right">P&L</th>
                    <th className="px-4 py-3 text-right">Date</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {goldInvs.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 text-sm">{inv.symbol}</div>
                        <div className="text-xs text-slate-400">{inv.etfName}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">{inv.units}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">₹{inv.buyPrice}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-700">₹{inv.currentPrice}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-700">{fmtDec(inv.amount)}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">{fmtDec(inv.currentValue)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <PnLBadge pnl={inv.pnl} pct={(inv.pnl / inv.amount) * 100} />
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-400">
                        {new Date(inv.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => removeGoldInvestment(inv.id)}
                          className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Stocks Table */}
      {(activeTab === 'all' || activeTab === 'stocks') && (
        <div className="mb-6">
          {activeTab === 'all' && (
            <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span>📊</span> Stocks
            </h2>
          )}
          {stockInvs.length === 0 ? (
            <EmptyState label="Stock" onNavigate={onNavigate} page="stocks" />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Buy Price</th>
                    <th className="px-4 py-3 text-right">Target</th>
                    <th className="px-4 py-3 text-right">Stop Loss</th>
                    <th className="px-4 py-3 text-right">Invested</th>
                    <th className="px-4 py-3 text-right">Current Value</th>
                    <th className="px-4 py-3 text-right">P&L</th>
                    <th className="px-4 py-3 text-right">Date</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stockInvs.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800 text-sm">{inv.symbol}</div>
                        <div className="text-xs text-slate-400">{inv.sector}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">{inv.quantity}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-slate-600">₹{inv.buyPrice.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-green-600 font-medium">₹{inv.targetPrice.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3.5 text-right text-sm text-red-500">₹{inv.stopLoss.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-700">{fmt(inv.amount)}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">{fmt(inv.currentValue)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <PnLBadge pnl={inv.pnl} pct={(inv.pnl / inv.amount) * 100} />
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-400">
                        {new Date(inv.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => removeStockInvestment(inv.id)}
                          className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
