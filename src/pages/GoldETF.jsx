import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { goldETFs, getMockCurrentPrice, getPriceChange } from '../data/goldETFs'
import AlertBanner from '../components/AlertBanner'

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

function ThresholdModal({ etf, current, existing, onClose, onSave }) {
  const [threshold, setThreshold] = useState(existing || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!threshold) return
    onSave(etf.id, parseFloat(threshold))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Set Buy Threshold</h3>
              <p className="text-sm text-slate-500 mt-0.5">{etf.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Current Price</span>
              <span className="font-bold text-slate-800">₹{current}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alert me when price drops to (₹)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              step="0.01"
              placeholder={`e.g. ${(current * 0.97).toFixed(2)}`}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              An alert will appear when the price falls at or below this value.
            </p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600">
              Set Threshold
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function BuyModal({ etf, currentPrice, onClose, onBuy }) {
  const [quantity, setQuantity] = useState(10)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const totalAmount = quantity * currentPrice

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!quantity || quantity <= 0) return
    onBuy({
      etfId: etf.id,
      etfName: etf.name,
      symbol: etf.symbol,
      units: parseFloat(quantity),
      buyPrice: currentPrice,
      amount: parseFloat(totalAmount.toFixed(2)),
      date,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Buy Gold ETF</h3>
              <p className="text-sm text-slate-500 mt-0.5">{etf.name} ({etf.symbol})</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Units</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
              step={1}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Price per unit</span><span className="font-medium">₹{currentPrice}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Units</span><span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-bold border-t border-amber-100 pt-1 mt-1">
              <span>Total Amount</span><span>{fmtINR(totalAmount)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600">
              Confirm Buy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GoldETF() {
  const [thresholdModal, setThresholdModal] = useState(null)
  const [buyModal, setBuyModal] = useState(null)
  const { goldThresholds, setGoldThreshold, clearGoldThreshold, addGoldInvestment, getGoldAlerts } = useFinanceStore()
  const alerts = getGoldAlerts()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gold ETF Tracker</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor Gold ETF prices and set buy thresholds. Prices update daily.
        </p>
      </div>

      <AlertBanner alerts={alerts} />

      {/* Why Gold ETF? Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥇</span>
          <div>
            <div className="font-semibold text-amber-800 text-sm">Why invest in Gold ETFs?</div>
            <div className="text-xs text-amber-700 mt-0.5">
              Gold ETFs offer pure gold exposure without storage costs. 1 unit ≈ 1/100 gram of gold.
              Ideal as 5-10% of your portfolio for inflation hedge and diversification.
            </div>
          </div>
        </div>
      </div>

      {/* ETF Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Top Gold ETFs — NSE</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ETF</th>
              <th className="px-4 py-3 text-right">Current Price</th>
              <th className="px-4 py-3 text-right">Change</th>
              <th className="px-4 py-3 text-right">AUM</th>
              <th className="px-4 py-3 text-right">Expense</th>
              <th className="px-4 py-3 text-right">Your Threshold</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {goldETFs.map((etf) => {
              const currentPrice = getMockCurrentPrice(etf)
              const { diff, pct, isUp } = getPriceChange(etf)
              const threshold = goldThresholds[etf.id]
              const isAlert = threshold !== undefined && currentPrice <= threshold

              return (
                <tr key={etf.id} className={`hover:bg-slate-50 transition-colors ${isAlert ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {isAlert && <span className="text-amber-500 text-lg">⚡</span>}
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{etf.symbol}</div>
                        <div className="text-xs text-slate-400">{etf.amc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-bold text-slate-800 text-sm">₹{currentPrice}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(pct)}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-500">{etf.aum}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-500">{etf.expense}%</td>
                  <td className="px-4 py-3.5 text-right">
                    {threshold !== undefined ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-sm font-medium ${isAlert ? 'text-amber-600' : 'text-slate-600'}`}>
                          ₹{threshold}
                        </span>
                        <button
                          onClick={() => clearGoldThreshold(etf.id)}
                          className="text-slate-300 hover:text-red-400 text-xs"
                          title="Remove threshold"
                        >✕</button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Not set</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setThresholdModal({ etf, currentPrice })}
                        className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2.5 py-1 rounded-lg font-medium transition-colors"
                      >
                        Set Alert
                      </button>
                      <button
                        onClick={() => setBuyModal({ etf, currentPrice })}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-lg font-medium transition-colors"
                      >
                        Buy
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Threshold Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-blue-500 text-lg shrink-0">💡</span>
          <div className="text-sm text-blue-800">
            <strong>How to use thresholds:</strong> Set a price below the current price for each ETF.
            When the price drops to your threshold, a buy alert will appear at the top of every page.
            A good strategy is to set thresholds 2-5% below current price for systematic gold buying.
          </div>
        </div>
      </div>

      {thresholdModal && (
        <ThresholdModal
          etf={thresholdModal.etf}
          current={thresholdModal.currentPrice}
          existing={goldThresholds[thresholdModal.etf.id]}
          onClose={() => setThresholdModal(null)}
          onSave={setGoldThreshold}
        />
      )}

      {buyModal && (
        <BuyModal
          etf={buyModal.etf}
          currentPrice={buyModal.currentPrice}
          onClose={() => setBuyModal(null)}
          onBuy={addGoldInvestment}
        />
      )}
    </div>
  )
}
