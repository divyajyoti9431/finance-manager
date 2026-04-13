export const sipFunds = [
  // Large Cap
  {
    id: 1,
    name: 'Mirae Asset Large Cap Fund',
    category: 'Large Cap',
    amc: 'Mirae Asset',
    returns: { '1y': 22.3, '3y': 18.5, '5y': 17.2 },
    risk: 'Moderate',
    minSIP: 1000,
    rating: 5,
    aum: '₹35,680 Cr',
    expenseRatio: 0.55,
    nav: 108.45,
    description: 'Invests in top 100 market cap companies with consistent long-term performance.',
  },
  {
    id: 2,
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    amc: 'Axis',
    returns: { '1y': 19.8, '3y': 16.2, '5y': 15.9 },
    risk: 'Moderate',
    minSIP: 500,
    rating: 4,
    aum: '₹42,130 Cr',
    expenseRatio: 0.63,
    nav: 72.30,
    description: 'Focus on quality large cap stocks with strong fundamentals and consistent growth.',
  },
  // Mid Cap
  {
    id: 3,
    name: 'HDFC Mid-Cap Opportunities Fund',
    category: 'Mid Cap',
    amc: 'HDFC',
    returns: { '1y': 38.5, '3y': 27.3, '5y': 23.8 },
    risk: 'High',
    minSIP: 100,
    rating: 5,
    aum: '₹68,450 Cr',
    expenseRatio: 0.72,
    nav: 183.60,
    description: 'One of the oldest mid cap funds with an exceptional 20+ year track record.',
  },
  {
    id: 4,
    name: 'Kotak Emerging Equity Fund',
    category: 'Mid Cap',
    amc: 'Kotak',
    returns: { '1y': 35.2, '3y': 25.8, '5y': 22.1 },
    risk: 'High',
    minSIP: 1000,
    rating: 4,
    aum: '₹48,900 Cr',
    expenseRatio: 0.48,
    nav: 142.80,
    description: 'Focuses on emerging mid-size companies with strong growth potential.',
  },
  // Small Cap
  {
    id: 5,
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    amc: 'SBI',
    returns: { '1y': 45.2, '3y': 32.1, '5y': 29.7 },
    risk: 'Very High',
    minSIP: 500,
    rating: 5,
    aum: '₹28,760 Cr',
    expenseRatio: 0.68,
    nav: 165.20,
    description: 'High-growth small cap fund with proven stock selection capability.',
  },
  {
    id: 6,
    name: 'Quant Small Cap Fund',
    category: 'Small Cap',
    amc: 'Quant',
    returns: { '1y': 52.8, '3y': 38.4, '5y': 33.2 },
    risk: 'Very High',
    minSIP: 1000,
    rating: 5,
    aum: '₹21,340 Cr',
    expenseRatio: 0.62,
    nav: 248.90,
    description: 'Quantitative model-driven small cap investing with outstanding returns.',
  },
  // ELSS
  {
    id: 7,
    name: 'Mirae Asset Tax Saver Fund',
    category: 'ELSS',
    amc: 'Mirae Asset',
    returns: { '1y': 28.4, '3y': 22.1, '5y': 20.3 },
    risk: 'Moderate-High',
    minSIP: 500,
    rating: 5,
    aum: '₹25,890 Cr',
    expenseRatio: 0.57,
    nav: 42.15,
    description: '3-year lock-in ELSS fund. Best for 80C deduction with excellent returns.',
  },
  {
    id: 8,
    name: 'Quant ELSS Tax Saver Fund',
    category: 'ELSS',
    amc: 'Quant',
    returns: { '1y': 35.6, '3y': 28.9, '5y': 24.5 },
    risk: 'High',
    minSIP: 500,
    rating: 5,
    aum: '₹8,760 Cr',
    expenseRatio: 0.52,
    nav: 352.40,
    description: 'Aggressive ELSS with quantitative approach and high alpha generation.',
  },
  {
    id: 9,
    name: 'Axis Long Term Equity Fund',
    category: 'ELSS',
    amc: 'Axis',
    returns: { '1y': 18.2, '3y': 14.5, '5y': 16.8 },
    risk: 'Moderate',
    minSIP: 500,
    rating: 4,
    aum: '₹32,450 Cr',
    expenseRatio: 0.68,
    nav: 78.65,
    description: 'Conservative ELSS focusing on quality large cap. Safe 80C option.',
  },
  // Flexi Cap
  {
    id: 10,
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Flexi Cap',
    amc: 'PPFAS',
    returns: { '1y': 29.8, '3y': 23.5, '5y': 22.8 },
    risk: 'Moderate',
    minSIP: 1000,
    rating: 5,
    aum: '₹62,340 Cr',
    expenseRatio: 0.58,
    nav: 84.20,
    description: 'Value investing approach with 10-15% international diversification.',
  },
  {
    id: 11,
    name: 'JM Flexicap Fund',
    category: 'Flexi Cap',
    amc: 'JM Financial',
    returns: { '1y': 46.2, '3y': 31.8, '5y': 26.4 },
    risk: 'High',
    minSIP: 1000,
    rating: 5,
    aum: '₹4,230 Cr',
    expenseRatio: 0.38,
    nav: 126.80,
    description: 'Aggressive flexi cap with high allocation to mid and small cap segments.',
  },
  // Debt
  {
    id: 12,
    name: 'HDFC Short Term Debt Fund',
    category: 'Debt',
    amc: 'HDFC',
    returns: { '1y': 7.8, '3y': 6.9, '5y': 7.2 },
    risk: 'Low',
    minSIP: 1000,
    rating: 4,
    aum: '₹18,560 Cr',
    expenseRatio: 0.32,
    nav: 28.45,
    description: 'Stable returns with short duration debt. Safe for capital preservation.',
  },
  {
    id: 13,
    name: 'ICICI Prudential Corporate Bond Fund',
    category: 'Debt',
    amc: 'ICICI Prudential',
    returns: { '1y': 8.4, '3y': 7.5, '5y': 7.8 },
    risk: 'Low',
    minSIP: 1000,
    rating: 4,
    aum: '₹22,780 Cr',
    expenseRatio: 0.28,
    nav: 26.80,
    description: 'Invests in high quality corporate bonds with steady consistent returns.',
  },
  // Sectoral
  {
    id: 14,
    name: 'Nippon India Banking Fund',
    category: 'Sectoral',
    amc: 'Nippon India',
    returns: { '1y': 24.6, '3y': 19.8, '5y': 16.5 },
    risk: 'High',
    minSIP: 1000,
    rating: 4,
    aum: '₹8,940 Cr',
    expenseRatio: 0.82,
    nav: 64.20,
    description: 'Banking and financial services sector fund. Benefits from credit growth.',
  },
  {
    id: 15,
    name: 'ICICI Prudential Technology Fund',
    category: 'Sectoral',
    amc: 'ICICI Prudential',
    returns: { '1y': 32.4, '3y': 22.8, '5y': 28.6 },
    risk: 'Very High',
    minSIP: 1000,
    rating: 4,
    aum: '₹12,450 Cr',
    expenseRatio: 0.93,
    nav: 195.60,
    description: 'IT and technology sector fund with global exposure via Nasdaq stocks.',
  },
]

