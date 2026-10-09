
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import InvestmentContextProvider from './contexts/InvestmentContext.jsx'
import ScrollToTop from './components/SerollTop.js'
import { SessionProvider } from './auth/SessionProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    {/* One session/inactivity manager for the whole app (every route, every tab) */}
    <SessionProvider>
      < InvestmentContextProvider >
        <App />
      </InvestmentContextProvider>
    </SessionProvider>
  </BrowserRouter>
)
