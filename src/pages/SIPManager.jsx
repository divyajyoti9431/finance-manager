import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { sipFunds, getMonthlyRecommendations, getRiskColor } from '../data/sipFunds'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function FundCard({ fund, onInvest }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-slate-800 text-sm leading-tight">{fund.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{fund.amc}</div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${getRiskColor(fund.risk)}`}>
          {fund.risk}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{fund.description}</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {['1y', '3y', '5y'].map((period) => (
          <div key={period} className="text-center bg-slate-50 rounded-lg p-2">
            <div className="text-sm font-bold text-green-600">{fund.returns[period]}%</div>
            <div className="text-xs text-slate-400">{period} returns</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span>AUM: {fund.aum}</span>
        <span>Expense: {fund.expenseRatio}%</span>
        <span>Min SIP: {fmt(fund.minSIP)}</span>
      </div>

      <div className="flex items-center justify-between">
        <StarRating rating={fund.rating} />
        <button
          onClick={() => onInvest(fund)}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          + Add SIP
        </button>
      </div>
    </div>
  )
}

function AddSIPModal({ fund, onClose, onAdd }) {
  const [amount, setAmount] = useState(fund.minSIP * 10)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || amount < fund.minSIP) return
    onAdd({
      fundId: fund.id,
      fundName: fund.name,
      category: fund.category,
      amount: parseFloat(amount),
      date,
      buyNAV: fund.nav,
      units: parseFloat((amount / fund.nav).toFixed(3)),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Add SIP Investment</h3>
              <p className="text-sm text-slate-500 mt-0.5">{fund.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly SIP Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={fund.minSIP}
              step={500}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Minimum SIP: {fmt(fund.minSIP)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between"><span>Current NAV</span><span className="font-medium">₹{fund.nav}</span></div>
            <div className="flex justify-between"><span>Units to be allocated</span><span className="font-medium">{(amount / fund.nav).toFixed(3)}</span></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600">
              Confirm SIP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SIPManager() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedFund, setSelectedFund] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const { addSIPInvestment } = useFinanceStore()

  const recommended = getMonthlyRecommendations(selectedMonth)
  const categories = ['All', ...new Set(sipFunds.map((f) => f.category))]

  const allFunds = filterCategory === 'All'
    ? sipFunds
    : sipFunds.filter((f) => f.category === filterCategory)

  const seasonLabel = {
    1: 'Tax Saving Season', 2: 'Tax Saving Season', 3: 'ELSS Deadline',
    4: 'Post-Budget Stability', 5: 'Pre-Monsoon Caution', 6: 'Mid-Year Balance',
    7: 'Growth Season', 8: 'Earnings Momentum', 9: 'Q2 Results Season',
    10: 'Year-End Balancing', 11: 'Conservative Phase', 12: 'Year-End Parking',
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">SIP Manager</h1>
        <p className="text-slate-500 text-sm mt-1">Monthly mutual fund suggestions based on market seasonality</p>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Month for Recommendations</label>
            <div className="flex flex-wrap gap-2">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(i + 1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedMonth === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2.5">
          <span className="text-blue-500 font-bold text-lg">📅</span>
          <div>
            <span className="text-sm font-semibold text-blue-800">{MONTHS[selectedMonth - 1]}</span>
            <span className="text-sm text-blue-600 ml-2">— {seasonLabel[selectedMonth]}</span>
          </div>
        </div>
      </div>

      {/* Monthly Recommendations */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-slate-700">
            Top Picks for {MONTHS[selectedMonth - 1]}
          </h2>
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
            {recommended.length} funds
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {recommended.map((fund) => (
            <FundCard key={fund.id} fund={fund} onInvest={setSelectedFund} />
          ))}
        </div>
      </div>

      {/* All Funds with Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-700">All Funds</h2>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {allFunds.map((fund) => (
            <FundCard key={fund.id} fund={fund} onInvest={setSelectedFund} />
          ))}
        </div>
      </div>

      {selectedFund && (
        <AddSIPModal
          fund={selectedFund}
          onClose={() => setSelectedFund(null)}
          onAdd={addSIPInvestment}
        />
      )}
    </div>
  )
}
