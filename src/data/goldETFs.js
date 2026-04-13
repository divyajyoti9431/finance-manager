export const goldETFs = [
  {
    id: 'GOLDBEES',
    name: 'Nippon India Gold BeES',
    symbol: 'GOLDBEES',
    amc: 'Nippon India',
    basePrice: 88.52,
    description: 'Oldest and most liquid Gold ETF in India. Tracks domestic gold price.',
    expense: 0.82,
    aum: '₹9,840 Cr',
  },
  {
    id: 'HDFCMFGETF',
    name: 'HDFC Gold ETF',
    symbol: 'HDFCMFGETF',
    amc: 'HDFC',
    basePrice: 87.95,
    description: 'Tracks domestic gold prices closely with low tracking error.',
    expense: 0.59,
    aum: '₹3,120 Cr',
  },
  {
    id: 'SBIGETS',
    name: 'SBI Gold ETF',
    symbol: 'SBIGETS',
    amc: 'SBI',
    basePrice: 89.20,
    description: 'SBI backed gold ETF with high investor trust and good liquidity.',
    expense: 0.65,
    aum: '₹2,760 Cr',
  },
  {
    id: 'IPGETF',
    name: 'ICICI Prudential Gold ETF',
    symbol: 'IPGETF',
    amc: 'ICICI Prudential',
    basePrice: 88.80,
    description: 'Solid gold ETF from a top AMC with competitive expense ratio.',
    expense: 0.50,
    aum: '₹2,340 Cr',
  },
  {
    id: 'KOTAKGOLD',
    name: 'Kotak Gold ETF',
    symbol: 'KOTAKGOLD',
    amc: 'Kotak',
    basePrice: 88.10,
    description: 'Competitive expense ratio with high liquidity on NSE.',
    expense: 0.55,
    aum: '₹1,980 Cr',
  },
]

// Deterministic daily price variation (changes every day)
export const getMockCurrentPrice = (etf) => {
  const today = new Date()
  const daySeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate()
  const charSeed = etf.id
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const combined = daySeed + charSeed
  const x = Math.sin(combined * 9301 + 49297) * 233280
  const rand = (x - Math.floor(x)) // 0 to 1
  const variation = (rand - 0.5) * 3 // -1.5% to +1.5%
  return parseFloat((etf.basePrice * (1 + variation / 100)).toFixed(2))
}

export const getPriceChange = (etf) => {
  const current = getMockCurrentPrice(etf)
  const diff = current - etf.basePrice
  const pct = ((diff / etf.basePrice) * 100).toFixed(2)
  return { diff: diff.toFixed(2), pct, isUp: diff >= 0 }
}
