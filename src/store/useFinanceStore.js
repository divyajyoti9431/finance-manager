import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sipFunds } from '../data/sipFunds'
import { goldETFs, getMockCurrentPrice } from '../data/goldETFs'

// Compute current SIP value based on annual return and days held
const getSIPCurrentValue = (investment) => {
  const fund = sipFunds.find(f => f.id === investment.fundId)
  if (!fund) return investment.amount
  const annualReturn = (fund.returns['3y'] || 12) / 100
  const days = (Date.now() - new Date(investment.date).getTime()) / (1000 * 60 * 60 * 24)
  return parseFloat((investment.amount * Math.pow(1 + annualReturn, days / 365)).toFixed(2))
}

// Compute current gold investment value
const getGoldCurrentValue = (investment) => {
  const etf = goldETFs.find(e => e.id === investment.etfId)
  if (!etf) return investment.amount
  const currentPrice = getMockCurrentPrice(etf)
  return parseFloat((investment.units * currentPrice).toFixed(2))
}

// Compute current stock value (moves toward target over 3 weeks)
const getStockCurrentValue = (investment) => {
  const days = (Date.now() - new Date(investment.date).getTime()) / (1000 * 60 * 60 * 24)
  const progress = Math.min(days / 21, 1)
  const priceChange = (investment.targetPrice - investment.buyPrice) * progress * 0.65
  const currentPrice = parseFloat((investment.buyPrice + priceChange).toFixed(2))
  return parseFloat((currentPrice * investment.quantity).toFixed(2))
}

const useFinanceStore = create(
  persist(
    (set, get) => ({
      sipInvestments: [],
      goldInvestments: [],
      stockInvestments: [],
      goldThresholds: {},

      // SIP Actions
      addSIPInvestment: (inv) =>
        set((state) => ({
          sipInvestments: [
            ...state.sipInvestments,
            { ...inv, id: Date.now() },
          ],
        })),

      removeSIPInvestment: (id) =>
        set((state) => ({
          sipInvestments: state.sipInvestments.filter((i) => i.id !== id),
        })),

      // Gold ETF Actions
      addGoldInvestment: (inv) =>
        set((state) => ({
          goldInvestments: [
            ...state.goldInvestments,
            { ...inv, id: Date.now() },
          ],
        })),

      removeGoldInvestment: (id) =>
        set((state) => ({
          goldInvestments: state.goldInvestments.filter((i) => i.id !== id),
        })),

      setGoldThreshold: (etfId, threshold) =>
        set((state) => ({
          goldThresholds: { ...state.goldThresholds, [etfId]: parseFloat(threshold) },
        })),

      clearGoldThreshold: (etfId) =>
        set((state) => {
          const updated = { ...state.goldThresholds }
          delete updated[etfId]
          return { goldThresholds: updated }
        }),

      // Stock Actions
      addStockInvestment: (inv) =>
        set((state) => ({
          stockInvestments: [
            ...state.stockInvestments,
            { ...inv, id: Date.now() },
          ],
        })),

      removeStockInvestment: (id) =>
        set((state) => ({
          stockInvestments: state.stockInvestments.filter((i) => i.id !== id),
        })),

      // Computed portfolio summary
      getPortfolioSummary: () => {
        const state = get()
        const sipTotal = state.sipInvestments.reduce((s, i) => s + i.amount, 0)
        const goldTotal = state.goldInvestments.reduce((s, i) => s + i.amount, 0)
        const stockTotal = state.stockInvestments.reduce((s, i) => s + i.amount, 0)
        const totalInvested = sipTotal + goldTotal + stockTotal

        const sipCurrentValue = state.sipInvestments.reduce(
          (s, i) => s + getSIPCurrentValue(i), 0
        )
        const goldCurrentValue = state.goldInvestments.reduce(
          (s, i) => s + getGoldCurrentValue(i), 0
        )
        const stockCurrentValue = state.stockInvestments.reduce(
          (s, i) => s + getStockCurrentValue(i), 0
        )
        const totalCurrentValue = sipCurrentValue + goldCurrentValue + stockCurrentValue

        const totalPnL = totalCurrentValue - totalInvested
        const pnlPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

        return {
          totalInvested,
          totalCurrentValue,
          totalPnL,
          pnlPct,
          sipTotal,
          goldTotal,
          stockTotal,
          sipCurrentValue,
          goldCurrentValue,
          stockCurrentValue,
        }
      },

      getEnrichedSIPInvestments: () => {
        const state = get()
        return state.sipInvestments.map((inv) => ({
          ...inv,
          currentValue: getSIPCurrentValue(inv),
          pnl: getSIPCurrentValue(inv) - inv.amount,
          fund: sipFunds.find((f) => f.id === inv.fundId),
        }))
      },

      getEnrichedGoldInvestments: () => {
        const state = get()
        return state.goldInvestments.map((inv) => {
          const etf = goldETFs.find((e) => e.id === inv.etfId)
          const currentValue = getGoldCurrentValue(inv)
          return {
            ...inv,
            currentValue,
            pnl: currentValue - inv.amount,
            etf,
            currentPrice: etf ? getMockCurrentPrice(etf) : inv.buyPrice,
          }
        })
      },

      getEnrichedStockInvestments: () => {
        const state = get()
        return state.stockInvestments.map((inv) => {
          const currentValue = getStockCurrentValue(inv)
          return {
            ...inv,
            currentValue,
            pnl: currentValue - inv.amount,
          }
        })
      },

      getGoldAlerts: () => {
        const state = get()
        const alerts = []
        goldETFs.forEach((etf) => {
          const threshold = state.goldThresholds[etf.id]
          if (threshold !== undefined) {
            const currentPrice = getMockCurrentPrice(etf)
            if (currentPrice <= threshold) {
              alerts.push({
                etfId: etf.id,
                etfName: etf.name,
                symbol: etf.symbol,
                currentPrice,
                threshold,
              })
            }
          }
        })
        return alerts
      },
    }),
    {
      name: 'finance-manager-v1',
    }
  )
)

export default useFinanceStore
