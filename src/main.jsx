
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import InvestmentContextProvider from './contexts/InvestmentContext.jsx'
import ScrollToTop from './components/SerollTop.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    < InvestmentContextProvider >
      <App />
    </InvestmentContextProvider>
  </BrowserRouter>
)
