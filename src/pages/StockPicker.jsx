import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { stockPicks, getMomentumColor, getSectors } from '../data/stocks'

const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

function BuyStockModal({ stock, onClose, onBuy }) {
  const [quantity, setQuantity] = useState(10)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const totalAmount = quantity * stock.currentPrice

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!quantity || quantity <= 0) return
    onBuy({
      stockId: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      quantity: parseInt(quantity),
      buyPrice: stock.currentPrice,
      targetPrice: stock.targetPrice,
      stopLoss: stock.stopLoss,
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
              <h3 className="font-bold text-slate-800">Add to Portfolio</h3>
              <p className="text-sm text-slate-500 mt-0.5">{stock.symbol} · {stock.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (shares)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Buy Price</span><span className="font-medium">₹{stock.currentPrice}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Target</span><span className="font-medium text-green-600">₹{stock.targetPrice} (+{stock.upside}%)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Stop Loss</span><span className="font-medium text-red-500">₹{stock.stopLoss}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-bold border-t border-green-100 pt-1 mt-1">
              <span>Total Investment</span><span>{fmtINR(totalAmount)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-green-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-600">
              Add to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function StockPicker() {
  const [selectedStock, setSelectedStock] = useState(null)
  const [filterSector, setFilterSector] = useState('All')
  const [filterMomentum, setFilterMomentum] = useState('All')
  const [sortBy, setSortBy] = useState('upside')
  const { addStockInvestment } = useFinanceStore()

  const sectors = ['All', ...getSectors()]
  const weekStr = (() => {
    const d = new Date()
    const start = new Date(d)
    start.setDate(d.getDate() - d.getDay() + 1)
    const end = new Date(start)
    end.setDate(start.getDate() + 4)
    return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
  })()

  let filtered = stockPicks
  if (filterSector !== 'All') filtered = filtered.filter((s) => s.sector === filterSector)
  if (filterMomentum !== 'All') filtered = filtered.filter((s) => s.momentum === filterMomentum)
  if (sortBy === 'upside') filtered = [...filtered].sort((a, b) => b.upside - a.upside)
  if (sortBy === 'change') filtered = [...filtered].sort((a, b) => b.change - a.change)
  if (sortBy === 'price') filtered = [...filtered].sort((a, b) => a.currentPrice - b.currentPrice)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stock Picker</h1>
          <p className="text-slate-500 text-sm mt-1">Short-term picks (1-4 weeks) based on technical & fundamental analysis</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-sm text-right">
          <div className="text-xs text-green-600 font-medium">This Week's Picks</div>
          <div className="text-green-800 font-semibold">{weekStr}</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 flex gap-2 items-start">
        <span className="text-yellow-500 text-sm shrink-0">⚠️</span>
        <p className="text-xs text-yellow-800">
          These suggestions are for educational purposes only. Stock market investments are subject to market risk.
          Please consult your financial advisor before investing. Past performance is not indicative of future results.
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-xs font-medium text-slate-500 mr-2">Sector:</span>
            <div className="inline-flex flex-wrap gap-1">
              {sectors.map((s) => (
                <button key={s} onClick={() => setFilterSector(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterSector === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 mr-2">Momentum:</span>
            {['All', 'Bullish', 'Neutral'].map((m) => (
              <button key={m} onClick={() => setFilterMomentum(m)}
                className={`mr-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterMomentum === m ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {m}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <span className="text-xs font-medium text-slate-500 mr-2">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2 py-1 text-slate-600 focus:outline-none">
              <option value="upside">Upside %</option>
              <option value="change">Today's Change</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-right">CMP</th>
              <th className="px-4 py-3 text-right">Target</th>
              <th className="px-4 py-3 text-right">Stop Loss</th>
              <th className="px-4 py-3 text-right">Upside</th>
              <th className="px-4 py-3 text-center">Momentum</th>
              <th className="px-4 py-3 text-center">Holding</th>
              <th className="px-4 py-3 text-left">Rationale</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((stock) => (
              <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-800 text-sm">{stock.symbol}</div>
                  <div className="text-xs text-slate-400 max-w-[140px] truncate">{stock.name}</div>
                  <div className="text-xs text-blue-500 mt-0.5">{stock.sector}</div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="font-bold text-slate-800 text-sm">₹{stock.currentPrice.toLocaleString('en-IN')}</div>
                  <div className={`text-xs font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-medium text-green-600">₹{stock.targetPrice.toLocaleString('en-IN')}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-medium text-red-500">₹{stock.stopLoss.toLocaleString('en-IN')}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-bold text-green-600">+{stock.upside}%</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getMomentumColor(stock.momentum)}`}>
                    {stock.momentum}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="text-xs text-slate-500 whitespace-nowrap">{stock.holdingPeriod}</span>
                </td>
                <td className="px-4 py-3.5 max-w-[200px]">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{stock.rationale}</p>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button
                    onClick={() => setSelectedStock(stock)}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {stockPicks.length} stocks
        </div>
      </div>

      {selectedStock && (
        <BuyStockModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onBuy={(inv) => { addStockInvestment(inv); setSelectedStock(null) }}
        />
      )}
    </div>
  )
}