// Month-based recommendation logic
const seasonMap = {
  1:  ['ELSS', 'Large Cap'],     // Jan - Tax saving season
  2:  ['ELSS', 'Large Cap'],     // Feb - Budget month, tax saving
  3:  ['ELSS', 'Flexi Cap'],     // Mar - Last chance for 80C
  4:  ['Large Cap', 'Flexi Cap'],// Apr - Post-budget stability
  5:  ['Large Cap', 'Debt'],     // May - Cautious pre-monsoon
  6:  ['Flexi Cap', 'Large Cap'],// Jun - Mid-year rebalance
  7:  ['Mid Cap', 'Small Cap'],  // Jul - Growth season begins
  8:  ['Mid Cap', 'Small Cap'],  // Aug - Earnings season momentum
  9:  ['Mid Cap', 'Flexi Cap'],  // Sep - Q2 results positive
  10: ['Flexi Cap', 'Debt'],     // Oct - Year-end balance
  11: ['Flexi Cap', 'Debt'],     // Nov - Conservative year-end
  12: ['Debt', 'Large Cap'],     // Dec - Year-end parking
}

export const getMonthlyRecommendations = (month) => {
  const categories = seasonMap[month] || ['Large Cap', 'Flexi Cap']
  return sipFunds.filter(f => categories.includes(f.category))
}

export const getRiskColor = (risk) => {
  const map = {
    'Low': 'bg-green-100 text-green-700',
    'Moderate': 'bg-blue-100 text-blue-700',
    'Moderate-High': 'bg-yellow-100 text-yellow-700',
    'High': 'bg-orange-100 text-orange-700',
    'Very High': 'bg-red-100 text-red-700',
  }
  return map[risk] || 'bg-slate-100 text-slate-700'
}
