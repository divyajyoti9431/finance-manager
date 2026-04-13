export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⚡</span>
        <span className="font-semibold text-amber-800">
          Buy Alert — {alerts.length} ETF{alerts.length > 1 ? 's' : ''} at/below threshold
        </span>
      </div>
      <div className="space-y-1">
        {alerts.map((alert) => (
          <div key={alert.etfId} className="flex items-center gap-2 text-sm text-amber-700">
            <span className="font-medium text-amber-900">[{alert.symbol}]</span>
            <span>{alert.etfName}</span>
            <span>—</span>
            <span>
              Current: <strong>₹{alert.currentPrice}</strong>
            </span>
            <span className="text-amber-500">≤</span>
            <span>
              Your threshold: <strong>₹{alert.threshold}</strong>
            </span>
            <span className="ml-2 bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold">
              BUY NOW
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
