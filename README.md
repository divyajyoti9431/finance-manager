# 💰 Finance Manager — Personal Investment Tracker

A personal finance management desktop/web app for tracking **SIP Mutual Funds**, **Gold ETFs**, and **NSE Stocks** — all with **real-time live prices** fetched from AMFI India and Yahoo Finance.

---

## 🎬 Demo

https://github.com/user-attachments/assets/DEMO_VIDEO_PLACEHOLDER

> *Replace the link above after uploading `Finance manager.mp4` as a GitHub Release asset (see [Adding the Demo Video](#adding-the-demo-video) below)*

---

## ✨ Features

### 📈 SIP Manager
- **Month-based fund recommendations** driven by market seasonality (e.g. ELSS in Jan–Mar for 80C tax saving, Mid/Small Cap in Jul–Sep for growth season)
- **15 curated mutual funds** across Large Cap, Mid Cap, Small Cap, ELSS, Flexi Cap, Debt, and Sectoral categories
- **Live AMFI NAV** fetched daily from [mfapi.in](https://www.amfiindia.com/spages/NAVAll.txt) — accurate to the last 4 decimal places
- Log SIP investments with units automatically calculated from live NAV
- Star ratings, expense ratios, AUM, 1Y / 3Y / 5Y historical returns displayed per fund

### 🥇 Gold ETF Tracker
- **5 NSE Gold ETFs** monitored: GOLDBEES, HDFCMFGETF, SBIGETS, IPGETF, KOTAKGOLD
- **Live NSE prices** from Yahoo Finance updated every 30 minutes
- **Per-ETF buy threshold alerts** — fires instantly when price drops to or below your target
- View today's % change, previous close, AUM and expense ratio
- Log Gold ETF purchases directly from the tracker

### 📊 Stock Picker
- **20 hand-picked NSE short-term stocks** (1–4 week horizon) with:
  - Live CMP (Current Market Price) from NSE via Yahoo Finance
  - Daily % change (▲/▼)
  - Target price, Stop Loss, Upside %
  - Momentum tag (Bullish / Neutral), Holding period, Rationale
- Filter by sector or momentum; sort by Upside %, Today's Change, or Price
- Buy modal to log purchases directly into your portfolio

### 💼 Portfolio Dashboard
- **Real-time P&L** across all three investment categories using live market prices
- **Recharts AreaChart** — 12-month portfolio growth (Invested vs Current Value)
- **Recharts PieChart** — allocation breakdown (SIP / Gold / Stocks)
- 4 summary stat cards: Total Invested · Current Value · Total P&L · # Investments
- Per-investment breakdown with Buy price, Live price, and P&L in both ₹ and %

### 🔄 Auto-Refresh
- Prices auto-refresh every **30 minutes** automatically
- Live countdown timer showing time until next refresh (`next in 29:48`)
- Manual **↻ refresh button** on every page
- Green **● Live** indicator on each row/card when a price is successfully fetched

---

## 🚀 Quick Start (No Build Required)

The simplest way to run the app is the **standalone `app.html`** — no Node.js, no build step needed.

### Option 1 — Open directly in browser
```
Double-click  finance-manager/app.html
```
> ⚠️ Some browsers block `fetch()` from `file://` URLs. If prices don't load, use Option 2.

### Option 2 — Serve with Python (Recommended)
```bash
# From the finance-manager directory:
python -m http.server 5173

# Then open in your browser:
http://localhost:5173/app.html
```

### Option 3 — Electron Desktop App (requires Node.js)
```bash
# Install Node.js LTS from https://nodejs.org first, then:
cd finance-manager
npm install
npm run electron:dev
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (via Babel Standalone CDN) |
| Styling | Tailwind CSS v3 (CDN) |
| Charts | Recharts 2.10.3 (UMD CDN) |
| Desktop Shell | Electron (optional) |
| Build Tool | Vite 5 (optional, for Electron version) |
| State & Storage | React Context + `localStorage` |
| Live Stock/ETF Prices | Yahoo Finance v8 Chart API (via corsproxy.io) |
| Live MF NAV | AMFI India NAVAll.txt (via corsproxy.io) |
| Persistence | `localStorage` (no backend required) |

---

## 📡 Live Data Sources

| Data | Source | Refresh |
|------|--------|---------|
| NSE Stock Prices | Yahoo Finance (`query1.finance.yahoo.com/v8/finance/chart/{symbol}.NS`) | Every 30 min |
| NSE Gold ETF Prices | Yahoo Finance (same endpoint) | Every 30 min |
| Mutual Fund NAV | AMFI India (`amfiindia.com/spages/NAVAll.txt`) | Every 30 min |

All API calls go through **corsproxy.io** as a CORS proxy to work in the browser.

---

## 📁 Project Structure

```
finance-manager/
│
├── app.html               ← Standalone single-file app (use this!)
│
├── src/                   ← Vite/Electron source (optional)
│   ├── App.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── SIPManager.jsx
│   │   ├── GoldETF.jsx
│   │   ├── StockPicker.jsx
│   │   └── Portfolio.jsx
│   ├── data/
│   │   ├── sipFunds.js    ← 15 mutual funds with scheme codes
│   │   ├── goldETFs.js    ← 5 NSE Gold ETFs
│   │   └── stocks.js      ← 20 NSE short-term picks
│   └── store/
│       └── useFinanceStore.js  ← Zustand + persist (Electron version)
│
├── electron/
│   └── main.cjs           ← Electron main process (CommonJS)
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 📸 Screenshots

### Dashboard
![Dashboard — Portfolio overview with live P&L, charts and stat cards](docs/screenshot-dashboard.png)

### SIP Manager
![SIP Manager — Monthly recommendations with live NAV](docs/screenshot-sip.png)

### Gold ETF Tracker
![Gold ETF — Live NSE prices with threshold alerts](docs/screenshot-gold.png)

### Stock Picker
![Stock Picker — 20 NSE stocks with live CMP](docs/screenshot-stocks.png)

---

## 💡 How the Seasonality Works

| Months | Season | Recommended Categories |
|--------|--------|----------------------|
| Jan–Feb | Tax Saving Season | ELSS, Large Cap |
| Mar | ELSS Deadline | ELSS, Flexi Cap |
| Apr | Post-Budget Stability | Large Cap, Flexi Cap |
| May | Pre-Monsoon Caution | Large Cap, Debt |
| Jun | Mid-Year Balance | Flexi Cap, Large Cap |
| Jul–Aug | Growth Season | Mid Cap, Small Cap |
| Sep | Q2 Results Season | Mid Cap, Flexi Cap |
| Oct–Nov | Year-End Balancing | Flexi Cap, Debt |
| Dec | Year-End Parking | Debt, Large Cap |

---

## 🏗️ Building the Electron App

```bash
npm install
npm run electron:dev      # Dev mode (hot reload)
npm run build             # Build for production
```

Requires Node.js 18+ and the ESM/CJS fix is already in place:
- `package.json` has `"type": "module"`
- Electron entry is `electron/main.cjs` (`.cjs` forces CommonJS)

---

## ⚠️ Disclaimer

This application is for **educational and personal tracking purposes only**. Stock and fund suggestions are based on publicly available data and do not constitute financial advice. Always consult a SEBI-registered financial advisor before investing.

---

## 📄 License

MIT License — free to use, modify and distribute.

---

## Adding the Demo Video

After creating the GitHub repo:
1. Go to your repo → **Releases** → **Create a new release**
2. Tag: `v1.0.0`, Title: `Finance Manager v1.0`
3. Drag and drop `Finance manager.mp4` into the release assets
4. Publish the release
5. Copy the video URL and replace `DEMO_VIDEO_PLACEHOLDER` in this README with the actual asset URL
6. GitHub will automatically embed it as a playable video in the README

---

*Built with ❤️ using React, Tailwind CSS, Recharts and live market data*
