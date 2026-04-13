import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SIPManager from './pages/SIPManager'
import GoldETF from './pages/GoldETF'
import StockPicker from './pages/StockPicker'
import Portfolio from './pages/Portfolio'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />
      case 'sip':       return <SIPManager />
      case 'gold':      return <GoldETF />
      case 'stocks':    return <StockPicker />
      case 'portfolio': return <Portfolio onNavigate={setActivePage} />
      default:          return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}
